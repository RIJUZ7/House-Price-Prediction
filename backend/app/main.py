"""
NEXUS ESTATE — AI Property Intelligence Backend
FastAPI Enterprise Application Entrypoint
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.app.config import settings
from backend.app.routes import health, prediction, analytics
from backend.app.services.model_service import model_service
from backend.app.services.analytics_service import analytics_service


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure artifacts and model cache are loaded
    print(f"[*] Starting {settings.APP_NAME} (v{settings.APP_VERSION})")
    model_loaded = model_service.load_model()
    analytics_service.load_artifacts()
    if model_loaded:
        print(f"[*] Machine learning pipeline active: {model_service.metadata.get('model_name')}")
    else:
        print("[!] Model pipeline not found on disk. Run 'python backend/train.py' to generate artifacts.")
    yield
    print("[*] Shutting down NEXUS ESTATE API backend.")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "High-performance machine learning backend for census block residential valuation, "
        "geospatial regression intelligence, and real-time model telemetry."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Configure Cross-Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.ENVIRONMENT == "development" else settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount generated static charts
if settings.ARTIFACTS_DIR.is_dir():
    app.mount("/artifacts", StaticFiles(directory=str(settings.ARTIFACTS_DIR)), name="artifacts")

# Register API Routers
app.include_router(health.router)
app.include_router(prediction.router)
app.include_router(analytics.router)


@app.get("/", tags=["Root"])
def root_status():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "operational",
        "docs": "/docs",
        "endpoints": {
            "health": "/api/health",
            "predict": "/api/predict",
            "presets": "/api/presets",
            "metadata": "/api/metadata",
            "metrics": "/api/metrics",
            "analytics": "/api/analytics",
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend.app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
