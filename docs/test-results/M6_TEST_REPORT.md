# M6 Test Report

Generated on 2026-10-30 from a local run in `frontend/` (Windows 11, Node.js
24.22.1, Vitest 4.1.12, V8 coverage provider). All figures below are copied
from real command output; none are estimated.

GitHub Actions CI (`.github/workflows/tests.yml`) is configured but has not
yet been verified with a run on GitHub.

## 1. Unit and API tests (mocked): `npm run test:coverage`

| Result | Count |
| --- | --- |
| Test files | 4 passed |
| Tests passed | **56** |
| Tests failed | **0** |
| Tests skipped | **0** |

| Test file | Tests | What it protects |
| --- | --- | --- |
| `src/app/api/analyze/route.test.ts` | 35 | Request validation, configuration, the n8n call (URL, secret header, trimmed ID, no-store, timeout signal), response contract validation, every upstream failure path, and no secret leaking into responses or logs |
| `src/components/RiskBadge.test.ts` | 12 | `getTone`, which maps free-form AI `riskLevel` / `priority` values to display tones |
| `src/lib/customers.test.ts` | 5 | Demo customer catalog and `getCustomer` lookup |
| `src/lib/navigation.test.ts` | 4 | `isActivePath` and the navigation lists |

The n8n Webhook is replaced by a mocked `fetch` in these tests. They prove the
API route's behavior, **not** that the live n8n workflow works.

### Mutation check

To confirm that the tests detect real regressions, four deliberate bugs were
injected into `route.ts` one at a time and then reverted (the final diff of
`route.ts` is empty):

| Injected regression | Tests that failed |
| --- | --- |
| Timeout returns 502 instead of 504 | 2 |
| `X-N8N-Webhook-Secret` header removed | 1 |
| `riskSignals` item validation removed | 2 |
| `client_id` no longer trimmed | 1 |

## 2. Coverage (V8)

**Measured scope:** `src/app/api/**/*.ts`, `src/lib/**/*.ts` and
`src/components/RiskBadge.tsx`, which are the server API route and the
non-visual modules that hold business logic. React pages and the other UI
components are **not** measured. These percentages are therefore not
whole-application coverage.

| Metric | Covered | Percentage |
| --- | --- | --- |
| Statements | 62 / 65 | **95.38%** |
| Branches | 57 / 63 | **90.47%** |
| Functions | 10 / 11 | **90.90%** |
| Lines | 61 / 64 | **95.31%** |

| File | Statements | Branches | Functions | Lines | Notes |
| --- | --- | --- | --- | --- | --- |
| `app/api/analyze/route.ts` | 100% (46/46) | 97.91% (47/48) | 100% (6/6) | 100% (46/46) | Uncovered branch: `content-type ?? "missing"` in a log message |
| `lib/customers.ts` | 100% (3/3) | 100% (0/0) | 100% (2/2) | 100% (2/2) | |
| `lib/navigation.ts` | 100% (4/4) | 100% (4/4) | 100% (1/1) | 100% (4/4) | |
| `components/RiskBadge.tsx` | 75% (9/12) | 54.54% (6/11) | 50% (1/2) | 75% (9/12) | `getTone` is fully tested; the JSX `RiskBadge` component (lines 60–66) is not rendered in tests |

Vitest's terminal table omits files that are 100% covered; the per-file values
above come from `coverage/coverage-summary.json`. The HTML report is written
to `frontend/coverage/index.html` (gitignored, and uploaded as a CI artifact).

## 3. Live n8n integration test: `npm run test:integration`

Target: local n8n at `http://localhost:5678/webhook/customer-risk-analysis`
(`/healthz` returned 200). No mocks are used: the requests reach the real
`Customer Health - Web App MVP` workflow, which reads Google Sheets and runs
the Gemini agents.

| Test | Result |
| --- | --- |
| n8n Webhook rejects a request without the secret (401/403) | **PASSED**: the workflow is active and enforces Header Auth |
| C005 analyzed end-to-end through the Webhook (Google Sheets + Gemini) | **PASSED** |
| C005 analyzed through `POST /api/analyze` → real n8n | **PASSED** |

**Summary: 3 passed, 0 failed, run in 17.31 s.**

For each C005 analysis the test checks HTTP 200, `success: true`,
`customer.id === "C005"` and the customer name. It also checks that
`riskLevel`, `riskCategory`, `priority` and `taskStatus` are non-empty
strings, that `riskSignals` is a non-empty array of non-empty strings, and
that `recommendedAction` is not empty. Gemini's exact wording is not asserted.

The live test was run in two steps:

1. The first run had no `N8N_WEBHOOK_SECRET` in the local environment. Only
   the authentication check could run, and it passed. The two analysis tests
   failed with the explicit message `Live integration test not configured:
   N8N_WEBHOOK_SECRET missing.` They are designed to fail rather than skip, so
   a missing configuration can never look like a passing live run.
2. The project owner then added the secret to `frontend/.env.local`
   (gitignored) and ran `npm run test:integration`. All 3 tests passed.

The secret value does not appear in the repository, the test output or this
report.

## 4. Other validation

| Check | Command | Result |
| --- | --- | --- |
| Lint | `npm run lint` | Passed (0 errors, 0 warnings) |
| Type check | `npx tsc --noEmit` | Passed |
| Production build | `npm run build` (`next build --webpack`) | Passed; all 13 pages and `/api/analyze` compiled |
