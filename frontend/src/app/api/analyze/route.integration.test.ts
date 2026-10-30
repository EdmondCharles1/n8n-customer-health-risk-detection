import { NextRequest } from "next/server";
import { beforeAll, describe, expect, it } from "vitest";

import { POST } from "./route";

// LIVE integration test — nothing is mocked.
//
// It sends real HTTP requests to the n8n Webhook configured by
// N8N_WEBHOOK_URL / N8N_WEBHOOK_SECRET (read from the environment or
// frontend/.env.local). The workflow reads Google Sheets and runs the Gemini
// agents. The Web App Webhook path is read-only: it does not append tasks or
// send Slack messages.
//
// Run with `npm run test:integration`. It is never part of `npm test` or CI.

const CUSTOMER_ID = "C005";
const CUSTOMER_NAME = "Ember Agency";

const webhookUrl = process.env.N8N_WEBHOOK_URL?.trim() ?? "";
const webhookSecret = process.env.N8N_WEBHOOK_SECRET?.trim() ?? "";

// Structure and business rules only: Gemini wording and classifications may
// change between runs, so no generated sentence is asserted verbatim.
function expectValidAnalysis(body: unknown) {
  expect(body).toMatchObject({ success: true });

  const { customer } = body as { customer: Record<string, unknown> };

  expect(customer.id).toBe(CUSTOMER_ID);
  expect(customer.name).toBe(CUSTOMER_NAME);

  for (const field of ["riskLevel", "riskCategory", "priority", "taskStatus"]) {
    expect(typeof customer[field], field).toBe("string");
    expect((customer[field] as string).trim(), field).not.toBe("");
  }

  expect(Array.isArray(customer.riskSignals)).toBe(true);
  const signals = customer.riskSignals as unknown[];
  for (const signal of signals) {
    expect(typeof signal).toBe("string");
    expect((signal as string).trim()).not.toBe("");
  }

  expect(typeof customer.recommendedAction).toBe("string");

  // C005 is the at-risk demo customer (long inactivity, low NPS, escalated
  // support), so a real analysis must surface signals and an action.
  expect(signals.length).toBeGreaterThan(0);
  expect((customer.recommendedAction as string).trim()).not.toBe("");
}

// Fail loudly (never skip) so a missing configuration cannot be mistaken
// for a passing live run.
function requireConfig(variable: string, value: string) {
  if (!value) {
    throw new Error(
      `Live integration test not configured: ${variable} missing. ` +
        "Set it in frontend/.env.local or the shell environment."
    );
  }
}

beforeAll(() => requireConfig("N8N_WEBHOOK_URL", webhookUrl));

describe("n8n Webhook — live", () => {
  it("rejects a request without the webhook secret", async () => {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: CUSTOMER_ID }),
    });

    expect([401, 403]).toContain(response.status);
  });

  it(`analyses ${CUSTOMER_ID} end-to-end (Google Sheets + Gemini)`, async () => {
    requireConfig("N8N_WEBHOOK_SECRET", webhookSecret);

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-N8N-Webhook-Secret": webhookSecret,
      },
      body: JSON.stringify({ client_id: CUSTOMER_ID }),
    });

    expect(response.status).toBe(200);
    expectValidAnalysis(await response.json());
  });
});

describe("POST /api/analyze → n8n — live", () => {
  it(`returns a validated analysis for ${CUSTOMER_ID} through the API route`, async () => {
    requireConfig("N8N_WEBHOOK_SECRET", webhookSecret);

    const request = new NextRequest("http://localhost/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: CUSTOMER_ID }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status, JSON.stringify(body)).toBe(200);
    expectValidAnalysis(body);
  });
});
