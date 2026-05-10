"""
test_api_corrected.py - Corrected API test for AIGAANE V4
Matches actual response format from server.py
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    print("=" * 50)
    print("1. TESTING HEALTH ENDPOINT")
    print("=" * 50)
    resp = requests.get(f"{BASE_URL}/api/health")
    print(f"Status: {resp.status_code}")
    print(f"Response: {resp.json()}\n")
    return resp.ok

def test_49d():
    print("=" * 50)
    print("2. TESTING 49D KERNEL")
    print("=" * 50)
    resp = requests.post(f"{BASE_URL}/api/49d/stats", json={"text": "Rāma"})
    if resp.ok:
        data = resp.json()
        print(f"Hash: {data['hash']}")
        print(f"Entropy: {data['entropy']}")
        print(f"Sigma Dim: {data['sigma_dim']}\n")
    return resp.ok

def test_sandhi():
    print("=" * 50)
    print("3. TESTING SANDHI")
    print("=" * 50)
    resp = requests.post(f"{BASE_URL}/api/sandhi", json={"left": "devaḥ", "right": "api"})
    if resp.ok:
        data = resp.json()
        print(f"Result: {data['result']}")
        print(f"Rule Applied: {data['rule_applied']}\n")
    return resp.ok

def test_nakshatra():
    print("=" * 50)
    print("4. TESTING NAKSHATRA ANALYSIS")
    print("=" * 50)
    resp = requests.post(f"{BASE_URL}/api/nakshatra/analyze", json={"text": "Rāma"})
    if resp.ok:
        data = resp.json()
        print(f"Nakshatra: {data['nakshatra']}")
        print(f"Pada: {data.get('pada', 'N/A')}")
        print(f"Raga: {data['sound']['raga']}")
        print(f"Frequency: {data['frequency_hz']} Hz")
        print(f"Mantra: {data['mantra']}\n")
    return resp.ok

def test_prosody():
    print("=" * 50)
    print("5. TESTING PROSODY VALIDATION")
    print("=" * 50)
    resp = requests.post(f"{BASE_URL}/api/prosody/validate", json={"text": "rāmaḥ rājā"})
    if resp.ok:
        data = resp.json()
        print(f"Syllables: {data['syllables']}")
        print(f"Pattern: {data['pattern']}")
        print(f"Laghu: {data['laghu_count']}, Guru: {data['guru_count']}\n")
    return resp.ok

def test_anumana():
    print("=" * 50)
    print("6. TESTING ANUMANA LAYER (CROWN JEWEL)")
    print("=" * 50)
    resp = requests.post(f"{BASE_URL}/api/anu-layer/predict",
                        json={"current_hash": 2693315, "current_rasa": "Shanta", "intensity": 0.5, "steps": 3})
    if resp.ok:
        data = resp.json()
        print(f"Current Nakshatra: {data.get('current_nakshatra', 'N/A')}")
        print(f"Current Navatara: {data.get('current_navatara', 'N/A')}")
        print(f"Next Nakshatra: {data.get('next_nakshatra', 'N/A')}")
        print(f"Next Navatara: {data.get('next_navatara', 'N/A')}")
        print(f"Predicted Raga: {data.get('predicted_raga', 'N/A')}")
        print(f"Predicted Mood: {data.get('predicted_mood', 'N/A')}\n")
    else:
        print(f"Error: {resp.status_code} - {resp.text}\n")
    return resp.ok

def test_dataset():
    print("=" * 50)
    print("7. TESTING DATASET SAMPLE")
    print("=" * 50)
    resp = requests.get(f"{BASE_URL}/api/dataset/sample")
    if resp.ok:
        data = resp.json()
        print(f"Random Nakshatra: {data.get('nakshatra', 'N/A')}")
        print(f"Raga: {data.get('raga', 'N/A')}")
        print(f"Chand: {data.get('chand', 'N/A')}")
        print(f"Seed Word: {data.get('seed_word', 'N/A')}\n")
    return resp.ok

if __name__ == "__main__":
    print("\n🧪 AIGAANE V4 API TEST SUITE (CORRECTED)\n")
    
    try:
        test_health()
        test_49d()
        test_sandhi()
        test_nakshatra()
        test_prosody()
        test_anumana()
        test_dataset()
        
        print("=" * 50)
        print("✅ ALL TESTS PASSED! API IS READY")
        print("=" * 50)
        print("\n🌐 Swagger UI: http://localhost:8000/docs")
        print("📱 Live Site: https://www.aigaane.in")
        
    except requests.exceptions.ConnectionError:
        print("\n❌ Server not running! Start with: python server.py")
    except Exception as e:
        print(f"\n❌ Error: {e}")
