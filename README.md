# n8n Customer Health Risk Detection

An n8n workflow that monitors customer health data, detects at-risk customers, creates follow-up tasks, sends Slack alerts, and logs API failures.

## Project Overview

This workflow reads customer data from Google Sheets and evaluates multiple risk indicators:

- Customer inactivity
- Low NPS score
- Support escalation
- Upcoming renewal

When a customer is considered at risk, the workflow creates a follow-up task and checks whether that task already exists before adding it to the tracking sheet.

For newly created high-priority tasks, the workflow sends a notification to Slack.

## Workflow Features

- Scheduled execution with n8n
- Google Sheets integration
- Customer risk calculation
- Conditional routing with IF nodes
- Duplicate task detection
- Dynamic task creation
- Slack API integration
- Explicit API error handling
- Error logging to Google Sheets

## Workflow Logic

```text
Schedule Trigger
      ↓
Read Customers from Google Sheets
      ↓
Calculate Customer Metrics
      ↓
Evaluate Risk Conditions
      ↓
Is Customer At Risk?
      ↓ Yes
Build Task Payload
      ↓
Generate Task ID
      ↓
Check Existing Tasks
      ↓
Task Already Exists?
      ↓ No
Append Task to Google Sheets
      ↓
Send Slack Alert
      ↓ Error
Prepare Slack Error Log
      ↓
Log Slack Error
```

## Local Development with Docker

This repository ships a small Docker Compose setup to run n8n locally on Windows
with Docker Desktop. The instance is bound to `127.0.0.1` only and is never
exposed on the network or the Internet.

### Prerequisites

- Docker Desktop for Windows (running)
- PowerShell
- `docker --version` and `docker compose version` must both answer

### 1. Create your local `.env`

```powershell
Copy-Item .env.example .env
```

Then open `.env` and set `N8N_ENCRYPTION_KEY` to a long random value, for example:

```powershell
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Max 256 }))
```

`.env` is git-ignored and must **never** be committed. Keep the encryption key
safe: if you lose it, every credential stored in n8n becomes unreadable.

### 2. Start n8n

```powershell
.\scripts\start-n8n.ps1
# or directly:
docker compose up -d
```

The editor is then available at **http://localhost:5678**.

On the very first start, create your local owner account in that interface.

### 3. Stop n8n

```powershell
.\scripts\stop-n8n.ps1
# or directly:
docker compose down
```

`docker compose down` stops the container but **keeps your data**.
Never run `docker compose down -v` unless you really want to wipe the
instance: `-v` deletes the persistent volume.

### 4. Logs and status

```powershell
.\scripts\logs-n8n.ps1            # last 100 lines
.\scripts\logs-n8n.ps1 -Follow    # live tail
.\scripts\status-n8n.ps1          # container + volume state
```

### 5. Where the data lives

All persistent state is stored in the Docker named volume `n8n_data`, mounted at
`/home/node/.n8n` inside the container. It holds:

- the n8n SQLite database
- the workflows created or imported in the instance
- the encrypted credentials
- the instance settings and local metadata

This project uses SQLite (the n8n default); no PostgreSQL is required.

### 6. Import the workflow

The `./workflow` folder is mounted read-only at `/workflow` inside the container.

Import it **after** creating your owner account:

```powershell
.\scripts\import-workflow.ps1
# or directly:
docker compose exec n8n n8n import:workflow --input=/workflow/customer-health-risk-detection.json
```

The workflow is shipped with `"active": false`, so it will not run on import.

### 7. After the import: manual configuration

The JSON contains **no credentials**. You must configure the following by hand in
the n8n interface:

- create the **Google Sheets** credential and attach it to the Google Sheets nodes
- create the **Slack** credential and attach it to the Slack node
- replace `YOUR_GOOGLE_SHEET_ID` with your real spreadsheet ID
- replace `YOUR_SLACK_CHANNEL_ID` with your real Slack channel ID

### Security notes

- Never commit `.env`
- Never commit Google OAuth secrets, Slack tokens or API keys
- Credentials belong in the n8n credential store, not in this repository
