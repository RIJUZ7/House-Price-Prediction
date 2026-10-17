"""
NEXUS ESTATE - Data Loader Module
Programmatically loads, validates, and prepares the California Housing dataset.
Includes comprehensive validation, schema checks, and domain documentation.
"""

from pathlib import Path
from typing import Dict, Any, Tuple
import pandas as pd
from sklearn.datasets import fetch_california_housing


# Dataset Feature Specifications & Metadata
FEATURE_METADATA: Dict[str, Dict[str, Any]] = {
    "MedInc": {
        "name": "Median Income",
        "description": "Median income in block group (in tens of thousands of USD)",
        "unit": "$10k / year",
        "min": 0.49,
        "max": 15.0,
        "default": 3.87,
        "step": 0.1,
    },
    "HouseAge": {
        "name": "House Age",
        "description": "Median house age in block group",
        "unit": "years",
        "min": 1.0,
        "max": 52.0,
        "default": 28.0,
        "step": 1.0,
    },
    "AveRooms": {
        "name": "Average Rooms",
        "description": "Average number of rooms per household in block group",
        "unit": "rooms",
        "min": 0.8,
        "max": 30.0,
        "default": 5.4,
        "step": 0.1,
    },
    "AveBedrms": {
        "name": "Average Bedrooms",
        "description": "Average number of bedrooms per household in block group",
        "unit": "bedrooms",
        "min": 0.3,
        "max": 10.0,
        "default": 1.1,
        "step": 0.05,
    },
    "Population": {
        "name": "Population",
        "description": "Total block group resident population",
        "unit": "residents",
        "min": 3.0,
        "max": 35000.0,
        "default": 1425.0,
        "step": 10.0,
    },
    "AveOccup": {
        "name": "Average Occupancy",
        "description": "Average number of household members in block group",
        "unit": "people / household",
        "min": 0.5,
        "max": 20.0,
        "default": 3.0,
        "step": 0.1,
    },
    "Latitude": {
        "name": "Latitude",
        "description": "Block group latitude coordinate",
        "unit": "° N",
        "min": 32.5,
        "max": 42.0,
        "default": 35.6,
        "step": 0.01,
    },
    "Longitude": {
        "name": "Longitude",
        "description": "Block group longitude coordinate",
        "unit": "° W",
        "min": -124.5,
        "max": -114.0,
        "default": -119.5,
        "step": 0.01,
    },
}

TARGET_METADATA: Dict[str, Any] = {
    "name": "MedHouseVal",
    "description": "Median house value for California districts / census block groups",
    "unit": "$100,000s USD",
    "target_multiplier": 100000.0,
    "min": 0.14999,
    "max": 5.00001,
}

DATASET_LIMITATIONS: str = (
    "1. Block-Group Level: Predictions represent the historical median home value of an entire "
    "census block group (~600 to 3,000 residents), not an individual property appraisal.\n"
    "2. 1990 U.S. Census Basis: The original dataset was derived from 1990 California census data. "
    "Dollar figures reflect 1990 valuation levels where 1.0 = $100,000.\n"
    "3. Capped Ceiling: Values exceeding $500,000 were clipped at 5.0 in the original census survey."
)


def load_raw_dataset(data_cache_dir: Path | None = None) -> pd.DataFrame:
    """
    Loads the real California Housing dataset using scikit-learn.
    Caches the downloaded data locally to avoid redundant network requests.
    
    Raises:
        RuntimeError: If download fails and no cached copy is found.
    """
    csv_cache_path = (data_cache_dir / "california_housing.csv") if data_cache_dir else None
    
    # Check local CSV cache first
    if csv_cache_path and csv_cache_path.is_file():
        try:
            df = pd.read_csv(csv_cache_path)
            validate_dataset_schema(df)
            return df
        except Exception:
            pass  # Fall back to fetch_california_housing
            
    try:
        raw = fetch_california_housing(as_frame=True)
        df = raw.frame
        validate_dataset_schema(df)
        
        # Save local copy if cache dir provided
        if csv_cache_path:
            csv_cache_path.parent.mkdir(parents=True, exist_ok=True)
            df.to_csv(csv_cache_path, index=False)
            
        return df
    except Exception as exc:
        raise RuntimeError(
            f"Failed to load California Housing dataset from scikit-learn: {exc}\n"
            "Recovery instructions:\n"
            "1. Verify internet connectivity to download the dataset.\n"
            "2. Ensure scikit-learn >= 1.5.0 is installed.\n"
            "3. If behind a firewall, ensure 'ndownloader.figshare.com' is accessible."
        ) from exc


def validate_dataset_schema(df: pd.DataFrame) -> None:
    """
    Validates that the dataframe contains expected features, correct dtypes,
    no missing values, and reasonable ranges.
    """
    expected_features = list(FEATURE_METADATA.keys())
    target_name = TARGET_METADATA["name"]
    
    for feat in expected_features:
        if feat not in df.columns:
            raise ValueError(f"Missing required feature column: '{feat}'")
            
    if target_name not in df.columns:
        raise ValueError(f"Missing target column: '{target_name}'")
        
    # Check for NaN / null values
    null_counts = df.isnull().sum()
    if null_counts.any():
        cols_with_nulls = null_counts[null_counts > 0].to_dict()
        raise ValueError(f"Dataset contains unexpected missing values: {cols_with_nulls}")
        
    # Check data types
    for col in expected_features + [target_name]:
        if not pd.api.types.is_numeric_dtype(df[col]):
            raise TypeError(f"Column '{col}' must be numeric, found: {df[col].dtype}")
            
    # Check minimum row count
    if len(df) < 1000:
        raise ValueError(f"Dataset row count ({len(df)}) is too low for a reliable pipeline.")


def get_feature_and_target_matrices(df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.Series]:
    """
    Separates the features X and target y.
    """
    feature_cols = list(FEATURE_METADATA.keys())
    target_col = TARGET_METADATA["name"]
    
    X = df[feature_cols].copy()
    y = df[target_col].copy()
    return X, y
