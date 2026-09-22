import json
import os
import sqlite3
from typing import Optional

import requests
try:
    from langchain.agents import AgentExecutor, create_tool_calling_agent
    HAS_LEGACY_AGENT = True
except ImportError:
    from langchain.agents import create_agent
    HAS_LEGACY_AGENT = False

from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.tools import tool

from app.agent.llm_test import get_llm
from app.agent.session_memory import get_session_history
from app.governance.approved_metrics import APPROVED_METRICS, is_approved
from app.governance.query_limits import QueryLimiter

DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "sales.db"))
CUBE_API_URL = os.getenv("CUBE_API_URL", "")

# Global limiter instance for query turn governance
GLOBAL_LIMITER = QueryLimiter(max_calls=8)


# ---- Tools -----------------------------------------------------------

@tool
def query_semantic_layer(
    metric: str,
    region: Optional[str] = None,
    quarter: Optional[str] = None,
    product: Optional[str] = None,
) -> str:
    """
    Query the semantic layer for an approved metric (revenue, cost, margin, margin_pct, material_cost, shipping_cost),
    optionally filtered by region (e.g. 'Europe', 'Asia'), quarter (e.g. 'Q2 2025', 'Q3 2024'), or product.
    Returns the aggregated value as a formatted string.
    """
    GLOBAL_LIMITER.tick()
    metric_clean = metric.strip().lower()
    if not is_approved(metric_clean):
        return f"Metric '{metric}' is not in the approved list: {APPROVED_METRICS}"

    # Try Cube.dev REST API if CUBE_API_URL is configured
    if CUBE_API_URL:
        try:
            filters = []
            if region:
                filters.append({"member": "sales.region", "operator": "equals", "values": [region]})
            if quarter:
                filters.append({"member": "sales.quarter", "operator": "equals", "values": [quarter]})
            if product:
                filters.append({"member": "sales.product", "operator": "equals", "values": [product]})

            res = requests.get(
                f"{CUBE_API_URL.rstrip('/')}/cubejs-api/v1/load",
                params={"query": json.dumps({"measures": [f"sales.{metric_clean}"], "filters": filters})},
                timeout=3,
            )
            if res.status_code == 200:
                data = res.json()
                if "data" in data and len(data["data"]) > 0:
                    val = data["data"][0].get(f"sales.{metric_clean}")
                    if val is not None:
                        return f"{metric_clean} for region={region or 'all'}, quarter={quarter or 'all'}, product={product or 'all'}: {val}"
        except Exception:
            pass  # Fall back to direct SQLite db query

    # Fallback to direct SQLite execution against backend/sales.db
    if not os.path.exists(DB_PATH):
        return f"Error: Database file not found at {DB_PATH}"

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Map metric to SQL aggregation expression matching semantic-layer/models/sales.yml
        metric_sql_map = {
            "revenue": "SUM(revenue)",
            "material_cost": "SUM(material_cost)",
            "shipping_cost": "SUM(shipping_cost)",
            "cost": "SUM(total_cost)",
            "margin": "SUM(margin)",
            "margin_pct": "ROUND((SUM(revenue) - SUM(total_cost)) / NULLIF(SUM(revenue), 0) * 100, 2)",
        }

        sql_expr = metric_sql_map[metric_clean]
        where_clauses = []
        params = []

        if region:
            where_clauses.append("LOWER(region) = LOWER(?)")
            params.append(region.strip())

        if quarter:
            where_clauses.append("LOWER(quarter) = LOWER(?)")
            params.append(quarter.strip())

        if product:
            where_clauses.append("LOWER(product) = LOWER(?)")
            params.append(product.strip())

        where_str = f" WHERE {' AND '.join(where_clauses)}" if where_clauses else ""
        query = f"SELECT {sql_expr} FROM fct_sales{where_str}"

        cursor.execute(query, params)
        row = cursor.fetchone()
        conn.close()

        val = row[0] if row else None

        if val is None:
            return f"{metric_clean} for region={region or 'all'}, quarter={quarter or 'all'}, product={product or 'all'}: No data found."

        if metric_clean == "margin_pct":
            formatted_val = f"{val:.2f}%"
        else:
            formatted_val = f"${val:,.2f}"

        filters_desc = []
        if region: filters_desc.append(f"region='{region}'")
        if quarter: filters_desc.append(f"quarter='{quarter}'")
        if product: filters_desc.append(f"product='{product}'")
        filter_str = f" ({', '.join(filters_desc)})" if filters_desc else ""

        return f"{metric_clean}{filter_str}: {formatted_val}"

    except Exception as e:
        return f"Error querying database for metric '{metric}': {str(e)}"


@tool
def compare_metrics(
    metric: str,
    period1: str,
    period2: str,
    region: Optional[str] = None,
    product: Optional[str] = None,
) -> str:
    """
    Compare an approved metric between two quarters (e.g. period1='Q1 2025', period2='Q2 2025').
    Optionally filter by region or product.
    Returns the values for both periods and the variance/change percentage.
    """
    GLOBAL_LIMITER.tick()
    val1_str = query_semantic_layer.invoke({"metric": metric, "quarter": period1, "region": region, "product": product})
    val2_str = query_semantic_layer.invoke({"metric": metric, "quarter": period2, "region": region, "product": product})
    return f"Comparison for {metric} (region={region or 'all'}, product={product or 'all'}):\n- {period1}: {val1_str}\n- {period2}: {val2_str}"


