"""
integrate_nakshatra.py - Complete integration of Sound + Creative modules
Connects 49D kernel to music and poetry generation
"""

from nakshatra_sound import get_sound_db
from nakshatra_creative import get_creative_db

def get_hash_from_text(text: str) -> int:
    """Generate 49D-style hash from any text (mirrors your kernel)"""
    h = 0
    for char in text:
        h = ((h << 5) - h) + ord(char)
        h = h & 0xffffffff  # Keep it 32-bit
    return abs(h)

def analyze_nakshatra_by_hash(hash_val: int, text: str = None):
    """Full analysis of a hash value across sound and creative modules"""
    
    sound_db = get_sound_db()
    creative_db = get_creative_db()
    
    # Get data by hash
    sound = sound_db.get_by_hash(hash_val)
    creative = creative_db.get_by_hash(hash_val)
    
    print("=" * 70)
    print(f"🔍 ANALYSIS FOR: {text if text else 'Hash: ' + str(hash_val)}")
    print("=" * 70)
    
    # Basic info
    print(f"\n📀 NAKSHATRA: {creative['name']} (Index: {creative['index']})")
    print(f"   Hash: {hash_val}")
    
    # Sound/Music Layer
    print(f"\n🎵 SOUND & MUSIC:")
    print(f"   Svara (Note): {sound['svara']}")
    print(f"   Frequency: {sound_db.get_svara_frequency(sound['svara']):.1f} Hz")
    print(f"   Primary Raga: {creative['raga']['primary']}")
    print(f"   Raga Time: {creative['raga']['time']}")
    print(f"   Raga Mood: {creative['raga']['mood']}")
    print(f"   Raga Vadi Swara: {creative['raga']['vadi_swara']}")
    
    # Poetry/Meter Layer
    print(f"\n📜 CHAND (METER):")
    print(f"   Meter: {creative['chand']['meter']}")
    print(f"   Syllable Pattern: {creative['chand']['syllable_pattern']}")
    print(f"   Total Syllables: {creative['chand']['total_syllables']}")
    print(f"   Style: {creative['chand']['style']}")
        
    # Kavita (Poetic Content)
    print(f"\n🎭 KAVITA (POETRY):")
    print(f"   Rasa (Emotion): {creative['kavita']['rasa']}")
    print(f"   Theme: {creative['kavita']['theme']}")
    print(f"   Imagery: {', '.join(creative['kavita']['imagery'][:3])}")
    print(f"   Tone: {creative['kavita']['tone']}")
    
    # Lyrics/Phoneme Layer
    print(f"\n📖 LYRICS & PHONEMES:")
    print(f"   Bīja Phoneme: {creative['lyrics']['bija_phoneme']}")
    print(f"   Pada Sound: {creative['lyrics']['pada_sound']}")
    print(f"   Phoneme Class: {creative['lyrics']['phoneme_class']}")
    print(f"   Seed Words: {', '.join(creative['lyrics']['seed_words'][:4])}")
    if 'example_line' in creative['lyrics']:
        print(f"   Example Line: \"{creative['lyrics']['example_line']}\"")
    
    # Generate mantra
    mantra = sound_db.generate_mantra_phrase(sound)
    print(f"\n🕉️ SUGGESTED MANTRA: {mantra}")
    
    return {
        "hash": hash_val,
        "nakshatra": creative['name'],
        "sound": sound,
        "creative": creative
    }

def compare_inputs(inputs: list):
    """Compare multiple text inputs"""
    print("\n" + "=" * 70)
    print("📊 COMPARISON TABLE")
    print("=" * 70)
    print(f"{'Input':<15} {'Hash':<12} {'Nakshatra':<18} {'Raga':<12} {'Rasa':<15}")
    print("-" * 70)
    
    for text in inputs:
        h = get_hash_from_text(text)
        creative_db = get_creative_db()
        n = creative_db.get_by_hash(h)
        print(f"{text:<15} {h:<12} {n['name']:<18} {n['raga']['primary']:<12} {n['kavita']['rasa']:<15}")
    
    print("=" * 70)

# ========== MAIN DEMO ==========
if __name__ == "__main__":
    # Test with known hash from live site
    print("\n" + "🧪 TESTING WITH LIVE SITE HASH (2693315 - Rāma)")
    analyze_nakshatra_by_hash(2693315, "Rāma")
    
    # Test with new inputs
    print("\n" + "🧪 TESTING WITH 'Shiva'")
    shiva_hash = get_hash_from_text("Shiva")
    analyze_nakshatra_by_hash(shiva_hash, "Shiva")
    
    # Compare multiple inputs
    compare_inputs(["Rāma", "Shiva", "Krishna", "Om", "Gāyatrī"])
    
    print("\n" + "=" * 70)
    print("✅ Integration complete! Your 49D kernel now drives music + poetry.")
    print("=" * 70)
