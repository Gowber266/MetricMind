"""
Database Initialization Script for MetricMind.
Delegates execution to the automated ETL pipeline runner (`run_etl.py`).
"""

import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

from run_etl import run_pipeline


def init_db():
    print("Delegating DB initialization to automated ETL pipeline...")
    run_pipeline()


if __name__ == "__main__":
    init_db()
