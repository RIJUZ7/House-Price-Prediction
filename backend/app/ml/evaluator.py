"""
NEXUS ESTATE - Model Evaluation & Visualization Module
Calculates regression metrics (MAE, RMSE, R²), produces production charts,
and exports structured JSON analytics for the frontend dashboards.
"""

from pathlib import Path
from typing import Dict, Any, List
import json
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")  # Non-interactive backend for headless server execution
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


def calculate_metrics(y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, float]:
    """
    Computes standard regression evaluation metrics: MAE, RMSE, R2.
    """
    mae = float(mean_absolute_error(y_true, y_pred))
    rmse = float(np.sqrt(mean_squared_error(y_true, y_pred)))
    r2 = float(r2_score(y_true, y_pred))
    
    return {
        "mae": round(mae, 4),
        "rmse": round(rmse, 4),
        "r2": round(r2, 4),
        # Real-world USD scale equivalents ($100k multiplier)
        "mae_usd": round(mae * 100000.0, 2),
        "rmse_usd": round(rmse * 100000.0, 2),
    }


def generate_eda_artifacts(df: pd.DataFrame, artifacts_dir: Path) -> Dict[str, Any]:
    """
    Generates EDA plots and JSON summary statistics for the dataset.
    """
    artifacts_dir.mkdir(parents=True, exist_ok=True)
    sns.set_theme(style="darkgrid", palette="muted")
    plt.rcParams.update({
        "figure.facecolor": "#0d1527",
        "axes.facecolor": "#070b14",
        "text.color": "#f1f5f9",
        "axes.labelcolor": "#94a3b8",
        "xtick.color": "#94a3b8",
        "ytick.color": "#94a3b8",
        "grid.color": "#1e293b",
    })

    # 1. Correlation Heatmap
    corr = df.corr()
    plt.figure(figsize=(10, 8))
    sns.heatmap(
        corr,
        annot=True,
        fmt=".2f",
        cmap="mako",
        cbar_kws={"label": "Correlation"},
        linewidths=0.5,
        linecolor="#070b14"
    )
    plt.title("California Housing Feature Correlations", fontsize=14, color="#38bdf8", pad=15)
    plt.tight_layout()
    corr_plot_path = artifacts_dir / "correlation_heatmap.png"
    plt.savefig(corr_plot_path, dpi=200)
    plt.close()

    # 2. California Housing Map
    plt.figure(figsize=(9, 7))
    scatter = plt.scatter(
        df["Longitude"],
        df["Latitude"],
        c=df["MedHouseVal"] * 100000,
        cmap="coolwarm",
        alpha=0.6,
        s=df["Population"] / 100,
        edgecolors="none"
    )
    cbar = plt.colorbar(scatter)
    cbar.set_label("Median House Value ($ USD)", color="#94a3b8")
    plt.title("California Block Groups: Geography & Valuation", fontsize=14, color="#38bdf8", pad=15)
    plt.xlabel("Longitude (° W)")
    plt.ylabel("Latitude (° N)")
    plt.tight_layout()
    map_plot_path = artifacts_dir / "california_housing_map.png"
    plt.savefig(map_plot_path, dpi=200)
    plt.close()

    # 3. Feature Distributions
    feature_cols = [c for c in df.columns if c != "MedHouseVal"]
    fig, axes = plt.subplots(nrows=3, ncols=3, figsize=(14, 11))
    axes = axes.flatten()
    for idx, col in enumerate(df.columns):
        if idx < len(axes):
            # Clip high outliers for visualization readability
            p99 = df[col].quantile(0.99)
            data_to_plot = df[col].clip(upper=p99)
            sns.histplot(data_to_plot, ax=axes[idx], color="#06b6d4", kde=True, bins=30)
            axes[idx].set_title(col, color="#38bdf8")
    plt.suptitle("Dataset Distributions (99th percentile view)", fontsize=16, color="#f1f5f9", y=1.02)
    plt.tight_layout()
    dist_plot_path = artifacts_dir / "feature_distributions.png"
    plt.savefig(dist_plot_path, dpi=200)
    plt.close()

    # Build JSON summary for frontend consumption
    summary_stats = {}
    for col in df.columns:
        desc = df[col].describe()
        summary_stats[col] = {
            "mean": round(float(desc["mean"]), 3),
            "std": round(float(desc["std"]), 3),
            "min": round(float(desc["min"]), 3),
            "p25": round(float(desc["25%"]), 3),
            "median": round(float(desc["50%"]), 3),
            "p75": round(float(desc["75%"]), 3),
            "max": round(float(desc["max"]), 3),
            "corr_with_target": round(float(corr.loc[col, "MedHouseVal"]), 3)
        }

    # Binned distribution for target MedHouseVal (USD)
    hist, bin_edges = np.histogram(df["MedHouseVal"] * 100000, bins=12)
    price_distribution = []
    for i in range(len(hist)):
        price_distribution.append({
            "range": f"${int(bin_edges[i] // 1000)}k - ${int(bin_edges[i+1] // 1000)}k",
            "count": int(hist[i]),
            "min_val": round(float(bin_edges[i]), 0),
            "max_val": round(float(bin_edges[i+1]), 0)
        })

    dataset_summary = {
        "total_records": len(df),
        "total_features": len(feature_cols),
        "target_column": "MedHouseVal",
        "target_multiplier": 100000,
        "feature_names": feature_cols,
        "summary_statistics": summary_stats,
        "price_distribution": price_distribution,
        "correlation_matrix": corr.round(3).to_dict()
    }

    summary_file = artifacts_dir / "dataset_summary.json"
    with open(summary_file, "w") as f:
        json.dump(dataset_summary, f, indent=2)

    return dataset_summary


