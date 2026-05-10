# test_sound_lattice.py
# Tests smooth frequency transitions between different inputs

from nakshatra_sound import get_sound_db
import time

db = get_sound_db()

test_inputs = [
    ("Pratik", 2693315),
    ("Shiva", 79855167),
    ("Rama", 2693315),
    ("Krishna", None)  # Will compute hash
]

def get_frequency_from_hash(hash_val):
    idx = hash_val % 27
    nakshatra = db.get_by_index(idx + 1)
    if nakshatra:
        return db.get_svara_frequency(nakshatra["svara"])
    return 261.63

print("=" * 60)
print("SOUND LATTICE - FREQUENCY TRANSITION TEST")
print("=" * 60)

prev_freq = None
for name, hash_val in test_inputs:
    if hash_val is None:
        # Simple hash for Krishna
        h = 0
        for c in name:
            h = ((h << 5) - h) + ord(c)
        hash_val = abs(h)
    
    freq = get_frequency_from_hash(hash_val)
    nakshatra_idx = hash_val % 27
    nakshatra = db.get_by_index(nakshatra_idx + 1)
    
    print(f"\n📀 Input: {name}")
    print(f"   Hash: {hash_val}")
    print(f"   Nakshatra: {nakshatra['name'] if nakshatra else 'Unknown'}")
    print(f"   Frequency: {freq:.1f} Hz")
    print(f"   Svara: {nakshatra['svara'] if nakshatra else 'Sa'}")
    
    if prev_freq:
        diff = abs(freq - prev_freq)
        print(f"   Δ from previous: {diff:.1f} Hz")
        if diff > 50:
            print(f"   ⚠️ Large jump - may cause audio pop")
        else:
            print(f"   ✅ Smooth transition possible")
    
    prev_freq = freq

print("\n" + "=" * 60)
print("✅ To prevent audio pops, use fade-in/fade-out in Web Audio API")
print("=" * 60)
