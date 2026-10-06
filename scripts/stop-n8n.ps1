# Stops the local n8n instance.
# The named volume n8n_data is intentionally preserved:
# this script never uses "docker compose down -v".

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

docker compose down

Write-Host ""
Write-Host "n8n stopped. The n8n_data volume (database, workflows, credentials) is kept." -ForegroundColor Yellow
