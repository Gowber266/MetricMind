"""
Governance tests: unapproved metrics must be rejected.
Run: pytest qa-testing/test_scripts/test_governance.py
"""

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "backend"))

from app.governance.approved_metrics import is_approved, APPROVED_METRICS
from app.governance.query_limits import QueryLimiter, QueryLimitExceeded


def test_approved_metrics_pass():
    for metric in APPROVED_METRICS:
        assert is_approved(metric)


def test_unapproved_metrics_rejected():
    for bad_metric in ["employee_salary", "stock_price", "profit_secret", "ceo_salary"]:
        assert not is_approved(bad_metric)


def test_query_limiter_blocks_excess_calls():
    limiter = QueryLimiter(max_calls=3)
    limiter.tick()
    limiter.tick()
    limiter.tick()
    try:
        limiter.tick()
        assert False, "Expected QueryLimitExceeded"
    except QueryLimitExceeded:
        pass


if __name__ == "__main__":
    test_approved_metrics_pass()
    test_unapproved_metrics_rejected()
    test_query_limiter_blocks_excess_calls()
    print("[OK] All governance checks passed.")
