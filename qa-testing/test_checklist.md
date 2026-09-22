# MetricMind — QA Testing Checklist

## Data Quality
- [ ] No duplicate rows in mock_data/sales.csv
- [ ] No missing values in revenue, cost, region, date columns
- [ ] Revenue is never negative
- [ ] margin = revenue - total_cost holds for every row

## Semantic Layer
- [ ] Revenue, Cost, Margin, Margin% return correct aggregates
- [ ] Region/Product/Time dimensions filter correctly
- [ ] Semantic API JSON response shape is stable

## Agent / API
- [ ] /health returns 200
- [ ] /ping-llm returns a valid LLM reply given a valid API key
- [ ] /ask correctly routes natural language to the right metric + filters
- [ ] Multi-step reasoning: "why did X drop" triggers a drill-down, not a single lookup

## Governance
- [ ] Unapproved metric names are rejected with a clear message
- [ ] Query limiter stops runaway tool-call loops
- [ ] Agent never fabricates numbers not returned by query_semantic_layer

## Frontend
- [ ] Chat UI sends/receives messages correctly
- [ ] Loading state shows while waiting for a response
- [ ] Error state shows if backend is unreachable
- [ ] Charts render and match the underlying data

## Regression (before each demo)
- [ ] Re-run core_questions.md end to end
- [ ] Re-run invalid_questions.md — all correctly rejected
- [ ] Compare 3 known-answer questions against source data
