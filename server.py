# server.py - Minimal FastAPI Backend for AIGAANE V4
import math
import hashlib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="AIGAANE V4 Backend")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

class StatsRequest(BaseModel):
    text: str

class StatsResponse(BaseModel):
    sigma_dim: float
    entropy: float
    hash: str

def compute_49d(text: str):
    vec = [0.0] * 49
    for i, ch in enumerate(text):
        code = ord(ch) % 49
        for d in range(49):
            vec[d] += (code / (i + 1)) * math.sin(d * (i + 1))
    sigma = sum(abs(v) for v in vec)
    total = sigma if sigma > 0 else 1
    probs = [abs(v) / total for v in vec]
    entropy = -sum(p * math.log(p + 1e-12) for p in probs)
    vec_str = "".join(f"{v:.5f}" for v in vec)
    hash_val = hashlib.sha256(vec_str.encode()).hexdigest()[:8]
    return {"sigma_dim": round(sigma, 5), "entropy": round(-entropy, 5), "hash": hash_val}

@app.post("/api/49d/stats", response_model=StatsResponse)
async def fortynine_stats(req: StatsRequest):
    return StatsResponse(**compute_49d(req.text))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
