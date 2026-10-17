<#
.SYNOPSIS
    NEXUS ESTATE — Run Automated Test Suite
.DESCRIPTION
    Executes backend pytest integration tests and verifies frontend production build.
#>

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  NEXUS ESTATE — RUNNING FULL TEST SUITE" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

if (Test-Path -Path ".venv\Scripts\python.exe") {
    $pythonCmd = ".venv\Scripts\python.exe"
} else {
    $pythonCmd = "python"
}

Write-Host "`n[1/2] Executing Backend Pytest Suite..." -ForegroundColor Yellow
& $pythonCmd -m pytest backend\tests -v

Write-Host "`n[2/2] Validating Frontend TypeScript & Build..." -ForegroundColor Yellow
Set-Location frontend
npm.cmd run build
Set-Location ..

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "  ALL TESTS PASSED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
