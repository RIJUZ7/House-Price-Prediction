<#
.SYNOPSIS
    NEXUS ESTATE — Automatic Model Training & Benchmark Execution
.DESCRIPTION
    Runs the full ML pipeline: EDA, 5-fold cross validation, model selection,
    metrics calculation, and model serialization.
#>

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  NEXUS ESTATE — MODEL TRAINING & BENCHMARKING" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

if (Test-Path -Path ".venv\Scripts\python.exe") {
    $pythonCmd = ".venv\Scripts\python.exe"
} else {
    $pythonCmd = "python"
}

& $pythonCmd backend\train.py
