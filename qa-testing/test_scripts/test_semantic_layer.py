"""
Unit tests for the query_semantic_layer tool.
Run: pytest qa-testing/test_scripts/test_semantic_layer.py
"""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "backend"))

from app.agent.langchain_agent import query_semantic_layer


def test_query_approved_metric_revenue():
    result = query_semantic_layer.invoke({"metric": "revenue"})
    assert "revenue" in result.lower()
    assert "$" in result


def test_query_metric_with_region_filter():
    result = query_semantic_layer.invoke({"metric": "revenue", "region": "Europe"})
    assert "region='Europe'" in result
    assert "$" in result


def test_query_metric_with_region_and_quarter_filter():
    result = query_semantic_layer.invoke({"metric": "margin_pct", "region": "Europe", "quarter": "Q2 2025"})
    assert "margin_pct" in result
    assert "%" in result


def test_unapproved_metric_rejected():
    result = query_semantic_layer.invoke({"metric": "ceo_salary"})
    assert "not in the approved list" in result.lower()


if __name__ == "__main__":
    test_query_approved_metric_revenue()
    test_query_metric_with_region_filter()
    test_query_metric_with_region_and_quarter_filter()
    test_unapproved_metric_rejected()
    print("[OK] All semantic layer tests passed.")
