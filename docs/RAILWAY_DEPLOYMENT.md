# Railway deployment for n8n

This repository deploys n8n from the root `Dockerfile`. The image is pinned to
`2.42.3`, matching the verified local instance. The Next.js application remains
under `frontend/` and keeps its independent Vercel deployment.

## Railway service

1. Create a Railway service from the GitHub repository
   `EdmondCharles1/n8n-customer-health-risk-detection` with the repository root
   as the service root. Railway will detect `Dockerfile` automatically.
2. Add a persistent volume mounted at `/home/node/.n8n` before storing any n8n
   configuration or credentials.
3. Generate a Railway public domain and route it to internal port `5678`.
4. Configure the variables below, review the staged changes, then deploy.

## Railway variables

| Variable | Value or purpose |
| --- | --- |
| `PORT` | `5678`, so Railway health checks and routing use n8n's listening port. |
| `N8N_WEBHOOK_URL` | `https://${{RAILWAY_PUBLIC_DOMAIN}}/` — current public webhook base URL. |
| `WEBHOOK_URL` | Legacy alias requested by older guides. It is deprecated since n8n 2.35.0; on 2.42.3 use `N8N_WEBHOOK_URL` instead. If temporarily set, use the same HTTPS value. |
| `N8N_EDITOR_BASE_URL` | `https://${{RAILWAY_PUBLIC_DOMAIN}}/`. |
| `N8N_PROXY_HOPS` | `1`, because Railway terminates HTTPS before forwarding to n8n. |
| `N8N_ENCRYPTION_KEY` | One long random secret. Seal it in Railway and never change or commit it after credentials are created. |
| `N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS` | `true`. |
| `N8N_USER_FOLDER` | `/home/node`, so state stays in `/home/node/.n8n`. |
| `N8N_LISTEN_ADDRESS` | `0.0.0.0`. |
| `TZ` | `America/Port-au-Prince`. |
| `GENERIC_TIMEZONE` | `America/Port-au-Prince`. |
| `RAILWAY_RUN_UID` | `0`, required because Railway volumes are mounted as root while the upstream image normally uses the `node` user. |

Do not add Google, Gemini, Slack, OAuth, Header Auth, or Vercel secrets to Git.
Store credentials only in n8n's credential store and Railway/Vercel variables.

## Workflow import

Import `workflow/customer-health-risk-detection-web-app.json` after the volume is
attached. It is an inactive 37-node template with no credential references. Its
Webhook requires Header Auth but intentionally has no credential selected.

Configure the existing Google Sheets and Gemini integrations on the Railway
instance. Create a Header Auth credential named `X-N8N-Webhook-Secret`, select it
on `Webhook - Analyze Customer`, and publish only after a controlled test.

The prepared response node is terminal: `Edit Fields` is not connected to the
optional Tasks/Slack branch. This preserves the HTTP JSON response verified with
C005 without executing that branch.

## Vercel connection

Set these server-only variables in the Vercel project and redeploy:

```dotenv
N8N_WEBHOOK_URL=https://<railway-domain>/webhook/customer-risk-analysis
N8N_WEBHOOK_SECRET=<same value as the n8n Header Auth credential>
```

Neither variable may use the `NEXT_PUBLIC_` prefix.
