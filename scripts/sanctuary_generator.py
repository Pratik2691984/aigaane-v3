"""
sanctuary_generator.py - AIGAANE V3 Sanctuary Data Pipeline
Generates 1,000+ JSON-LD compliant entries with Rasa, Nakshatra, and Frequency mapping
"""

import json
import random
import math
from datetime import datetime
from typing import List, Dict, Any
from enum import Enum

# ============================================================
# ENUMS & CONSTANTS
# ============================================================

class Rasa(Enum):
    SHRINGARA = "Shringara"  # Love, beauty
    HASYA = "Hasya"          # Laughter, joy
    KARUNA = "Karuna"        # Compassion, sorrow
    RAUDRA = "Raudra"        # Anger, fury
    VIRA = "Vira"            # Heroism, courage
    BHAYANAKA = "Bhayanaka"  # Fear, terror
    BIBHATSA = "Bibhatsa"    # Disgust, aversion
    ADBHUTA = "Adbhuta"      # Wonder, amazement
    SHANTA = "Shanta"        # Peace, tranquility

class Guna(Enum):
    SATTVA = "Sattva"   # Harmony, balance
    RAJAS = "Rajas"     # Activity, passion
    TAMAS = "Tamas"     # Inertia, darkness

# 27 Nakshatras with their attributes
NAKSHATRAS = [
    {"name": "Ashwini", "start_deg": 0, "end_deg": 13.2, "planet": "Ketu", "goddess": "Ashwini Kumaras"},
    {"name": "Bharani", "start_deg": 13.2, "end_deg": 26.4, "planet": "Venus", "goddess": "Yama"},
    {"name": "Krittika", "start_deg": 26.4, "end_deg": 40, "planet": "Sun", "goddess": "Agni"},
    {"name": "Rohini", "start_deg": 40, "end_deg": 53.2, "planet": "Moon", "goddess": "Prajapati"},
    {"name": "Mrigashira", "start_deg": 53.2, "end_deg": 66.4, "planet": "Mars", "goddess": "Soma"},
    {"name": "Ardra", "start_deg": 66.4, "end_deg": 80, "planet": "Rahu", "goddess": "Rudra"},
    {"name": "Punarvasu", "start_deg": 80, "end_deg": 93.2, "planet": "Jupiter", "goddess": "Aditi"},
    {"name": "Pushya", "start_deg": 93.2, "end_deg": 106.4, "planet": "Saturn", "goddess": "Brihaspati"},
    {"name": "Ashlesha", "start_deg": 106.4, "end_deg": 120, "planet": "Mercury", "goddess": "Sarpas"},
    {"name": "Magha", "start_deg": 120, "end_deg": 133.2, "planet": "Ketu", "goddess": "Pitrs"},
    {"name": "Purva Phalguni", "start_deg": 133.2, "end_deg": 146.4, "planet": "Venus", "goddess": "Bhaga"},
    {"name": "Uttara Phalguni", "start_deg": 146.4, "end_deg": 160, "planet": "Sun", "goddess": "Aryaman"},
    {"name": "Hasta", "start_deg": 160, "end_deg": 173.2, "planet": "Moon", "goddess": "Savitr"},
    {"name": "Chitra", "start_deg": 173.2, "end_deg": 186.4, "planet": "Mars", "goddess": "Vishwakarma"},
    {"name": "Swati", "start_deg": 186.4, "end_deg": 200, "planet": "Rahu", "goddess": "Vayu"},
    {"name": "Vishakha", "start_deg": 200, "end_deg": 213.2, "planet": "Jupiter", "goddess": "Indra-Agni"},
    {"name": "Anuradha", "start_deg": 213.2, "end_deg": 226.4, "planet": "Saturn", "goddess": "Mitra"},
    {"name": "Jyeshtha", "start_deg": 226.4, "end_deg": 240, "planet": "Mercury", "goddess": "Indra"},
    {"name": "Mula", "start_deg": 240, "end_deg": 253.2, "planet": "Ketu", "goddess": "Nirriti"},
    {"name": "Purva Ashadha", "start_deg": 253.2, "end_deg": 266.4, "planet": "Venus", "goddess": "Apas"},
    {"name": "Uttara Ashadha", "start_deg": 266.4, "end_deg": 280, "planet": "Sun", "goddess": "Vishvedevas"},
    {"name": "Shravana", "start_deg": 280, "end_deg": 293.2, "planet": "Moon", "goddess": "Vishnu"},
    {"name": "Dhanishtha", "start_deg": 293.2, "end_deg": 306.4, "planet": "Mars", "goddess": "Vasus"},
    {"name": "Shatabhisha", "start_deg": 306.4, "end_deg": 320, "planet": "Rahu", "goddess": "Varuna"},
    {"name": "Purva Bhadrapada", "start_deg": 320, "end_deg": 333.2, "planet": "Jupiter", "goddess": "Aja Ekapada"},
    {"name": "Uttara Bhadrapada", "start_deg": 333.2, "end_deg": 346.4, "planet": "Saturn", "goddess": "Ahirbudhnya"},
    {"name": "Revati", "start_deg": 346.4, "end_deg": 360, "planet": "Mercury", "goddess": "Pushan"}
]

