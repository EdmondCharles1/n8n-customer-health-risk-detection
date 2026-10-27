import type { Metadata } from "next";
import Link from "next/link";

import {
  FlowArrow,
  FlowNode,
  FlowZone,
  LegendItem,
} from "@/components/Flow";
import {
  ArrowRightIcon,
  BoltIcon,
  BrainIcon,
  CheckIcon,
  ClockIcon,
  DatabaseIcon,
  MessageIcon,
  PulseIcon,
  SearchIcon,
  ShieldIcon,
  TargetIcon,
} from "@/components/icons";
import { SignalGrid } from "@/components/SignalGrid";
import { StatusList } from "@/components/StatusList";
import {
  Container,
  CtaBand,
  Eyebrow,
  IconTile,
  SectionHeading,
  focusRing,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "Project",
};

const solution = [
  {
    title: "Detect",
    description:
      "Evaluate customer activity, NPS, support status and renewal proximity.",
    Icon: SearchIcon,
  },
  {
    title: "Reason",
    description:
      "Use specialized AI agents to classify risk and interpret signals.",
    Icon: BrainIcon,
  },
  {
    title: "Recommend",
    description:
      "Generate an appropriate next action for the account manager.",
    Icon: TargetIcon,
  },
  {
    title: "Automate",
    description:
      "Support downstream workflows such as task creation and Slack alerts.",
    Icon: BoltIcon,
  },
];

const agents = [
  {
    name: "Risk Classifier Agent",
    description: "Determines risk level, category and confidence.",
    outputs: ["riskLevel", "riskCategory", "confidence"],
  },
  {
    name: "Risk Signal Extractor Agent",
    description: "Identifies factual risk indicators from customer data.",
    outputs: ["riskSignals"],
  },
  {
    name: "Action Reasoner Agent",
    description:
      "Decides whether action is needed and recommends the follow-up.",
    outputs: ["priority", "recommendedAction"],
  },
  {
    name: "Slack Composer Agent",
    description:
      "Formats approved decisions into clear Slack messages.",
    outputs: ["Slack message"],
    note: "Being reintegrated",
  },
];

const stack = [
  { name: "n8n", mark: "n8n", role: "Workflow orchestration" },
  { name: "Next.js", mark: "N", role: "Web app and API proxy" },
  { name: "TypeScript", mark: "TS", role: "Typed application code" },
  { name: "Tailwind CSS", mark: "TW", role: "Interface styling" },
  { name: "Google Sheets", mark: "GS", role: "Customer data source" },
  { name: "Google Gemini", mark: "GG", role: "LLM behind the agents" },
  { name: "Slack", mark: "SL", role: "Team alerts" },
  { name: "Docker", mark: "DK", role: "Local n8n runtime" },
  { name: "Vercel", mark: "VC", role: "Web app hosting" },
];

const completed = [
  "Customer data retrieval",
  "Deterministic risk detection",
  "Multi-agent risk reasoning",
  "Responsive web interface",
  "API proxy",
  "Vercel deployment",
];

const inProgress = [
  "Production n8n public endpoint",
  "Final task / Slack reintegration",
  "Production hardening",
];

