<#
.SYNOPSIS
    NEXUS ESTATE — Environment Setup Script for Windows PowerShell
.DESCRIPTION
    Sets up Python virtual environment, installs backend dependencies,
    and installs frontend npm dependencies.
#>

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  NEXUS ESTATE — ENVIRONMENT SETUP" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Setup Python Virtual Environment
if (-not (Test-Path -Path ".venv")) {
    Write-Host "`n[1/3] Creating Python virtual environment (.venv)..." -ForegroundColor Yellow
    python -m venv .venv
} else {
    Write-Host "`n[1/3] Python virtual environment (.venv) already exists." -ForegroundColor Green
}

# 2. Install Python Dependencies
Write-Host "`n[2/3] Installing Python backend dependencies..." -ForegroundColor Yellow
& .venv\Scripts\python.exe -m pip install --upgrade pip
& .venv\Scripts\python.exe -m pip install -r backend\requirements.txt

# 3. Install Frontend Dependencies
Write-Host "`n[3/3] Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm.cmd install
Set-Location ..

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "  SETUP COMPLETE!" -ForegroundColor Green
Write-Host "  Next steps:" -ForegroundColor White
Write-Host "    1. Train Model:   powershell -ExecutionPolicy Bypass -File .\train.ps1" -ForegroundColor Cyan
Write-Host "    2. Start Backend: powershell -ExecutionPolicy Bypass -File .\start-backend.ps1" -ForegroundColor Cyan
Write-Host "    3. Start UI:      powershell -ExecutionPolicy Bypass -File .\start-frontend.ps1" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Green
