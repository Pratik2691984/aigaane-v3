"""
anumana_layer.py - Predictive State Modeling for AIGAANE V4
Bridges 49D kernel with emotional and creative transitions
"""

import math
import random
from typing import Dict, List, Optional, Tuple
from enum import Enum
from dataclasses import dataclass
import json

# ========== ENUMS FOR STATE SPACE ==========
class Rasa(str, Enum):
    """The nine emotional flavors (Navarasa)"""
    SHRINGARA = "Shringara"  # Love, beauty
    HASYA = "Hasya"          # Laughter, joy
    KARUNA = "Karuna"        # Compassion, sorrow
    RAUDRA = "Raudra"        # Anger, fury
    VIRA = "Vira"            # Heroism, courage
    BHAYANAKA = "Bhayanaka"  # Fear, terror
    BIBHATSA = "Bibhatsa"    # Disgust, aversion
    ADBHUTA = "Adbhuta"      # Wonder, amazement
    SHANTA = "Shanta"        # Peace, tranquility

class Prakriti(str, Enum):
    """Natural disposition weights"""
    SATTVA = "Sattva"   # Harmony, balance
    RAJAS = "Rajas"     # Activity, passion
    TAMAS = "Tamas"     # Inertia, darkness

class TransitionType(str, Enum):
    GRADUAL = "gradual"     # Smooth, natural transition
    SUDDEN = "sudden"       # Abrupt, dramatic shift
    CYCLIC = "cyclic"       # Returning to previous state
    RESONANT = "resonant"   # Jump to complimentary state

# ========== TRANSITION RESONANCE MATRIX ==========
# Defines compatible emotional transitions based on resonance
TRANSITION_MATRIX = {
    Rasa.SHANTA: {
        "primary": [Rasa.KARUNA, Rasa.ADBHUTA],
        "secondary": [Rasa.SHRINGARA],
        "blocked": [Rasa.RAUDRA, Rasa.BIBHATSA],
        "resonance": {"Sattva": 0.9, "Rajas": 0.3, "Tamas": 0.5}
    },
    Rasa.SHRINGARA: {
        "primary": [Rasa.HASYA, Rasa.ADBHUTA],
        "secondary": [Rasa.SHANTA, Rasa.VIRA],
        "blocked": [Rasa.BIBHATSA, Rasa.BHAYANAKA],
        "resonance": {"Sattva": 0.8, "Rajas": 0.7, "Tamas": 0.2}
    },
    Rasa.VIRA: {
        "primary": [Rasa.RAUDRA, Rasa.ADBHUTA],
        "secondary": [Rasa.SHRINGARA, Rasa.SHANTA],
        "blocked": [Rasa.KARUNA, Rasa.BHAYANAKA],
        "resonance": {"Sattva": 0.5, "Rajas": 0.9, "Tamas": 0.3}
    },
    Rasa.RAUDRA: {
        "primary": [Rasa.BHAYANAKA, Rasa.VIRA],
        "secondary": [Rasa.BIBHATSA],
        "blocked": [Rasa.SHANTA, Rasa.KARUNA],
        "resonance": {"Sattva": 0.1, "Rajas": 0.9, "Tamas": 0.6}
    },
    Rasa.KARUNA: {
        "primary": [Rasa.SHANTA, Rasa.KARUNA],
        "secondary": [Rasa.ADBHUTA],
        "blocked": [Rasa.HASYA, Rasa.RAUDRA],
        "resonance": {"Sattva": 0.7, "Rajas": 0.2, "Tamas": 0.5}
    },
    Rasa.ADBHUTA: {
        "primary": [Rasa.SHRINGARA, Rasa.VIRA],
        "secondary": [Rasa.HASYA, Rasa.SHANTA],
        "blocked": [Rasa.BIBHATSA, Rasa.BHAYANAKA],
        "resonance": {"Sattva": 0.8, "Rajas": 0.6, "Tamas": 0.2}
    },
    Rasa.HASYA: {
        "primary": [Rasa.SHRINGARA, Rasa.ADBHUTA],
        "secondary": [Rasa.SHANTA],
        "blocked": [Rasa.KARUNA, Rasa.BHAYANAKA],
        "resonance": {"Sattva": 0.7, "Rajas": 0.6, "Tamas": 0.1}
    },
    Rasa.BHAYANAKA: {
        "primary": [Rasa.RAUDRA, Rasa.BIBHATSA],
        "secondary": [Rasa.KARUNA],
        "blocked": [Rasa.SHRINGARA, Rasa.HASYA],
        "resonance": {"Sattva": 0.1, "Rajas": 0.5, "Tamas": 0.9}
    },
    Rasa.BIBHATSA: {
        "primary": [Rasa.BHAYANAKA, Rasa.RAUDRA],
        "secondary": [Rasa.KARUNA],
        "blocked": [Rasa.SHRINGARA, Rasa.SHANTA],
        "resonance": {"Sattva": 0.1, "Rajas": 0.4, "Tamas": 0.8}
    }
}

