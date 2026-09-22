<<<<<<< HEAD
# MetricMind — Frontend (Atharv)
Agentic Semantic BI Engine — Ask questions in plain English, get instant charts, explanations, and full transparency into the API/SQL behind every answer.

👤 Role: Frontend Development — Next.js, Chat UI, Charts & Visualizations
⚙️ Tech Stack:Next.js (App Router) · Tailwind CSS · ECharts (via `echarts-for-react`)
 🚀 Quick Start

```bash
cd metricmind
npm install
npm run dev
```
Then open the URL shown in the terminal (e.g. `http://localhost:3000` or `http://localhost:8080`) 🌐
---

 📅 30-Day Progress Log
 🏗️ Week 1 — Foundation

- Day 1 —  Set up the Next.js project and built the basic MetricMind chat interface
- Day 2 —  Built reusable chat input and message display components
- Day 3 —  Added loading/streaming response UI with typing indicator and auto-scroll
- Day 4 —  Improved chat UI layout with a responsive header and custom scrollbar
- Day 5 — Prepared reusable ECharts components — Line, Bar, and KPI
- Day 6 —  Connected the frontend to the backend via a Next.js API route
- Day 7 — Completed the initial UI/API connection and verified the end-to-end flow

  🧬 Week 2 — Semantic + Agentic Integration

- Day 8 — Designed the analytical explanation (AI reasoning) UI panel
- Day 9 —  Implemented Line, Bar, and KPI visualizations inside chat messages
- Day 10 —  Added proper error states for failed backend responses
- Day 11 —  Added "View API Call / View SQL" transparency panel
- Day 12 — Fixed UI/chart issues found during the Week 2 review
- Day 13 —  Polished the prototype UI with suggested questions on the empty state
- Day 14 — Frontend review — mid-project checklist and minor fixes

 🎯 Week 3 — Advanced Features + Accuracy

- Day 15 — Improved dynamic visualization behavior with automatic chart-type selection
- Day 16 —  Validated Line/Bar/KPI chart-type selection logic
- Day 17 — Improved error and empty-state handling for charts
- Day 18 — Fixed visualization mismatches between backend data and charts
- Day 19 —  Refined the transparency panel and added a copy button
- Day 20 —  Tested all chart states — empty, loading, and filled
- Day 21 —  Closed all outstanding UI defects from Weeks 1–3

🏁 Week 4 — Final QA + Demo

- Day 22 — Responsive UI polish for mobile screens
- Day 23 — Added chart animations and interaction polish
- Day 24 — Documented the Next.js/ECharts implementation (`docs/FRONTEND.md`)
- Day 25 — Ran a live UI and chart demo — full end-to-end flow test
- Day 26 — Fixed final UI issues found during the demo
- Day 27 — Finalized the Next.js/charts/live UI for the demo
- Day 28 — Ran the final Next.js + charts + live UI demo for the team
- Day 29 — Final UI responsiveness and chart verification fixes

 🤝 Handover
- Day 30 — 📦 Finalized UI/demo assets and presentation screenshots for project handover

 🧩 Key Components

- `ChatInput.tsx` — handles user input
- `ChatMessage.tsx` — renders user/AI messages and charts
- `TypingIndicator.tsx` — shows the loading/typing state
- `charts/LineChart.tsx`, `BarChart.tsx`, `KpiCard.tsx` — visualization components
- `TransparencyPanel.tsx` — shows the API call / SQL used for a query
- `AnalysisPanel.tsx` — shows the AI's reasoning steps
- `ErrorMessage.tsx`, `EmptyState.tsx`— error and empty-state handling

 🔄 Data Flow

1. 🧑 User types a question → `handleSend()` in `page.tsx`
2. 📤 A POST request is sent to `/api/query`
3. 🧠 The backend (LangChain + Semantic Layer) returns an answer + chart data
4. 💬 The response is rendered as a chat bubble + chart (if applicable)

## 🏆 Milestones

- 🟢 Day 7 — Foundation + initial working flow
- 🟢 Day 14 — Working prototype + mid-project review readiness
- 🟢 Day 21 — Advanced features + accuracy stabilization
- 🟢 Day 28 — Feature-complete + demo-ready MetricMind
- 🟢 Day 30 — Final handover + team presentation readiness

<p align="center">Made with 💙 by <b>Atharv</b> — Frontend Engineer, MetricMind</p>
=======
# MetricMind — Agentic Semantic BI Engine

A 6-member team project: ask business questions in plain English, get
answers backed by real metrics, with charts and a transparent SQL/API trail.

See `docs/architecture.md` for the full flow diagram and team ownership.

## Project Layout

```
metricmind/
├── backend/            Agentic AI layer — FastAPI + LangChain + Gemini (Srinivethitha)
├── frontend/           Next.js chat UI + ECharts (Atharv)
├── semantic-layer/     Cube.dev metric definitions (Sravani)
├── data-engineering/   Mock data + dbt models (Arati)
├── qa-testing/         Test checklist, questions, pytest scripts (Raj)
└── docs/               Architecture notes
```

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
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Open http://localhost:3000 — make sure the backend is running on port 8000
first (or update `NEXT_PUBLIC_BACKEND_URL` in `.env.local`).

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
>>>>>>> srinivethitha-work
