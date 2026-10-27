"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  allNav,
  isActivePath,
  moreNav,
  primaryNav,
} from "@/lib/navigation";

import {
  ChevronIcon,
  CloseIcon,
  MenuIcon,
  PulseIcon,
  SparkleIcon,
} from "./icons";
import { focusRing } from "./ui";

function AiBadge() {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200">
      <SparkleIcon className="h-3.5 w-3.5" />
      AI Powered
    </span>
  );
}

const desktopLinkBase = `rounded-lg px-3 py-2 text-sm font-medium transition ${focusRing}`;
const desktopLinkActive = "bg-indigo-50 text-indigo-700";
const desktopLinkIdle =
  "text-slate-600 hover:bg-slate-100 hover:text-slate-900";

/**
 * Disclosure-style dropdown (a button that shows a list of links).
 * Closes on Escape, on a click outside, when focus leaves it, or when
 * a link is chosen.
 */
function MoreMenu({ pathname }: { pathname: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const activeItem = moreNav.find((item) =>
    isActivePath(pathname, item.href)
  );

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls="more-menu"
        onClick={() => setIsOpen((open) => !open)}
        className={`inline-flex items-center gap-1 ${desktopLinkBase} ${
          activeItem ? desktopLinkActive : desktopLinkIdle
        }`}
      >
        More
        {activeItem && (
          <span className="sr-only">
            (current page: {activeItem.label})
          </span>
        )}
        <ChevronIcon
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <ul
          id="more-menu"
          className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg shadow-slate-900/5"
        >
          {moreNav.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium ${focusRing} ${
                    active
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {item.label}

                  {active && (
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-indigo-600"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          onClick={() => setIsMenuOpen(false)}
          className={`-mx-1 flex min-w-0 items-center gap-2.5 rounded-lg px-1 py-1 ${focusRing}`}
        >
          <span
            aria-hidden="true"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-indigo-600 to-violet-600 text-white shadow-sm"
          >
            <PulseIcon className="h-4 w-4" />
          </span>

          <span className="text-[13px] font-semibold leading-tight text-slate-900 sm:text-sm">
            Customer Success Intelligence
          </span>
        </Link>

        <div className="hidden items-center gap-5 md:flex">
          <nav aria-label="Main">
            <ul className="flex items-center gap-1">
              {primaryNav.map((item) => {
                const active = isActivePath(pathname, item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`${desktopLinkBase} ${
                        active ? desktopLinkActive : desktopLinkIdle
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}

              <li>
                <MoreMenu pathname={pathname} />
              </li>
            </ul>
          </nav>

          <span className="hidden lg:inline-flex">
            <AiBadge />
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-700 ring-1 ring-inset ring-slate-200 transition hover:bg-slate-100 md:hidden ${focusRing}`}
        >
          <span className="sr-only">
            {isMenuOpen ? "Close menu" : "Open menu"}
          </span>

          {isMenuOpen ? (
            <CloseIcon className="h-5 w-5" />
          ) : (
            <MenuIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-slate-200 bg-white md:hidden"
        >
          <nav
            aria-label="Main"
            className="mx-auto max-w-6xl px-4 py-3 sm:px-6"
          >
            <ul className="space-y-1">
              {allNav.map((item) => {
                const active = isActivePath(pathname, item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium ${focusRing} ${
                        active
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {item.label}

                      {active && (
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 rounded-full bg-indigo-600"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-3 border-t border-slate-100 px-3 pt-3">
              <AiBadge />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
