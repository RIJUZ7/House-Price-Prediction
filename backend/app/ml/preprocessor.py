"""
NEXUS ESTATE - Preprocessing & Feature Engineering Module
Builds robust scikit-learn transformers and pipelines to prevent data leakage.
"""

from typing import List
import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler


class GeoAndRatioFeatureEngineer(BaseEstimator, TransformerMixin):
    """
    Scikit-learn compatible transformer that extracts domain-specific features:
    1. Bedrooms per room ratio: AveBedrms / AveRooms
    2. Population per room: Population / (AveRooms * AveOccup + 1e-5)
    3. Distance to Los Angeles center (34.0522, -118.2437)
    4. Distance to San Francisco center (37.7749, -122.4194)
    """

    def __init__(self, add_geo_distances: bool = True):
        self.add_geo_distances = add_geo_distances
        # Reference coordinates
        self.la_coords = (34.0522, -118.2437)
        self.sf_coords = (37.7749, -122.4194)

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        # Convert to pandas DataFrame if numpy array
        if isinstance(X, np.ndarray):
            cols = [
                "MedInc", "HouseAge", "AveRooms", "AveBedrms",
                "Population", "AveOccup", "Latitude", "Longitude"
            ]
            df = pd.DataFrame(X, columns=cols[:X.shape[1]])
        else:
            df = X.copy()

        # Engineered features
        # 1. Ratio of bedrooms to total rooms (density indicator)
        df["BedroomsPerRoom"] = df["AveBedrms"] / (df["AveRooms"] + 1e-5)
        
        # 2. People per room (crowding indicator)
        df["PeoplePerRoom"] = df["AveOccup"] / (df["AveRooms"] + 1e-5)

        if self.add_geo_distances:
            # Approximate Euclidean distance in degrees to major economic hubs
            df["DistToLA"] = np.sqrt(
                (df["Latitude"] - self.la_coords[0]) ** 2 +
                (df["Longitude"] - self.la_coords[1]) ** 2
            )
            df["DistToSF"] = np.sqrt(
                (df["Latitude"] - self.sf_coords[0]) ** 2 +
                (df["Longitude"] - self.sf_coords[1]) ** 2
            )

        return df.to_numpy()


def create_preprocessing_pipeline() -> Pipeline:
    """
    Constructs the end-to-end preprocessing pipeline.
    Combines feature engineering and standard scaling.
    """
    return Pipeline([
        ("feature_engineering", GeoAndRatioFeatureEngineer(add_geo_distances=True)),
        ("scaler", StandardScaler()),
    ])
