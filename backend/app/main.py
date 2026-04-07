from dotenv import load_dotenv
from fastapi import FastAPI
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="HR Agent")

load_dotenv()

frontend_url = os.getenv("FRONTEND_URL")

app.add_middleware (
    CORSMiddleware, 
    allow_origins=[frontend_url],
    allow_methods = ["*"],
    allow_headers = ["*"]
)

