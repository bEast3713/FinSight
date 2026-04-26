export type CompanyKey = "apple" | "google" | "microsoft" | "ibm" | "jpmorgan";

export type RevenueDatum = {
  year: number;
  revenue_billions: number;
  net_income_billions: number;
};

export type StockDatum = {
  date: string;
  close: number;
  volume: number;
};

export type EpsDatum = {
  year: number;
  eps: number;
};

export type DebtDatum = {
  year: number;
  total_debt_billions: number;
  total_liabilities_billions: number;
};

export type MarketCapDatum = {
  year: number;
  market_cap_billions: number;
};

export type CompanyMeta = {
  name: string;
  ticker: string;
  sector: string;
  description: string;
  founded: number;
};

export type HealthBreakdown = {
  component: string;
  weight: number;
  rawScore: number;
  weightedScore: number;
};
