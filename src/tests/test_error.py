from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)


class TestErrorHealth:
    def test_error_status_code(self):
        response = client.get("/api/v1/error")
        assert response.status_code == 200
        assert response.json() == {"error": "Boom!"}
