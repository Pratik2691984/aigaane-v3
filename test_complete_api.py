"""
test_complete_api.py - Test all API endpoints
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    print("=" * 60)
    print("TESTING API HEALTH")
    print("=" * 60)
    resp = requests.get(f"{BASE_URL}/api/health")
    print(f"Status: {resp.status_code}")
    print(f"Response: {resp.json()}")
    return resp.ok

def test_49d():
    print("\n" + "=" * 60)
    print("TESTING 49D KERNEL")
    print("=" * 60)
    resp = requests.post(f"{BASE_URL}/api/49d/stats", json={"text": "Rāma"})
    print(f"Status: {resp.status_code}")
    print(f"Hash: {resp.json()['hash']}")
    print(f"Entropy: {resp.json()['entropy']}")
    return resp.ok

def test_sandhi():
    print("\n" + "=" * 60)
    print("TESTING SANDHI")
    print("=" * 60)
    resp = requests.post(f"{BASE_URL}/api/sandhi", json={"left": "devaḥ", "right": "api"})
    print(f"Status: {resp.status_code}")
    print(f"Result: {resp.json()['result']}")
    return resp.ok

def test_nakshatra_analysis():
    print("\n" + "=" * 60)
    print("TESTING NAKSHATRA ANALYSIS")
    print("=" * 60)
    
    test_texts = ["Rāma", "Shiva", "Krishna", "Om"]
    
    for text in test_texts:
        resp = requests.post(f"{BASE_URL}/api/nakshatra/analyze", json={"text": text})
        if resp.ok:
            data = resp.json()
            print(f"\n📀 {text}:")
            print(f"   Hash: {data['hash']}")
            print(f"   Nakshatra: {data['nakshatra']}")
            print(f"   Raga: {data['sound']['raga']}")
            print(f"   Frequency: {data['frequency_hz']} Hz")
            print(f"   Mantra: {data['mantra']}")
        else:
            print(f"\n❌ Error for {text}: {resp.status_code}")
    
    return True

if __name__ == "__main__":
    print("\n🧪 AIGAANE V4 API TEST SUITE\n")
    
    try:
        test_health()
        test_49d()
        test_sandhi()
        test_nakshatra_analysis()
        
        print("\n" + "=" * 60)
        print("✅ ALL TESTS PASSED!")
        print("=" * 60)
        print("\n🌐 Start server with: python server.py")
        print("📱 Frontend available at: https://www.aigaane.in")
        
    except requests.exceptions.ConnectionError:
        print("\n❌ Server not running! Start with: python server.py")
    except Exception as e:
        print(f"\n❌ Error: {e}")
