"""
nakshatra_creative.py - Generate Chand, Kavita, Raga, Lyrics from Nakshatra
Integrates with your 49D kernel for hash-based creative output
"""

import json
import random
import os
from typing import Dict, Optional, List

class NakshatraCreative:
    """Creative generator from nakshatra attributes"""
    
    def __init__(self, json_path: str = None):
        if json_path is None:
            json_path = os.path.join(os.path.dirname(__file__), "data", "nakshatra_creative.json")
        
        with open(json_path, 'r', encoding='utf-8') as f:
            self.data = json.load(f)
        
        self.nakshatras = {n['name']: n for n in self.data['nakshatras']}
        print(f"✅ Loaded {len(self.nakshatras)} nakshatra creative mappings")
    
    def get_by_name(self, name: str) -> Optional[dict]:
        """Get nakshatra creative data by name"""
        return self.nakshatras.get(name)
    
    def get_by_index(self, idx: int) -> Optional[dict]:
        """Get nakshatra by index (0-26 or 1-27)"""
        if idx < 27:
            return self.data['nakshatras'][idx]
        if 1 <= idx <= 27:
            return self.data['nakshatras'][idx - 1]
        return None
    
    def get_by_hash(self, hash_val: int) -> dict:
        """Get nakshatra from 49D hash"""
        idx = hash_val % 27
        return self.data['nakshatras'][idx]
    
    def get_chand(self, nakshatra: dict) -> dict:
        """Get meter information for composition"""
        return nakshatra.get('chand', {})
    
    def get_kavita(self, nakshatra: dict) -> dict:
        """Get poetic theme and imagery"""
        return nakshatra.get('kavita', {})
    
    def get_raga(self, nakshatra: dict) -> dict:
        """Get raga recommendation"""
        return nakshatra.get('raga', {})
    
    def get_lyrics(self, nakshatra: dict) -> dict:
        """Get lyric suggestions and phonemes"""
        return nakshatra.get('lyrics', {})
    
    def generate_chand_line(self, nakshatra: dict, words: List[str] = None) -> str:
        """Generate a line in the nakshatra's meter"""
        chand = nakshatra.get('chand', {})
        meter_name = chand.get('meter', 'Unknown')
        syllable_count = chand.get('total_syllables', 0)
        
        if words:
            line = " ".join(words[:syllable_count//2])
        else:
            line = f"[{meter_name} meter - {syllable_count} syllables]"
        
        return f"📜 Chand ({meter_name}): {line}"
    
    def generate_kavita_theme(self, nakshatra: dict) -> str:
        """Generate a poetic theme description"""
        kavita = nakshatra.get('kavita', {})
        theme = kavita.get('theme', 'Unknown')
        rasa = kavita.get('rasa', 'Unknown')
        imagery_list = kavita.get('imagery', ['nature'])
        imagery = random.choice(imagery_list)
        
        return f"🎭 Kavita (Rasa: {rasa}): {theme}. Imagery: {imagery}"
    
    def select_raga(self, nakshatra: dict) -> str:
        """Select the primary raga"""
        raga = nakshatra.get('raga', {})
        primary = raga.get('primary', 'Unknown')
        time = raga.get('time', 'any')
        mood = raga.get('mood', 'peaceful')
        return f"🎵 Raga: {primary} (Time: {time}, Mood: {mood})"
    
    def suggest_lyrics(self, nakshatra: dict) -> str:
        """Generate lyric suggestions"""
        lyrics = nakshatra.get('lyrics', {})
        seed_words = lyrics.get('seed_words', ['om'])
        bija = lyrics.get('bija_phoneme', 'OM')
        phoneme_class = lyrics.get('phoneme_class', 'sacred')
        seed_word = random.choice(seed_words)
        
        if 'example_line' in lyrics:
            example = lyrics['example_line']
            return f"📖 Lyrics: Bīja '{bija}' ({phoneme_class}) - Example: '{example}'"
        else:
            return f"📖 Lyrics: Bīja '{bija}' ({phoneme_class}) - Seed word: {seed_word}"
    
    def generate_full_composition(self, hash_val: int, include_all: bool = True) -> Dict:
        """Generate a complete creative composition from hash"""
        nakshatra = self.get_by_hash(hash_val)
        
        result = {
            "hash": hash_val,
            "nakshatra": nakshatra['name'],
            "index": nakshatra['index'],
        }
        
        if include_all:
            result["chand"] = self.get_chand(nakshatra)
            result["kavita"] = self.get_kavita(nakshatra)
            result["raga"] = self.get_raga(nakshatra)
            result["lyrics"] = self.get_lyrics(nakshatra)
        else:
            result["chand_summary"] = self.generate_chand_line(nakshatra)
            result["kavita_summary"] = self.generate_kavita_theme(nakshatra)
            result["raga_summary"] = self.select_raga(nakshatra)
            result["lyrics_summary"] = self.suggest_lyrics(nakshatra)
        
        return result
    
    def to_json_string(self, hash_val: int, pretty: bool = True) -> str:
        """Export composition as JSON string"""
        data = self.generate_full_composition(hash_val)
        if pretty:
            return json.dumps(data, indent=2, ensure_ascii=False)
        return json.dumps(data, ensure_ascii=False)


# Singleton instance
_creative_db = None

def get_creative_db() -> NakshatraCreative:
    global _creative_db
    if _creative_db is None:
        _creative_db = NakshatraCreative()
    return _creative_db


# Quick test
if __name__ == "__main__":
    db = get_creative_db()
    
    print("=" * 60)
    print("NAKSHATRA CREATIVE ENGINE TEST")
    print("=" * 60)
    
    test_hash = 2693315
    n = db.get_by_hash(test_hash)
    print(f"\n📀 Hash: {test_hash} → Nakshatra: {n['name']}")
    print(f"\n{db.generate_chand_line(n)}")
    print(f"{db.generate_kavita_theme(n)}")
    print(f"{db.select_raga(n)}")
    print(f"{db.suggest_lyrics(n)}")
