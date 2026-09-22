"""
Unit tests for Session Memory Manager (backend/app/agent/session_memory.py).
Run: python qa-testing/test_scripts/test_session_memory.py
"""

import os
import sys

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "backend"))
sys.path.insert(0, BASE_DIR)

from app.agent.session_memory import (
    get_session_history,
    clear_session,
    list_active_sessions,
    get_formatted_history,
    MAX_SESSION_MESSAGES,
)


def test_session_creation_and_retrieval():
    session_id = "test_session_1"
    history = get_session_history(session_id)
    history.add_user_message("What is European revenue in Q2 2025?")
    history.add_ai_message("European revenue in Q2 2025 was $120,000.00.")

    formatted = get_formatted_history(session_id)
    assert len(formatted) == 2
    assert formatted[0]["role"] == "user"
    assert formatted[0]["content"] == "What is European revenue in Q2 2025?"
    assert formatted[1]["role"] == "assistant"
    assert "120,000" in formatted[1]["content"]


def test_active_sessions_list_with_metadata():
    sessions = list_active_sessions()
    session_ids = [s["session_id"] for s in sessions]
    assert "test_session_1" in session_ids
    target = next(s for s in sessions if s["session_id"] == "test_session_1")
    assert "created_at" in target
    assert "last_active_at" in target
    assert target["message_count"] == 2


def test_session_history_truncation():
    session_id = "test_overflow_session"
    history = get_session_history(session_id)
    for i in range(40):
        history.add_user_message(f"Msg {i}")

    # Accessing session history triggers truncation check
    history_after = get_session_history(session_id)
    assert len(history_after.messages) <= MAX_SESSION_MESSAGES
    clear_session(session_id)


def test_clear_session():
    session_id = "test_session_1"
    cleared = clear_session(session_id)
    assert cleared is True

    # Confirm memory is reset
    formatted = get_formatted_history(session_id)
    assert len(formatted) == 0


if __name__ == "__main__":
    test_session_creation_and_retrieval()
    test_active_sessions_list_with_metadata()
    test_session_history_truncation()
    test_clear_session()
    print("[OK] All Session Memory tests passed successfully.")

