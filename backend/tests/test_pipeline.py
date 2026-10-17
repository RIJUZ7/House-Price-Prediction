"""
Unit Tests for ML Preprocessing, Feature Engineering, and Metrics
"""

import numpy as np
import pandas as pd
from backend.app.ml.preprocessor import (
    GeoAndRatioFeatureEngineer,
    create_preprocessing_pipeline,
)
from backend.app.ml.evaluator import calculate_metrics


def test_geo_and_ratio_feature_engineer():
    """Verify engineered ratio and geographic distance features."""
    sample_df = pd.DataFrame([{
        "MedInc": 3.5,
        "HouseAge": 30.0,
        "AveRooms": 6.0,
        "AveBedrms": 1.2,
        "Population": 1200.0,
        "AveOccup": 3.0,
        "Latitude": 34.05,
        "Longitude": -118.24,
    }])
    engineer = GeoAndRatioFeatureEngineer(add_geo_distances=True)
    res = engineer.transform(sample_df)
    # 8 original features + BedroomsPerRoom + PeoplePerRoom + DistToLA + DistToSF = 12 features
    assert res.shape[1] == 12


def test_preprocessing_pipeline():
    """Ensure end-to-end preprocessing pipeline transforms inputs without error."""
    pipeline = create_preprocessing_pipeline()
    sample_data = np.array([
        [3.5, 30.0, 6.0, 1.2, 1200.0, 3.0, 34.05, -118.24],
        [5.0, 15.0, 7.0, 1.1, 800.0, 2.5, 37.77, -122.42],
        [2.1, 45.0, 4.5, 1.0, 1900.0, 3.8, 36.75, -119.77],
    ])
    pipeline.fit(sample_data)
    transformed = pipeline.transform(sample_data)
    assert transformed.shape[0] == 3
    assert transformed.shape[1] == 12
    # Verify standard scaling properties (mean near 0)
    assert np.allclose(transformed.mean(axis=0), 0.0, atol=1e-7)


def test_calculate_metrics():
    """Verify regression metrics calculation."""
    y_true = np.array([2.0, 3.0, 4.0, 5.0])
    y_pred = np.array([2.1, 2.9, 4.2, 4.8])
    metrics = calculate_metrics(y_true, y_pred)
    assert "mae" in metrics
    assert "rmse" in metrics
    assert "r2" in metrics
    assert "mae_usd" in metrics
    assert "rmse_usd" in metrics
    assert metrics["r2"] > 0.95
    assert metrics["mae_usd"] == round(metrics["mae"] * 100000.0, 2)
