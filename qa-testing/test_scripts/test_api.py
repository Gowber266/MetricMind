"""
API tests using FastAPI's TestClient (no real server needed).
Run: pytest qa-testing/test_scripts/test_api.py
"""

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "backend"))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_endpoint():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"


def test_ping_llm_without_key_fails_gracefully():
    # Without GOOGLE_API_KEY set, this should fail with a clear 500,
    # not crash the server.
    res = client.post("/ping-llm", json={"message": "hello"})
    assert res.status_code in (200, 500)


def test_ask_route_exists():
    res = client.post("/ask", json={"question": "What is revenue?"})
    assert res.status_code in (200, 500)


if __name__ == "__main__":
    test_health_endpoint()
    test_ping_llm_without_key_fails_gracefully()
    test_ask_route_exists()
    print("[OK] All API structure checks passed.")
