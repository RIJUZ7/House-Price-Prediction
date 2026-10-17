"""
NEXUS ESTATE - Model Service
Handles thread-safe model caching, inference, feature transformation,
and confidence interval calculation.
"""

from typing import Dict, Any, Optional
import json
import joblib
import numpy as np
import pandas as pd

from backend.app.config import settings
from backend.app.schemas import PredictionRequest, PredictionResponse, ConfidenceInterval


class ModelService:
    _instance: Optional["ModelService"] = None

    def __init__(self):
        self.pipeline = None
        self.metadata: Optional[Dict[str, Any]] = None
        self.is_loaded: bool = False
        self.load_model()

    @classmethod
    def get_instance(cls) -> "ModelService":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def load_model(self) -> bool:
        """
        Loads the joblib pipeline and metadata from disk if available.
        """
        model_path = settings.MODEL_PATH
        metadata_path = settings.METADATA_PATH

        if model_path.is_file() and metadata_path.is_file():
            try:
                self.pipeline = joblib.load(model_path)
                with open(metadata_path, "r", encoding="utf-8") as f:
                    self.metadata = json.load(f)
                self.is_loaded = True
                return True
            except Exception as e:
                print(f"[WARN] Failed to load model from {model_path}: {e}")
                self.pipeline = None
                self.metadata = None
                self.is_loaded = False
                return False
        else:
            self.is_loaded = False
            return False

    def predict(self, req: PredictionRequest) -> PredictionResponse:
        """
        Generates valuation inference and confidence metrics from inputs.
        """
        if not self.is_loaded or self.pipeline is None:
            # Try reloading once in case training finished while server is up
            if not self.load_model():
                raise RuntimeError(
                    "Model pipeline is not trained or loaded. "
                    "Please execute 'python backend/train.py' to train and serialize the model."
                )

        # Prepare DataFrame with matching feature names in expected order
        features_dict = {
            "MedInc": req.MedInc,
            "HouseAge": req.HouseAge,
            "AveRooms": req.AveRooms,
            "AveBedrms": req.AveBedrms,
            "Population": req.Population,
            "AveOccup": req.AveOccup,
            "Latitude": req.Latitude,
            "Longitude": req.Longitude,
        }
        df_input = pd.DataFrame([features_dict])

        # Raw prediction (in $100,000s)
        raw_pred = float(self.pipeline.predict(df_input)[0])
        # Safeguard lower bound (minimum house price floor)
        raw_pred = max(0.15, raw_pred)

        # Target multiplier is $100,000 USD
        predicted_usd = float(raw_pred * 100000.0)

        # Compute empirical 90% confidence bounds using test RMSE
        test_rmse_usd = 45229.0
        if self.metadata and "test_performance" in self.metadata:
            test_rmse_usd = float(self.metadata["test_performance"].get("rmse_usd", 45229.0))

        margin = 1.645 * test_rmse_usd
        lower_bound = max(15000.0, predicted_usd - margin)
        upper_bound = predicted_usd + margin

        # Compute domain derived metrics
        derived = {
            "BedroomsPerRoom": round(req.AveBedrms / (req.AveRooms + 1e-5), 3),
            "PeoplePerRoom": round(req.AveOccup / (req.AveRooms + 1e-5), 3),
            "DistToLA_deg": round(
                float(np.sqrt((req.Latitude - 34.0522) ** 2 + (req.Longitude - (-118.2437)) ** 2)), 2
            ),
            "DistToSF_deg": round(
                float(np.sqrt((req.Latitude - 37.7749) ** 2 + (req.Longitude - (-122.4194)) ** 2)), 2
            ),
        }

        model_name = self.metadata.get("model_name", "Production Hist Gradient Boosting") if self.metadata else "Production Hist Gradient Boosting"
        test_metrics = self.metadata.get("test_performance", {}) if self.metadata else {}

        return PredictionResponse(
            status="success",
            predicted_raw=round(raw_pred, 4),
            predicted_value_usd=round(predicted_usd, 2),
            predicted_value_formatted=f"${predicted_usd:,.0f}",
            currency="USD",
            model_name=model_name,
            target_scale_explanation=(
                "Target scale: 1.0 unit = $100,000 USD. Reflects historical median residential "
                "property values at the census block group scale (approx 600-3,000 residents)."
            ),
            input_summary=features_dict,
            derived_features=derived,
            confidence_interval=ConfidenceInterval(
                lower_bound_usd=round(lower_bound, 2),
                upper_bound_usd=round(upper_bound, 2),
                confidence_level="90% Empirical Residual Interval",
            ),
            test_metrics=test_metrics,
            disclaimer=(
                "NEXUS ESTATE utilizes machine learning statistical modeling trained on California "
                "census block group data. This estimate provides neighborhood-level valuation guidance "
                "and does not constitute a certified appraisal or financial investment advice."
            ),
        )


model_service = ModelService.get_instance()
