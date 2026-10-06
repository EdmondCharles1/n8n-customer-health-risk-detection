import { NextRequest, NextResponse } from "next/server";

const customers = [
  {
    id: "C005",
    name: "Ember Agency",
    riskLevel: "HIGH",
    riskCategory: "SUPPORT_RISK",
    riskSignals: [
      "no login for 75 days",
      "NPS of 4 is below 7",
      "support escalation is active",
      "renewal is in 1 day",
    ],
    priority: "HIGH",
    recommendedAction:
      "Contact the customer within 24 hours about the escalation.",
    taskStatus: "DUPLICATE",
  },
  {
    id: "C006",
    name: "Futura",
    riskLevel: "LOW",
    riskCategory: "NO_RISK",
    riskSignals: [],
    priority: "LOW",
    recommendedAction: "No action required.",
    taskStatus: "NO_ACTION",
  },
  {
    id: "C008",
    name: "Indigo Media",
    riskLevel: "MEDIUM",
    riskCategory: "RENEWAL_RISK",
    riskSignals: ["renewal is in 36 days"],
    priority: "MEDIUM",
    recommendedAction:
      "Schedule a check-in before the renewal date.",
    taskStatus: "DUPLICATE",
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { client_id } = body;

    if (!client_id) {
      return NextResponse.json(
        {
          success: false,
          error: "MISSING_CLIENT_ID",
          message: "client_id is required.",
        },
        { status: 400 }
      );
    }

    const customer = customers.find(
      (customer) => customer.id === client_id
    );

    if (!customer) {
      return NextResponse.json(
        {
          success: false,
          error: "CUSTOMER_NOT_FOUND",
          message: "Customer not found.",
        },
        { status: 404 }
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 1200));

    return NextResponse.json({
      success: true,
      customer,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_ERROR",
        message: "Unable to analyze the customer.",
      },
      { status: 500 }
    );
  }
}