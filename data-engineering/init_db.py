"""
Database Initialization Script for MetricMind.
Converts mock_data/sales.csv into SQLite database `backend/sales.db`
with staging table (`stg_sales`) and fact view (`fct_sales`).
"""

import os
import csv
import sqlite3

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(BASE_DIR, "data-engineering", "mock_data", "sales.csv")
DB_PATH = os.path.join(BASE_DIR, "backend", "sales.db")


def init_db():
    print(f"Loading data from {CSV_PATH}...")
    if not os.path.exists(CSV_PATH):
        raise FileNotFoundError(f"Sales CSV not found at {CSV_PATH}")

    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Drop existing tables/views if any
    cursor.execute("DROP VIEW IF EXISTS fct_sales")
    cursor.execute("DROP TABLE IF EXISTS stg_sales")

    # Create staging table
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

    # Read CSV and insert into staging
    with open(CSV_PATH, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows_to_insert = []
        for row in reader:
            date_str = row["date"].strip()
            # Calculate quarter (e.g. "Q3 2025")
            year = int(date_str.split("-")[0])
            month_int = int(date_str.split("-")[1])
            q_num = (month_int - 1) // 3 + 1
            quarter_str = f"Q{q_num} {year}"
            month_str = f"{year}-{month_int:02d}"

            rows_to_insert.append((
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

    cursor.executemany("""
        INSERT INTO stg_sales (
            sale_date, region, country, product, quantity, unit_price,
            revenue, material_cost, shipping_cost, total_cost, margin,
            quarter, year, month
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, rows_to_insert)

    # Create transformed fact view
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
        FROM stg_sales
    """)

    conn.commit()
    cursor.execute("SELECT COUNT(*) FROM fct_sales")
    count = cursor.fetchone()[0]
    conn.close()
    print(f"Successfully initialized `sales.db` with {count} records in `fct_sales` view!")

if __name__ == "__main__":
    init_db()
