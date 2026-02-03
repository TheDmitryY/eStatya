from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

class TestHealth:
    def test_health_endpoint(self):
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        assert response.json() == {"health": "good"}

    def test_root_endpoint(self):
        response = client.get("/api/v1/")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}