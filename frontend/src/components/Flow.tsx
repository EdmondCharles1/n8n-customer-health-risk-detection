import type { ReactNode } from "react";

import { ArrowDownIcon } from "./icons";

export type NodeKind = "app" | "workflow" | "ai" | "pending";

const nodeStyles: Record<
  NodeKind,
  { card: string; tile: string; tag: string }
> = {
  app: {
    card: "border-indigo-200 bg-white",
    tile: "bg-indigo-50 text-indigo-600 ring-indigo-100",
    tag: "bg-indigo-50 text-indigo-700",
  },
  workflow: {
    card: "border-slate-200 bg-white",
    tile: "bg-slate-100 text-slate-600 ring-slate-200",
    tag: "bg-slate-100 text-slate-600",
  },
  ai: {
    card: "border-violet-200 bg-violet-50/60",
    tile: "bg-white text-violet-600 ring-violet-200",
    tag: "bg-violet-100 text-violet-700",
  },
  pending: {
    card: "border-dashed border-amber-300 bg-amber-50/60",
    tile: "bg-white text-amber-700 ring-amber-200",
    tag: "bg-amber-100 text-amber-800",
  },
};

export function FlowNode({
  title,
  detail,
  tag,
  kind,
  icon,
}: {
  title: string;
  detail?: string;
  tag?: string;
  kind: NodeKind;
  icon: ReactNode;
}) {
  const styles = nodeStyles[kind];

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border p-3 shadow-sm sm:p-3.5 ${styles.card}`}
    >
      <span
        aria-hidden="true"
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset ${styles.tile}`}
      >
        {icon}
      </span>

      <div className="min-w-0 flex-1">
        <p className="break-words text-sm font-semibold text-slate-900">
          {title}
        </p>

        {detail && (
          <p className="break-words text-xs text-slate-500">{detail}</p>
        )}
      </div>

      {tag && (
        <span
          className={`hidden shrink-0 rounded-md px-2 py-0.5 text-xs font-medium sm:inline ${styles.tag}`}
        >
          {tag}
        </span>
      )}
    </div>
  );
}

export function FlowArrow() {
  return (
    <div aria-hidden="true" className="flex justify-center py-1.5">
      <ArrowDownIcon className="h-4 w-4 text-slate-400" />
    </div>
  );
}

export function FlowZone({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-3 sm:p-4">
      <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      {children}
    </div>
  );
}

export function LegendItem({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  return (
    <li className="flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className={`h-3.5 w-3.5 shrink-0 rounded border ${className}`}
      />
      {children}
    </li>
  );
}
