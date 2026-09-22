import os
from dotenv import load_dotenv

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
APP_ENV = os.getenv("APP_ENV", "development")

if not GOOGLE_API_KEY:
    print(
        "[config] WARNING: GOOGLE_API_KEY is not set. "
        "Copy .env.example to .env and add your key from "
        "https://aistudio.google.com/app/apikey"
    )
