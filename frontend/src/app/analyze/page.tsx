import type { Metadata } from "next";

import { CustomerAnalyzer } from "@/components/CustomerAnalyzer";
import { Eyebrow } from "@/components/ui";
import { getCustomer } from "@/lib/customers";

export const metadata: Metadata = {
  title: "Analyzer",
};

export default async function AnalyzePage({
  searchParams,
}: PageProps<"/analyze">) {
  const { customer } = await searchParams;
  const requestedId = typeof customer === "string" ? customer : undefined;
  const initialCustomerId =
    requestedId && getCustomer(requestedId) ? requestedId : undefined;

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-linear-to-b from-indigo-50 to-transparent"
      />

      <div className="relative mx-auto w-full max-w-3xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
        <header className="mb-8 sm:mb-10">
          <Eyebrow>Customer Health Analysis</Eyebrow>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Customer Health Risk Analyzer
          </h1>

          <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-600">
            Select a customer to evaluate risk signals and receive an
            AI-assisted recommended action.
          </p>
        </header>

        {/* Keyed so a client-side change of ?customer= re-applies the pre-selection. */}
        <CustomerAnalyzer
          key={initialCustomerId ?? "none"}
          initialCustomerId={initialCustomerId}
        />
      </div>
    </div>
  );
}
