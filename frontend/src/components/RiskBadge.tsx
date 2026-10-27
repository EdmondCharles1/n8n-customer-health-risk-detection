export type Tone = "low" | "medium" | "high" | "neutral";

export const toneStyles: Record<
  Tone,
  { badge: string; dot: string; accent: string }
> = {
  high: {
    badge: "bg-red-50 text-red-700 ring-red-200",
    dot: "bg-red-500",
    accent: "bg-red-500",
  },
  medium: {
    badge: "bg-amber-50 text-amber-800 ring-amber-200",
    dot: "bg-amber-500",
    accent: "bg-amber-500",
  },
  low: {
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
    accent: "bg-emerald-500",
  },
  neutral: {
    badge: "bg-slate-100 text-slate-700 ring-slate-200",
    dot: "bg-slate-400",
    accent: "bg-slate-300",
  },
};

export function getTone(value: string): Tone {
  const normalized = value.trim().toUpperCase();

  if (["HIGH", "CRITICAL", "URGENT", "P1"].includes(normalized)) {
    return "high";
  }

  if (["MEDIUM", "MODERATE", "P2"].includes(normalized)) {
    return "medium";
  }

  if (["LOW", "P3"].includes(normalized)) {
    return "low";
  }

  return "neutral";
}

/**
 * Pill showing a level (risk or priority). The level is always spelled
 * out in text, so the badge never relies on color alone.
 */
export function RiskBadge({
  label,
  value,
  size = "sm",
}: {
  label?: string;
  value: string;
  size?: "sm" | "lg";
}) {
  const tone = toneStyles[getTone(value)];
  const sizeClasses =
    size === "lg"
      ? "px-3.5 py-1.5 text-sm"
      : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex w-fit shrink-0 items-center gap-2 rounded-full font-semibold ring-1 ring-inset ${tone.badge} ${sizeClasses}`}
    >
      <span
        aria-hidden="true"
        className={`h-2 w-2 rounded-full ${tone.dot}`}
      />
      {label ? `${value} ${label}` : value}
    </span>
  );
}
