import { NextRequest, NextResponse } from "next/server";

const N8N_REQUEST_TIMEOUT_MS = 120_000;

type ErrorResponse = {
  success: false;
  error: string;
  message: string;
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

  const webhookUrl = process.env.N8N_WEBHOOK_URL?.trim();

  if (!webhookUrl) {
    console.error("Analyze API configuration error: N8N_WEBHOOK_URL is missing.");

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
      },
      body: JSON.stringify({ client_id: clientId.trim() }),
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
