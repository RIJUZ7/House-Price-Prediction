"""
Unit Tests for California Housing Data Loading & Validation
"""

import pandas as pd
import pytest
from backend.app.ml.data_loader import (
    validate_dataset_schema,
    get_feature_and_target_matrices,
    FEATURE_METADATA,
    TARGET_METADATA,
)


def test_schema_validation_passes_valid_data():
    """Verify schema validator accepts well-formed data."""
    valid_data = {
        col: [1.0, 2.0, 3.0] for col in FEATURE_METADATA.keys()
    }
    valid_data[TARGET_METADATA["name"]] = [2.5, 3.0, 4.0]
    df = pd.DataFrame(valid_data)
    # Replicate to meet minimum row threshold in test fixture
    df_large = pd.concat([df] * 400, ignore_index=True)
    validate_dataset_schema(df_large)


def test_schema_validation_fails_missing_feature():
    """Ensure missing columns trigger ValueError."""
    data = {"MedInc": [3.0] * 1100, TARGET_METADATA["name"]: [2.0] * 1100}
    df = pd.DataFrame(data)
    with pytest.raises(ValueError, match="Missing required feature column"):
        validate_dataset_schema(df)


def test_schema_validation_fails_with_nulls():
    """Ensure null/NaN values are caught."""
    valid_data = {
        col: [1.0] * 1100 for col in FEATURE_METADATA.keys()
    }
    valid_data[TARGET_METADATA["name"]] = [2.0] * 1100
    valid_data["MedInc"][5] = None
    df = pd.DataFrame(valid_data)
    with pytest.raises(ValueError, match="unexpected missing values"):
        validate_dataset_schema(df)


def test_get_matrices():
    """Test feature/target splitting."""
    data = {
        col: [1.0, 2.0] for col in FEATURE_METADATA.keys()
    }
    data[TARGET_METADATA["name"]] = [3.5, 4.5]
    df = pd.DataFrame(data)
    X, y = get_feature_and_target_matrices(df)
    assert list(X.columns) == list(FEATURE_METADATA.keys())
    assert y.name == TARGET_METADATA["name"]
    assert len(X) == 2
    assert len(y) == 2
