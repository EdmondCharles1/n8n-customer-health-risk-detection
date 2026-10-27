import type { Metadata } from "next";
import type { ReactNode } from "react";

import {
  FlowArrow,
  FlowNode,
  FlowZone,
  LegendItem,
} from "@/components/Flow";
import {
  BoltIcon,
  BoxIcon,
  BrainIcon,
  CheckIcon,
  ClockIcon,
  CloudIcon,
  DatabaseIcon,
  MessageIcon,
  PulseIcon,
  ShieldIcon,
  UserIcon,
} from "@/components/icons";
import { StatusList } from "@/components/StatusList";
import {
  Container,
  CtaBand,
  Eyebrow,
  IconTile,
  SectionHeading,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "Integrations",
  description:
    "How n8n, Google Sheets, Google Gemini, Slack, Next.js, Vercel and Docker fit together in the customer-health analysis flow.",
};

type StatusTone = "core" | "ok" | "pending" | "neutral";

const statusStyles: Record<StatusTone, { pill: string; dot: string }> = {
  core: {
    pill: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    dot: "bg-indigo-500",
  },
  ok: {
    pill: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
  },
  pending: {
    pill: "bg-amber-50 text-amber-800 ring-amber-200",
    dot: "bg-amber-500",
  },
  neutral: {
    pill: "bg-slate-100 text-slate-700 ring-slate-200",
    dot: "bg-slate-400",
  },
};

type Integration = {
  name: string;
  role: string;
  description: string;
  status: string;
  tone: StatusTone;
  group: "analysis" | "platform";
  Icon: (props: { className?: string }) => ReactNode;
};

const integrations: Integration[] = [
  {
    name: "n8n",
    role: "Workflow orchestration",
    description:
      "Receives analysis requests, retrieves customer data, calculates deterministic risk signals and coordinates the AI agents.",
    status: "Core workflow",
    tone: "core",
    group: "analysis",
    Icon: BoltIcon,
  },
  {
    name: "Google Sheets",
    role: "Customer data source",
    description:
      "Stores the customer information used by the health analysis workflow.",
    status: "Connected",
    tone: "ok",
    group: "analysis",
    Icon: DatabaseIcon,
  },
  {
    name: "Google Gemini",
    role: "AI reasoning",
    description:
      "Powers the specialized agents that classify risk, extract signals and recommend follow-up actions.",
    status: "Connected",
    tone: "ok",
    group: "analysis",
    Icon: BrainIcon,
  },
  {
    name: "Slack",
    role: "Operational notification",
    description:
      "Used by the broader workflow to notify the team about customer-risk actions.",
    status: "Being reintegrated into the Web App flow",
    tone: "pending",
    group: "platform",
    Icon: MessageIcon,
  },
  {
    name: "Next.js",
    role: "Web application",
    description:
      "Provides the customer-facing interface and the /api/analyze proxy route.",
    status: "Deployed",
    tone: "ok",
    group: "analysis",
    Icon: PulseIcon,
  },
  {
    name: "Vercel",
    role: "Frontend hosting",
    description: "Hosts the public Next.js web application.",
    status: "Deployed",
    tone: "ok",
    group: "platform",
    Icon: CloudIcon,
  },
  {
    name: "Docker",
    role: "Local development environment",
    description: "Runs the local n8n development environment.",
    status: "Development",
    tone: "neutral",
    group: "platform",
    Icon: BoxIcon,
  },
];

const agents = [
  {
    name: "Risk Classifier Agent",
    description: "Assigns risk level, category and confidence.",
  },
  {
    name: "Risk Signal Extractor Agent",
    description: "Extracts factual risk signals from the customer data.",
  },
  {
    name: "Action Reasoner Agent",
    description: "Recommends the operational follow-up.",
  },
  {
    name: "Slack Composer Agent",
    description: "Formats an already-made decision for Slack.",
    note: "Broader workflow · being reintegrated into the Web App flow",
  },
];

