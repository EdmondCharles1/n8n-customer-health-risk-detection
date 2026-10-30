import { describe, expect, it } from "vitest";

import { getTone, toneStyles } from "./RiskBadge";

// getTone maps free-form AI output (riskLevel, priority) to a display tone.
describe("getTone", () => {
  it.each([
    ["HIGH", "high"],
    ["CRITICAL", "high"],
    ["URGENT", "high"],
    ["P1", "high"],
    ["MEDIUM", "medium"],
    ["MODERATE", "medium"],
    ["P2", "medium"],
    ["LOW", "low"],
    ["P3", "low"],
  ] as const)("maps %s to %s", (value, tone) => {
    expect(getTone(value)).toBe(tone);
  });

  it("normalises case and surrounding whitespace from LLM output", () => {
    expect(getTone("  high ")).toBe("high");
    expect(getTone("Medium")).toBe("medium");
    expect(getTone("low\n")).toBe("low");
  });

  it("falls back to neutral for unknown or empty values", () => {
    expect(getTone("UNKNOWN")).toBe("neutral");
    expect(getTone("")).toBe("neutral");
    expect(getTone("HIGHEST")).toBe("neutral");
  });

  it("always resolves to a tone that has styles defined", () => {
    for (const value of ["HIGH", "MEDIUM", "LOW", "???"]) {
      expect(toneStyles[getTone(value)]).toBeDefined();
    }
  });
});
