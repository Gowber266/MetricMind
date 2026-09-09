"""
Unit & Integration tests for Data Engineering ETL Pipeline (`data-engineering/run_etl.py`).
Run: pytest qa-testing/test_scripts/test_etl_pipeline.py
"""

import json
import os
import sqlite3
import tempfile
import sys

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DATA_ENG_DIR = os.path.join(BASE_DIR, "data-engineering")
sys.path.insert(0, DATA_ENG_DIR)

from run_etl import (
    extract_data,
    validate_data,
    transform_data,
    load_database,
    run_pipeline,
    CSV_PATH,
    DB_PATH,
    LOG_PATH,
)


def test_extract_data():
    rows = extract_data(CSV_PATH)
    assert len(rows) > 0
    assert "revenue" in rows[0]
    assert "region" in rows[0]


def test_validate_valid_data():
    rows = extract_data(CSV_PATH)
    is_valid, errors = validate_data(rows)
    assert is_valid is True
    assert len(errors) == 0


def test_validate_invalid_data():
    invalid_rows = [
        {
            "date": "2025-01-01",
            "region": "Europe",
            "country": "Germany",
            "product": "Widget A",
            "quantity": "10",
            "unit_price": "100",
            "revenue": "-500",  # Invalid: negative revenue
            "material_cost": "200",
            "shipping_cost": "50",
            "total_cost": "250",
            "margin": "100",  # Invalid: margin math mismatch (-500 - 250 != 100)
        }
    ]
    is_valid, errors = validate_data(invalid_rows)
    assert is_valid is False
    assert len(errors) >= 2


def test_end_to_end_etl_execution():
    with tempfile.TemporaryDirectory() as tmp_dir:
        tmp_db = os.path.join(tmp_dir, "test_sales.db")
        tmp_log = os.path.join(tmp_dir, "test_pipeline_logs.json")

        summary = run_pipeline(csv_path=CSV_PATH, db_path=tmp_db, log_path=tmp_log)

        assert summary["status"] == "SUCCESS"
        assert summary["records_extracted"] > 0
        assert summary["stg_sales_records"] == summary["records_extracted"]
        assert summary["fct_margin_records"] > 0
        assert os.path.exists(tmp_log)

        # Inspect DB tables created
        conn = sqlite3.connect(tmp_db)
        cursor = conn.cursor()

        for table in ["stg_sales", "fct_sales", "fct_revenue", "fct_cost", "fct_margin"]:
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
            count = cursor.fetchone()[0]
            assert count > 0, f"Table {table} is empty!"

        conn.close()


def test_pipeline_log_output():
    # Execute pipeline to default paths to update pipeline_logs.json
    summary = run_pipeline()
    assert os.path.exists(LOG_PATH)
    with open(LOG_PATH, "r", encoding="utf-8") as f:
        log_data = json.load(f)
    assert log_data["status"] == "SUCCESS"
    assert "execution_duration_sec" in log_data


if __name__ == "__main__":
    test_extract_data()
    test_validate_valid_data()
    test_validate_invalid_data()
    test_end_to_end_etl_execution()
    test_pipeline_log_output()
    print("[OK] All ETL Pipeline tests passed successfully.")
