"""
NEXUS ESTATE — Automatic Model Training & Artifact Generation Script

Execute this script with a single command:
    python backend/train.py
or:
    cd backend && python train.py
"""

import sys
from pathlib import Path

# Ensure backend and project root are in sys.path
CURRENT_FILE = Path(__file__).resolve()
BACKEND_DIR = CURRENT_FILE.parent
PROJECT_ROOT = BACKEND_DIR.parent

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from backend.app.config import settings
from backend.app.ml.trainer import train_and_evaluate_pipeline


def main():
    try:
        results = train_and_evaluate_pipeline(
            data_dir=settings.DATA_DIR,
            models_dir=settings.MODELS_DIR,
            artifacts_dir=settings.ARTIFACTS_DIR,
            random_seed=42,
        )
        print(f"\nSuccessfully trained: {results['model_name']}")
        print(f"Test R2 Score: {results['test_metrics']['r2']}")
        print(f"Test RMSE:     ${results['test_metrics']['rmse_usd']:,.2f} USD")
        print(f"Artifacts:     {settings.ARTIFACTS_DIR}")
        print(f"Model path:    {results['pipeline_file']}")
    except Exception as exc:
        print(f"\n[ERROR] Pipeline training failed: {exc}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
