import requests
import json

BASE_URL = "http://localhost:8000"

def login(username, password):
    response = requests.post(f"{BASE_URL}/auth/token", data={"username": username, "password": password})
    if response.status_code == 200:
        return response.json()["access_token"]
    else:
        print(f"Login failed: {response.text}")
        return None

def create_task(token):
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "task_type": "Data Entry",
        "company_name": "Test Company",
        "document_type": "Invoice",
        "priority": "Medium",
        "target_qty": 10
    }
    response = requests.post(f"{BASE_URL}/tasks/", json=data, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Create task failed: {response.text}")
        return None

def complete_task(token, task_id):
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "achieved_qty": 10,
        "remarks": "Done"
    }
    response = requests.post(f"{BASE_URL}/tasks/{task_id}/complete", json=data, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Complete task failed: {response.text}")
        return None

def review_task(token, task_id):
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "rating": 1,
        "error_status": "Internal Error",
        "remarks": "do not repeat that mistake"
    }
    print(f"Sending review data: {data}")
    response = requests.put(f"{BASE_URL}/tasks/{task_id}/review", json=data, headers=headers)
    print(f"Review response status: {response.status_code}")
    print(f"Review response body: {response.text}")

def main():
    token = login("test_admin", "password123")
    if not token:
        return

    print("Logged in as test_admin")
    
    # Create a task
    task = create_task(token)
    if not task:
        return
    print(f"Created task {task['task_id']}")
    
    # Complete it
    completed_task = complete_task(token, task['task_id'])
    if not completed_task:
        return
    print(f"Completed task {task['task_id']}")
    
    # Review it
    review_task(token, task['task_id'])

if __name__ == "__main__":
    main()
