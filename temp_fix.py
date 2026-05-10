def test_anumana():
    print("=" * 50)
    print("6. TESTING ANUMANA LAYER (CROWN JEWEL)")
    print("=" * 50)
    resp = requests.post(f"{BASE_URL}/api/anu-layer/predict",
                        json={"current_hash": 2693315, "current_rasa": "Shanta", "intensity": 0.5, "steps": 3})
    if resp.ok:
        data = resp.json()
        print(f"Current Nakshatra: {data['current_nakshatra']}")
        print(f"Current Navatara: {data['current_navatara']}")
        print(f"→ Next Nakshatra: {data['next_nakshatra']}")
        print(f"→ Next Navatara: {data['next_navatara']}")
        print(f"Predicted Raga: {data['predicted_raga']}")
        print(f"Predicted Mood: {data['predicted_mood']}\n")
    else:
        print(f"Error: {resp.status_code}\n")
    return resp.ok
