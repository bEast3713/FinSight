import type { CompanyKey } from "@/types";

export const COMPANY_OPTIONS: Array<{ key: CompanyKey; label: string }> = [
  { key: "AAPL", label: "Apple" },
  { key: "GOOGL", label: "Google" },
  { key: "MSFT", label: "Microsoft" },
  { key: "IBM", label: "IBM" },
  { key: "JPM", label: "JPMorgan" },
];

export function isCompanyKey(value: string): value is CompanyKey {
  return /^[A-Za-z0-9]{1,5}$/.test(value);
}
