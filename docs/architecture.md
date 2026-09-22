# MetricMind — Architecture

## Flow

```
User question ("Why did our European margins drop last quarter?")
        │
        ▼
   Next.js Frontend (chat UI)
        │  POST /ask
        ▼
   FastAPI Backend (Agentic AI layer)
        │
        ▼
   LangChain Agent
        │  tool calls
        ▼
   Semantic Layer (Cube.dev) ── governance: approved_metrics, query_limits
        │
        ▼
   Database (dbt: staging → transformed → fct_revenue / fct_cost / fct_margin)
        │
        ▼
   JSON results
        │
        ▼
   Multi-step reasoning (root-cause drill-down)
        │
        ▼
   Charts + natural-language explanation + View API Call / View SQL
```

## Layers & Owners

| Layer | Folder | Owner |
|---|---|---|
| Frontend | `frontend/` | Atharv |
| Agentic AI / Backend | `backend/` | Srinivethitha |
| Semantic Layer | `semantic-layer/` | Sravani |
| Data Engineering | `data-engineering/` | Arati |
| QA / Testing / Governance | `qa-testing/` | Raj |
| Integration / Coordination | (cross-cutting) | Gowber |

## Data Model

`sales.csv` (mock corporate data) → dbt staging (`stg_sales`) → dbt transformed
facts (`fct_revenue`, `fct_cost`, `fct_margin`) → Cube.dev semantic layer
(`sales.yml`) exposing approved measures: revenue, material_cost,
shipping_cost, cost, margin, margin_pct.

The mock dataset intentionally simulates a Q3 2025 European shipping/material
cost spike, so "Why did European margins drop?" has a real, discoverable
answer in the data — useful for demoing multi-step reasoning.

## Governance

The agent can only call `query_semantic_layer` with metrics from
`backend/app/governance/approved_metrics.py`. `QueryLimiter` caps tool calls
per question to prevent runaway reasoning loops.
