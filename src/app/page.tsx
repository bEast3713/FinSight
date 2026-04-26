import { ChatPanel } from "@/components/ChatPanel";
import { CompanyHeader } from "@/components/CompanyHeader";
import { CompanySelector } from "@/components/CompanySelector";
import { GrowthChart } from "@/components/GrowthChart";
import { HealthScore } from "@/components/HealthScore";
import { MetricCard } from "@/components/MetricCard";
import { Navbar } from "@/components/Navbar";
import { RevenueChart } from "@/components/RevenueChart";
import { StockChart } from "@/components/StockChart";
import { formatBillions, formatTrillions } from "@/lib/formatters";
import { computeHealthScore } from "@/lib/healthScore";
import { COMPANY_OPTIONS, isCompanyKey } from "@/lib/companies";
import { linearRegression } from "@/lib/regression";
import type { CompanyKey, CompanyMeta, DebtDatum, EpsDatum, MarketCapDatum, RevenueDatum, StockDatum } from "@/types";
import { promises as fs } from "node:fs";
import path from "node:path";

async function readData<T>(fileName: string): Promise<T> {
  const filePath = path.join(process.cwd(), "public", "data", fileName);
  const content = await fs.readFile(filePath, "utf8");
  return JSON.parse(content) as T;
}

async function loadCompanyData(company: CompanyKey) {
  return Promise.all([
    readData<RevenueDatum[]>(`${company}_revenue.json`),
    readData<StockDatum[]>(`${company}_stock.json`),
    readData<EpsDatum[]>(`${company}_eps.json`),
    readData<DebtDatum[]>(`${company}_debt.json`),
    readData<MarketCapDatum[]>(`${company}_market_cap.json`),
    readData<CompanyMeta>(`${company}_meta.json`),
  ]);
}

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ company?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const selectedCompany = params.company && isCompanyKey(params.company) ? params.company : COMPANY_OPTIONS[0].key;

  const [revenue, stock, eps, debt, marketCap, meta] = await loadCompanyData(selectedCompany);

  const latestRevenue = revenue.at(-1)!;
  const prevRevenue = revenue.at(-2)!;
  const latestMarketCap = marketCap.at(-1)!;
  const prevMarketCap = marketCap.at(-2)!;

  const revenueDelta = ((latestRevenue.revenue_billions - prevRevenue.revenue_billions) / prevRevenue.revenue_billions) * 100;
  const incomeDelta = ((latestRevenue.net_income_billions - prevRevenue.net_income_billions) / prevRevenue.net_income_billions) * 100;
  const marketCapDelta = ((latestMarketCap.market_cap_billions - prevMarketCap.market_cap_billions) / prevMarketCap.market_cap_billions) * 100;

  const health = computeHealthScore({ revenue, stock, eps, debt, marketCap });

  const points = revenue.slice(-5);
  const revenueRegression = linearRegression(points.map((item) => ({ x: item.year, y: item.revenue_billions })));
  const incomeRegression = linearRegression(points.map((item) => ({ x: item.year, y: item.net_income_billions })));

  const revenueChartData = [
    ...revenue.map((item) => ({ year: item.year, revenue: item.revenue_billions, netIncome: item.net_income_billions })),
    {
      year: 2024,
      forecastRevenue: revenueRegression.forecast(2024),
      forecastNetIncome: incomeRegression.forecast(2024),
      revenue: revenue.at(-1)!.revenue_billions,
      netIncome: revenue.at(-1)!.net_income_billions,
    },
    {
      year: 2025,
      forecastRevenue: revenueRegression.forecast(2025),
      forecastNetIncome: incomeRegression.forecast(2025),
      revenue: revenue.at(-1)!.revenue_billions,
      netIncome: revenue.at(-1)!.net_income_billions,
    },
  ];

  const growthData = revenue.slice(1).map((item, idx) => ({
    year: item.year,
    growth: ((item.revenue_billions - revenue[idx].revenue_billions) / revenue[idx].revenue_billions) * 100,
  }));

  const stockData = stock.map((item) => ({ date: item.date, close: item.close }));

  const systemContext = JSON.stringify({
    COMPANY: meta,
    REVENUE_DATA: revenue,
    STOCK_DATA: stock,
    MARKET_CAP_DATA: marketCap,
    DEBT_DATA: debt,
    EPS_DATA: eps,
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
        <CompanySelector selected={selectedCompany} />
        <CompanyHeader meta={meta} />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Revenue" value={formatBillions(latestRevenue.revenue_billions)} delta={revenueDelta} />
          <MetricCard title="Net Income" value={formatBillions(latestRevenue.net_income_billions)} delta={incomeDelta} />
          <MetricCard title="Market Cap" value={formatTrillions(latestMarketCap.market_cap_billions)} delta={marketCapDelta} />
          <HealthScore score={health.score} context={systemContext} companyName={meta.name} />
        </section>

        <RevenueChart data={revenueChartData} />

        <section className="grid gap-4 lg:grid-cols-2">
          <GrowthChart data={growthData} />
          <StockChart data={stockData} />
        </section>

        <ChatPanel context={systemContext} companyName={meta.name} />
      </main>
    </div>
  );
}
