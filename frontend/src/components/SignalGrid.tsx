import {
  CalendarIcon,
  ClockIcon,
  LifebuoyIcon,
  SmileIcon,
} from "./icons";
import { IconTile } from "./ui";

type Variant = "long" | "short" | "compact";

const signals = [
  {
    titles: {
      long: "Customer inactivity",
      short: "Inactivity",
      compact: "Inactivity",
    },
    description: "Time elapsed since the customer last logged in.",
    compactDescription: "Last customer activity / login recency.",
    source: "last_login_date",
    Icon: ClockIcon,
  },
  {
    titles: {
      long: "NPS / satisfaction",
      short: "NPS",
      compact: "Satisfaction",
    },
    description: "The latest Net Promoter Score reported by the customer.",
    compactDescription: "NPS or customer sentiment.",
    source: "nps",
    Icon: SmileIcon,
  },
  {
    titles: {
      long: "Support escalation",
      short: "Support Escalation",
      compact: "Support",
    },
    description: "Whether the account currently has an escalated support case.",
    compactDescription: "Escalation status.",
    source: "support_escalated",
    Icon: LifebuoyIcon,
  },
  {
    titles: {
      long: "Renewal proximity",
      short: "Renewal Window",
      compact: "Renewal",
    },
    description: "How close the contract is to its renewal date.",
    compactDescription: "Proximity to renewal date.",
    source: "renewal_date",
    Icon: CalendarIcon,
  },
];

export function SignalGrid({
  variant = "long",
  showSource = false,
}: {
  variant?: Variant;
  showSource?: boolean;
}) {
  const isCompact = variant === "compact";

  return (
    <ul
      className={`grid gap-4 sm:grid-cols-2 ${
        isCompact ? "" : "lg:grid-cols-4"
      }`}
    >
      {signals.map(
        ({ titles, description, compactDescription, source, Icon }) => (
          <li
            key={source}
            className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${
              isCompact ? "flex items-start gap-4 p-4" : "p-5"
            }`}
          >
            <IconTile>
              <Icon className="h-5 w-5" />
            </IconTile>

            <div className="min-w-0">
              <h3
                className={`font-semibold text-slate-900 ${
                  isCompact ? "" : "mt-4"
                }`}
              >
                {titles[variant]}
              </h3>

              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                {isCompact ? compactDescription : description}
              </p>

              {showSource && (
                <p className="mt-4 inline-block rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600">
                  {source}
                </p>
              )}
            </div>
          </li>
        )
      )}
    </ul>
  );
}
