 MetricMind Chat UI — Setup 

## What these files are
- `app/page.tsx` — main chat page (message list + scroll + mock send handler)
- `components/ChatMessage.tsx` — a single message bubble (user / assistant)
- `components/ChatInput.tsx` — the bottom textbox + Send button
- `components/TypingIndicator.tsx` — the "typing..." loading animation

## Setup Steps

1. If the Next.js project isn't created yet, run:
   ```bash
   npx create-next-app@latest metricmind-chat --typescript --tailwind --app
   cd metricmind-chat
   ```
   (Choose "Yes" for both TypeScript and Tailwind — this code is built for that setup)

2. Copy the 4 files above into the project's `app/` and `components/` folders
   (replace the existing `app/page.tsx`).

3. Run:
   ```bash
   npm run dev
   ```
   Your chat UI will appear at `http://localhost:3000`.

## What works right now
- You can send a message and it appears in the chat
- After 1.2 seconds, a mock (fake) reply comes back, with a typing indicator shown in between
- Auto-scroll is working

## What's next (after Day 4)
- **Day 4:** Fine-tune spacing/colors, test on mobile
- **Day 5:** Build `LineChart.tsx` and `BarChart.tsx` templates inside `components/` using ECharts (`npm install echarts echarts-for-react`)
- **Day 6:** Remove the `setTimeout` mock in `page.tsx` and replace it with a real `fetch()` call to Raj's API — the TODO comment marks exactly where
- **Day 9:** Dynamically choose the chart type based on the JSON response from the backend (time-series → line chart, category → bar chart)

## Notes
- The color theme is currently dark + emerald green (a professional data/finance tool feel) — you can change this to match your team's branding by editing the Tailwind classes in `page.tsx`, `ChatMessage.tsx`, and `ChatInput.tsx`.