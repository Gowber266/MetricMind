from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from app.agent.llm_test import get_llm

app = FastAPI(title="MetricMind Agentic Layer", version="0.2.0")


@app.get("/health")
def health():
    """Basic liveness check — used by Gowber/team to confirm the service is up."""
    return {"status": "ok", "service": "metricmind-agent"}


class PingRequest(BaseModel):
    message: str


@app.post("/ping-llm")
def ping_llm(req: PingRequest):
    """Day 1 smoke-test: raw message straight to Gemini, no agent/tools involved."""
    try:
        llm = get_llm()
        result = llm.invoke(req.message)
        return {"reply": result.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class AskRequest(BaseModel):
    question: str


@app.post("/ask")
def ask(req: AskRequest):
    """
    Day 2-6 route: runs the full LangChain agent (with semantic-layer
    tools + governance checks) against a natural-language question.
    """
    try:
        from app.agent.langchain_agent import build_agent
        executor = build_agent()
        result = executor.invoke({"input": req.question})
        return {"answer": result["output"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Run with: uvicorn app.main:app --reload --port 8000
