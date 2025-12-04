import requests
import sys

BASE_URL = "http://localhost:8000"
USERNAME = "parth"
PASSWORD = "password123"

def debug_dashboard():
    # 1. Login
    print(f"Logging in as {USERNAME}...")
    resp = requests.post(f"{BASE_URL}/auth/token", data={"username": USERNAME, "password": PASSWORD})
    if resp.status_code != 200:
        print(f"Login failed: {resp.text}")
        sys.exit(1)
    
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Get Stats
    print("Fetching /dashboard/stats...")
    resp = requests.get(f"{BASE_URL}/dashboard/stats", headers=headers)
    
    if resp.status_code != 200:
        print(f"Failed to get stats: {resp.status_code} - {resp.text}")
        sys.exit(1)
        
    data = resp.json()
    print("\nResponse Data:")
    import json
    print(json.dumps(data, indent=2))
    
    # 3. Validation
    if "my_stats" not in data:
        print("\nERROR: 'my_stats' key is missing!")
    elif data["my_stats"] is None:
         print("\nERROR: 'my_stats' is None!")
    else:
        print("\n'my_stats' is present.")
        if "tasks_assigned_today" not in data["my_stats"]:
            print("ERROR: 'tasks_assigned_today' missing in my_stats")

if __name__ == "__main__":
    debug_dashboard()
