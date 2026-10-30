import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "./route";

// Unit/API tests for POST /api/analyze. The n8n Webhook is replaced by a
// mocked `fetch`; nothing here contacts n8n, Google Sheets or Gemini.
// See route.integration.test.ts for the live end-to-end test.

const WEBHOOK_URL = "https://n8n.test/webhook/customer-risk-analysis";
const WEBHOOK_SECRET = "unit-test-secret-value";

const validAnalysis = {
  success: true,
  customer: {
    id: "C005",
    name: "Ember Agency",
    riskLevel: "HIGH",
    riskCategory: "SUPPORT_RISK",
    riskSignals: [
      "no login for 118 days",
      "NPS of 4 is below 7",
      "support is escalated",
    ],
    priority: "HIGH",
    recommendedAction:
      "contact the customer within 24 hours about the escalation.",
    taskStatus: "RISK_DETECTED",
  },
};

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

let fetchMock: ReturnType<typeof vi.fn>;
let consoleErrorMock: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  vi.stubEnv("N8N_WEBHOOK_URL", WEBHOOK_URL);
  vi.stubEnv("N8N_WEBHOOK_SECRET", WEBHOOK_SECRET);

  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);

  // The route logs diagnostics with console.error; keep test output clean
  // and let individual tests inspect what was logged.
  consoleErrorMock = vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("POST /api/analyze — request validation", () => {
  it("rejects a body that is not valid JSON", async () => {
    const response = await POST(makeRequest("{not json"));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      success: false,
      error: "INVALID_REQUEST_BODY",
      message: "The request body must be valid JSON.",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    ["no client_id", {}],
    ["empty client_id", { client_id: "" }],
    ["whitespace client_id", { client_id: "   " }],
    ["non-string client_id", { client_id: 5 }],
    ["null body", null],
  ])("rejects a request with %s", async (_label, body) => {
    const response = await POST(makeRequest(body));

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      success: false,
      error: "MISSING_CLIENT_ID",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects an unknown customer ID without calling n8n", async () => {
    const response = await POST(makeRequest({ client_id: "C999" }));

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      success: false,
      error: "UNKNOWN_CLIENT_ID",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("POST /api/analyze — configuration", () => {
  it.each([
    ["N8N_WEBHOOK_URL", "N8N_WEBHOOK_URL"],
    ["N8N_WEBHOOK_SECRET", "N8N_WEBHOOK_SECRET"],
  ])("returns 500 when %s is missing", async (_label, variable) => {
    vi.stubEnv(variable, "");

    const response = await POST(makeRequest({ client_id: "C005" }));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      success: false,
      error: "N8N_WEBHOOK_NOT_CONFIGURED",
      message: "The analysis service is not configured.",
    });
    expect(fetchMock).not.toHaveBeenCalled();
    // The log names the missing variable so operators can fix it.
    expect(String(consoleErrorMock.mock.calls[0][0])).toContain(variable);
  });

  it("treats whitespace-only configuration as missing", async () => {
    vi.stubEnv("N8N_WEBHOOK_SECRET", "   ");

    const response = await POST(makeRequest({ client_id: "C005" }));

    expect(response.status).toBe(500);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("POST /api/analyze — successful n8n analysis", () => {
  it("calls the n8n Webhook with the secret header and trimmed client_id", async () => {
    fetchMock.mockResolvedValue(jsonResponse(validAnalysis));

    await POST(makeRequest({ client_id: "  C005 " }));

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0];

    expect(url).toBe(WEBHOOK_URL);
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({
      "Content-Type": "application/json",
      "X-N8N-Webhook-Secret": WEBHOOK_SECRET,
    });
    expect(JSON.parse(init.body)).toEqual({ client_id: "C005" });
    expect(init.cache).toBe("no-store");
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it("returns the validated n8n analysis unchanged", async () => {
    fetchMock.mockResolvedValue(jsonResponse(validAnalysis));

    const response = await POST(makeRequest({ client_id: "C005" }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual(validAnalysis);
    expect(JSON.stringify(body)).not.toContain(WEBHOOK_SECRET);
  });

  it("accepts an analysis with no risk signals (healthy customer)", async () => {
    const healthy = {
      success: true,
      customer: {
        ...validAnalysis.customer,
        id: "C006",
        name: "Futura",
        riskLevel: "LOW",
        riskSignals: [],
        recommendedAction: "",
        taskStatus: "NO_ACTION",
      },
    };
    fetchMock.mockResolvedValue(jsonResponse(healthy));

    const response = await POST(makeRequest({ client_id: "C006" }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(healthy);
  });
});

describe("POST /api/analyze — n8n contract validation", () => {
  const { customer } = validAnalysis;

  it.each([
    ["success is false", { success: false, customer }],
    ["customer is missing", { success: true }],
    ["customer id is empty", { success: true, customer: { ...customer, id: "" } }],
    ["riskLevel is missing", { success: true, customer: { ...customer, riskLevel: undefined } }],
    ["riskSignals is a string", { success: true, customer: { ...customer, riskSignals: "no login" } }],
    ["riskSignals contains a non-string", { success: true, customer: { ...customer, riskSignals: ["ok", 42] } }],
    ["riskSignals contains an empty string", { success: true, customer: { ...customer, riskSignals: [" "] } }],
    ["priority is missing", { success: true, customer: { ...customer, priority: undefined } }],
    ["recommendedAction is not a string", { success: true, customer: { ...customer, recommendedAction: null } }],
    ["taskStatus is empty", { success: true, customer: { ...customer, taskStatus: "" } }],
    ["payload is an n8n item array", [validAnalysis]],
  ])("returns 502 N8N_INVALID_CONTRACT when %s", async (_label, payload) => {
    fetchMock.mockResolvedValue(jsonResponse(payload));

    const response = await POST(makeRequest({ client_id: "C005" }));

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({
      success: false,
      error: "N8N_INVALID_CONTRACT",
      message: "The customer analysis service returned an incomplete result.",
    });
  });
});

describe("POST /api/analyze — upstream failures", () => {
  it("returns 502 N8N_INVALID_RESPONSE when n8n returns non-JSON", async () => {
    fetchMock.mockResolvedValue(
      new Response("<html>Bad Gateway</html>", {
        status: 200,
        headers: { "Content-Type": "text/html" },
      })
    );

    const response = await POST(makeRequest({ client_id: "C005" }));

    expect(response.status).toBe(502);
    expect(await response.json()).toMatchObject({
      success: false,
      error: "N8N_INVALID_RESPONSE",
    });
  });

  it("returns 502 N8N_INVALID_RESPONSE for an HTML error page (e.g. Nginx 502)", async () => {
    // Non-JSON bodies are detected before the HTTP status is inspected.
    fetchMock.mockResolvedValue(
      new Response("<html>502 Bad Gateway</html>", { status: 502 })
    );

    const response = await POST(makeRequest({ client_id: "C005" }));

    expect(response.status).toBe(502);
    expect(await response.json()).toMatchObject({ error: "N8N_INVALID_RESPONSE" });
  });

  it("returns 502 N8N_INVALID_RESPONSE for an empty body", async () => {
    fetchMock.mockResolvedValue(new Response("", { status: 200 }));

    const response = await POST(makeRequest({ client_id: "C005" }));

    expect(response.status).toBe(502);
    expect(await response.json()).toMatchObject({ error: "N8N_INVALID_RESPONSE" });
  });

  it.each([
    [403, { message: "Authorization data is wrong!" }],
    [404, { code: 404, message: "The requested webhook is not registered." }],
    [500, { message: "Error in workflow" }],
  ])(
    "forwards n8n HTTP %i as N8N_REQUEST_FAILED without leaking upstream details",
    async (status, upstreamBody) => {
      fetchMock.mockResolvedValue(jsonResponse(upstreamBody, status));

      const response = await POST(makeRequest({ client_id: "C005" }));
      const body = await response.json();

      expect(response.status).toBe(status);
      expect(body).toEqual({
        success: false,
        error: "N8N_REQUEST_FAILED",
        message: "Unable to analyze the customer.",
      });
      expect(JSON.stringify(body)).not.toContain(upstreamBody.message);
    }
  );

  it.each(["TimeoutError", "AbortError"])(
    "returns 504 N8N_REQUEST_TIMEOUT when fetch fails with %s",
    async (name) => {
      fetchMock.mockRejectedValue(new DOMException("The operation timed out.", name));

      const response = await POST(makeRequest({ client_id: "C005" }));

      expect(response.status).toBe(504);
      expect(await response.json()).toEqual({
        success: false,
        error: "N8N_REQUEST_TIMEOUT",
        message: "The customer analysis took too long. Please try again.",
      });
    }
  );

  it("returns 502 N8N_UNREACHABLE on a network failure (e.g. SSH tunnel down)", async () => {
    fetchMock.mockRejectedValue(
      new TypeError("fetch failed", {
        cause: Object.assign(new Error("connect ECONNREFUSED"), {
          code: "ECONNREFUSED",
        }),
      })
    );

    const response = await POST(makeRequest({ client_id: "C005" }));

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({
      success: false,
      error: "N8N_UNREACHABLE",
      message: "The customer analysis service is currently unavailable.",
    });
  });

  it("returns 500 INTERNAL_ERROR when reading the upstream body throws", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers(),
      text: () => Promise.reject(new Error("socket hang up")),
    });

    const response = await POST(makeRequest({ client_id: "C005" }));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      success: false,
      error: "INTERNAL_ERROR",
      message: "Unable to analyze the customer right now.",
    });
  });

  it("never writes the webhook secret to the logs on failure paths", async () => {
    fetchMock
      .mockRejectedValueOnce(new TypeError("fetch failed"))
      .mockResolvedValueOnce(new Response("not json", { status: 500 }))
      .mockResolvedValueOnce(jsonResponse({ message: "boom" }, 500));

    for (let i = 0; i < 3; i++) {
      await POST(makeRequest({ client_id: "C005" }));
    }

    const logged = JSON.stringify(consoleErrorMock.mock.calls, (_key, value) =>
      value instanceof Error ? `${value.name}: ${value.message}` : value
    );

    expect(consoleErrorMock).toHaveBeenCalled();
    expect(logged).not.toContain(WEBHOOK_SECRET);
  });
});
