"""
Simple per-request query limiter so the agent can't fire unbounded
tool calls in a single reasoning chain (Day 10 governance task).
"""

MAX_TOOL_CALLS_PER_QUERY = 6


class QueryLimitExceeded(Exception):
    pass


class QueryLimiter:
    def __init__(self, max_calls: int = MAX_TOOL_CALLS_PER_QUERY):
        self.max_calls = max_calls
        self.count = 0

    def tick(self):
        self.count += 1
        if self.count > self.max_calls:
            raise QueryLimitExceeded(
                f"Exceeded max tool calls per query ({self.max_calls})"
            )

    def reset(self):
        self.count = 0
