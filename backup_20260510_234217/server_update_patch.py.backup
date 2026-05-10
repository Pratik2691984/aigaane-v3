# Add this to your existing server.py (after imports)

from anumana_layer import get_anumana_engine, Rasa, Prakriti, TransitionType

class AnumanaRequest(BaseModel):
    current_hash: int = Field(..., description="Current 49D hash value", example=2693315)
    current_rasa: Optional[str] = Field(None, description="Current emotional state (Navarasa)")
    intensity: float = Field(default=0.5, ge=0.1, le=1.0, description="Current intensity level")
    steps: int = Field(default=1, ge=1, le=9, description="Steps to predict (1-9)")

class AnumanaResponse(BaseModel):
    current_state: Dict[str, Any]
    predicted_state: Dict[str, Any]
    transition_type: str
    confidence: float
    suggested_meter: str
    suggested_raga: str
    prakriti: str
    resonance_score: float

@app.post(
    "/api/anu-layer/predict",
    response_model=AnumanaResponse,
    summary="Anumana Layer - Predictive State Modeling",
    description="""
    Predicts next emotional and creative state based on:
    - Current 49D hash (entropy signature)
    - Nakshatra alignment
    - Current Rasa (emotional state)
    - Intensity level
    
    Uses resonance matrix and Vedic principles for deterministic yet creative predictions.
    """
)
async def predict_next_state(req: AnumanaRequest):
    """Forward prediction for creative guidance"""
    
    # Get nakshatra from hash
    creative_db = get_creative_db()
    current_n = creative_db.get_by_hash(req.current_hash)
    nakshatra_name = current_n['name']
    
    # Get 49D stats for entropy
    stats = compute_49d(current_n['name'])
    entropy = stats['entropy']
    
    # Determine current rasa if not provided
    anumana = get_anumana_engine()
    if req.current_rasa:
        try:
            current_rasa = Rasa(req.current_rasa)
        except ValueError:
            current_rasa = anumana.get_rasa_from_nakshatra(nakshatra_name)
    else:
        current_rasa = anumana.get_rasa_from_nakshatra(nakshatra_name)
    
    # Predict transition
    prediction = anumana.predict_transition(
        current_rasa=current_rasa,
        nakshatra_name=nakshatra_name,
        entropy=entropy,
        intensity=req.intensity
    )
    
    # Calculate next nakshatra for multi-step prediction
    next_idx = (req.current_hash + req.steps) % 27
    next_n = creative_db.get_by_index(next_idx)
    
    # Get suggested meter and raga
    suggested_meter = anumana.get_meter_suggestion(
        prediction['predicted_rasa'], 
        req.intensity
    )
    suggested_raga = anumana.get_suggested_raga(
        prediction['predicted_rasa'],
        next_n['name']
    )
    
    # Calculate resonance score
    resonance_score = prediction['confidence'] * (1 - abs(entropy) / 20)
    
    return AnumanaResponse(
        current_state={
            "rasa": current_rasa.value,
            "nakshatra": nakshatra_name,
            "entropy": entropy,
            "hash": req.current_hash
        },
        predicted_state={
            "rasa": prediction['predicted_rasa'].value,
            "next_nakshatra": next_n['name'],
            "intensity": req.intensity,
            "transition_type": prediction['transition_type']
        },
        transition_type=prediction['transition_type'],
        confidence=round(prediction['confidence'], 3),
        suggested_meter=suggested_meter,
        suggested_raga=suggested_raga,
        prakriti=prediction['prakriti'],
        resonance_score=round(resonance_score, 3)
    )
