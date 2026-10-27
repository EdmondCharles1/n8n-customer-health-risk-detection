"use client";

import { useState } from "react";

import { customers, getCustomer } from "@/lib/customers";

import { AlertIcon, CheckIcon, ChevronIcon, SparkleIcon } from "./icons";
import { RiskBadge, getTone, toneStyles } from "./RiskBadge";

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

export function CustomerAnalyzer({
  initialCustomerId,
}: {
  /** Pre-selects a known customer. Never triggers an analysis. */
  initialCustomerId?: string;
}) {
  const [selectedCustomerId, setSelectedCustomerId] = useState(
    initialCustomerId && getCustomer(initialCustomerId)
      ? initialCustomerId
      : ""
  );
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

  const hasCustomer = selectedCustomerId !== "";

  return (
    <div>
      <section
        aria-labelledby="analyzer-heading"
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
      >
        <h2 id="analyzer-heading" className="sr-only">
          Run an analysis
        </h2>

        <label
          htmlFor="customer"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Customer
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <select
              id="customer"
              value={selectedCustomerId}
              disabled={isLoading}
              aria-describedby="customer-help"
              onChange={(event) => {
                setSelectedCustomerId(event.target.value);
                setResult(null);
                setError("");
              }}
              className="h-12 w-full appearance-none rounded-xl border border-slate-300 bg-white pl-4 pr-10 text-slate-900 shadow-sm outline-none transition hover:border-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
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

            <ChevronIcon className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isLoading}
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 active:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-indigo-400"
          >
            {isLoading ? (
              <>
                <Spinner className="h-4 w-4 border-white/40 border-t-white" />
                Analyzing…
              </>
            ) : (
              "Analyze Customer"
            )}
          </button>
        </div>

        <p id="customer-help" className="mt-3 text-sm text-slate-500">
          The analysis runs a live n8n workflow with AI agents and can
          take a little while.
        </p>

        <div role="status" aria-live="polite">
          {isLoading && (
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
              <Spinner className="mt-0.5 h-5 w-5 shrink-0 border-indigo-200 border-t-indigo-600" />

              <div className="min-w-0">
                <p className="text-sm font-medium text-indigo-900">
                  Analyzing customer health...
                </p>

                <p className="mt-0.5 text-sm text-indigo-700">
                  Evaluating customer activity, satisfaction, support and
                  renewal signals.
                </p>
              </div>
            </div>
          )}
        </div>

        {error && !isLoading && (
          <div
            role="alert"
            className="mt-5 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-start"
          >
            <div className="flex min-w-0 flex-1 gap-3">
              <AlertIcon className="mt-px h-5 w-5 shrink-0 text-red-600" />

              <div className="min-w-0">
                <p className="text-sm font-semibold text-red-800">
                  {hasCustomer
                    ? "Analysis unavailable"
                    : "No customer selected"}
                </p>

                <p className="mt-1 wrap-anywhere text-sm text-red-700">
                  {toDisplayMessage(error)}
                </p>
              </div>
            </div>

            {hasCustomer && (
              <button
                type="button"
                onClick={handleAnalyze}
                className="ml-8 inline-flex h-10 w-fit shrink-0 items-center rounded-lg border border-red-200 bg-white px-4 text-sm font-medium text-red-700 shadow-sm transition hover:bg-red-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-100 sm:ml-0"
              >
                Try again
              </button>
            )}
          </div>
        )}
      </section>

      {result && !isLoading && <ResultPanel result={result} />}
    </div>
  );
}

/**
 * Presentation only: errors coming from the API route are already
 * user-friendly, but low-level browser errors (network failures, an
 * unparseable response) are replaced by a neutral message.
 */
function toDisplayMessage(message: string) {
  if (
    /json|unexpected token|failed to fetch|networkerror|load failed/i.test(
      message
    )
  ) {
    return "The analysis service could not be reached. Please try again in a moment.";
  }

  return message;
}

function ResultPanel({ result }: { result: AnalysisResult }) {
  const riskTone = toneStyles[getTone(result.riskLevel)];

  return (
    <section
      aria-labelledby="result-heading"
      className="relative mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div
        aria-hidden="true"
        className={`h-1 w-full ${riskTone.accent}`}
      />

      <div className="p-5 sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
          Analysis result
        </p>

        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2
              id="result-heading"
              className="wrap-anywhere text-2xl font-semibold tracking-tight text-slate-900"
            >
              {result.name}
            </h2>

            <p className="mt-1 font-mono text-xs font-medium uppercase tracking-wider text-slate-500">
              {result.id}
            </p>
          </div>

          <RiskBadge
            label="Risk"
            value={result.riskLevel}
            size="lg"
          />
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Risk Category
            </dt>

            <dd className="mt-1.5 wrap-anywhere font-semibold text-slate-900">
              {result.riskCategory}
            </dd>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Priority
            </dt>

            <dd className="mt-1.5">
              <RiskBadge value={result.priority} />
            </dd>
          </div>
        </dl>

        <div className="mt-7">
          <h3 className="text-sm font-semibold text-slate-900">
            Risk Signals
          </h3>

          {result.riskSignals.length > 0 ? (
            <ul className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-200">
              {result.riskSignals.map((signal, index) => (
                <li
                  key={`${index}-${signal}`}
                  className="flex items-start gap-3 px-4 py-3 text-sm text-slate-700"
                >
                  <span
                    aria-hidden="true"
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${riskTone.dot}`}
                  />

                  <span className="min-w-0 wrap-anywhere">{signal}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-500">
              No risk signals detected.
            </p>
          )}
        </div>

        <div className="mt-7 rounded-xl border border-indigo-200 bg-indigo-50 p-4 sm:p-5">
          <div className="flex items-center gap-2 text-indigo-700">
            <SparkleIcon className="h-4 w-4" />

            <h3 className="text-sm font-semibold">
              Recommended Action
            </h3>
          </div>

          <p className="mt-2 wrap-anywhere leading-relaxed text-slate-800">
            {result.recommendedAction}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-slate-100 pt-4 text-xs text-slate-500">
          <CheckIcon className="h-3.5 w-3.5" />
          <span>Task status:</span>
          <span className="font-medium text-slate-700">
            {result.taskStatus}
          </span>
        </div>
      </div>
    </section>
  );
}

function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block animate-spin rounded-full border-2 ${className}`}
    />
  );
}
