import Link from "next/link";

import { allNav } from "@/lib/navigation";

import { PulseIcon } from "./icons";
import { focusRing } from "./ui";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-900 text-white"
          >
            <PulseIcon className="h-3.5 w-3.5" />
          </span>

          <div>
            <p className="text-sm font-semibold text-slate-900">
              Powered by n8n + Gemini
            </p>

            <p className="text-xs text-slate-500">
              Built with Next.js, n8n and AI agents
            </p>
          </div>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
            {allNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`rounded hover:text-slate-900 ${focusRing}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
