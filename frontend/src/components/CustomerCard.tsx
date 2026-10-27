import type { Customer } from "@/lib/customers";

import { ButtonLink } from "./ui";

export function CustomerAvatar({
  name,
  size = "md",
}: {
  name: string;
  size?: "md" | "lg";
}) {
  const initials = name
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 font-semibold text-white shadow-sm ${
        size === "lg" ? "h-14 w-14 text-lg" : "h-11 w-11 text-sm"
      }`}
    >
      {initials}
    </span>
  );
}

export function CustomerCard({
  customer,
  variant = "portfolio",
  headingLevel = 2,
}: {
  customer: Customer;
  /** "demo" leads with the analyzer instead of the profile. */
  variant?: "portfolio" | "demo";
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const profileHref = `/customers/${customer.id}`;
  const analyzeHref = `/analyze?customer=${customer.id}`;

  return (
    <article
      aria-labelledby={`customer-${customer.id}`}
      className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md motion-reduce:transform-none md:max-lg:flex-row md:max-lg:items-center md:max-lg:gap-6"
    >
      {/* Tablet (md–lg): one horizontal row per customer instead of a
          2 + 1 grid; mobile and desktop keep the stacked card. */}
      <div className="flex min-w-0 items-start gap-4 md:max-lg:flex-1">
        <CustomerAvatar name={customer.name} />

        <div className="min-w-0">
          <p className="font-mono text-xs font-medium uppercase tracking-wider text-slate-500">
            {customer.id}
          </p>

          <Heading
            id={`customer-${customer.id}`}
            className="mt-0.5 break-words text-lg font-semibold text-slate-900"
          >
            {customer.name}
          </Heading>

          <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500"
            />
            Available for customer health analysis.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2 border-t border-slate-100 pt-5 min-[400px]:flex-row md:max-lg:mt-0 md:max-lg:shrink-0 md:max-lg:border-0 md:max-lg:pt-0">
        {variant === "demo" ? (
          <>
            <ButtonLink
              href={analyzeHref}
              size="sm"
              ariaLabel={`Analyze Customer ${customer.name}`}
            >
              Analyze Customer
            </ButtonLink>

            <ButtonLink
              href={profileHref}
              variant="secondary"
              size="sm"
              ariaLabel={`View Profile of ${customer.name}`}
            >
              View Profile
            </ButtonLink>
          </>
        ) : (
          <>
            <ButtonLink
              href={profileHref}
              size="sm"
              ariaLabel={`View customer ${customer.name}`}
            >
              View Customer
            </ButtonLink>

            <ButtonLink
              href={analyzeHref}
              variant="secondary"
              size="sm"
              ariaLabel={`Analyze ${customer.name}`}
            >
              Analyze
            </ButtonLink>
          </>
        )}
      </div>
    </article>
  );
}
