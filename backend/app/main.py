from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.agent.llm_test import get_llm
from app.agent.session_memory import (
    clear_session,
    get_formatted_history,
    list_active_sessions,
)

app = FastAPI(title="MetricMind Agentic Layer", version="0.3.0")

# Enable CORS for local development (Vite/React frontend support)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    """Basic liveness check — used to confirm service is running."""
    return {"status": "ok", "service": "metricmind-agent"}


class PingRequest(BaseModel):
    message: str


@app.post("/ping-llm")
def ping_llm(req: PingRequest):
    """Smoke-test route: direct query to LLM without tools."""
    try:
        llm = get_llm()
        result = llm.invoke(req.message)
        return {"reply": result.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class AskRequest(BaseModel):
    question: str
    session_id: Optional[str] = "default"


@app.post("/ask")
def ask(req: AskRequest):
    """
    Main agent route: runs the LangChain agent with session memory,
    semantic-layer tools, and governance checks.
    """
    try:
        from app.agent.langchain_agent import run_agent_with_memory
        session_id = req.session_id or "default"
        answer = run_agent_with_memory(req.question, session_id=session_id)
        return {
            "answer": answer,
            "session_id": session_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---- Session Memory Endpoints ----------------------------------------

@app.get("/sessions")
def get_sessions():
    """List all active sessions and their message counts and metadata."""
    return {"sessions": list_active_sessions()}


@app.get("/sessions/{session_id}/history")
def get_session_history_endpoint(session_id: str):
    """Retrieve full conversation history for a given session."""
    history = get_formatted_history(session_id)
    return {
        "session_id": session_id,
        "history": history,
        "message_count": len(history)
    }


@app.delete("/sessions/{session_id}")
@app.post("/sessions/{session_id}/clear")
def delete_session(session_id: str):
    """Reset and clear session memory for a given session ID."""
    existed = clear_session(session_id)
    if not existed:
        return {"message": f"Session '{session_id}' was not active.", "cleared": False}
    return {"message": f"Session '{session_id}' memory successfully cleared.", "cleared": True}


# Run with: uvicorn app.main:app --reload --port 8000

