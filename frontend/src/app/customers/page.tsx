import type { Metadata } from "next";
import type { ReactNode } from "react";

import { CustomerCard } from "@/components/CustomerCard";
import { BoltIcon, BrainIcon, PulseIcon } from "@/components/icons";
import { Container, CtaBand, Eyebrow, IconTile } from "@/components/ui";
import { customers } from "@/lib/customers";

export const metadata: Metadata = {
  title: "Customers",
};

export default function CustomersPage() {
  return (
    <>
      <section
        aria-labelledby="customers-heading"
        className="relative border-b border-slate-200 bg-white"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-b from-indigo-50/80 via-white to-white"
        />

        <Container className="relative py-12 sm:py-16">
          <Eyebrow>Customer Portfolio</Eyebrow>

          <h1
            id="customers-heading"
            className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
          >
            Customers
          </h1>

          <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-600">
            Monitor customer health and launch risk analysis for individual
            accounts.
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-3">
            <SummaryItem icon={<PulseIcon className="h-5 w-5" />}>
              <span className="font-semibold text-slate-900">
                {customers.length} customers
              </span>{" "}
              monitored
            </SummaryItem>

            <SummaryItem icon={<BrainIcon className="h-5 w-5" />}>
              AI-assisted health analysis
            </SummaryItem>

            <SummaryItem icon={<BoltIcon className="h-5 w-5" />}>
              n8n-powered automation
            </SummaryItem>
          </ul>
        </Container>
      </section>

      <section aria-label="Customer list" className="pt-10 sm:pt-14">
        <Container>
          <ul className="grid gap-4 lg:grid-cols-3 lg:gap-5">
            {customers.map((customer) => (
              <li key={customer.id}>
                <CustomerCard customer={customer} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand
        title="Need a deeper health assessment?"
        description="Run the AI-assisted analyzer on any account to surface risk signals and a recommended next action."
        href="/analyze"
        label="Open Analyzer"
      />
    </>
  );
}

function SummaryItem({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 text-sm text-slate-600 shadow-sm">
      <IconTile>{icon}</IconTile>
      <span>{children}</span>
    </li>
  );
}
