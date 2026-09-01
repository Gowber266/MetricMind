"""
Data quality tests for data-engineering/mock_data/sales.csv (Arati's dataset).
Run: pytest qa-testing/test_scripts/test_data_quality.py
"""

import csv
import os

DATA_PATH = os.path.join(
    os.path.dirname(__file__), "..", "..", "data-engineering", "mock_data", "sales.csv"
)


def load_rows():
    with open(DATA_PATH, newline="") as f:
        return list(csv.DictReader(f))


def test_no_missing_values():
    rows = load_rows()
    required = ["date", "region", "country", "product", "revenue", "total_cost", "margin"]
    for row in rows:
        for field in required:
            assert row[field] not in ("", None), f"Missing {field} in row: {row}"


def test_no_duplicate_rows():
    rows = load_rows()
    seen = set()
    for row in rows:
        key = tuple(row.items())
        assert key not in seen, f"Duplicate row found: {row}"
        seen.add(key)


def test_revenue_non_negative():
    rows = load_rows()
    for row in rows:
        assert float(row["revenue"]) >= 0, f"Negative revenue: {row}"


def test_margin_matches_revenue_minus_cost():
    rows = load_rows()
    for row in rows:
        expected = round(float(row["revenue"]) - float(row["total_cost"]), 2)
        actual = round(float(row["margin"]), 2)
        assert abs(expected - actual) < 0.01, f"Margin mismatch: {row}"


if __name__ == "__main__":
    test_no_missing_values()
    test_no_duplicate_rows()
    test_revenue_non_negative()
    test_margin_matches_revenue_minus_cost()
    print("[OK] All data quality checks passed.")
