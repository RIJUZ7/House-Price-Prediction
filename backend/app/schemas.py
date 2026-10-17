"""
NEXUS ESTATE - Pydantic Request & Response Schemas
Provides comprehensive runtime validation, boundary checks, and structured responses.
"""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field, field_validator


class PredictionRequest(BaseModel):
    """
    Validated input parameters for property price prediction.
    Corresponds to California Census Block Group features.
    """
    MedInc: float = Field(
        default=3.87,
        ge=0.1,
        le=20.0,
        description="Median income in block group (in tens of thousands of USD). Example: 3.87 = $38,700/yr."
    )
    HouseAge: float = Field(
        default=28.0,
        ge=1.0,
        le=100.0,
        description="Median house age in the block group (years)."
    )
    AveRooms: float = Field(
        default=5.4,
        ge=0.5,
        le=40.0,
        description="Average number of rooms per household."
    )
    AveBedrms: float = Field(
        default=1.1,
        ge=0.2,
        le=20.0,
        description="Average number of bedrooms per household."
    )
    Population: float = Field(
        default=1425.0,
        ge=1.0,
        le=50000.0,
        description="Total residential population of the census block group."
    )
    AveOccup: float = Field(
        default=3.0,
        ge=0.2,
        le=30.0,
        description="Average number of household members in the block group."
    )
    Latitude: float = Field(
        default=35.6,
        ge=32.0,
        le=42.5,
        description="Geographic latitude coordinate (California range: 32.0 to 42.5° N)."
    )
    Longitude: float = Field(
        default=-119.5,
        ge=-124.5,
        le=-114.0,
        description="Geographic longitude coordinate (California range: -124.5 to -114.0° W)."
    )

    @field_validator("AveBedrms")
    @classmethod
    def validate_bedrooms(cls, v: float, info) -> float:
        # Check that average bedrooms is realistic compared to rooms if rooms provided
        data = info.data
        if "AveRooms" in data and v > data["AveRooms"]:
            raise ValueError("Average bedrooms cannot exceed average total rooms.")
        return v

    model_config = {
        "json_schema_extra": {
            "example": {
                "MedInc": 4.5,
                "HouseAge": 25.0,
                "AveRooms": 5.8,
                "AveBedrms": 1.1,
                "Population": 1200.0,
                "AveOccup": 2.8,
                "Latitude": 37.77,
                "Longitude": -122.42
            }
        }
    }


class ConfidenceInterval(BaseModel):
    lower_bound_usd: float
    upper_bound_usd: float
    confidence_level: str = "90% Empirical Residual Interval"


class PredictionResponse(BaseModel):
    """
    Standardized valuation response including formatted currency,
    underlying raw value, model identity, input audit, and limitation disclaimers.
    """
    status: str = "success"
    predicted_raw: float = Field(..., description="Raw model prediction in $100k units")
    predicted_value_usd: float = Field(..., description="Calculated median value in US Dollars")
    predicted_value_formatted: str = Field(..., description="Human-readable currency string")
    currency: str = "USD"
    model_name: str
    target_scale_explanation: str
    input_summary: Dict[str, Any]
    derived_features: Dict[str, float]
    confidence_interval: ConfidenceInterval
    test_metrics: Optional[Dict[str, float]] = None
    disclaimer: str


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_name: Optional[str] = None
    version: str
    environment: str
    dataset_records: Optional[int] = None


class MetadataResponse(BaseModel):
    model_name: str
    architecture_type: str
    training_timestamp: str
    random_seed: int
    dataset_name: str
    source: str
    total_samples: int
    train_samples: int
    test_samples: int
    target_variable: str
    target_description: str
    target_multiplier: float
    target_unit: str
    features: Dict[str, Any]
    limitations: str
    cv_performance: Dict[str, float]
    test_performance: Dict[str, float]
    all_candidates_benchmarked: List[Dict[str, Any]]


class AnalyticsResponse(BaseModel):
    total_records: int
    total_features: int
    summary_statistics: Dict[str, Any]
    price_distribution: List[Dict[str, Any]]
    sample_comparisons: List[Dict[str, Any]]
    residual_distribution: List[Dict[str, Any]]
    model_comparisons: List[Dict[str, Any]]
