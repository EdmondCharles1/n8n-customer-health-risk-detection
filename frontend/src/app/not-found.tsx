import type { Metadata } from "next";

import { SearchIcon } from "@/components/icons";
import { ButtonLink, Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center py-20 text-center sm:py-28">
      <span
        aria-hidden="true"
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-inset ring-indigo-100"
      >
        <SearchIcon className="h-6 w-6" />
      </span>

      <p className="mt-6 font-mono text-sm font-semibold text-indigo-600">
        404
      </p>

      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Page not found
      </h1>

      <p className="mt-3 max-w-md text-base leading-relaxed text-slate-600">
        The page or customer you requested could not be found.
      </p>

      <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <ButtonLink href="/">Back Home</ButtonLink>

        <ButtonLink href="/customers" variant="secondary">
          View Customers
        </ButtonLink>
      </div>
    </Container>
  );
}
