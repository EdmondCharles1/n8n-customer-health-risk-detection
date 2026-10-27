import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CustomerAvatar } from "@/components/CustomerCard";
import { PulseIcon } from "@/components/icons";
import { SignalGrid } from "@/components/SignalGrid";
import {
  ButtonLink,
  Container,
  SectionHeading,
  focusRing,
} from "@/components/ui";
import { customers, getCustomer } from "@/lib/customers";

// Only the known demo customers exist; any other ID is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return customers.map((customer) => ({ id: customer.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/customers/[id]">): Promise<Metadata> {
  const { id } = await params;
  const customer = getCustomer(id);

  return { title: customer ? customer.name : "Customer not found" };
}

export default async function CustomerDetailPage({
  params,
}: PageProps<"/customers/[id]">) {
  const { id } = await params;
  const customer = getCustomer(id);

  if (!customer) {
    notFound();
  }

  const analyzeHref = `/analyze?customer=${customer.id}`;

  return (
    <>
      <section
        aria-labelledby="customer-heading"
        className="relative border-b border-slate-200 bg-white"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-b from-indigo-50/80 via-white to-white"
        />

        <Container className="relative py-10 sm:py-14">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
              <li>
                <Link
                  href="/customers"
                  className={`rounded font-medium text-slate-500 transition hover:text-indigo-700 ${focusRing}`}
                >
                  Customers
                </Link>
              </li>

              <li aria-hidden="true" className="text-slate-300">
                /
              </li>

              <li>
                <span
                  aria-current="page"
                  className="break-words font-medium text-slate-900"
                >
                  {customer.name}
                </span>
              </li>
            </ol>
          </nav>

          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <CustomerAvatar name={customer.name} size="lg" />

              <div className="min-w-0">
                <p className="font-mono text-xs font-medium uppercase tracking-wider text-slate-500">
                  {customer.id}
                </p>

                <h1
                  id="customer-heading"
                  className="mt-1 break-words text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
                >
                  {customer.name}
                </h1>

                <p className="mt-2 text-base text-slate-600">
                  Customer profile and health analysis entry point.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <ButtonLink href={analyzeHref} withArrow>
                Analyze Customer
              </ButtonLink>

              <ButtonLink href="/customers" variant="secondary">
                Back to Customers
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <Container className="grid gap-6 py-10 sm:py-14 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <section
          aria-labelledby="profile-heading"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2
            id="profile-heading"
            className="text-lg font-semibold text-slate-900"
          >
            Customer Profile
          </h2>

          <dl className="mt-5 divide-y divide-slate-100 rounded-xl border border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
              <dt className="text-sm text-slate-500">Customer ID</dt>
              <dd className="font-mono text-sm font-semibold text-slate-900">
                {customer.id}
              </dd>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
              <dt className="text-sm text-slate-500">Customer Name</dt>
              <dd className="break-words text-sm font-semibold text-slate-900">
                {customer.name}
              </dd>
            </div>
          </dl>

          <p className="mt-4 text-sm leading-relaxed text-slate-500">
            Other account details, such as activity, NPS, support status and
            renewal date, are read from Google Sheets by the n8n workflow
            when an analysis runs. They are not stored in the web app.
          </p>
        </section>

        <section
          aria-labelledby="health-heading"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2
            id="health-heading"
            className="text-lg font-semibold text-slate-900"
          >
            Customer Health
          </h2>

          <div className="mt-5 flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-slate-50/70 px-5 py-10 text-center">
            <span
              aria-hidden="true"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200"
            >
              <PulseIcon className="h-5 w-5" />
            </span>

            <p className="mt-4 font-semibold text-slate-900">
              No health analysis has been run in this view yet.
            </p>

            <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-slate-600">
              Run the analyzer to evaluate engagement, satisfaction,
              support, and renewal risk.
            </p>

            <div className="mt-6">
              <ButtonLink href={analyzeHref} size="sm" withArrow>
                Analyze Customer
              </ButtonLink>
            </div>
          </div>
        </section>
      </Container>

      <section aria-labelledby="evaluated-heading" className="pb-14 sm:pb-20">
        <Container>
          <SectionHeading
            id="evaluated-heading"
            title="What will be evaluated"
            description={`The analysis of ${customer.name} looks at four operational signals.`}
          />

          <div className="mt-8">
            <SignalGrid variant="compact" />
          </div>
        </Container>
      </section>
    </>
  );
}
