# Imports the repository workflow into the running n8n container via the n8n CLI.
#
# PREREQUISITE: open http://localhost:5678 and create your local owner account
# FIRST. Importing before the instance is initialised is not supported.
#
# Note on the workflow id:
# The n8n CLI importer requires a top-level "id" in the JSON and does not
# generate one (it fails with "NOT NULL constraint failed: workflow_entity.id").
# The repository JSON has none, so this script injects a generated id into a
# TEMPORARY copy and imports that. The file in ./workflow is never modified.
# Pass -Id to reuse a known id (re-importing with the same id updates the
# existing workflow instead of creating a duplicate).
#
# Credentials (Google Sheets, Slack) are NOT part of the JSON and must be
# recreated by hand in the n8n UI after the import.

param(
    [string]$File = 'customer-health-risk-detection.json',
    [string]$Id
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

$localPath = Join-Path $repoRoot "workflow\$File"
if (-not (Test-Path $localPath)) {
    Write-Error "Workflow file not found: $localPath"
}

$running = docker compose ps --status running --services
if ($running -notcontains 'n8n') {
    Write-Error "The n8n container is not running. Start it first: .\scripts\start-n8n.ps1"
}

# --- Read the workflow and check whether it already carries an id -----------
$raw = Get-Content -Path $localPath -Raw -Encoding utf8
$json = $raw | ConvertFrom-Json

if ($json.PSObject.Properties.Name -contains 'id' -and $json.id) {
    Write-Host "Workflow already has an id ($($json.id)); importing as-is." -ForegroundColor Cyan
    $containerPath = "/workflow/$File"
    $tempInContainer = $null
} else {
    if (-not $Id) {
        $alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        $Id = -join (1..16 | ForEach-Object { $alphabet[(Get-Random -Maximum $alphabet.Length)] })
    }
    Write-Host "No id in the JSON; importing a temporary copy with id '$Id'." -ForegroundColor Cyan
    Write-Host "(the file in .\workflow is left unchanged)" -ForegroundColor DarkGray

    # Textual injection right after the opening brace: every other byte of the
    # file (expressions, node parameters, accents) is preserved exactly.
    $idx = $raw.IndexOf('{')
    if ($idx -lt 0) { Write-Error "Not a JSON object: $localPath" }
    $patched = $raw.Insert($idx + 1, "`n  ""id"": ""$Id"",")

    $tempLocal = Join-Path ([System.IO.Path]::GetTempPath()) "n8n-import-$Id.json"
    Set-Content -Path $tempLocal -Value $patched -Encoding utf8NoBOM

    $tempInContainer = "/tmp/n8n-import-$Id.json"
    docker cp $tempLocal "n8n:$tempInContainer" | Out-Null
    Remove-Item $tempLocal -Force
    $containerPath = $tempInContainer
}

# --- Import ------------------------------------------------------------------
Write-Host "Importing $containerPath into n8n..." -ForegroundColor Cyan
docker compose exec n8n n8n import:workflow --input=$containerPath
$importExit = $LASTEXITCODE

if ($tempInContainer) {
    # docker cp writes as root, so the cleanup needs -u root.
    # A failed cleanup must not change the outcome of the import.
    docker compose exec -u root n8n rm -f $tempInContainer 2>&1 | Out-Null
}

if ($importExit -ne 0) {
    Write-Error "Import FAILED (exit code $importExit). See the messages above."
}

Write-Host ""
Write-Host "Import succeeded." -ForegroundColor Green
Write-Host "Next steps in the n8n UI (http://localhost:5678):"
Write-Host "  1. Create the Google Sheets and Slack credentials and attach them to the nodes."
Write-Host "  2. Replace YOUR_GOOGLE_SHEET_ID with your real spreadsheet ID."
Write-Host "  3. Replace YOUR_SLACK_CHANNEL_ID with your real Slack channel ID."
Write-Host "  4. Activate the workflow once it has been tested."
