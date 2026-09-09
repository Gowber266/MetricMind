"""
API integration tests using FastAPI TestClient (backend/app/main.py).
Run: python qa-testing/test_scripts/test_api.py
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


def test_cors_headers():
    res = client.options("/health", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "GET"})
    assert res.status_code == 200
    assert "access-control-allow-origin" in res.headers


def test_ping_llm_fails_gracefully_or_succeeds():
    res = client.post("/ping-llm", json={"message": "hello"})
    assert res.status_code in (200, 500)


def test_ask_route_with_session_id():
    res = client.post("/ask", json={"question": "What is total revenue?", "session_id": "test_api_session"})
    assert res.status_code in (200, 500)


def test_session_management_endpoints():
    session_id = "test_api_session"
    
    # 1. Get sessions list
    res_list = client.get("/sessions")
    assert res_list.status_code == 200
    assert "sessions" in res_list.json()

    # 2. Get session history
    res_hist = client.get(f"/sessions/{session_id}/history")
    assert res_hist.status_code == 200
    assert res_hist.json()["session_id"] == session_id
    assert "history" in res_hist.json()

    # 3. Clear session via POST endpoint
    res_post_clear = client.post(f"/sessions/{session_id}/clear")
    assert res_post_clear.status_code == 200
    assert res_post_clear.json()["cleared"] is True

    # 4. Delete session via DELETE endpoint
    res_del = client.delete(f"/sessions/{session_id}")
    assert res_del.status_code == 200


if __name__ == "__main__":
    test_health_endpoint()
    test_cors_headers()
    test_ping_llm_fails_gracefully_or_succeeds()
    test_ask_route_with_session_id()
    test_session_management_endpoints()
    print("[OK] All API structure & session memory endpoint tests passed.")

