"""
Integration Tests for FastAPI Endpoints using HTTPX TestClient
"""

import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_root_endpoint():
    """Verify root index status."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "operational"
    assert "NEXUS ESTATE" in data["app"]


def test_health_endpoint():
    """Verify health endpoint reports model status."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert "model_loaded" in data
    assert data["model_loaded"] is True
    assert "model_name" in data


def test_metadata_endpoint():
    """Verify metadata returns dataset info and features catalog."""
    response = client.get("/api/metadata")
    assert response.status_code == 200
    data = response.json()
    assert "features" in data
    assert "MedInc" in data["features"]
    assert "test_performance" in data
    assert data["target_multiplier"] == 100000.0


def test_metrics_endpoint():
    """Verify metrics endpoint returns performance metrics."""
    response = client.get("/api/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "test_performance" in data
    assert "r2" in data["test_performance"]
    assert data["test_performance"]["r2"] > 0.7


def test_analytics_endpoint():
    """Verify analytics telemetry returns distribution bins and correlations."""
    response = client.get("/api/analytics")
    assert response.status_code == 200
    data = response.json()
    assert "price_distribution" in data
    assert len(data["price_distribution"]) > 0
    assert "model_comparisons" in data
    assert "sample_comparisons" in data


def test_presets_endpoint():
    """Verify regional property presets."""
    response = client.get("/api/presets")
    assert response.status_code == 200
    presets = response.json()
    assert isinstance(presets, list)
    assert len(presets) >= 4
    assert any(p["id"] == "silicon-valley" for p in presets)


def test_predict_endpoint_valid_payload():
    """Verify prediction with standard California property features."""
    payload = {
        "MedInc": 5.2,
        "HouseAge": 25.0,
        "AveRooms": 6.1,
        "AveBedrms": 1.1,
        "Population": 1400.0,
        "AveOccup": 2.9,
        "Latitude": 37.44,
        "Longitude": -122.16
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert res["status"] == "success"
    assert res["predicted_value_usd"] > 50000.0
    assert "$" in res["predicted_value_formatted"]
    assert "confidence_interval" in res
    assert res["confidence_interval"]["lower_bound_usd"] < res["predicted_value_usd"]
    assert res["confidence_interval"]["upper_bound_usd"] > res["predicted_value_usd"]


def test_predict_endpoint_rejects_invalid_values():
    """Verify input bounds rejection (e.g. invalid latitude)."""
    payload = {
        "MedInc": -2.0,  # Invalid: negative income
        "HouseAge": 25.0,
        "AveRooms": 6.1,
        "AveBedrms": 1.1,
        "Population": 1400.0,
        "AveOccup": 2.9,
        "Latitude": 95.0,  # Invalid: out of bounds
        "Longitude": -122.16
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 422  # Unprocessable Entity (Pydantic validation failure)


def test_predict_endpoint_rejects_more_bedrooms_than_rooms():
    """Verify custom validator catches AveBedrms > AveRooms."""
    payload = {
        "MedInc": 4.0,
        "HouseAge": 20.0,
        "AveRooms": 2.0,
        "AveBedrms": 5.0,  # Invalid: more bedrooms than rooms
        "Population": 1000.0,
        "AveOccup": 3.0,
        "Latitude": 34.0,
        "Longitude": -118.0
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 422
