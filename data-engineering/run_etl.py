"""
Automated Data Engineering & ETL Pipeline Runner for MetricMind.

Pipeline Stages:
1. Extract: Reads raw sales data from CSV/source.
2. Validate: Executes data quality assertions (nulls, duplicates, non-negative revenue, margin math).
3. Transform: Aggregates staging data into multi-dimensional fact models (fct_revenue, fct_cost, fct_margin, fct_sales).
4. Load: Transactionally loads tables into SQLite database (`backend/sales.db`).
5. Audit & Log: Logs execution summary to `data-engineering/pipeline_logs.json`.
"""

import csv
import json
import os
import sqlite3
import time
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(BASE_DIR, "data-engineering", "mock_data", "sales.csv")
DB_PATH = os.path.join(BASE_DIR, "backend", "sales.db")
LOG_PATH = os.path.join(BASE_DIR, "data-engineering", "pipeline_logs.json")


def extract_data(csv_path: str) -> list[dict]:
    """Extract raw records from CSV file."""
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Source file not found at {csv_path}")

    with open(csv_path, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = list(reader)
    return rows


def validate_data(rows: list[dict]) -> tuple[bool, list[str]]:
    """Validate data quality rules on extracted rows."""
    errors = []
    required_fields = ["date", "region", "country", "product", "revenue", "total_cost", "margin"]
    seen = set()

    for idx, row in enumerate(rows, start=1):
        # 1. Missing value check
        for field in required_fields:
            if not row.get(field):
                errors.append(f"Row {idx}: Missing value for required field '{field}'")

        # 2. Duplicate row check
        row_tuple = tuple(row.items())
        if row_tuple in seen:
            errors.append(f"Row {idx}: Duplicate row detected")
        seen.add(row_tuple)

        # 3. Numeric & Logic checks
        try:
            revenue = float(row.get("revenue", 0))
            total_cost = float(row.get("total_cost", 0))
            margin = float(row.get("margin", 0))

            if revenue < 0:
                errors.append(f"Row {idx}: Negative revenue ({revenue})")

            expected_margin = round(revenue - total_cost, 2)
            if abs(expected_margin - round(margin, 2)) >= 0.01:
                errors.append(
                    f"Row {idx}: Margin mismatch (revenue={revenue}, cost={total_cost}, margin={margin}, expected={expected_margin})"
                )
        except ValueError as ve:
            errors.append(f"Row {idx}: Invalid numeric format ({str(ve)})")

    is_valid = len(errors) == 0
    return is_valid, errors


def transform_data(rows: list[dict]) -> tuple[list[tuple], list[dict]]:
    """Clean data and transform into staging records and transformed model rows."""
    stg_records = []

    for row in rows:
        date_str = row["date"].strip()
        year = int(date_str.split("-")[0])
        month_int = int(date_str.split("-")[1])
        q_num = (month_int - 1) // 3 + 1
        quarter_str = f"Q{q_num} {year}"
        month_str = f"{year}-{month_int:02d}"

        stg_records.append((
            date_str,
            row["region"].strip(),
            row["country"].strip(),
            row["product"].strip(),
            int(row["quantity"]),
            float(row["unit_price"]),
            float(row["revenue"]),
            float(row["material_cost"]),
            float(row["shipping_cost"]),
            float(row["total_cost"]),
            float(row["margin"]),
            quarter_str,
            year,
            month_str
        ))

    return stg_records


def load_database(stg_records: list[tuple], db_path: str):
    """Load transformed data into SQLite database transactionally."""
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        conn.execute("BEGIN TRANSACTION;")

        # Drop existing tables/views
        cursor.execute("DROP VIEW IF EXISTS fct_sales;")
        cursor.execute("DROP TABLE IF EXISTS fct_margin;")
        cursor.execute("DROP TABLE IF EXISTS fct_cost;")
        cursor.execute("DROP TABLE IF EXISTS fct_revenue;")
        cursor.execute("DROP TABLE IF EXISTS stg_sales;")

        # Create Staging Table
        cursor.execute("""
            CREATE TABLE stg_sales (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sale_date TEXT,
                region TEXT,
                country TEXT,
                product TEXT,
                quantity INTEGER,
                unit_price REAL,
                revenue REAL,
                material_cost REAL,
                shipping_cost REAL,
                total_cost REAL,
                margin REAL,
                quarter TEXT,
                year INTEGER,
                month TEXT
            )
        """)

        # Insert Staging Records
        cursor.executemany("""
            INSERT INTO stg_sales (
                sale_date, region, country, product, quantity, unit_price,
                revenue, material_cost, shipping_cost, total_cost, margin,
                quarter, year, month
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, stg_records)

        # Create Analytical Fact View (fct_sales)
        cursor.execute("""
            CREATE VIEW fct_sales AS
            SELECT
                id,
                sale_date,
                region,
                country,
                product,
                quantity,
                unit_price,
                revenue,
                material_cost,
                shipping_cost,
                total_cost,
                margin,
                ROUND((margin / NULLIF(revenue, 0)) * 100, 2) AS margin_pct,
                quarter,
                year,
                month
            FROM stg_sales;
        """)

        # Create Aggregated Fact Models matching dbt spec
        cursor.execute("""
            CREATE TABLE fct_revenue AS
            SELECT
                sale_date,
                region,
                country,
                product,
                quarter,
                month,
                SUM(quantity) AS total_quantity,
                SUM(revenue) AS total_revenue
            FROM stg_sales
            GROUP BY sale_date, region, country, product, quarter, month;
        """)

        cursor.execute("""
            CREATE TABLE fct_cost AS
            SELECT
                sale_date,
                region,
                country,
                product,
                quarter,
                month,
                SUM(material_cost) AS total_material_cost,
                SUM(shipping_cost) AS total_shipping_cost,
                SUM(total_cost) AS total_cost
            FROM stg_sales
            GROUP BY sale_date, region, country, product, quarter, month;
        """)

        cursor.execute("""
            CREATE TABLE fct_margin AS
            SELECT
                r.sale_date,
                r.region,
                r.country,
                r.product,
                r.quarter,
                r.month,
                r.total_revenue,
                c.total_material_cost,
                c.total_shipping_cost,
                c.total_cost,
                (r.total_revenue - c.total_cost) AS margin,
                ROUND((r.total_revenue - c.total_cost) / NULLIF(r.total_revenue, 0) * 100, 2) AS margin_pct
            FROM fct_revenue r
            JOIN fct_cost c
              ON r.sale_date = c.sale_date
             AND r.region = c.region
             AND r.country = c.country
             AND r.product = c.product;
        """)

        conn.commit()
    except Exception as e:
        conn.rollback()
        conn.close()
        raise RuntimeError(f"Database transaction failed and was rolled back: {str(e)}")

    conn.close()


def run_pipeline(csv_path=CSV_PATH, db_path=DB_PATH, log_path=LOG_PATH) -> dict:
    """Execute complete ETL pipeline with metrics and logging."""
    start_time = time.time()
    timestamp = datetime.now().isoformat()

    print(f"[{timestamp}] Starting MetricMind ETL Pipeline...")
    print(f"Extracting data from: {csv_path}")
    raw_rows = extract_data(csv_path)

    print(f"Validating {len(raw_rows)} raw records...")
    is_valid, errors = validate_data(raw_rows)

    if not is_valid:
        error_msg = f"ETL Pipeline aborted due to {len(errors)} data quality failures."
        print(f"[ERROR] {error_msg}")
        for err in errors[:5]:
            print(f" - {err}")
        log_entry = {
            "timestamp": timestamp,
            "status": "FAILED",
            "records_extracted": len(raw_rows),
            "errors": errors,
            "execution_duration_sec": round(time.time() - start_time, 4),
        }
        with open(log_path, "w", encoding="utf-8") as lf:
            json.dump(log_entry, lf, indent=2)
        raise ValueError(error_msg)

    print("Data quality checks PASSED. Transforming data...")
    stg_records = transform_data(raw_rows)

    print(f"Loading data into SQLite database: {db_path}...")
    load_database(stg_records, db_path)

    duration = round(time.time() - start_time, 4)

    # Verification query
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM stg_sales")
    stg_count = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM fct_margin")
    fct_margin_count = cursor.fetchone()[0]
    conn.close()

    summary = {
        "timestamp": timestamp,
        "status": "SUCCESS",
        "records_extracted": len(raw_rows),
        "stg_sales_records": stg_count,
        "fct_margin_records": fct_margin_count,
        "execution_duration_sec": duration,
    }

    with open(log_path, "w", encoding="utf-8") as lf:
        json.dump(summary, lf, indent=2)

    print(f"[SUCCESS] ETL Pipeline complete in {duration}s!")
    print(f"Summary: {stg_count} stg_sales records, {fct_margin_count} fct_margin records loaded.")
    return summary


if __name__ == "__main__":
    run_pipeline()
