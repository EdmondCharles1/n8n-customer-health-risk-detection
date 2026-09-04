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