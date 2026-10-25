import { NextRequest, NextResponse } from "next/server";

import { getCustomer } from "@/lib/customers";

const N8N_REQUEST_TIMEOUT_MS = 120_000;

type ErrorResponse = {
  success: false;
  error: string;
  message: string;
};

type AnalysisResult = {
  id: string;
  name: string;
  riskLevel: string;
  riskCategory: string;
  riskSignals: string[];
  priority: string;
  recommendedAction: string;
  taskStatus: string;
};

type SuccessResponse = {
  success: true;
  customer: AnalysisResult;
};

function errorResponse(
  status: number,
  error: string,
  message: string
) {
  return NextResponse.json<ErrorResponse>(
    { success: false, error, message },
    { status }
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isSuccessResponse(value: unknown): value is SuccessResponse {
  if (!isRecord(value) || value.success !== true || !isRecord(value.customer)) {
    return false;
  }

  const customer = value.customer;

  return (
    isNonEmptyString(customer.id) &&
    isNonEmptyString(customer.name) &&
    isNonEmptyString(customer.riskLevel) &&
    isNonEmptyString(customer.riskCategory) &&
    Array.isArray(customer.riskSignals) &&
    customer.riskSignals.every(isNonEmptyString) &&
    isNonEmptyString(customer.priority) &&
    typeof customer.recommendedAction === "string" &&
    isNonEmptyString(customer.taskStatus)
  );
}

async function analyze(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse(
      400,
      "INVALID_REQUEST_BODY",
      "The request body must be valid JSON."
    );
  }

  const clientId =
    typeof body === "object" && body !== null && "client_id" in body
      ? body.client_id
      : undefined;

  if (typeof clientId !== "string" || clientId.trim() === "") {
    return errorResponse(
      400,
      "MISSING_CLIENT_ID",
      "Please select a customer."
    );
  }

  const normalizedClientId = clientId.trim();

  if (!getCustomer(normalizedClientId)) {
    return errorResponse(
      400,
      "UNKNOWN_CLIENT_ID",
      "Please select one of the available demo customers."
    );
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL?.trim();
  const webhookSecret = process.env.N8N_WEBHOOK_SECRET?.trim();

  if (!webhookUrl || !webhookSecret) {
    const missingVariables = [
      !webhookUrl ? "N8N_WEBHOOK_URL" : null,
      !webhookSecret ? "N8N_WEBHOOK_SECRET" : null,
    ].filter(Boolean);

    console.error(
      `Analyze API configuration error: ${missingVariables.join(", ")} missing.`
    );

    return errorResponse(
      500,
      "N8N_WEBHOOK_NOT_CONFIGURED",
      "The analysis service is not configured."
    );
  }

  let n8nResponse: Response;

  try {
    n8nResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-N8N-Webhook-Secret": webhookSecret,
      },
      body: JSON.stringify({ client_id: normalizedClientId }),
      cache: "no-store",
      signal: AbortSignal.timeout(N8N_REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError")
    ) {
      console.error(
        `Analyze API timeout: n8n did not respond within ${N8N_REQUEST_TIMEOUT_MS}ms.`
      );

      return errorResponse(
        504,
        "N8N_REQUEST_TIMEOUT",
        "The customer analysis took too long. Please try again."
      );
    }

    console.error("Analyze API network error while contacting n8n:", error);

    return errorResponse(
      502,
      "N8N_UNREACHABLE",
      "The customer analysis service is currently unavailable."
    );
  }

  const responseText = await n8nResponse.text();
  let data: unknown;

  try {
    data = JSON.parse(responseText);
  } catch (error) {
    console.error(
      `Analyze API invalid n8n response: status=${n8nResponse.status}, content-type=${n8nResponse.headers.get("content-type") ?? "missing"}, bodyLength=${responseText.length}`,
      error
    );

    return errorResponse(
      502,
      "N8N_INVALID_RESPONSE",
      "The customer analysis service returned an invalid response."
    );
  }

  if (!n8nResponse.ok) {
    console.error(
      `Analyze API n8n HTTP error: status=${n8nResponse.status}`
    );

    return errorResponse(
      n8nResponse.status,
      "N8N_REQUEST_FAILED",
      "Unable to analyze the customer."
    );
  }

  if (!isSuccessResponse(data)) {
    console.error("Analyze API contract error: n8n returned an unexpected payload.");

    return errorResponse(
      502,
      "N8N_INVALID_CONTRACT",
      "The customer analysis service returned an incomplete result."
    );
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  try {
    return await analyze(request);
  } catch (error) {
    console.error("Unexpected Analyze API error:", error);

    return errorResponse(
      500,
      "INTERNAL_ERROR",
      "Unable to analyze the customer right now."
    );
  }
}
