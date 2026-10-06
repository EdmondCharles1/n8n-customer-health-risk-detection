# Shows n8n logs.
#   .\scripts\logs-n8n.ps1            -> last 100 lines
#   .\scripts\logs-n8n.ps1 -Follow    -> live tail (Ctrl+C to quit)

param(
    [int]$Tail = 100,
    [switch]$Follow
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

if ($Follow) {
    docker compose logs --tail=$Tail -f n8n
} else {
    docker compose logs --tail=$Tail n8n
}
