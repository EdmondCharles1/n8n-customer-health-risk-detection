# M6 — Production Hardening: Path 1, Test it

**Project:** n8n Customer Health Risk Detection
**Live app:** https://n8n-customer-health-risk-detection.vercel.app
**Date:** 2026-10-30

## Acceptance Criteria

| # | Criterion | Status | Evidence |
| --- | --- | --- | --- |
| 1 | One-paragraph path justification | Complete | Section A |
| 2 | Meaningful test suite on critical paths | Complete | 56 unit/API tests; the regression check caught 4 of 4 injected bugs |
| 3 | Unit tests on data transformations | Complete | `getCustomer`, `getTone`, `isActivePath`, contract validation |
| 4 | Genuine n8n/LLM end-to-end integration test | Complete | 3 live tests passed against real n8n, Google Sheets and Gemini |
| 5 | Test report with a real coverage percentage | Complete | [M6 test report](test-results/M6_TEST_REPORT.md): 95.31% of lines in the measured scope |
| 6 | README: running tests locally and in CI | Complete | README section "Testing & Production Hardening (M6)" |
| 7 | 300-word reflection | Complete | Section C |

## A. Path Selection Justification

I chose Path 1 (Test it) because almost every problem I hit during M5 was found
by hand, late, and often during a demo run. These included expired Google OAuth
credentials that silently broke the Sheets read, HTTP 500 errors when
environment variables were missing, 502 Bad Gateway responses when n8n returned
an HTML error page or the reverse SSH tunnel had disconnected, 504 timeouts
while the Gemini agents were still running, and a frontend build failure that
only showed up at deploy time. Each time, the only way to know whether the
system worked was to click through the app and read logs, so I could never tell
whether a fix to one layer had broken another. Every one of those failures maps
to a specific branch in `/api/analyze`, which makes them ideal for testing.
Mocked unit and API tests can reproduce each failure deterministically in
milliseconds, and a separate live test can confirm that the real n8n, Google
Sheets and Gemini chain still honors the contract. Testing is the hardening step
that turns "it worked during the demo" into something I can check again on
every change. It is also the foundation the other paths need: observability or
cost work is much safer once regressions are caught automatically.

## B. Test Results

All results below come from real runs on 2026-10-30. Full details are in
[test-results/M6_TEST_REPORT.md](test-results/M6_TEST_REPORT.md).

| Item | Result |
| --- | --- |
| Framework | Vitest 4.1.12 (Node environment) with V8 coverage |
| Unit/API tests | **56 passed, 0 failed, 0 skipped** (4 test files) |
| Coverage (measured scope) | Statements **95.38%**, Branches **90.47%**, Functions **90.90%**, Lines **95.31%** |
| Coverage scope | `src/app/api/**`, `src/lib/**` and `src/components/RiskBadge.tsx`; UI pages and other components are not measured |
| Regression check | 4 bugs injected into `route.ts` one at a time; each one made at least one test fail |
| CI | `.github/workflows/tests.yml`: `npm ci`, lint, and tests with coverage on pushes to `main` and on PRs, with no secrets. It is configured but **not yet verified with a run on GitHub**. |
| Lint / type check / build | All passed (`npm run lint`, `tsc --noEmit`, `npm run build` with Webpack) |
| Live n8n integration | **3 passed, 0 failed (17.31 s)**, with no mocks. The real Webhook rejected an unauthenticated request; C005 was analyzed end-to-end through the n8n Webhook (Google Sheets + Gemini); and C005 was analyzed through the Next.js `/api/analyze` route. |

The live tests check HTTP 200, `success: true`, `customer.id === "C005"`,
non-empty `riskLevel`, `riskCategory`, `priority` and `taskStatus`, a
non-empty `riskSignals` array of strings, and a non-empty `recommendedAction`.
They do not depend on Gemini's exact wording. The coverage figures come from
the mocked suite only.

The 35 API route tests cover request validation, missing configuration, the
exact call made to n8n, contract validation of the AI output, and every
upstream failure mode seen in M5: non-JSON or HTML responses, HTTP errors,
timeouts and network failures. They also check that the webhook secret never
leaks into responses or logs.

**Remaining limitations**

- React components have no rendering or browser tests.
- The live test depends on local n8n, valid Google OAuth and Gemini quota, so it
  is run manually and not in CI. Its pass reflects one point in time.
- The public deployment still relies on n8n running on a local machine, reached
  from the VPS through a reverse SSH tunnel.
- The GitHub Actions workflow has not yet been verified on GitHub.
- The n8n workflow's internal risk rules and prompts are only checked through
  their HTTP output.

## C. Reflection

<!-- ~300 words -->

Before this module, I thought my project was working because I had seen it
work. The Demo Day run for C005 produced a convincing risk analysis, and that
felt like proof. M5 showed me how fragile that proof was: the same app failed
when an OAuth token expired, when the SSH tunnel dropped, and when Gemini took
too long. A successful demo shows that one path worked once. A reliable
application keeps doing the right thing when things around it go wrong.

That is why most of my tests are about failures. The happy path is only a few
tests, and the rest check what the user sees when n8n returns HTML instead of
JSON, when the request times out, or when the AI returns an incomplete object.
Writing them made me reread my own error handling carefully. For example, I
learned that an Nginx 502 page is reported as an invalid response before its
status is even checked.

Isolated unit tests gave me speed and certainty. They run in under a second,
need no credentials, and can run in CI on every pull request. When I injected
deliberate bugs into the API route, the tests caught every one.

Still, a mocked test can only confirm my own assumptions about n8n. Only the
live integration test can show that Google Sheets, Gemini and the workflow
still honor the contract. I designed it to check structure instead of exact
wording, because LLM output varies. Its first run failed on purpose because the
webhook secret was missing, which showed that a misconfiguration cannot pass
silently. Once configured, all three live tests passed in about 17 seconds.

The biggest lesson about external APIs is that every dependency is a failure
mode I need to name and handle. Tests now give me a safety net before each
deployment. What still needs work is UI tests, monitoring of the live path, and
removing the dependency on my local machine.
