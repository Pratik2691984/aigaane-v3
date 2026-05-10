"""
nakshatra_sound.py - Pure sound architecture for 27 Nakshatras
No astrology, only music & mantra attributes for 49D kernel integration
"""

import json
import os
from typing import Dict, Optional

class NakshatraSound:
    """Music & mantra mapping for each nakshatra"""
    
    def __init__(self, json_path: str = None):
        if json_path is None:
            json_path = os.path.join(os.path.dirname(__file__), "data", "nakshatra_sound.json")
        
        with open(json_path, "r", encoding="utf-8") as f:
            self.data = json.load(f)
        
        # Create lookup by name and index
        self.by_name: Dict[str, dict] = {}
        self.by_index: Dict[int, dict] = {}
        
        for n in self.data["nakshatras"]:
            self.by_name[n["name"].lower()] = n
            self.by_index[n["index"]] = n
        
        print(f"✅ Loaded {len(self.by_name)} nakshatra sound mappings")
    
    def get_by_name(self, name: str) -> Optional[dict]:
        """Get nakshatra sound data by name (case-insensitive)"""
        return self.by_name.get(name.lower())
    
    def get_by_index(self, idx: int) -> Optional[dict]:
        """Get nakshatra sound data by index (1-27)"""
        return self.by_index.get(idx)
    
    def get_svara_frequency(self, svara: str, base_freq: float = 261.63) -> float:
        """
        Convert svara name to frequency ratio
        Base frequency: C4 (Middle C) = 261.63 Hz
        """
        ratios = {
            "Sa (śuddha)": 1/1,
            "Re (komal)": 9/8,
            "Ga (śuddha)": 5/4,
            "Ma (tivra)": 4/3,
            "Pa (śuddha)": 3/2,
            "Dha (komal)": 11/8,
            "Ni (komal)": 7/4
        }
        ratio = ratios.get(svara, 1/1)
        return base_freq * ratio
    
    def get_meter_pattern(self, chand: str) -> dict:
        """
        Convert meter name to syllable pattern
        Returns pattern and syllable count
        """
        meters = {
            "Vasantatilaka": {"pattern": "S S G S G G", "syllables": 12},
            "Shikharini": {"pattern": "G G G S G S G G G", "syllables": 17},
            "Mandākrāntā": {"pattern": "G S G S G S G S G", "syllables": 15},
            "Upajati": {"pattern": "G G S G G G", "syllables": 11},
            "Shārdūlavikrīḍita": {"pattern": "G G S G G S G G G", "syllables": 19}
        }
        return meters.get(chand, {"pattern": "S G", "syllables": 2})
    
    def to_49d_vector(self, nakshatra: dict) -> list:
        """
        Convert nakshatra sound attributes to 49-dimensional vector
        Each attribute maps to specific dimension ranges
        """
        vec = [0.0] * 49
        
        # Svara (dimensions 1-7) - one-hot based on note
        svara_map = {
            "Sa (śuddha)": 0, "Re (komal)": 1, "Ga (śuddha)": 2,
            "Ma (tivra)": 3, "Pa (śuddha)": 4, "Dha (komal)": 5,
            "Ni (komal)": 6
        }
        svara_idx = svara_map.get(nakshatra["svara"], 0)
        vec[svara_idx] = 1.0
        
        # Raga (dimensions 8-20) - encode as frequency cluster
        raga_freq = hash(nakshatra["raga"]) % 13
        vec[8 + raga_freq] = 0.8
        
        # Chand/meter (dimensions 21-28) - syllable count
        meter = self.get_meter_pattern(nakshatra["chand"])
        vec[21] = meter["syllables"] / 20.0
        
        # Bija phoneme (dimensions 29-40) - phonetic class
        bija_val = ord(nakshatra["bija"][0]) % 12
        vec[29 + bija_val] = 0.9
        
        # Lyric seed (dimensions 41-49) - semantic anchor
        seed_val = len(nakshatra["seed"]) / 10.0
        vec[41] = seed_val
        
        return vec
    
    def generate_mantra_phrase(self, nakshatra: dict) -> str:
        """Generate a simple mantra phrase using bija and seed"""
        bija = nakshatra["bija"].lower()
        seed = nakshatra["seed"].lower()
        
        if len(bija) == 1:
            return f"Oṁ {bija}ṁ {seed} namaḥ"
        else:
            return f"Oṁ {bija} {seed} namaḥ"

# Singleton instance
_sound_db = None

def get_sound_db() -> NakshatraSound:
    global _sound_db
    if _sound_db is None:
        _sound_db = NakshatraSound()
    return _sound_db

# Quick test
if __name__ == "__main__":
    db = get_sound_db()
    rohini = db.get_by_name("Rohiṇī")
    print(f"\n📊 Rohiṇī Sound Data:")
    print(f"   Svara: {rohini['svara']}")
    print(f"   Rāga: {rohini['raga']}")
    print(f"   Chand: {rohini['chand']}")
    print(f"   Bīja: {rohini['bija']}")
    print(f"   Seed: {rohini['seed']}")
    print(f"   Mantra: {db.generate_mantra_phrase(rohini)}")
    print(f"   Frequency: {db.get_svara_frequency(rohini['svara']):.1f} Hz")
    
    # Test 49D vector
    vec = db.to_49d_vector(rohini)
    print(f"\n   49D Vector (first 10 dims): {vec[:10]}")
