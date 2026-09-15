# Deliverable 04 — Real Input Agent Traces

**Workflow:** Customer Health - Risk Detection (Module 3 - Multi-Agent)
**Workflow ID:** `5ZoogSUNDq82G5hf` · **n8n:** 2.38.7 · **Collected:** 2026-09-15

Three complete real executions. Every agent output in
`04_Real_Input_Agent_Traces.json` was copied verbatim from the n8n execution store
and re-verified against it after the file was written. **Nothing was simulated,
predicted or edited after execution.**

## Method

One customer per execution, isolated with a temporary `client_id` filter on
`Get row(s) in sheet`. Customer source data was never modified. The temporary
filter and the temporary CLI trigger were removed afterwards; the saved workflow
contains no test scaffolding and no pinned data.

Agent prompts, structured output schemas, output parsers and the multi-agent
topology were identical across all three runs.

## Models used

| Run | Execution | Model |
|---|---|---|
| C006 | 18 | `models/gemini-3.6-flash` |
| C008 | 28 | `models/gemini-3.1-flash-lite` |
| C005 | 29 | `models/gemini-3.1-flash-lite` |

Run 1 is preserved exactly as originally captured. Runs 2 and 3 needed a different
model: `gemini-3.6-flash` had exhausted its free-tier daily cap (20 requests per day
per model) and then returned 503; `gemini-3.7-flash` and `gemini-3.8-flash` returned
503 "experiencing high demand"; `gemini-2.5-flash` is retired for new users (404).
`gemini-3.1-flash-lite` had capacity. Only the model reference changed — no prompt,
schema or parser was altered.

## Run 1 — C006 Futura · healthy · execution 18

Input: `days_since_login 26`, `nps 9`, `support_escalated false`,
`days_until_renewal 153`, all four risk flags `false`.

```json
classifier → {"risk_level": "LOW", "risk_category": "NO_RISK", "confidence": 1}
extractor  → {"risk_signals": [],
              "key_metrics": {"usage_trend": "stable", "support_trend": "stable",
                              "renewal_window": "far"}}
reasoner   → {"requires_action": false, "action": "NO_ACTION", "priority": "LOW",
              "reason": "No risk signals detected.",
              "recommended_follow_up": "No action required."}
```

`If` emitted **0 items on the true branch, 1 on the false branch** — the workflow
stopped on its own before task creation. Composer **SKIPPED**: *no action required.*

## Run 2 — C008 Indigo Media · renewal risk · execution 28

Input: `days_since_login 25`, `nps 7`, `support_escalated false`,
`days_until_renewal 35`, only `risk_renewal true`.

```json
classifier → {"risk_level": "MEDIUM", "risk_category": "RENEWAL_RISK", "confidence": 1}
extractor  → {"risk_signals": ["renewal is in 35 days"],
              "key_metrics": {"usage_trend": "stable", "support_trend": "stable",
                              "renewal_window": "approaching"}}
reasoner   → {"requires_action": true, "action": "CREATE_CSM_TASK", "priority": "MEDIUM",
              "reason": "Renewal is in 35 days.",
              "recommended_follow_up": "Schedule a check-in before the renewal date."}
```

`If` routed to the at-risk branch (1 item true), the task payload and
`TASK-C008-2026-09-14` were built, then `If - Task Exists?` matched an existing row
and stopped the branch. Composer **SKIPPED**: *duplicate task already present.*
This is the duplicate-detection requirement working correctly.

## Run 3 — C005 Ember Agency · multiple / high risk · execution 29

Input: `days_since_login 76`, `nps 4`, `support_escalated true`,
`days_until_renewal 0`, **all four risk flags true**.

```json
classifier → {"risk_level": "HIGH", "risk_category": "SUPPORT_RISK", "confidence": 1}
extractor  → {"risk_signals": ["no login for 76 days", "NPS of 4 is low",
                               "support escalation is active", "renewal is in 0 days"],
              "key_metrics": {"usage_trend": "declining", "support_trend": "increasing",
                              "renewal_window": "approaching"}}
reasoner   → {"requires_action": true, "action": "CREATE_CSM_TASK", "priority": "HIGH",
              "reason": "The customer has an active support escalation and a renewal
                         date of 0 days.",
              "recommended_follow_up": "Contact the customer within 24 hours about the
                                        escalation."}
```

Same routing as C008: at-risk branch taken, `TASK-C005-2026-09-14` built, then
stopped by duplicate detection. Composer **SKIPPED**: *duplicate task already present.*

Note the agent separation working as designed — the Classifier resolved four
competing risks to the single most severe category (`SUPPORT_RISK`), while the
Extractor independently listed all four signals. Neither did the other's job.

## What the three runs demonstrate

- **Parallel analysis** — Classifier and Extractor ran independently from
  `Prepare Agent Input` in all three runs.
- **Combined reasoning** — `Merge Agent Analysis` paired both results onto one item
  with customer identity intact, and the Reasoner decided from the combination.
- **Correct routing in both directions** — C006 stopped at `If`; C008 and C005 passed
  it and were then stopped by duplicate detection.
- **Graded severity** — LOW → MEDIUM → HIGH across the three real customers.

## Composer Execution Note

`Slack Composer Agent` did not execute in any of the three recorded runs. In every
case this was **normal workflow routing**, not a failure and not a missing trace:

| Run | Customer | Why the Composer was not reached |
|---|---|---|
| 1 | C006 Futura | Reasoner returned `requires_action: false` / `NO_ACTION`, so `If` sent the item down the false branch and the workflow stopped before task creation. |
| 2 | C008 Indigo Media | Action **was** required (`CREATE_CSM_TASK`, MEDIUM). The task payload and `TASK-C008-2026-09-14` were built, but `If - Task Exists?` matched an existing current-week task and stopped the branch before append and Slack. |
| 3 | C005 Ember Agency | Action **was** required (`CREATE_CSM_TASK`, HIGH). Same outcome: `TASK-C005-2026-09-14` already existed, so duplicate-task detection stopped the branch. |

These are **real routing outcomes recorded by n8n**, not simulated results. Each one is
backed by the branch item counts captured in `04_Real_Input_Agent_Traces.json` under
`final_output.routing_evidence`:

- C006 — `If`: 0 items true, 1 item false.
- C008 and C005 — `If`: 1 item true; `If - Task Exists?`: 1 item on the duplicate
  branch, 0 items on the new-task branch.

Runs 2 and 3 are therefore positive evidence for two separate requirements at once:
the agent layer correctly decided that action was needed, **and** the pre-existing
duplicate-task detection correctly prevented a second task for the same customer in
the same week.

### Why no additional run was performed

A fresh read of the live **Clients** and **Tasks** sheets was carried out specifically
to find an at-risk customer with no current-week task, which would have reached the
Composer through normal routing. The result was empty:

- Seven of the eight customers (C001, C002, C003, C004, C005, C007, C008) are at risk,
  and **all seven already have a `TASK-<id>-2026-09-14` row**.
- The only customer without a current-week task is **C006**, which is not at risk.

Since no eligible customer existed, **production data was intentionally left
unchanged**. No task row was deleted, no customer record was edited, and no customer
was invented in order to force the Composer branch to run. Fabricating or forcing that
trace would have made the evidence in this deliverable unreliable.

The `task_id` format is `TASK-<client_id>-<week_start>`, so from the next week start
the at-risk customers will produce new task IDs and the branch will reach
`Append row in sheet` → `Slack Composer Agent` → `Send Slack Alert` on its own, with
no data changes required.