# ========== NAKSHATRA TO RASA MAPPING ==========
NAKSHATRA_RASA = {
    "Ashwini": Rasa.VIRA,
    "Bharani": Rasa.KARUNA,
    "Krittika": Rasa.RAUDRA,
    "Rohini": Rasa.SHRINGARA,
    "Mrigashira": Rasa.SHRINGARA,
    "Ardra": Rasa.RAUDRA,
    "Punarvasu": Rasa.HASYA,
    "Pushya": Rasa.SHANTA,
    "Ashlesha": Rasa.BHAYANAKA,
    "Magha": Rasa.KARUNA,
    "Purva Phalguni": Rasa.SHRINGARA,
    "Uttara Phalguni": Rasa.VIRA,
    "Hasta": Rasa.ADBHUTA,
    "Chitra": Rasa.ADBHUTA,
    "Swati": Rasa.VIRA,
    "Vishakha": Rasa.RAUDRA,
    "Anuradha": Rasa.SHANTA,
    "Jyeshtha": Rasa.RAUDRA,
    "Mula": Rasa.BHAYANAKA,
    "Purva Ashadha": Rasa.VIRA,
    "Uttara Ashadha": Rasa.VIRA,
    "Shravana": Rasa.SHANTA,
    "Dhanishtha": Rasa.ADBHUTA,
    "Shatabhisha": Rasa.BHAYANAKA,
    "Purva Bhadrapada": Rasa.RAUDRA,
    "Uttara Bhadrapada": Rasa.SHANTA,
    "Revati": Rasa.SHANTA
}

