# MetricMind Frontend Documentation

## Tech Stack
- Next.js (App Router)
- Tailwind CSS
- ECharts (via echarts-for-react)

## Key Components
- `ChatInput.tsx` — user input handling
- `ChatMessage.tsx` — renders user/AI messages + charts
- `TypingIndicator.tsx` — loading state
- `charts/LineChart.tsx`, `BarChart.tsx`, `KpiCard.tsx` — visualization components
- `TransparencyPanel.tsx` — shows the API/SQL used for a query

## Data Flow
1. User types a question → `handleSend()` in `page.tsx`
2. POST request sent to `/api/query`
3. Backend (LangChain + Semantic Layer) returns an answer + chart data
4. Response is rendered as a chat bubble + chart (if applicable)