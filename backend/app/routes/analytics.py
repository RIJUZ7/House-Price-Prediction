"""
NEXUS ESTATE - Analytics Router
Serves genuine model metadata, evaluation metrics, and visualization telemetry.
"""

from fastapi import APIRouter, HTTPException, status
from backend.app.schemas import MetadataResponse, AnalyticsResponse
from backend.app.services.analytics_service import analytics_service

router = APIRouter(prefix="/api", tags=["Analytics & Intelligence"])


@router.get("/metadata", response_model=MetadataResponse)
def get_model_metadata():
    """
    Returns full metadata for the trained champion pipeline, feature definitions,
    and dataset provenance.
    """
    try:
        data = analytics_service.get_metadata()
        return data
    except FileNotFoundError as fnf:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(fnf)
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve metadata: {str(exc)}"
        )


@router.get("/metrics")
def get_evaluation_metrics():
    """
    Returns actual held-out test set metrics (MAE, RMSE, R²) and cross-validation comparisons.
    """
    try:
        return analytics_service.get_metrics()
    except FileNotFoundError as fnf:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(fnf)
        )


@router.get("/analytics")
def get_analytics_data():
    """
    Returns structured dataset summaries, correlation matrix, price distribution,
    actual vs predicted points, and residual distributions for frontend charts.
    """
    try:
        return analytics_service.get_analytics()
    except FileNotFoundError as fnf:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(fnf)
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate analytics payload: {str(exc)}"
        )