# ========== ANUMANA ENGINE ==========
class AnumanaEngine:
    """Predictive state modeling based on 49D kernel and nakshatra"""
    
    def __init__(self):
        self.transition_matrix = TRANSITION_MATRIX
        self.nakshatra_rasa = NAKSHATRA_RASA
    
    def calculate_prakriti_from_entropy(self, entropy: float) -> Tuple[Prakriti, float]:
        """Determine prakriti (disposition) from entropy value"""
        # Normalize entropy (typical range -10 to 0)
        norm_entropy = abs(entropy) / 10.0
        norm_entropy = min(1.0, norm_entropy)
        
        if norm_entropy < 0.33:
            return Prakriti.SATTVA, 0.8
        elif norm_entropy < 0.66:
            return Prakriti.RAJAS, 0.7
        else:
            return Prakriti.TAMAS, 0.6
    
    def get_rasa_from_nakshatra(self, nakshatra_name: str) -> Rasa:
        """Map nakshatra to predominant rasa"""
        return self.nakshatra_rasa.get(nakshatra_name, Rasa.SHANTA)
    
    def predict_transition(
        self,
        current_rasa: Rasa,
        nakshatra_name: str,
        entropy: float,
        intensity: float = 0.5
    ) -> Dict:
        """Predict next emotional state based on multiple factors"""
        
        # Get nakshatra influence
        nakshatra_rasa = self.get_rasa_from_nakshatra(nakshatra_name)
        
        # Get transition options for current rasa
        options = self.transition_matrix.get(current_rasa, TRANSITION_MATRIX[Rasa.SHANTA])
        
        # Determine prakriti from entropy
        prakriti, prakriti_weight = self.calculate_prakriti_from_entropy(entropy)
        
        # Weight transitions based on prakriti compatibility
        weighted_options = []
        for rasa in options["primary"]:
            resonance = options["resonance"].get(prakriti.value, 0.5)
            weight = resonance * (1 + intensity) * prakriti_weight
            weighted_options.append((rasa, weight, "primary"))
        
        for rasa in options["secondary"]:
            resonance = options["resonance"].get(prakriti.value, 0.3)
            weight = resonance * intensity * 0.7
            weighted_options.append((rasa, weight, "secondary"))
        
        # Add nakshatra influence as a modifier
        if nakshatra_rasa != current_rasa:
            # Nakshatra suggests a different emotional center
            weighted_options.append((nakshatra_rasa, 0.6 * intensity, "nakshatra"))
        
        # Add cyclic return to original (stability)
        weighted_options.append((current_rasa, 0.4 * (1 - intensity), "cyclic"))
        
        # Sort by weight and select
        weighted_options.sort(key=lambda x: x[1], reverse=True)
        
        # Apply deterministic randomness based on entropy
        seed = int(abs(entropy) * 1000) % 100
        random.seed(seed)
        
        # Select top 3 weighted options with probability distribution
        top_options = weighted_options[:3]
        total_weight = sum(w for _, w, _ in top_options)
        
        if total_weight > 0:
            r = random.random() * total_weight
            cumulative = 0
            for rasa, weight, transition_type in top_options:
                cumulative += weight
                if r <= cumulative:
                    return {
                        "predicted_rasa": rasa,
                        "transition_type": transition_type,
                        "confidence": weight / total_weight,
                        "prakriti": prakriti.value,
                        "prakriti_weight": prakriti_weight
                    }
        
        # Fallback
        return {
            "predicted_rasa": options["primary"][0] if options["primary"] else Rasa.SHANTA,
            "transition_type": "gradual",
            "confidence": 0.5,
            "prakriti": prakriti.value,
            "prakriti_weight": prakriti_weight
        }
    
    def get_meter_suggestion(self, rasa: Rasa, intensity: float) -> str:
        """Suggest meter based on emotional state"""
        meter_map = {
            Rasa.SHANTA: "Vasantatilaka (12+12, gentle flow)",
            Rasa.VIRA: "Shikharini (17+17, heroic)",
            Rasa.SHRINGARA: "Mandakranta (15+15, lyrical)",
            Rasa.RAUDRA: "Shardulavikri?ita (19+19, intense)",
            Rasa.ADBHUTA: "Upajati (11+11, wonder)",
            Rasa.KARUNA: "Vasantatilaka (12+12, flowing sorrow)",
            Rasa.HASYA: "Upajati (11+11, light)",
            Rasa.BHAYANAKA: "Shikharini (17+17, sharp breaks)",
            Rasa.BIBHATSA: "Shardulavikri?ita (19+19, heavy)"
        }
        base_meter = meter_map.get(rasa, "Vasantatilaka")
        
        # Adjust for intensity
        if intensity > 0.7:
            return f"{base_meter} (intensified)"
        elif intensity < 0.3:
            return f"{base_meter} (subdued)"
        return base_meter
    
    def get_suggested_raga(self, rasa: Rasa, nakshatra_name: str) -> str:
        """Suggest raga based on emotional state and nakshatra"""
        # This maps to your existing nakshatra sound database
        from nakshatra_sound import get_sound_db
        from nakshatra_creative import get_creative_db
        
        sound_db = get_sound_db()
        creative_db = get_creative_db()
        
        # Try to get raga from nakshatra
        n = creative_db.get_by_name(nakshatra_name)
        if n and 'raga' in n:
            return n['raga'].get('primary', 'Yaman')
        
        # Fallback rasa-based mapping
        raga_map = {
            Rasa.SHANTA: "Bhoop",
            Rasa.VIRA: "Bhairav",
            Rasa.SHRINGARA: "Khamaj",
            Rasa.RAUDRA: "Todi",
            Rasa.ADBHUTA: "Yaman",
            Rasa.KARUNA: "Bhimpalasi",
            Rasa.HASYA: "Desh",
            Rasa.BHAYANAKA: "Malkauns",
            Rasa.BIBHATSA: "Darbari"
        }
        return raga_map.get(rasa, "Bhoop")


# Singleton instance
_anumana_engine = None

def get_anumana_engine() -> AnumanaEngine:
    global _anumana_engine
    if _anumana_engine is None:
        _anumana_engine = AnumanaEngine()
    return _anumana_engine


# Test function
if __name__ == "__main__":
    engine = get_anumana_engine()
    
    print("=" * 60)
    print("ANUMANA LAYER TEST")
    print("=" * 60)
    
    # Test transitions
    test_cases = [
        (Rasa.SHANTA, "Uttara Phalguni", -7.0, 0.3),
        (Rasa.SHRINGARA, "Rohini", -4.0, 0.6),
        (Rasa.VIRA, "Krittika", -2.0, 0.8),
        (Rasa.KARUNA, "Magha", -5.0, 0.4),
    ]
    
    for rasa, nakshatra, entropy, intensity in test_cases:
        result = engine.predict_transition(rasa, nakshatra, entropy, intensity)
        print(f"\n?? Current: {rasa} ({nakshatra}) - Entropy: {entropy}")
        print(f"   ? Predicted: {result['predicted_rasa']}")
        print(f"   Transition: {result['transition_type']}")
        print(f"   Confidence: {result['confidence']:.2f}")
        print(f"   Prakriti: {result['prakriti']}")
        print(f"   Suggested Meter: {engine.get_meter_suggestion(result['predicted_rasa'], intensity)}")
