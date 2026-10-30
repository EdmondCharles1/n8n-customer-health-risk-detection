import { describe, expect, it } from "vitest";

import { customers, getCustomer } from "./customers";

describe("customers catalog", () => {
  it("exposes the three demo customers analysed by the n8n workflow", () => {
    // These IDs must match rows in the Google Sheets `Clients` worksheet.
    expect(customers.map((customer) => customer.id)).toEqual([
      "C005",
      "C006",
      "C008",
    ]);
  });

  it("has unique, well-formed IDs and non-empty names", () => {
    const ids = customers.map((customer) => customer.id);

    expect(new Set(ids).size).toBe(ids.length);

    for (const customer of customers) {
      expect(customer.id).toMatch(/^C\d{3}$/);
      expect(customer.name.trim()).not.toBe("");
    }
  });
});

describe("getCustomer", () => {
  it("returns an existing customer with its identifier preserved", () => {
    expect(getCustomer("C005")).toEqual({ id: "C005", name: "Ember Agency" });
    expect(getCustomer("C006")?.name).toBe("Futura");
    expect(getCustomer("C008")?.name).toBe("Indigo Media");
  });

  it("returns undefined for an unknown customer", () => {
    expect(getCustomer("C999")).toBeUndefined();
    expect(getCustomer("")).toBeUndefined();
  });

  it("matches IDs exactly (case and whitespace are not normalised here)", () => {
    // The API route trims input before calling getCustomer; this module
    // itself performs strict lookups.
    expect(getCustomer("c005")).toBeUndefined();
    expect(getCustomer(" C005 ")).toBeUndefined();
  });
});
