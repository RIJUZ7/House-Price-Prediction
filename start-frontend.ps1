<#
.SYNOPSIS
    NEXUS ESTATE — Launch Vite React Development Server
.DESCRIPTION
    Runs Vite development server on http://127.0.0.1:5173
#>

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  NEXUS ESTATE — LAUNCHING REACT VITE FRONTEND (PORT 5173)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

Set-Location frontend
npm.cmd run dev -- --host 127.0.0.1 --port 5173
Set-Location ..