# Seed vocabulary for generating terms
TERM_PREFIXES = ["Brahma", "Atma", "Para", "Adi", "Maha", "Sva", "Veda", "Prana", "Chit", "Ananda"]
TERM_SUFFIXES = ["nanda", "kara", "maya", "pada", "tva", "sara", "rupa", "gata", "sthiti", "laya"]
CONSONANTS = ["k", "g", "ch", "j", "t", "d", "p", "b", "m", "y", "r", "l", "v", "sh", "s", "h"]
VOWELS = ["a", "i", "u", "e", "o", "ā", "ī", "ū"]

# Healing focuses
HEALING_FOCUS = [
    "Ārogya (healing)", "Śodhana (purification)", "Pauṣṭi (nourishment)",
    "Maitrī (friendship)", "Śakti (power)", "Vijaya (victory)",
    "Nāyakatva (leadership)", "Kauśala (creativity)", "Śilpa (art)",
    "Svātantrya (freedom)", "Parivartana (transformation)", "Dhana (wealth)",
    "Mūla śodhana (root)", "Śuddhi (purification)", "Śravaṇa (learning)",
    "Paitṛka (ancestral)", "Vaivāhika (marriage)", "Kuṇḍalinī (healing)",
    "Saṃvedana (intuition)", "Saṃkṣobha (transformation)", "Navīkaraṇa (renewal)"
]

# Rāgas
RAGAS = ["Bhairav", "Todi", "Rageshri", "Khamaj", "Bageshree", "Malkauns", 
         "Yaman", "Darbari", "Bhimpalasi", "Bhoop", "Shankara", "Brindavani Sarang",
         "Hamsadhwani", "Desh", "Marwa", "Puriya Dhanashree", "Ahir Bhairav", "Kafi"]


