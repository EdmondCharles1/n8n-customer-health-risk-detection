// Demo customers known to the frontend. Only the ID and name live here:
// every other customer field is read from Google Sheets by the n8n
// workflow when an analysis runs.
export const customers = [
  {
    id: "C005",
    name: "Ember Agency",
  },
  {
    id: "C006",
    name: "Futura",
  },
  {
    id: "C008",
    name: "Indigo Media",
  },
];

export type Customer = (typeof customers)[number];

export function getCustomer(id: string): Customer | undefined {
  return customers.find((customer) => customer.id === id);
}