def generate_evaluation_artifacts(
    y_test: np.ndarray,
    y_pred: np.ndarray,
    model_name: str,
    artifacts_dir: Path
) -> Dict[str, Any]:
    """
    Generates actual vs predicted and residual diagnostic plots and JSON.
    """
    artifacts_dir.mkdir(parents=True, exist_ok=True)
    residuals = y_test - y_pred

    # 1. Actual vs Predicted Plot
    plt.figure(figsize=(8, 6))
    plt.scatter(y_test * 100000, y_pred * 100000, alpha=0.3, color="#22d3ee", s=15)
    min_val = min(y_test.min(), y_pred.min()) * 100000
    max_val = max(y_test.max(), y_pred.max()) * 100000
    plt.plot([min_val, max_val], [min_val, max_val], color="#f43f5e", linestyle="--", linewidth=2, label="Ideal 1:1 Line")
    plt.title(f"Actual vs. Predicted ({model_name})", fontsize=14, color="#38bdf8", pad=15)
    plt.xlabel("Actual Value ($ USD)")
    plt.ylabel("Predicted Value ($ USD)")
    plt.legend()
    plt.tight_layout()
    plt.savefig(artifacts_dir / "actual_vs_predicted.png", dpi=200)
    plt.close()

    # 2. Residual Plot
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))
    ax1.scatter(y_pred * 100000, residuals * 100000, alpha=0.3, color="#a855f7", s=15)
    ax1.axhline(0, color="#f43f5e", linestyle="--", linewidth=1.5)
    ax1.set_title("Residuals vs. Fitted Values", color="#38bdf8")
    ax1.set_xlabel("Fitted Values ($ USD)")
    ax1.set_ylabel("Residuals ($ USD)")

    sns.histplot(residuals * 100000, ax=ax2, kde=True, color="#06b6d4", bins=40)
    ax2.axvline(0, color="#f43f5e", linestyle="--", linewidth=1.5)
    ax2.set_title("Residual Error Distribution", color="#38bdf8")
    ax2.set_xlabel("Residual ($ USD)")
    plt.tight_layout()
    plt.savefig(artifacts_dir / "residual_plot.png", dpi=200)
    plt.close()

    # Create sampled actual-vs-predicted points for frontend Recharts
    indices = np.random.RandomState(42).choice(len(y_test), size=min(120, len(y_test)), replace=False)
    sample_points = []
    for idx in sorted(indices):
        act = float(y_test[idx] * 100000)
        prd = float(y_pred[idx] * 100000)
        sample_points.append({
            "id": int(idx),
            "actual": round(act, 2),
            "predicted": round(prd, 2),
            "residual": round(act - prd, 2),
            "abs_error": round(abs(act - prd), 2),
        })

    # Residual distribution bins for frontend Recharts
    r_hist, r_bins = np.histogram(residuals * 100000, bins=16)
    residual_distribution = []
    for i in range(len(r_hist)):
        residual_distribution.append({
            "range": f"${int(r_bins[i] // 1000)}k to ${int(r_bins[i+1] // 1000)}k",
            "count": int(r_hist[i]),
            "bin_center": round(float((r_bins[i] + r_bins[i+1]) / 2), 0)
        })

    test_metrics = calculate_metrics(y_test, y_pred)
    evaluation_data = {
        "model_name": model_name,
        "metrics": test_metrics,
        "sample_comparisons": sample_points,
        "residual_distribution": residual_distribution,
    }

    with open(artifacts_dir / "test_evaluation.json", "w") as f:
        json.dump(evaluation_data, f, indent=2)

    return evaluation_data


def generate_model_comparison_artifacts(
    models_results: List[Dict[str, Any]],
    artifacts_dir: Path
) -> None:
    """
    Creates bar chart and JSON comparing all evaluated models.
    """
    artifacts_dir.mkdir(parents=True, exist_ok=True)
    df_results = pd.DataFrame(models_results)

    # Plot Comparison
    fig, axes = plt.subplots(1, 3, figsize=(16, 5))
    metrics_to_plot = [
        ("r2_cv_mean", "Cross-Validation R² (Higher is Better)", "#06b6d4"),
        ("rmse_cv_mean", "Cross-Validation RMSE (Lower is Better)", "#8b5cf6"),
        ("mae_cv_mean", "Cross-Validation MAE (Lower is Better)", "#ec4899"),
    ]

    for ax, (metric, title, color) in zip(axes, metrics_to_plot):
        if metric in df_results.columns:
            sns.barplot(data=df_results, x="name", y=metric, ax=ax, palette=[color] * len(df_results))
            ax.set_title(title, fontsize=12, color="#38bdf8")
            ax.set_xlabel("")
            ax.set_ylabel("")
            ax.tick_params(axis="x", rotation=20)

    plt.suptitle("Model Benchmark Comparison", fontsize=15, color="#f1f5f9", y=1.02)
    plt.tight_layout()
    plt.savefig(artifacts_dir / "model_comparison.png", dpi=200)
    plt.close()

    # Save JSON
    with open(artifacts_dir / "model_comparison.json", "w") as f:
        json.dump(models_results, f, indent=2)
