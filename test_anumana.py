"""
test_anumana.py - Complete test suite for Anumana Layer
"""

from anumana_layer import get_anumana_engine, Rasa

def test_anumana():
    engine = get_anumana_engine()
    
    print("=" * 60)
    print("ANUMANA LAYER - COMPLETE TEST SUITE")
    print("=" * 60)
    
    # Test cases
    test_cases = [
        ("Uttara Phalguni", Rasa.SHANTA, -7.0, 0.3),
        ("Rohini", Rasa.SHRINGARA, -4.0, 0.6),
        ("Krittika", Rasa.VIRA, -2.0, 0.8),
        ("Magha", Rasa.KARUNA, -5.0, 0.4),
        ("Ardra", Rasa.RAUDRA, -3.0, 0.7),
        ("Shravana", Rasa.ADBHUTA, -6.0, 0.5),
    ]
    
    print("\n📊 TRANSITION PREDICTIONS")
    print("-" * 60)
    
    for nakshatra, current_rasa, entropy, intensity in test_cases:
        result = engine.predict_transition(current_rasa, nakshatra, entropy, intensity)
        
        print(f"\n📀 {nakshatra} ({current_rasa.value}):")
        print(f"   Entropy: {entropy}, Intensity: {intensity}")
        print(f"   → {result['predicted_rasa'].value} ({result['transition_type']}, conf: {result['confidence']:.2f})")
        print(f"   Prakriti: {result['prakriti']}")
        print(f"   Suggested Meter: {engine.get_meter_suggestion(result['predicted_rasa'], intensity)}")
    
    print("\n" + "=" * 60)
    print("✅ Anumana Layer test complete!")
    print("=" * 60)

if __name__ == "__main__":
    test_anumana()
