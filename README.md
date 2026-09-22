
## Quick Start

### 1. Backend (Agentic AI)

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env        # add your Gemini API key
uvicorn app.main:app --reload --port 8000
```

Test it:
```bash
curl http://localhost:8000/health
python -m app.agent.llm_test
```

### 2. Frontend

```bash
npm install
npm run dev
```

Open http://localhost:8080 — make sure the backend is running on port 8000
first (or update the backend URL in your `.env`/config as needed).

### 3. QA Tests

```bash
cd qa-testing/test_scripts
pip install pytest
pytest .
```

Or run any script directly, e.g. `python test_data_quality.py`.

### 4. Data / Semantic Layer

- `data-engineering/mock_data/sales.csv` — the mock dataset (600 rows,
  includes a simulated Q3 2025 EU cost spike for demo purposes).
- `data-engineering/dbt_project/` — dbt models: staging → transformed facts.
- `semantic-layer/models/sales.yml` — Cube.dev metric/dimension definitions.

Wiring dbt + Cube.dev to a real warehouse (Snowflake/Postgres) is the next
step once each layer is individually verified.

## Status

This is a working **scaffold**, not a finished product:
- Backend: FastAPI + LangChain agent structure verified, tools currently
  return mocked data — wire `query_semantic_layer` to Cube.dev's real API.
- Frontend: chat UI complete, expects the backend on `/ask`.
- Semantic layer / dbt: models written, need a real database connection.
- QA: data-quality and governance tests pass against the current mock data
  and backend code.