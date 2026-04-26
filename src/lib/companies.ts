import type { CompanyKey } from "@/types";

export const COMPANY_OPTIONS: Array<{ key: CompanyKey; label: string }> = [
  { key: "apple", label: "Apple" },
  { key: "google", label: "Google" },
  { key: "microsoft", label: "Microsoft" },
  { key: "ibm", label: "IBM" },
  { key: "jpmorgan", label: "JPMorgan" },
];

export function isCompanyKey(value: string): value is CompanyKey {
  return COMPANY_OPTIONS.some((company) => company.key === value);
}
