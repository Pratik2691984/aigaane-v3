"""
server.py - FastAPI Backend for AIGAANE V4
Includes 49D kernel, sandhi, and nakshatra creative analysis
"""

import math
import hashlib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Dict, Any, Optional

# Import nakshatra modules
from nakshatra_sound import get_sound_db
from nakshatra_creative import get_creative_db

app = FastAPI(title="AIGAANE V4 API", description="Vedic Sound + Poetry Engine")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========== 49D KERNEL ==========
class StatsRequest(BaseModel):
    text: str

class StatsResponse(BaseModel):
    sigma_dim: float
    entropy: float
    hash: str

def compute_49d(text: str) -> Dict[str, Any]:
    """49-dimensional kernel computation"""
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

# ========== SANDHI ENDPOINT ==========
class SandhiRequest(BaseModel):
    left: str
    right: str

class SandhiResponse(BaseModel):
    left: str
    right: str
    result: str

def apply_sandhi(left: str, right: str) -> str:
    """External sandhi rules"""
    if not left or not right:
        return left + right
    
    # Vowel sandhi
    ik_vowels = set("iīuūṛṝḷ")
    ac_vowels = set("aāiīuūṛṝḷeoaiau")
    
    if left[-1] in ik_vowels and right[0] in ac_vowels:
        mapping = {'i':'y', 'ī':'y', 'u':'v', 'ū':'v', 'ṛ':'r', 'ṝ':'r', 'ḷ':'l'}
        return left[:-1] + mapping.get(left[-1], left[-1]) + right
    
    # Visarga sandhi
    if left[-1] == 'ḥ' and right[0] in ac_vowels:
        return left[:-1] + 'r' + right
    
    return left + right

@app.post("/api/sandhi", response_model=SandhiResponse)
async def external_sandhi(req: SandhiRequest):
    result = apply_sandhi(req.left, req.right)
    return SandhiResponse(left=req.left, right=req.right, result=result)

# ========== NAKSHATRA ANALYSIS ENDPOINT ==========
class NakshatraRequest(BaseModel):
    text: str
    hash_val: Optional[int] = None

class NakshatraResponse(BaseModel):
    text: str
    hash: int
    nakshatra: str
    index: int
    sound: Dict[str, Any]
    creative: Dict[str, Any]
    mantra: str
    frequency_hz: float

def get_hash_from_text(text: str) -> int:
    """Generate hash from text"""
    h = 0
    for char in text:
        h = ((h << 5) - h) + ord(char)
        h = h & 0xffffffff
    return abs(h)

@app.post("/api/nakshatra/analyze", response_model=NakshatraResponse)
async def analyze_nakshatra(req: NakshatraRequest):
    """Complete nakshatra analysis from text"""
    text = req.text.strip()
    hash_val = req.hash_val if req.hash_val else get_hash_from_text(text)
    
    # Get sound and creative data
    sound_db = get_sound_db()
    creative_db = get_creative_db()
    
    sound = sound_db.get_by_hash(hash_val)
    creative = creative_db.get_by_hash(hash_val)
    
    if not sound or not creative:
        return JSONResponse(status_code=404, content={"error": "Nakshatra not found"})
    
    # Calculate frequency
    frequency = sound_db.get_svara_frequency(sound.get("svara", "Sa (śuddha)"))
    
    # Generate mantra
    mantra = sound_db.generate_mantra_phrase(sound)
    
    return NakshatraResponse(
        text=text,
        hash=hash_val,
        nakshatra=creative["name"],
        index=creative["index"],
        sound={
            "svara": sound.get("svara"),
            "raga": creative.get("raga", {}).get("primary"),
            "time": creative.get("raga", {}).get("time"),
            "mood": creative.get("raga", {}).get("mood")
        },
        creative={
            "chand": creative.get("chand"),
            "kavita": creative.get("kavita"),
            "lyrics": creative.get("lyrics")
        },
        mantra=mantra,
        frequency_hz=round(frequency, 1)
    )

@app.get("/api/health")
async def health():
    return {"status": "ok", "version": "4.0", "modules": ["49d", "sandhi", "nakshatra"]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
