import os
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL") or "https://digital-motion-7.preview.emergentagent.com"


def test_api_root_and_enquiry_persistence():
    root = requests.get(f"{BASE_URL}/api/", timeout=15)
    assert root.status_code == 200
    assert root.json()["message"] == "The Squirrel Agency API"

    payload = {
        "name": "TEST_Regression",
        "email": "test.regression@example.com",
        "phone": "+919999999999",
        "company": "TEST_Agency",
        "service": "SEO",
        "budget": "₹1L — ₹3L",
        "message": "Testing enquiry persistence and response serialization.",
    }
    created = requests.post(f"{BASE_URL}/api/enquiries", json=payload, timeout=15)
    assert created.status_code == 200
    data = created.json()
    assert data["name"] == payload["name"]
    assert isinstance(data["id"], str)
    assert "_id" not in data

    listing = requests.get(f"{BASE_URL}/api/enquiries", timeout=15)
    assert listing.status_code == 200
    assert any(row["id"] == data["id"] for row in listing.json())


def test_enquiry_validation():
    response = requests.post(f"{BASE_URL}/api/enquiries", json={"name": "x"}, timeout=15)
    assert response.status_code == 422