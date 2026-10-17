<#
.SYNOPSIS
    NEXUS ESTATE — Launch FastAPI Backend Server
.DESCRIPTION
    Runs Uvicorn ASGI server with live reloading on http://127.0.0.1:8000
#>

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  NEXUS ESTATE — LAUNCHING FASTAPI BACKEND (PORT 8000)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

if (Test-Path -Path ".venv\Scripts\python.exe") {
    $pythonCmd = ".venv\Scripts\python.exe"
} else {
    $pythonCmd = "python"
}

& $pythonCmd -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
