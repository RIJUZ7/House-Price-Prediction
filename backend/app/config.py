"""
NEXUS ESTATE - Configuration Module
Manages application settings, filesystem paths, and environment variables.
"""

from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "NEXUS ESTATE — AI Property Intelligence"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Network
    HOST: str = "127.0.0.1"
    PORT: int = 8000
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    
    # Base paths
    # backend/app/config.py -> parent of parent of parent is project root
    ROOT_DIR: Path = Path(__file__).resolve().parent.parent.parent
    BACKEND_DIR: Path = Path(__file__).resolve().parent.parent
    DATA_DIR: Path = ROOT_DIR / "data"
    MODELS_DIR: Path = ROOT_DIR / "models"
    ARTIFACTS_DIR: Path = ROOT_DIR / "artifacts"
    
    # Model artifact files
    MODEL_PATH: Path = MODELS_DIR / "california_housing_pipeline.joblib"
    METADATA_PATH: Path = MODELS_DIR / "model_metadata.json"
    MODEL_COMPARISON_PATH: Path = ARTIFACTS_DIR / "model_comparison.json"
    TEST_EVALUATION_PATH: Path = ARTIFACTS_DIR / "test_evaluation.json"
    DATASET_SUMMARY_PATH: Path = ARTIFACTS_DIR / "dataset_summary.json"

    model_config = {
        "env_file": ".env",
        "extra": "ignore"
    }


settings = Settings()

# Ensure standard output directories exist
settings.DATA_DIR.mkdir(parents=True, exist_ok=True)
settings.MODELS_DIR.mkdir(parents=True, exist_ok=True)
settings.ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
