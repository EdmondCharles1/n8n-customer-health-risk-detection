# Shows the state of the n8n container and of its persistent volume.

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

Write-Host "=== Containers ===" -ForegroundColor Cyan
docker compose ps

Write-Host ""
Write-Host "=== Persistent volume ===" -ForegroundColor Cyan
docker volume ls --filter "name=n8n_data"
