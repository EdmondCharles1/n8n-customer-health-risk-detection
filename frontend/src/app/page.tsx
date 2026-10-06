"use client";

import { useState } from "react";

const customers = [
  {
    id: "C005",
    name: "Ember Agency",
  },
  {
    id: "C006",
    name: "Futura",
  },
  {
    id: "C008",
    name: "Indigo Media",
  },
];

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

type ApiResponse = {
  success: boolean;
  customer?: AnalysisResult;
  error?: string;
  message?: string;
};

export default function Home() {
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleAnalyze() {
    setError("");
    setResult(null);

    if (!selectedCustomerId) {
      setError(
        "Please select a customer before running the analysis."
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: selectedCustomerId,
        }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to analyze this customer."
        );
      }

      if (!data.customer) {
        throw new Error(
          "The analysis completed but no customer result was returned."
        );
      }

      setResult(data.customer);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to analyze this customer.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-indigo-600">
            Customer Success Intelligence
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Customer Health Risk Analyzer
          </h1>

          <p className="mt-3 text-slate-600">
            Select a customer and run the AI-powered customer
            health analysis.
          </p>
        </header>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <label
            htmlFor="customer"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Customer
          </label>

          <select
            id="customer"
            value={selectedCustomerId}
            disabled={isLoading}
            onChange={(event) => {
              setSelectedCustomerId(event.target.value);
              setResult(null);
              setError("");
            }}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-slate-900 outline-none transition focus:border-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            <option value="">Select a customer</option>

            {customers.map((customer) => (
              <option
                key={customer.id}
                value={customer.id}
              >
                {customer.id} — {customer.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isLoading}
            className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading
              ? "Analyzing customer..."
              : "Analyze Customer"}
          </button>

          {isLoading && (
            <div className="mt-4 rounded-lg border border-indigo-100 bg-indigo-50 p-4">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />

                <div>
                  <p className="text-sm font-medium text-indigo-900">
                    Analyzing customer...
                  </p>

                  <p className="text-sm text-indigo-700">
                    Running the customer health risk analysis.
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-800">
                Analysis failed
              </p>

              <p className="mt-1 text-sm text-red-700">
                {error}
              </p>
            </div>
          )}
        </section>

        {result && !isLoading && (
          <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  {result.id}
                </p>

                <h2 className="text-2xl font-semibold text-slate-900">
                  {result.name}
                </h2>
              </div>

              <RiskBadge riskLevel={result.riskLevel} />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <ResultCard
                label="Risk Category"
                value={result.riskCategory}
              />

              <ResultCard
                label="Priority"
                value={result.priority}
              />

              <ResultCard
                label="Task Status"
                value={result.taskStatus}
              />
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-slate-900">
                Risk Signals
              </h3>

              {result.riskSignals.length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {result.riskSignals.map((signal) => (
                    <li
                      key={signal}
                      className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-700"
                    >
                      {signal}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-slate-500">
                  No risk signals detected.
                </p>
              )}
            </div>

            <div className="mt-6 rounded-xl bg-indigo-50 p-4">
              <p className="text-sm font-medium text-indigo-700">
                Recommended Action
              </p>

              <p className="mt-1 text-slate-800">
                {result.recommendedAction}
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function ResultCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function RiskBadge({
  riskLevel,
}: {
  riskLevel: string;
}) {
  let classes = "bg-slate-100 text-slate-700";

  if (riskLevel === "HIGH") {
    classes = "bg-red-100 text-red-700";
  }

  if (riskLevel === "MEDIUM") {
    classes = "bg-amber-100 text-amber-700";
  }

  if (riskLevel === "LOW") {
    classes = "bg-emerald-100 text-emerald-700";
  }

  return (
    <div
      className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${classes}`}
    >
      {riskLevel}
    </div>
  );
}