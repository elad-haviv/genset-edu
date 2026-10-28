export const calculatorIds = ["power3ph", "kwkva", "pf", "loading", "demand", "redundancy"] as const;
export type CalculatorId = (typeof calculatorIds)[number];
