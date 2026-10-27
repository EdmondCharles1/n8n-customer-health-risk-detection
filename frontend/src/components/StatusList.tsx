import type { ReactNode } from "react";

export function StatusList({
  title,
  items,
  icon,
  tone,
  headerTone,
}: {
  title: string;
  items: string[];
  icon: ReactNode;
  tone: string;
  headerTone: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3
        className={`flex items-center gap-2 text-sm font-semibold uppercase tracking-wider ${headerTone}`}
      >
        {title}
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium normal-case tracking-normal text-slate-600">
          {items.length}
        </span>
      </h3>

      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-sm text-slate-700"
          >
            <span
              aria-hidden="true"
              className={`mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${tone}`}
            >
              {icon}
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
