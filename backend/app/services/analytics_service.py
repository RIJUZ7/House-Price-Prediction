"""
NEXUS ESTATE - Analytics Service
Aggregates and caches dataset distributions, evaluation metrics, and model benchmarks.
"""

from pathlib import Path
from typing import Dict, Any, Optional
import json

from backend.app.config import settings
from backend.app.schemas import AnalyticsResponse, MetadataResponse


class AnalyticsService:
    _instance: Optional["AnalyticsService"] = None

    def __init__(self):
        self.dataset_summary: Optional[Dict[str, Any]] = None
        self.test_evaluation: Optional[Dict[str, Any]] = None
        self.model_comparison: Optional[list] = None
        self.metadata: Optional[Dict[str, Any]] = None
        self.load_artifacts()

    @classmethod
    def get_instance(cls) -> "AnalyticsService":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def load_artifacts(self) -> None:
        """Loads all JSON artifacts from disk."""
        if settings.DATASET_SUMMARY_PATH.is_file():
            try:
                with open(settings.DATASET_SUMMARY_PATH, "r", encoding="utf-8") as f:
                    self.dataset_summary = json.load(f)
            except Exception as e:
                print(f"[WARN] Failed loading dataset_summary.json: {e}")

        if settings.TEST_EVALUATION_PATH.is_file():
            try:
                with open(settings.TEST_EVALUATION_PATH, "r", encoding="utf-8") as f:
                    self.test_evaluation = json.load(f)
            except Exception as e:
                print(f"[WARN] Failed loading test_evaluation.json: {e}")

        if settings.MODEL_COMPARISON_PATH.is_file():
            try:
                with open(settings.MODEL_COMPARISON_PATH, "r", encoding="utf-8") as f:
                    self.model_comparison = json.load(f)
            except Exception as e:
                print(f"[WARN] Failed loading model_comparison.json: {e}")

        if settings.METADATA_PATH.is_file():
            try:
                with open(settings.METADATA_PATH, "r", encoding="utf-8") as f:
                    self.metadata = json.load(f)
            except Exception as e:
                print(f"[WARN] Failed loading model_metadata.json: {e}")

    def get_metadata(self) -> Dict[str, Any]:
        if self.metadata is None:
            self.load_artifacts()
        if self.metadata is None:
            raise FileNotFoundError("Model metadata not found. Train the model first.")
        return self.metadata

    def get_metrics(self) -> Dict[str, Any]:
        meta = self.get_metadata()
        return {
            "model_name": meta.get("model_name"),
            "test_performance": meta.get("test_performance", {}),
            "cv_performance": meta.get("cv_performance", {}),
            "all_candidates": meta.get("all_candidates_benchmarked", []),
        }

    def get_analytics(self) -> Dict[str, Any]:
        if self.dataset_summary is None or self.test_evaluation is None:
            self.load_artifacts()

        if self.dataset_summary is None or self.test_evaluation is None:
            raise FileNotFoundError("Analytics artifacts not found. Run training pipeline first.")

        return {
            "total_records": self.dataset_summary.get("total_records", 20640),
            "total_features": self.dataset_summary.get("total_features", 8),
            "summary_statistics": self.dataset_summary.get("summary_statistics", {}),
            "price_distribution": self.dataset_summary.get("price_distribution", []),
            "correlation_matrix": self.dataset_summary.get("correlation_matrix", {}),
            "sample_comparisons": self.test_evaluation.get("sample_comparisons", []),
            "residual_distribution": self.test_evaluation.get("residual_distribution", []),
            "model_comparisons": self.model_comparison or [],
            "test_metrics": self.test_evaluation.get("metrics", {}),
        }


analytics_service = AnalyticsService.get_instance()
