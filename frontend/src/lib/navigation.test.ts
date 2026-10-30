import { describe, expect, it } from "vitest";

import { allNav, isActivePath, moreNav, primaryNav } from "./navigation";

describe("isActivePath", () => {
  it("marks Home active only on the exact root path", () => {
    expect(isActivePath("/", "/")).toBe(true);
    expect(isActivePath("/customers", "/")).toBe(false);
  });

  it("marks a section active on its own path and nested paths", () => {
    expect(isActivePath("/customers", "/customers")).toBe(true);
    expect(isActivePath("/customers/C005", "/customers")).toBe(true);
  });

  it("does not match paths that only share a prefix", () => {
    expect(isActivePath("/customersX", "/customers")).toBe(false);
    expect(isActivePath("/analyze", "/customers")).toBe(false);
  });
});

describe("navigation lists", () => {
  it("lists every header link in the full navigation", () => {
    const allHrefs = allNav.map((item) => item.href);

    for (const item of [...primaryNav, ...moreNav]) {
      expect(allHrefs).toContain(item.href);
    }
  });
});