export default function ProjectPage() {
  return (
    <>
      <section
        aria-labelledby="project-heading"
        className="relative border-b border-slate-200 bg-white"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-b from-indigo-50/80 via-white to-white"
        />

        <Container className="relative py-14 sm:py-20">
          <Eyebrow>Project Overview</Eyebrow>

          <h1
            id="project-heading"
            className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl sm:leading-[1.1]"
          >
            AI-Powered Customer Health Risk Detection
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            A customer-success automation system built with n8n, Google
            Sheets, Gemini agents, Slack and a Next.js web interface.
          </p>

          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
            <li>
              <Link
                href="/integrations"
                className={`group inline-flex items-center gap-1.5 rounded text-indigo-700 hover:text-indigo-900 ${focusRing}`}
              >
                View Integrations
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>

            <li>
              <Link
                href="/demo"
                className={`group inline-flex items-center gap-1.5 rounded text-indigo-700 hover:text-indigo-900 ${focusRing}`}
              >
                Try Demo
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
          </ul>

          <dl className="mt-10 grid max-w-2xl grid-cols-3 gap-3 sm:gap-4">
            <Stat value="4" label="Risk signals" />
            <Stat value="4" label="AI agents" />
            <Stat value="1" label="n8n flow" />
          </dl>
        </Container>
      </section>

      <section aria-labelledby="problem-heading" className="py-14 sm:py-20">
        <Container className="grid gap-6 lg:grid-cols-2 lg:gap-16">
          <SectionHeading
            id="problem-heading"
            eyebrow="The Problem"
            title="Churn risk is usually spotted too late"
          />

          <div className="space-y-4 text-base leading-relaxed text-slate-600">
            <p>
              Customer success teams often identify churn risk too late
              because customer-health information is spread across
              operational systems.
            </p>

            <p className="rounded-2xl border-l-4 border-indigo-500 bg-white p-5 text-slate-700 shadow-sm">
              This project centralizes those signals and turns them into
              actionable risk analysis.
            </p>
          </div>
        </Container>
      </section>

      <section
        aria-labelledby="solution-heading"
        className="border-y border-slate-200 bg-white py-14 sm:py-20"
      >
        <Container>
          <SectionHeading
            id="solution-heading"
            eyebrow="Solution"
            title="Detect, reason, recommend, automate"
          />

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {solution.map(({ title, description, Icon }) => (
              <li
                key={title}
                className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6"
              >
                <IconTile>
                  <Icon className="h-5 w-5" />
                </IconTile>

                <h3 className="mt-5 font-semibold text-slate-900">
                  {title}
                </h3>

                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  {description}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Architecture />

      <section
        aria-labelledby="agents-heading"
        className="border-y border-slate-200 bg-white py-14 sm:py-20"
      >
        <Container>
          <SectionHeading
            id="agents-heading"
            eyebrow="AI Agent Architecture"
            title="Specialized agents on top of deterministic rules"
            description="Each agent has a single, narrow responsibility. Their outputs are merged into one structured analysis."
          />

          <div className="mt-8 flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <ShieldIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

            <p className="text-sm leading-relaxed text-emerald-900">
              <span className="font-semibold">
                Deterministic calculations remain part of the system.
              </span>{" "}
              Customer-health metrics are computed by explicit business
              rules in n8n before any agent runs. The agents receive those
              results as input to classify, explain and decide, rather
              than recomputing them.
            </p>
          </div>

          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {agents.map((agent) => (
              <li
                key={agent.name}
                className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
              >
                <IconTile className="bg-violet-50 text-violet-600 ring-violet-100">
                  <BrainIcon className="h-5 w-5" />
                </IconTile>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-900">
                      {agent.name}
                    </h3>

                    {agent.note && (
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-200">
                        {agent.note}
                      </span>
                    )}
                  </div>

                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                    {agent.description}
                  </p>

                  <ul
                    aria-label="Outputs"
                    className="mt-3 flex flex-wrap gap-1.5"
                  >
                    {agent.outputs.map((output) => (
                      <li
                        key={output}
                        className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600"
                      >
                        {output}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="stack-heading" className="py-14 sm:py-20">
        <Container>
          <SectionHeading
            id="stack-heading"
            eyebrow="Tech Stack"
            title="Built with production-grade tools"
          />

          <ul className="mt-10 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-3">
            {stack.map((tool) => (
              <li
                key={tool.name}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white"
                >
                  {tool.mark}
                </span>

                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">
                    {tool.name}
                  </p>

                  <p className="text-sm text-slate-500">{tool.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section
        aria-labelledby="signals-heading"
        className="border-y border-slate-200 bg-white py-14 sm:py-20"
      >
        <Container>
          <SectionHeading
            id="signals-heading"
            eyebrow="Risk Signals"
            title="Four indicators from the customer sheet"
            description="Each signal maps to a column of the Google Sheets customer data."
          />

          <div className="mt-10">
            <SignalGrid variant="short" showSource />
          </div>
        </Container>
      </section>

      <section aria-labelledby="status-heading" className="pt-14 sm:pt-20">
        <Container>
          <SectionHeading
            id="status-heading"
            eyebrow="Current Prototype Status"
            title="What works today, and what comes next"
          />

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            <StatusList
              title="Completed"
              items={completed}
              icon={<CheckIcon className="h-3.5 w-3.5" />}
              tone="bg-emerald-100 text-emerald-700"
              headerTone="text-emerald-700"
            />

            <StatusList
              title="In Progress"
              items={inProgress}
              icon={<ClockIcon className="h-3.5 w-3.5" />}
              tone="bg-amber-100 text-amber-800"
              headerTone="text-amber-800"
            />
          </div>
        </Container>
      </section>

      <CtaBand
        title="Try the Customer Health Analyzer"
        description="Run a live analysis on one of the sample customers."
        href="/analyze"
        label="Open the Analyzer"
      />
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <dt className="text-xs font-medium text-slate-500 sm:text-sm">
        {label}
      </dt>
      <dd className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
        {value}
      </dd>
    </div>
  );
}


function Architecture() {
  const icon = "h-4 w-4";

  return (
    <section aria-labelledby="architecture-heading" className="py-14 sm:py-20">
      <Container>
        <SectionHeading
          id="architecture-heading"
          eyebrow="Architecture"
          title="How a request flows through the system"
          description="The browser never talks to n8n directly: a server-side API route proxies every analysis request."
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
          <ol
            aria-label="Request flow, from the web app back to the web app"
            className="mx-auto w-full max-w-2xl"
          >
            <li>
              <FlowZone label="Web application">
                <FlowNode
                  kind="app"
                  title="Next.js Web App"
                  detail="Customer is selected in the analyzer"
                  tag="Browser"
                  icon={<PulseIcon className={icon} />}
                />
                <FlowArrow />
                <FlowNode
                  kind="app"
                  title="/api/analyze"
                  detail="Server-side proxy route"
                  tag="Next.js"
                  icon={<ShieldIcon className={icon} />}
                />
              </FlowZone>
            </li>

            <li>
              <FlowArrow />
            </li>

            <li>
              <FlowZone label="n8n workflow">
                <FlowNode
                  kind="workflow"
                  title="n8n Webhook"
                  detail="Receives the customer ID"
                  tag="Trigger"
                  icon={<BoltIcon className={icon} />}
                />
                <FlowArrow />
                <FlowNode
                  kind="workflow"
                  title="Google Sheets"
                  detail="Loads the customer record"
                  tag="Data"
                  icon={<DatabaseIcon className={icon} />}
                />
                <FlowArrow />
                <FlowNode
                  kind="workflow"
                  title="Deterministic Risk Calculation"
                  detail="Business rules compute health metrics"
                  tag="Rules"
                  icon={<ShieldIcon className={icon} />}
                />
                <FlowArrow />

                <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                  <FlowNode
                    kind="ai"
                    title="Risk Classifier Agent"
                    icon={<BrainIcon className={icon} />}
                  />
                  <span
                    aria-hidden="true"
                    className="text-center text-sm font-semibold text-violet-500"
                  >
                    +
                  </span>
                  <FlowNode
                    kind="ai"
                    title="Risk Signal Extractor Agent"
                    icon={<BrainIcon className={icon} />}
                  />
                </div>

                <FlowArrow />
                <FlowNode
                  kind="workflow"
                  title="Merge Agent Analysis"
                  detail="Combines both agent outputs"
                  tag="Merge"
                  icon={<TargetIcon className={icon} />}
                />
                <FlowArrow />
                <FlowNode
                  kind="ai"
                  title="Action Reasoner Agent"
                  detail="Decides the follow-up"
                  tag="Gemini"
                  icon={<BrainIcon className={icon} />}
                />
                <FlowArrow />
                <FlowNode
                  kind="workflow"
                  title="API Response"
                  detail="Structured JSON result"
                  tag="Response"
                  icon={<MessageIcon className={icon} />}
                />
              </FlowZone>
            </li>

            <li>
              <FlowArrow />
            </li>

            <li>
              <FlowNode
                kind="app"
                title="Web App"
                detail="Risk level, signals and recommended action are displayed"
                tag="Result"
                icon={<PulseIcon className={icon} />}
              />
            </li>
          </ol>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">
                Legend
              </h3>

              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <LegendItem className="border-indigo-300 bg-white">
                  Web application
                </LegendItem>
                <LegendItem className="border-slate-300 bg-white">
                  n8n step (deterministic)
                </LegendItem>
                <LegendItem className="border-violet-300 bg-violet-100">
                  Gemini AI agent
                </LegendItem>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">
                API contract
              </h3>

              <p className="mt-3 text-xs font-medium uppercase tracking-wider text-slate-500">
                Request
              </p>
              <pre className="mt-1.5 overflow-x-auto rounded-lg bg-slate-900 p-3 font-mono text-xs leading-relaxed text-slate-100">
{`POST /api/analyze
{ "client_id": "C006" }`}
              </pre>

              <p className="mt-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                Response fields
              </p>
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {[
                  "id",
                  "name",
                  "riskLevel",
                  "riskCategory",
                  "riskSignals",
                  "priority",
                  "recommendedAction",
                  "taskStatus",
                ].map((field) => (
                  <li
                    key={field}
                    className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600"
                  >
                    {field}
                  </li>
                ))}
              </ul>

              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                The webhook URL stays server-side. Requests time out after
                120&nbsp;seconds and failures return user-friendly errors.
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}