@tool
def drill_down_variance(
    metric: str,
    region: Optional[str] = None,
    quarter: Optional[str] = None,
) -> str:
    """
    Perform multi-step drill-down variance analysis for root-cause queries ('Why did margin drop?').
    Dissects material cost vs shipping cost breakdown and product-level metric distribution.
    """
    GLOBAL_LIMITER.tick()
    if not os.path.exists(DB_PATH):
        return f"Error: Database file not found at {DB_PATH}"

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        where_clauses = []
        params = []
        if region:
            where_clauses.append("LOWER(region) = LOWER(?)")
            params.append(region.strip())
        if quarter:
            where_clauses.append("LOWER(quarter) = LOWER(?)")
            params.append(quarter.strip())

        where_str = f" WHERE {' AND '.join(where_clauses)}" if where_clauses else ""

        # Cost Breakdown Analysis
        cost_query = f"""
            SELECT
                SUM(revenue) AS total_rev,
                SUM(material_cost) AS total_mat_cost,
                SUM(shipping_cost) AS total_ship_cost,
                SUM(total_cost) AS total_cst,
                SUM(margin) AS total_mgn,
                ROUND((SUM(margin) / NULLIF(SUM(revenue), 0)) * 100, 2) AS mgn_pct
            FROM fct_sales{where_str}
        """
        cursor.execute(cost_query, params)
        summary_row = cursor.fetchone()

        # Product-level breakdown
        prod_query = f"""
            SELECT
                product,
                SUM(revenue) AS prod_rev,
                SUM(total_cost) AS prod_cost,
                SUM(margin) AS prod_margin,
                ROUND((SUM(margin) / NULLIF(SUM(revenue), 0)) * 100, 2) AS prod_mgn_pct
            FROM fct_sales{where_str}
            GROUP BY product
            ORDER BY prod_margin ASC
        """
        cursor.execute(prod_query, params)
        prod_rows = cursor.fetchall()
        conn.close()

        if not summary_row or summary_row[0] is None:
            return f"No data available for drill-down analysis (region={region or 'all'}, quarter={quarter or 'all'})."

        rev, mat, ship, cost, mgn, mgn_pct = summary_row
        report = [
            f"--- Root-Cause Drill-Down Analysis ({region or 'All Regions'}, {quarter or 'All Quarters'}) ---",
            f"Overall Revenue: ${rev:,.2f}",
            f"Overall Margin: ${mgn:,.2f} ({mgn_pct}%)",
            f"Cost Breakdown: Material Cost = ${mat:,.2f} | Shipping Cost = ${ship:,.2f} | Total Cost = ${cost:,.2f}",
            "Product Performance Breakdown:"
        ]
        for p_name, p_rev, p_cost, p_mgn, p_pct in prod_rows:
            report.append(f"  - {p_name}: Rev=${p_rev:,.2f}, Cost=${p_cost:,.2f}, Margin=${p_mgn:,.2f} ({p_pct}%)")

        return "\n".join(report)
    except Exception as e:
        return f"Error executing drill-down analysis: {str(e)}"


@tool
def get_dimensions() -> str:
    """List the dimensions available in the semantic layer (region, country, product, time)."""
    GLOBAL_LIMITER.tick()
    return "Available dimensions: region, country, product, sale_date, quarter, month"


@tool
def get_approved_metrics() -> str:
    """List the metrics the agent is allowed to query (governance boundary)."""
    GLOBAL_LIMITER.tick()
    return ", ".join(APPROVED_METRICS)


TOOLS = [query_semantic_layer, compare_metrics, drill_down_variance, get_dimensions, get_approved_metrics]


# ---- Agent -------------------------------------------------------------

SYSTEM_PROMPT = """You are MetricMind, an agentic business-intelligence assistant with session memory.

You answer questions about company Revenue, Cost, and Margin by calling the
query_semantic_layer, compare_metrics, and drill_down_variance tools — never invent numbers yourself.

When answering follow-up questions, inspect the session conversation history to resolve implied context and filters (e.g. region, quarter, or product discussed in prior messages).

When a question asks for root-cause or variance ("why did margin drop?"), use the drill_down_variance tool to analyze cost components (material vs shipping) and product performance before providing a synthesized explanation.

Only query metrics present in get_approved_metrics. If a user asks for an unapproved metric (e.g. salary, profit margin), state that the metric is unapproved and list the available approved metrics.
"""


def build_agent():
    llm = get_llm(temperature=0)
    if HAS_LEGACY_AGENT:
        prompt = ChatPromptTemplate.from_messages([
            ("system", SYSTEM_PROMPT),
            MessagesPlaceholder(variable_name="chat_history"),
            ("human", "{input}"),
            MessagesPlaceholder(variable_name="agent_scratchpad"),
        ])
        agent = create_tool_calling_agent(llm, TOOLS, prompt)
        executor = AgentExecutor(agent=agent, tools=TOOLS, verbose=False)
    else:
        executor = create_agent(model=llm, tools=TOOLS, system_prompt=SYSTEM_PROMPT)

    agent_with_history = RunnableWithMessageHistory(
        executor,
        get_session_history,
        input_messages_key="input",
        history_messages_key="chat_history",
    )
    return agent_with_history


def run_agent_with_memory(question: str, session_id: str = "default") -> str:
    """Execute the agent for a given input question and session_id with session memory."""
    GLOBAL_LIMITER.reset()
    agent_with_history = build_agent()
    result = agent_with_history.invoke(
        {"input": question},
        config={"configurable": {"session_id": session_id}}
    )
    if isinstance(result, dict) and "output" in result:
        return result["output"]
    return str(result)


if __name__ == "__main__":
    res1 = run_agent_with_memory("What was European revenue in Q2 2025?", session_id="demo_session")
    print("Response 1:", res1)
    res2 = run_agent_with_memory("How does that compare to Q1 2025?", session_id="demo_session")
    print("Response 2:", res2)

