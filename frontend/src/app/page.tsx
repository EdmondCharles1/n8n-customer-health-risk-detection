import type { Metadata } from "next";
import Link from "next/link";

import {
  ArrowRightIcon,
  BoltIcon,
  BrainIcon,
  DatabaseIcon,
  ShieldIcon,
  SparkleIcon,
} from "@/components/icons";
import { RiskBadge } from "@/components/RiskBadge";
import { SignalGrid } from "@/components/SignalGrid";
import {
  ButtonLink,
  Container,
  CtaBand,
  Eyebrow,
  IconTile,
  SectionHeading,
  focusRing,
} from "@/components/ui";

export const metadata: Metadata = {
  title: { absolute: "Home | Customer Health Risk Analyzer" },
};

const steps = [
  {
    title: "Customer Data",
    description: "Google Sheets provides operational customer data.",
    Icon: DatabaseIcon,
  },
  {
    title: "Risk Detection",
    description: "n8n calculates deterministic customer-health signals.",
    Icon: ShieldIcon,
  },
  {
    title: "AI Reasoning",
    description:
      "Gemini agents classify risk, extract signals and decide follow-up.",
    Icon: BrainIcon,
  },
  {
    title: "Action",
    description:
      "The application presents the recommended action to the user.",
    Icon: BoltIcon,
  },
];

export default function HomePage() {
  return (
    <>
      <section
        aria-labelledby="hero-heading"
        className="relative border-b border-slate-200 bg-white"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-b from-indigo-50/80 via-white to-white"
        />

        <Container className="relative grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-24">
          <div>
            <Eyebrow>
              <SparkleIcon className="h-3.5 w-3.5" />
              AI-Powered Customer Success
            </Eyebrow>

            <h1
              id="hero-heading"
              className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]"
            >
              Detect customer risk{" "}
              <span className="text-indigo-600">before churn.</span>
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
              Customer Health Risk Analyzer combines operational customer
              data, deterministic business rules, and AI agents to identify
              risk and recommend the next best action.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/analyze" withArrow>
                Analyze a Customer
              </ButtonLink>

              <ButtonLink href="/project" variant="secondary">
                View Project
              </ButtonLink>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate-500">
              <p className="inline-flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 text-white"
                >
                  <BoltIcon className="h-3.5 w-3.5" />
                </span>
                <span>
                  Powered by{" "}
                  <span className="font-semibold text-slate-700">
                    n8n + Gemini
                  </span>
                </span>
              </p>

              <span
                aria-hidden="true"
                className="hidden h-4 w-px bg-slate-300 sm:block"
              />

              <p>
                First time here?{" "}
                <Link
                  href="/demo"
                  className={`group inline-flex items-center gap-1 rounded font-semibold text-indigo-700 hover:text-indigo-900 ${focusRing}`}
                >
                  Guided Demo
                  <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </p>
            </div>
          </div>

          <ProductPreview />
        </Container>
      </section>

      <section
        aria-labelledby="how-heading"
        className="py-14 sm:py-20"
      >
        <Container>
          <SectionHeading
            id="how-heading"
            eyebrow="How it works"
            title="From raw account data to a clear next step"
            description="Deterministic rules and AI agents each do what they are best at, in a single automated workflow."
          />

          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ title, description, Icon }, index) => (
              <li
                key={title}
                className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <IconTile>
                    <Icon className="h-5 w-5" />
                  </IconTile>

                  <span className="font-mono text-sm font-medium text-slate-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-5 font-semibold text-slate-900">
                  {title}
                </h3>

                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  {description}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section
        aria-labelledby="evaluates-heading"
        className="border-y border-slate-200 bg-white py-14 sm:py-20"
      >
        <Container>
          <SectionHeading
            id="evaluates-heading"
            eyebrow="Signals"
            title="What the system evaluates"
            description="Four operational indicators drive every customer-health assessment."
          />

          <div className="mt-10">
            <SignalGrid />
          </div>
        </Container>
      </section>

      <CtaBand
        title="Ready to analyze customer health?"
        description="Pick a customer and get a risk assessment with a recommended next action."
        href="/analyze"
        label="Analyze Customer"
      />
    </>
  );
}

function ProductPreview() {
  return (
    <figure className="relative w-full max-w-lg lg:max-w-none">
      <div
        aria-hidden="true"
        className="absolute -inset-3 rounded-[28px] bg-linear-to-br from-indigo-100 to-violet-100 opacity-70"
      />

      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-indigo-900/5">
        <div aria-hidden="true" className="h-1 w-full bg-amber-500" />

        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Example analysis
            </p>

            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
              Illustrative preview
            </span>
          </div>

          <div>
            <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="sr-only">Customer</p>
                <div className="text-xl font-semibold text-slate-900">
                  Futura
                  <span className="ml-2 font-mono text-xs font-medium text-slate-500">
                    · C006
                  </span>
                </div>
              </div>

              <div>
                <p className="sr-only">Risk Level</p>
                <div>
                  <RiskBadge label="Risk" value="MEDIUM" />
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Category
                </p>
                <div className="mt-1 break-words font-mono text-sm font-semibold text-slate-900">
                  ENGAGEMENT_RISK
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Priority
                </p>
                <div className="mt-1">
                  <RiskBadge value="MEDIUM" />
                </div>
              </div>
            </div>

            <div className="mt-3 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-indigo-700">
                <SparkleIcon className="h-4 w-4" />
                Recommended Action
              </p>
              <div className="mt-1.5 text-sm leading-relaxed text-slate-800">
                Contact the customer about the drop in usage.
              </div>
            </div>
          </div>
        </div>
      </div>

      <figcaption className="sr-only">
        Illustrative example of an analysis result. Not live data.
      </figcaption>
    </figure>
  );
}
