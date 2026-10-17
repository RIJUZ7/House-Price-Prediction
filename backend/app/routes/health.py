"""
NEXUS ESTATE - Health Router
"""

from fastapi import APIRouter
from backend.app.schemas import HealthResponse
from backend.app.services.model_service import model_service
from backend.app.config import settings

router = APIRouter(prefix="/api", tags=["System Health"])


@router.get("/health", response_model=HealthResponse)
def get_health():
    """
    Checks the readiness of the application server and the trained ML pipeline.
    """
    is_loaded = model_service.is_loaded
    model_name = model_service.metadata.get("model_name") if model_service.metadata else None

    return HealthResponse(
        status="healthy" if is_loaded else "unready (model not loaded)",
        model_loaded=is_loaded,
        model_name=model_name,
        version=settings.APP_VERSION,
        environment=settings.ENVIRONMENT,
        dataset_records=model_service.metadata.get("total_samples") if model_service.metadata else None,
    )
