import requests
import json

url = "http://127.0.0.1:8000/api/token/"
data = {
    "username": "admin",
    "password": "aryan123"
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        tokens = response.json()
        print("✅ Success!")
        print(f"Access Token: {tokens['access']}")
        print(f"Refresh Token: {tokens['refresh']}...")
    else:
        print(f"Error: {response.text}")
except Exception as e:
    print(f"Connection error: {e}")