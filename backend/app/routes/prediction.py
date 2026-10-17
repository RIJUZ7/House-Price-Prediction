"""
NEXUS ESTATE - Prediction Router
Handles real-time machine learning inference requests and property presets.
"""

from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, status
from backend.app.schemas import PredictionRequest, PredictionResponse
from backend.app.services.model_service import model_service

router = APIRouter(prefix="/api", tags=["Prediction"])

PROPERTY_PRESETS: List[Dict[str, Any]] = [
    {
        "id": "silicon-valley",
        "name": "Silicon Valley / Palo Alto",
        "description": "High-income tech corridor with prime coastal proximity",
        "tag": "Luxury Tech Hub",
        "values": {
            "MedInc": 11.5,
            "HouseAge": 25.0,
            "AveRooms": 7.4,
            "AveBedrms": 1.1,
            "Population": 980.0,
            "AveOccup": 2.4,
            "Latitude": 37.44,
            "Longitude": -122.16
        }
    },
    {
        "id": "sf-urban",
        "name": "San Francisco Urban Core",
        "description": "Dense historic neighborhood with high economic concentration",
        "tag": "Metro Historic",
        "values": {
            "MedInc": 6.8,
            "HouseAge": 48.0,
            "AveRooms": 5.2,
            "AveBedrms": 1.05,
            "Population": 1650.0,
            "AveOccup": 2.3,
            "Latitude": 37.77,
            "Longitude": -122.42
        }
    },
    {
        "id": "la-coastal",
        "name": "Los Angeles Westside",
        "description": "Established coastal district with high demand",
        "tag": "Coastal Suburban",
        "values": {
            "MedInc": 5.6,
            "HouseAge": 32.0,
            "AveRooms": 5.9,
            "AveBedrms": 1.15,
            "Population": 1820.0,
            "AveOccup": 3.0,
            "Latitude": 34.02,
            "Longitude": -118.49
        }
    },
    {
        "id": "central-valley",
        "name": "Central Valley Starter Home",
        "description": "Inland family residential district with accessible affordability",
        "tag": "Affordable Heartland",
        "values": {
            "MedInc": 2.9,
            "HouseAge": 16.0,
            "AveRooms": 5.1,
            "AveBedrms": 1.06,
            "Population": 1540.0,
            "AveOccup": 3.4,
            "Latitude": 36.75,
            "Longitude": -119.77
        }
    }
]


@router.post("/predict", response_model=PredictionResponse)
def predict_property_value(payload: PredictionRequest):
    """
    Validates input block group features and generates price prediction
    using the serialized machine learning pipeline.
    """
    try:
        response = model_service.predict(payload)
        return response
    except RuntimeError as rerr:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(rerr)
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Inference execution failed: {str(exc)}"
        )


@router.get("/presets")
def get_property_presets():
    """
    Returns curated regional California property archetypes for quick exploration.
    """
    return PROPERTY_PRESETS
