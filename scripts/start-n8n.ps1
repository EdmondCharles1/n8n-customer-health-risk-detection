# Starts the local n8n instance (detached).
# Run from anywhere: the script resolves the repository root itself.

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

if (-not (Test-Path '.env')) {
    Write-Error "Missing .env file. Copy it first:  Copy-Item .env.example .env  then set N8N_ENCRYPTION_KEY."
}

docker compose up -d
docker compose ps

Write-Host ""
Write-Host "n8n is starting. Open http://localhost:5678" -ForegroundColor Green
