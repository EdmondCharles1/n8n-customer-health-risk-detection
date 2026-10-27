export type NavItem = { href: string; label: string };

/** Always visible in the desktop header. */
export const primaryNav: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/customers", label: "Customers" },
  { href: "/analyze", label: "Analyzer" },
  { href: "/project", label: "Project" },
];

/** Grouped under "More" in the desktop header. */
export const moreNav: NavItem[] = [
  { href: "/demo", label: "Demo" },
  { href: "/integrations", label: "Integrations" },
];

/** Every page, in reading order (mobile menu and footer). */
export const allNav: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/customers", label: "Customers" },
  { href: "/analyze", label: "Analyzer" },
  { href: "/demo", label: "Demo" },
  { href: "/integrations", label: "Integrations" },
  { href: "/project", label: "Project" },
];

export function isActivePath(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}