const available = [
  "Public Next.js interface",
  "Customer portfolio",
  "Customer detail pages",
  "Analyzer interface",
  "Deterministic risk logic",
  "Gemini multi-agent reasoning",
  "Google Sheets customer retrieval",
  "API proxy",
  "Vercel deployment",
];

const inProgress = [
  "Public production n8n endpoint",
  "Complete end-to-end public analysis",
  "Task creation / dedup reintegration",
  "Slack reintegration",
  "Production hardening",
];

export default function IntegrationsPage() {
  return (
    <>
      <section
        aria-labelledby="integrations-heading"
        className="relative border-b border-slate-200 bg-white"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-b from-indigo-50/80 via-white to-white"
        />

        <Container className="relative py-12 sm:py-16">
          <Eyebrow>System Integrations</Eyebrow>

          <h1
            id="integrations-heading"
            className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
          >
            How the system connects
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
            The prototype combines customer data, workflow automation, AI
            reasoning and a web interface into one customer-health analysis
            flow.
          </p>
        </Container>
      </section>

      <section aria-labelledby="services-heading" className="py-14 sm:py-20">
        <Container>
          <SectionHeading
            id="services-heading"
            eyebrow="Services"
            title="Seven building blocks, one flow"
            description="Each card states the service's role and its current status in the prototype."
          />

          <h3 className="mt-10 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Analysis path
          </h3>

          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {analysisPath.map((integration) => (
              <IntegrationCard
                key={integration.name}
                integration={integration}
              />
            ))}
          </ul>

          <h3 className="mt-10 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Hosting &amp; operations
          </h3>

          <ul className="mt-4 grid gap-4 md:grid-cols-3">
            {platform.map((integration) => (
              <IntegrationCard
                key={integration.name}
                integration={integration}
              />
            ))}
          </ul>
        </Container>
      </section>

      <IntegrationFlow />

      <section
        aria-labelledby="agents-heading"
        className="py-14 sm:py-20"
      >
        <Container>
          <SectionHeading
            id="agents-heading"
            eyebrow="AI Agents"
            title="Gemini agents and what they own"
            description="Agents work on top of the deterministic risk calculations computed earlier in the n8n workflow."
          />

          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {agents.map((agent) => (
              <li
                key={agent.name}
                className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
              >
                <IconTile className="bg-violet-50 text-violet-600 ring-violet-100">
                  <BrainIcon className="h-5 w-5" />
                </IconTile>

                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900">
                    {agent.name}
                  </h3>

                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {agent.description}
                  </p>

                  {agent.note && (
                    <p className="mt-3 inline-flex rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-200">
                      {agent.note}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section
        aria-labelledby="boundaries-heading"
        className="border-t border-slate-200 bg-white pt-14 sm:pt-20"
      >
        <Container>
          <SectionHeading
            id="boundaries-heading"
            eyebrow="Transparency"
            title="Prototype boundaries"
            description="What the prototype offers today, and what is still being built."
          />

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            <StatusList
              title="Available"
              items={available}
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

      <div className="bg-white">
        <CtaBand
          title="See the integrations at work"
          description="Follow the guided demo to run an analysis through the analyzer."
          href="/demo"
          label="Open the Guided Demo"
        />
      </div>
    </>
  );
}

// Analysis path cards follow the request order shown in the flow below.
const analysisOrder = ["Next.js", "n8n", "Google Sheets", "Google Gemini"];
const analysisPath = analysisOrder.map(
  (name) => integrations.find((integration) => integration.name === name)!
);
const platform = integrations.filter(
  (integration) => integration.group === "platform"
);

function IntegrationCard({ integration }: { integration: Integration }) {
  const status = statusStyles[integration.tone];
  const { Icon } = integration;

  return (
    <li className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3.5">
        <IconTile>
          <Icon className="h-5 w-5" />
        </IconTile>

        <div className="min-w-0">
          <h4 className="font-semibold text-slate-900">{integration.name}</h4>

          <p className="text-sm font-medium text-indigo-600">
            {integration.role}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-600">
        {integration.description}
      </p>

      <p className="mt-auto pt-5 text-xs">
        <span className="sr-only">Status: </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-medium ring-1 ring-inset ${status.pill}`}
        >
          <span
            aria-hidden="true"
            className={`h-1.5 w-1.5 shrink-0 rounded-full ${status.dot}`}
          />
          {integration.status}
        </span>
      </p>
    </li>
  );
}

function IntegrationFlow() {
  const icon = "h-4 w-4";

  return (
    <section
      aria-labelledby="flow-heading"
      className="border-y border-slate-200 bg-slate-50 py-14 sm:py-20"
    >
      <Container>
        <SectionHeading
          id="flow-heading"
          eyebrow="Integration flow"
          title="From a click to a recommendation"
          description="The response path the web app uses, with the Slack branch shown separately."
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
          <ol
            aria-label="Analysis response path"
            className="mx-auto w-full max-w-2xl"
          >
            <li>
              <FlowNode
                kind="app"
                title="User"
                detail="Picks a customer in the analyzer"
                tag="Start"
                icon={<UserIcon className={icon} />}
              />
            </li>
            <li>
              <FlowArrow />
            </li>
            <li>
              <FlowZone label="Next.js on Vercel">
                <FlowNode
                  kind="app"
                  title="Next.js Web App"
                  detail="Sends the selected customer ID"
                  tag="Browser"
                  icon={<PulseIcon className={icon} />}
                />
                <FlowArrow />
                <FlowNode
                  kind="app"
                  title="/api/analyze"
                  detail="Server-side proxy route"
                  tag="Proxy"
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
                  detail="Receives the analysis request"
                  tag="Trigger"
                  icon={<BoltIcon className={icon} />}
                />
                <FlowArrow />
                <FlowNode
                  kind="workflow"
                  title="Google Sheets"
                  detail="Customer record lookup"
                  tag="Data"
                  icon={<DatabaseIcon className={icon} />}
                />
                <FlowArrow />
                <FlowNode
                  kind="workflow"
                  title="Risk Calculations"
                  detail="Deterministic business rules"
                  tag="Rules"
                  icon={<ShieldIcon className={icon} />}
                />
                <FlowArrow />
                <FlowNode
                  kind="ai"
                  title="Gemini Agents"
                  detail="Classifier, Signal Extractor, Action Reasoner"
                  tag="AI"
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
                detail="Displays the analysis result"
                tag="Result"
                icon={<PulseIcon className={icon} />}
              />
            </li>
          </ol>

          <aside
            aria-labelledby="branch-heading"
            className="space-y-4 lg:sticky lg:top-24 lg:self-start"
          >
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3
                id="branch-heading"
                className="text-sm font-semibold text-slate-900"
              >
                Downstream operational branch
              </h3>

              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                Slack notifications belong to the broader n8n workflow.
                They are not part of the response path the web app uses
                today.
              </p>

              <div className="mt-4">
                <FlowNode
                  kind="workflow"
                  title="n8n Workflow"
                  icon={<BoltIcon className={icon} />}
                />

                <div className="flex items-start">
                  <span
                    aria-hidden="true"
                    className="ml-[1.35rem] h-8 w-5 shrink-0 rounded-bl-lg border-b-2 border-l-2 border-dashed border-amber-400"
                  />
                  <span className="sr-only">branches to</span>

                  <div className="mt-2 min-w-0 flex-1">
                    <FlowNode
                      kind="pending"
                      title="Slack notification"
                      detail="Being reintegrated"
                      icon={<MessageIcon className={icon} />}
                    />
                  </div>
                </div>
              </div>
            </div>

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
                  Gemini AI agents
                </LegendItem>
                <LegendItem className="border-dashed border-amber-400 bg-amber-50">
                  Being reintegrated
                </LegendItem>
              </ul>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
