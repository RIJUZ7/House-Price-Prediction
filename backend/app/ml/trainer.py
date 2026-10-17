"""
NEXUS ESTATE - Training Pipeline Module
Executes cross-validation, hyperparameter comparison, model selection,
and serialization of the production machine learning pipeline.
"""

from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Any, List
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.dummy import DummyRegressor
from sklearn.ensemble import RandomForestRegressor, HistGradientBoostingRegressor
from sklearn.linear_model import Ridge
from sklearn.model_selection import KFold, cross_validate, train_test_split
from sklearn.pipeline import Pipeline

from backend.app.ml.data_loader import (
    load_raw_dataset,
    get_feature_and_target_matrices,
    FEATURE_METADATA,
    TARGET_METADATA,
    DATASET_LIMITATIONS,
)
from backend.app.ml.preprocessor import create_preprocessing_pipeline
from backend.app.ml.evaluator import (
    calculate_metrics,
    generate_eda_artifacts,
    generate_evaluation_artifacts,
    generate_model_comparison_artifacts,
)


def train_and_evaluate_pipeline(
    data_dir: Path,
    models_dir: Path,
    artifacts_dir: Path,
    random_seed: int = 42,
) -> Dict[str, Any]:
    """
    Executes the complete machine learning training workflow:
    1. Loads and validates raw data
    2. Generates initial EDA artifacts
    3. Splits data into train and held-out test sets
    4. Evaluates multiple algorithms via 5-fold cross-validation
    5. Selects champion model strictly based on validation performance
    6. Fits champion pipeline on full training data
    7. Evaluates champion on unseen test set
    8. Exports models, metadata, and diagnostic plots
    """
    models_dir.mkdir(parents=True, exist_ok=True)
    artifacts_dir.mkdir(parents=True, exist_ok=True)

    print("\n" + "=" * 65)
    print("  NEXUS ESTATE — MACHINE LEARNING PIPELINE EXECUTION")
    print("=" * 65)

    # 1. Load Data
    print("\n[1/6] Loading California Housing dataset...")
    df = load_raw_dataset(data_cache_dir=data_dir)
    print(f"      Dataset successfully loaded: {df.shape[0]} rows, {df.shape[1]} columns.")

    # 2. Exploratory Data Analysis & Artifacts
    print("\n[2/6] Generating exploratory data analysis visualizations & metrics...")
    dataset_summary = generate_eda_artifacts(df, artifacts_dir)
    print("      Saved EDA plots: correlation_heatmap.png, california_housing_map.png, feature_distributions.png")

    # 3. Train-Test Split (Prevent Data Leakage)
    print("\n[3/6] Partitioning data into train (80%) and held-out test (20%)...")
    X, y = get_feature_and_target_matrices(df)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=random_seed
    )
    print(f"      Training samples: {len(X_train)} | Test samples: {len(X_test)}")

    # 4. Define Candidate Regressors
    print("\n[4/6] Initializing candidate regression architectures...")
    candidates: List[Dict[str, Any]] = [
        {
            "name": "Dummy Baseline",
            "type": "Baseline",
            "pipeline": Pipeline([
                ("preprocessor", create_preprocessing_pipeline()),
                ("regressor", DummyRegressor(strategy="median")),
            ]),
        },
        {
            "name": "Ridge Linear Regression",
            "type": "Linear",
            "pipeline": Pipeline([
                ("preprocessor", create_preprocessing_pipeline()),
                ("regressor", Ridge(alpha=10.0)),
            ]),
        },
        {
            "name": "Hist Gradient Boosting",
            "type": "Ensemble",
            "pipeline": Pipeline([
                ("preprocessor", create_preprocessing_pipeline()),
                ("regressor", HistGradientBoostingRegressor(
                    max_iter=150,
                    learning_rate=0.08,
                    max_depth=10,
                    random_state=random_seed,
                )),
            ]),
        },
        {
            "name": "Random Forest Regressor",
            "type": "Ensemble",
            "pipeline": Pipeline([
                ("preprocessor", create_preprocessing_pipeline()),
                ("regressor", RandomForestRegressor(
                    n_estimators=100,
                    max_depth=16,
                    min_samples_split=4,
                    random_state=random_seed,
                    n_jobs=-1,
                )),
            ]),
        },
    ]

    # 5. 5-Fold Cross-Validation on Training Data
    print("      Running 5-fold cross-validation benchmarks...")
    cv = KFold(n_splits=5, shuffle=True, random_state=random_seed)
    scoring = {
        "r2": "r2",
        "neg_rmse": "neg_root_mean_squared_error",
        "neg_mae": "neg_mean_absolute_error",
    }

    comparison_results: List[Dict[str, Any]] = []
    best_cv_score = -float("inf")
    best_candidate = None

    for item in candidates:
        name = item["name"]
        pipeline = item["pipeline"]
        print(f"      --> Benchmarking: {name}...")

        cv_scores = cross_validate(
            pipeline,
            X_train,
            y_train,
            cv=cv,
            scoring=scoring,
            n_jobs=-1,
            return_train_score=False,
        )

        r2_mean = float(np.mean(cv_scores["test_r2"]))
        rmse_mean = float(-np.mean(cv_scores["test_neg_rmse"]))
        mae_mean = float(-np.mean(cv_scores["test_neg_mae"]))

        result_entry = {
            "name": name,
            "type": item["type"],
            "r2_cv_mean": round(r2_mean, 4),
            "rmse_cv_mean": round(rmse_mean, 4),
            "mae_cv_mean": round(mae_mean, 4),
            "rmse_cv_usd": round(rmse_mean * 100000.0, 2),
            "mae_cv_usd": round(mae_mean * 100000.0, 2),
        }
        comparison_results.append(result_entry)
        print(f"          CV R²: {r2_mean:.4f} | CV RMSE: ${rmse_mean * 100000:,.0f} | CV MAE: ${mae_mean * 100000:,.0f}")

        # Selection criterion: Highest Cross-Validation R2 score
        if r2_mean > best_cv_score:
            best_cv_score = r2_mean
            best_candidate = item

    if not best_candidate:
        raise RuntimeError("Model benchmark failed to select a champion model.")

    print(f"\n[5/6] Champion Selected: {best_candidate['name']} (Validation R² = {best_cv_score:.4f})")

    # 6. Fit Champion on Full Training Set and Evaluate on Held-Out Test Set
    champion_pipeline: Pipeline = best_candidate["pipeline"]
    print(f"      Fitting {best_candidate['name']} on full training set ({len(X_train)} samples)...")
    champion_pipeline.fit(X_train, y_train)

    print("      Evaluating champion on held-out test set (unseen 4,128 samples)...")
    y_test_pred = champion_pipeline.predict(X_test)
    test_metrics = calculate_metrics(y_test.to_numpy(), y_test_pred)

    print(f"      Test Set R²:   {test_metrics['r2']:.4f}")
    print(f"      Test Set RMSE: ${test_metrics['rmse_usd']:,.2f} USD")
    print(f"      Test Set MAE:  ${test_metrics['mae_usd']:,.2f} USD")

    # Update comparison list with held-out test metrics for transparency
    for item in comparison_results:
        if item["name"] == best_candidate["name"]:
            item["test_r2"] = test_metrics["r2"]
            item["test_rmse"] = test_metrics["rmse"]
            item["test_mae"] = test_metrics["mae"]
            item["is_selected_champion"] = True
        else:
            item["is_selected_champion"] = False

    # 7. Generate Evaluation and Comparison Visuals
    print("\n[6/6] Exporting production artifacts & serializing pipeline...")
    generate_model_comparison_artifacts(comparison_results, artifacts_dir)
    evaluation_artifacts = generate_evaluation_artifacts(
        y_test.to_numpy(), y_test_pred, best_candidate["name"], artifacts_dir
    )

    # Save Pipeline to Models Directory
    pipeline_file = models_dir / "california_housing_pipeline.joblib"
    joblib.dump(champion_pipeline, pipeline_file)
    print(f"      Saved model pipeline: {pipeline_file.name}")

    # Save Comprehensive Metadata
    metadata: Dict[str, Any] = {
        "model_name": best_candidate["name"],
        "architecture_type": best_candidate["type"],
        "training_timestamp": datetime.now(timezone.utc).isoformat(),
        "random_seed": random_seed,
        "dataset_name": "California Housing (1990 U.S. Census)",
        "source": "scikit-learn.datasets.fetch_california_housing",
        "total_samples": len(df),
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "target_variable": TARGET_METADATA["name"],
        "target_description": TARGET_METADATA["description"],
        "target_multiplier": TARGET_METADATA["target_multiplier"],
        "target_unit": TARGET_METADATA["unit"],
        "features": FEATURE_METADATA,
        "limitations": DATASET_LIMITATIONS,
        "cv_performance": {
            "r2_cv_mean": next(c["r2_cv_mean"] for c in comparison_results if c["name"] == best_candidate["name"]),
            "rmse_cv_mean": next(c["rmse_cv_mean"] for c in comparison_results if c["name"] == best_candidate["name"]),
            "mae_cv_mean": next(c["mae_cv_mean"] for c in comparison_results if c["name"] == best_candidate["name"]),
        },
        "test_performance": test_metrics,
        "all_candidates_benchmarked": comparison_results,
    }

    metadata_file = models_dir / "model_metadata.json"
    with open(metadata_file, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"      Saved metadata catalog: {metadata_file.name}")

    print("\n" + "=" * 65)
    print("  TRAINING PIPELINE COMPLETE — PRODUCTION ARTIFACTS READY")
    print("=" * 65)

    return {
        "model_name": best_candidate["name"],
        "test_metrics": test_metrics,
        "comparison_results": comparison_results,
        "pipeline_file": str(pipeline_file),
        "metadata_file": str(metadata_file),
    }
