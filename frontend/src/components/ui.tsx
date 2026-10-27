import Link from "next/link";
import type { ReactNode } from "react";

import { ArrowRightIcon } from "./icons";

export const focusRing =
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-700 ring-1 ring-inset ring-indigo-200">
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  id?: string;
  align?: "left" | "center";
}) {
  const alignment =
    align === "center" ? "mx-auto text-center" : "";

  return (
    <div className={`max-w-2xl ${alignment}`}>
      {eyebrow && (
        <p className="text-sm font-semibold text-indigo-600">
          {eyebrow}
        </p>
      )}

      <h2
        id={id}
        className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
      >
        {title}
      </h2>

      {description && (
        <p className="mt-3 text-base leading-relaxed text-slate-600">
          {description}
        </p>
      )}
    </div>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  withArrow = false,
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "inverse";
  size?: "sm" | "md";
  withArrow?: boolean;
  ariaLabel?: string;
}) {
  const sizes = {
    sm: "h-10 px-4",
    md: "h-12 px-6",
  };

  const variants = {
    primary:
      "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 active:bg-indigo-800",
    secondary:
      "bg-white text-slate-800 ring-1 ring-inset ring-slate-300 shadow-sm hover:bg-slate-50 hover:ring-slate-400",
    inverse:
      "bg-white text-indigo-700 shadow-sm hover:bg-indigo-50",
  };

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={`group inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition ${sizes[size]} ${variants[variant]} ${focusRing}`}
    >
      {children}

      {withArrow && (
        <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      )}
    </Link>
  );
}

export function IconTile({
  children,
  className = "bg-indigo-50 text-indigo-600 ring-indigo-100",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${className}`}
    >
      {children}
    </span>
  );
}

export function CtaBand({
  title,
  description,
  href,
  label,
}: {
  title: string;
  description: string;
  href: string;
  label: string;
}) {
  return (
    <section
      aria-labelledby="cta-heading"
      className="py-14 sm:py-20"
    >
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-indigo-600 px-6 py-12 text-center shadow-sm sm:px-12 sm:py-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-500/40 blur-3xl"
          />

          <h2
            id="cta-heading"
            className="relative text-2xl font-bold tracking-tight text-white sm:text-3xl"
          >
            {title}
          </h2>

          <p className="relative mx-auto mt-3 max-w-xl text-indigo-100">
            {description}
          </p>

          <div className="relative mt-8 flex justify-center">
            <ButtonLink href={href} variant="inverse" withArrow>
              {label}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
