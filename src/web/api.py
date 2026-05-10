from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from core._49d.kernel import get_49d_stats

app = FastAPI(title="AIGAANE V4 API")

# Serve static files
app.mount("/static", StaticFiles(directory="src/web/static"), name="static")

@app.get("/")
async def root():
    with open("src/web/templates/index.html", "r", encoding="utf-8") as f:
        return HTMLResponse(content=f.read())

@app.post("/api/49d/stats")
async def stats_49d(data: dict):
    text = data.get("text", "")
    return get_49d_stats(text)

@app.get("/api/health")
async def health():
    return {"status": "ok", "version": "4.0"}
