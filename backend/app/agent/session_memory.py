"""
Session Memory Manager for MetricMind Agentic Layer.
Provides thread-safe session chat history management and metadata per `session_id`.
"""

from datetime import datetime
from typing import Dict, List, Optional
from langchain_core.chat_history import InMemoryChatMessageHistory, BaseChatMessageHistory

# In-memory store for session histories and session metadata
_SESSION_STORES: Dict[str, InMemoryChatMessageHistory] = {}
_SESSION_METADATA: Dict[str, Dict[str, str]] = {}
MAX_SESSION_MESSAGES = 30


def get_session_history(session_id: str) -> BaseChatMessageHistory:
    """Retrieve or initialize the ChatMessageHistory for a given session_id with metadata tracking."""
    clean_id = session_id.strip() if session_id else "default"
    now_iso = datetime.now().isoformat()

    if clean_id not in _SESSION_STORES:
        _SESSION_STORES[clean_id] = InMemoryChatMessageHistory()
        _SESSION_METADATA[clean_id] = {
            "created_at": now_iso,
            "last_active_at": now_iso
        }
    else:
        _SESSION_METADATA[clean_id]["last_active_at"] = now_iso

    # History truncation check
    history = _SESSION_STORES[clean_id]
    if len(history.messages) > MAX_SESSION_MESSAGES:
        history.messages = history.messages[-MAX_SESSION_MESSAGES:]

    return history


def clear_session(session_id: str) -> bool:
    """Clear memory and metadata for a given session_id. Returns True if session existed."""
    clean_id = session_id.strip() if session_id else "default"
    existed = False
    if clean_id in _SESSION_STORES:
        del _SESSION_STORES[clean_id]
        existed = True
    if clean_id in _SESSION_METADATA:
        del _SESSION_METADATA[clean_id]
        existed = True
    return existed


def list_active_sessions() -> List[Dict]:
    """Return list of active sessions with message counts and metadata."""
    sessions = []
    for s_id, history in _SESSION_STORES.items():
        meta = _SESSION_METADATA.get(s_id, {})
        sessions.append({
            "session_id": s_id,
            "message_count": len(history.messages),
            "created_at": meta.get("created_at"),
            "last_active_at": meta.get("last_active_at")
        })
    return sessions


def get_formatted_history(session_id: str) -> List[Dict[str, str]]:
    """Return formatted conversation history list for API responses."""
    history = get_session_history(session_id)
    formatted = []
    for msg in history.messages:
        role = "user" if msg.type == "human" else ("assistant" if msg.type == "ai" else msg.type)
        formatted.append({
            "role": role,
            "content": str(msg.content)
        })
    return formatted

