"""
Day 1 checkpoint script.

Run this to confirm Python + LangChain + Gemini are wired up correctly:

    python -m app.agent.llm_test

Expected output: a short natural-language reply from Gemini.
"""

from langchain_google_genai import ChatGoogleGenerativeAI
from app.config import GOOGLE_API_KEY, GEMINI_MODEL


def get_llm(temperature: float = 0.2) -> ChatGoogleGenerativeAI:
    """Factory so other modules (the real agent, later) can reuse this."""
    if not GOOGLE_API_KEY:
        raise RuntimeError(
            "GOOGLE_API_KEY missing. Add it to a .env file (see .env.example)."
        )
    return ChatGoogleGenerativeAI(
        model=GEMINI_MODEL,
        google_api_key=GOOGLE_API_KEY,
        temperature=temperature,
    )


def run_basic_test() -> str:
    llm = get_llm()
    response = llm.invoke(
        "You are MetricMind, a business-intelligence assistant. "
        "In one short sentence, introduce yourself."
    )
    return response.content


if __name__ == "__main__":
    print("Testing Gemini connection via LangChain...\n")
    try:
        output = run_basic_test()
        print("LLM response:")
        print(output)
        print("\n✅ Day 1 checkpoint passed — LangChain + Gemini are working.")
    except Exception as e:
        print(f"❌ Something went wrong: {e}")
