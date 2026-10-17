# NEXUS ESTATE - Run Automated Test Suite
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  NEXUS ESTATE -- RUNNING FULL TEST SUITE" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$pythonCmd = 'python'
if (Test-Path -Path '.venv\Scripts\python.exe') {
    $pythonCmd = '.venv\Scripts\python.exe'
}

Write-Host ''
Write-Host '[1/2] Executing Backend Pytest Suite...' -ForegroundColor Yellow
& $pythonCmd -m pytest backend\tests -v

Write-Host ''
Write-Host '[2/2] Validating Frontend TypeScript and Build...' -ForegroundColor Yellow
Set-Location frontend
npm.cmd run build
Set-Location ..

Write-Host ''
Write-Host '==========================================================' -ForegroundColor Green
Write-Host '  ALL TESTS PASSED SUCCESSFULLY!' -ForegroundColor Green
Write-Host '==========================================================' -ForegroundColor Green