class SanctuaryGenerator:
    """Generates JSON-LD compliant sanctuary entries"""
    
    def __init__(self):
        self.entries = []
        self.counter = 1
    
    def generate_term(self) -> str:
        """Generate a Sanskrit-like term"""
        prefix = random.choice(TERM_PREFIXES)
        suffix = random.choice(TERM_SUFFIXES)
        return prefix + suffix
    
    def generate_meaning(self, rasa: Rasa, guna: Guna) -> str:
        """Generate meaning based on Rasa and Guna"""
        rasa_meanings = {
            Rasa.SHANTA: "peace, tranquility, stillness",
            Rasa.VIRA: "heroism, courage, valor",
            Rasa.SHRINGARA: "love, beauty, devotion",
            Rasa.KARUNA: "compassion, mercy, empathy",
            Rasa.ADBHUTA: "wonder, amazement, curiosity",
            Rasa.RAUDRA: "fury, anger, intensity",
            Rasa.HASYA: "laughter, joy, mirth",
            Rasa.BHAYANAKA: "fear, terror, awe",
            Rasa.BIBHATSA: "aversion, disgust, repulsion"
        }
        
        guna_meanings = {
            Guna.SATTVA: "pure, harmonious, balanced",
            Guna.RAJAS: "active, passionate, dynamic",
            Guna.TAMAS: "stable, inert, grounded"
        }
        
        return f"{rasa_meanings[rasa]} · {guna_meanings[guna]} · sacred vibration"
    
    def generate_frequency(self, nakshatra_idx: int) -> float:
        """Generate frequency based on Nakshatra"""
        base_freq = 108 + (nakshatra_idx * 2)
        variation = random.uniform(-0.5, 0.5)
        return round(base_freq + variation, 1)
    
    def generate_mantra_seed(self, term: str) -> str:
        """Generate a mantra seed from the term"""
        seed = term.lower().replace(" ", "")
        if seed.endswith(("a", "ā")):
            return f"Oṁ {seed}ya namaḥ"
        elif seed.endswith(("i", "ī")):
            return f"Oṁ {seed}ye namaḥ"
        else:
            return f"Oṁ {seed}ve namaḥ"
    
    def create_entry(self, nakshatra: Dict, rasa: Rasa, guna: Guna) -> Dict:
        """Create a single sanctuary entry"""
        term = self.generate_term()
        entry_id = f"SAN-{self.counter:04d}"
        
        return {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            "entry_id": entry_id,
            "term": term,
            "iast": term.lower(),
            "category": rasa.value,
            "frequency_target": self.generate_frequency(nakshatra["index"]),
            "nakshatra_alignment": [nakshatra["name"]],
            "nakshatra_planet": nakshatra["planet"],
            "nakshatra_goddess": nakshatra["goddess"],
            "guna": guna.value,
            "healing_focus": random.choice(HEALING_FOCUS),
            "suggested_raga": random.choice(RAGAS),
            "mantra_seed": self.generate_mantra_seed(term),
            "meaning": self.generate_meaning(rasa, guna),
            "resonance_quality": f"{random.choice(['High', 'Medium', 'Deep'])} Frequency",
            "timestamp": datetime.now().isoformat()
        }
    
    def generate_batch(self, total_entries: int = 1000) -> List[Dict]:
        """Generate a batch of sanctuary entries"""
        self.entries = []
        
        for i in range(total_entries):
            nakshatra_idx = i % 27
            nakshatra = NAKSHATRAS[nakshatra_idx].copy()
            nakshatra["index"] = nakshatra_idx
            
            rasa = list(Rasa)[i % len(Rasa)]
            guna = list(Guna)[i % len(Guna)]
            
            entry = self.create_entry(nakshatra, rasa, guna)
            self.entries.append(entry)
            self.counter += 1
            
            if (i + 1) % 100 == 0:
                print(f"Generated {i + 1} entries...")
        
        return self.entries
    
    def save_to_json(self, filename: str = "data/sanctuary/sanctuary_entries.json"):
        """Save entries to JSON file"""
        import os
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        with open(filename, "w", encoding="utf-8") as f:
            json.dump({
                "version": "3.0",
                "total_entries": len(self.entries),
                "generated_at": datetime.now().isoformat(),
                "entries": self.entries
            }, f, indent=2, ensure_ascii=False)
        print(f"✅ Saved {len(self.entries)} entries to {filename}")
    
    def save_to_csv(self, filename: str = "data/sanctuary/sanctuary_entries.csv"):
        """Save entries to CSV for spreadsheet analysis"""
        import csv
        import os
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        with open(filename, "w", newline="", encoding="utf-8") as f:
            if self.entries:
                writer = csv.DictWriter(f, fieldnames=self.entries[0].keys())
                writer.writeheader()
                writer.writerows(self.entries)
        print(f"✅ Saved {len(self.entries)} entries to {filename}")
    
    def generate_stats(self):
        """Generate statistics about the sanctuary"""
        stats = {
            "total_entries": len(self.entries),
            "by_category": {},
            "by_guna": {},
            "by_nakshatra": {},
            "frequency_range": {"min": 999, "max": 0}
        }
        
        for entry in self.entries:
            cat = entry["category"]
            stats["by_category"][cat] = stats["by_category"].get(cat, 0) + 1
            
            guna = entry["guna"]
            stats["by_guna"][guna] = stats["by_guna"].get(guna, 0) + 1
            
            for n in entry["nakshatra_alignment"]:
                stats["by_nakshatra"][n] = stats["by_nakshatra"].get(n, 0) + 1
            
            freq = entry["frequency_target"]
            if freq < stats["frequency_range"]["min"]:
                stats["frequency_range"]["min"] = freq
            if freq > stats["frequency_range"]["max"]:
                stats["frequency_range"]["max"] = freq
        
        return stats


def main():
    print("=" * 60)
    print("🕉️ AIGAANE V3 - SANCTUARY DATA GENERATOR")
    print("=" * 60)
    
    generator = SanctuaryGenerator()
    
    print("\n📊 Generating 1000+ sanctuary entries...")
    entries = generator.generate_batch(1050)
    
    print("\n💾 Saving data...")
    generator.save_to_json()
    generator.save_to_csv()
    
    print("\n📈 STATISTICS:")
    stats = generator.generate_stats()
    print(f"   Total Entries: {stats['total_entries']}")
    print(f"   Categories: {len(stats['by_category'])}")
    print(f"   Frequency Range: {stats['frequency_range']['min']} - {stats['frequency_range']['max']} Hz")
    
    print("\n   By Guna:")
    for guna, count in stats["by_guna"].items():
        print(f"      {guna}: {count}")
    
    print("\n   By Category (Top 5):")
    sorted_cats = sorted(stats["by_category"].items(), key=lambda x: x[1], reverse=True)[:5]
    for cat, count in sorted_cats:
        print(f"      {cat}: {count}")
    
    print("\n✅ Sanctuary data generation complete!")
    print("📁 Files created:")
    print("   - data/sanctuary/sanctuary_entries.json")
    print("   - data/sanctuary/sanctuary_entries.csv")


if __name__ == "__main__":
    main()
