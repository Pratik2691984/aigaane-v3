# test_sound_db.py
from nakshatra_sound import get_sound_db

db = get_sound_db()

print("=" * 50)
print("NAKSHATRA SOUND DATABASE TEST")
print("=" * 50)

test_names = ["Rohini", "Uttara Phalguni", "Mula", "Ashwini", "Bharani"]

for name in test_names:
    n = db.get_by_name(name)
    if n:
        print(f"\n📀 {name}:")
        print(f"   Svara: {n['svara']}")
        print(f"   Raga: {n['raga']}")
        print(f"   Chand: {n['chand']}")
        print(f"   Bija: {n['bija']}")
        print(f"   Seed: {n['seed']}")
        print(f"   Mantra: {db.generate_mantra_phrase(n)}")
        print(f"   Frequency: {db.get_svara_frequency(n['svara']):.1f} Hz")

print("\n" + "=" * 50)
print("✅ All tests complete!")
print("=" * 50)
