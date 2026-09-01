"""
Day 2-6 agent skeleton: a LangChain agent with tools that talk to the
Semantic Layer (Cube.dev). Replace the mocked tool bodies with real
HTTP calls to the Cube.dev REST/GraphQL API once it's running
(semantic-layer/cube.js).
"""

from typing import Optional
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.tools import tool

from app.agent.llm_test import get_llm
from app.governance.approved_metrics import APPROVED_METRICS, is_approved


# ---- Tools -----------------------------------------------------------

@tool
def query_semantic_layer(metric: str, region: Optional[str] = None, quarter: Optional[str] = None) -> str:
    """
    Query the semantic layer for a metric (revenue, cost, margin, margin_pct),
    optionally filtered by region and quarter (e.g. 'Q3 2025').
    Returns the aggregated value as a string.
    """
    if not is_approved(metric):
        return f"Metric '{metric}' is not in the approved list: {APPROVED_METRICS}"

    # TODO: replace with a real call to the Cube.dev REST API, e.g.
    # requests.get(f"{CUBE_API_URL}/cubejs-api/v1/load", params={...})
    return (
        f"[mocked] {metric} for region={region or 'all'}, quarter={quarter or 'all'} "
        f"— wire this up to Cube.dev's /load endpoint."
    )


@tool
def get_dimensions() -> str:
    """List the dimensions available in the semantic layer (region, country, product, time)."""
    return "Available dimensions: region, country, product, sale_date, quarter, month"


@tool
def get_approved_metrics() -> str:
    """List the metrics the agent is allowed to query (governance boundary)."""
    return ", ".join(APPROVED_METRICS)


TOOLS = [query_semantic_layer, get_dimensions, get_approved_metrics]


# ---- Agent -------------------------------------------------------------

SYSTEM_PROMPT = """You are MetricMind, an agentic business-intelligence assistant.

You answer questions about company Revenue, Cost, and Margin by calling the
query_semantic_layer tool — never invent numbers yourself. When a question
implies a root-cause ("why did X drop"), break it into steps: check the
overall metric, then drill into contributing dimensions (region, product,
cost components) before answering. Only use metrics from get_approved_metrics.
"""


def build_agent() -> AgentExecutor:
    llm = get_llm(temperature=0)
    prompt = ChatPromptTemplate.from_messages([
        ("system", SYSTEM_PROMPT),
        ("human", "{input}"),
        MessagesPlaceholder("agent_scratchpad"),
    ])
    agent = create_tool_calling_agent(llm, TOOLS, prompt)
    return AgentExecutor(agent=agent, tools=TOOLS, verbose=True)


if __name__ == "__main__":
    executor = build_agent()
    result = executor.invoke({"input": "Why did our European margins drop last quarter?"})
    print(result["output"])
