import { linearRegression } from "@/lib/regression";
import type {
  DebtDatum,
  EpsDatum,
  HealthBreakdown,
  MarketCapDatum,
  RevenueDatum,
  StockDatum,
} from "@/types";

const clamp = (value: number) => Math.max(0, Math.min(100, value));

export function computeHealthScore(input: {
  revenue: RevenueDatum[];
  stock: StockDatum[];
  eps: EpsDatum[];
  debt: DebtDatum[];
  marketCap: MarketCapDatum[];
}) {
  const latestRevenue = input.revenue.at(-1);
  const fiveYearsAgo = input.revenue.at(-6);
  const latestDebt = input.debt.at(-1);
  const latestEps = input.eps.slice(-3);

  const cagr =
    latestRevenue && fiveYearsAgo
      ? (Math.pow(latestRevenue.revenue_billions / fiveYearsAgo.revenue_billions, 1 / 5) - 1) * 100
      : 0;
  const revenueScore = clamp((cagr / 10) * 100);

  const margin = latestRevenue
    ? (latestRevenue.net_income_billions / latestRevenue.revenue_billions) * 100
    : 0;
  const marginScore = clamp((margin / 25) * 100);

  const debtToIncome = latestRevenue && latestDebt
    ? latestDebt.total_debt_billions / latestRevenue.net_income_billions
    : 3;
  const debtScore = clamp((1 - Math.min(debtToIncome, 3) / 3) * 100);

  const stockStart = input.stock.at(0);
  const stockEnd = input.stock.at(-1);
  const oneYearReturn = stockStart && stockEnd ? ((stockEnd.close - stockStart.close) / stockStart.close) * 100 : 0;
  const stockScore = clamp(Math.max(0, oneYearReturn * 2));

  const epsRegression = linearRegression(latestEps.map((item) => ({ x: item.year, y: item.eps })));
  const epsScore = epsRegression.slope > 0 ? 100 : 0;

  const breakdown: HealthBreakdown[] = [
    { component: "Revenue growth (5yr CAGR)", weight: 25, rawScore: revenueScore, weightedScore: revenueScore * 0.25 },
    { component: "Profit margin", weight: 25, rawScore: marginScore, weightedScore: marginScore * 0.25 },
    { component: "Debt-to-income ratio", weight: 20, rawScore: debtScore, weightedScore: debtScore * 0.2 },
    { component: "Stock momentum", weight: 15, rawScore: stockScore, weightedScore: stockScore * 0.15 },
    { component: "EPS growth", weight: 15, rawScore: epsScore, weightedScore: epsScore * 0.15 },
  ];

  const score = Math.round(breakdown.reduce((acc, item) => acc + item.weightedScore, 0));

  return {
    score,
    breakdown,
    stats: { cagr, margin, oneYearReturn },
  };
}
