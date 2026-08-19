import { Suspense } from "react";
import { ChatPanel } from "@/components/ChatPanel";
import { CompanyHeader } from "@/components/CompanyHeader";
import { SearchBar } from "@/components/SearchBar";
import { NewsFeed } from "@/components/NewsFeed";
import { HealthScore } from "@/components/HealthScore";
import { MetricCard } from "@/components/MetricCard";
import { Navbar } from "@/components/Navbar";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";
import { DashboardError } from "@/components/DashboardError";
import { formatBillions, formatTrillions } from "@/lib/formatters";

import { RevenueChart } from "@/components/RevenueChart";
import { GrowthChart } from "@/components/GrowthChart";
import { StockChart } from "@/components/StockChart";
import { computeHealthScore } from "@/lib/healthScore";
import { COMPANY_OPTIONS, isCompanyKey } from "@/lib/companies";
import { linearRegression } from "@/lib/regression";
import { getCompanyData } from "@/lib/yahoo";

async function DashboardContent({ selectedCompany }: { selectedCompany: string }) {
  let data;
  try {
    data = await getCompanyData(selectedCompany);
  } catch (error) {
    return <DashboardError error={error as Error} />;
  }

  const { meta, revenue, stock, eps, debt, marketCap, news } = data;

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

  const lastYear = revenue.at(-1)!.year;
  const nextYear1 = lastYear + 1;
  const nextYear2 = lastYear + 2;

  const revenueChartData = revenue.map((item, index) => {
    const isLast = index === revenue.length - 1;
    return {
      year: item.year,
      revenue: item.revenue_billions,
      netIncome: item.net_income_billions,
      // Start the forecast line exactly at the last historical point so they connect seamlessly
      ...(isLast ? { forecastRevenue: item.revenue_billions, forecastNetIncome: item.net_income_billions } : {}),
    };
  });

  revenueChartData.push(
    {
      year: nextYear1,
      forecastRevenue: revenueRegression.forecast(nextYear1),
      forecastNetIncome: incomeRegression.forecast(nextYear1),
      revenue: null as any,
      netIncome: null as any,
    },
    {
      year: nextYear2,
      forecastRevenue: revenueRegression.forecast(nextYear2),
      forecastNetIncome: incomeRegression.forecast(nextYear2),
      revenue: null as any,
      netIncome: null as any,
    }
  );

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
      <div className="mt-8">
        <CompanyHeader meta={meta} />

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Revenue" value={formatBillions(latestRevenue.revenue_billions)} delta={revenueDelta} />
          <MetricCard title="Net Income" value={formatBillions(latestRevenue.net_income_billions)} delta={incomeDelta} />
          <MetricCard title="Market Cap" value={formatTrillions(latestMarketCap.market_cap_billions)} delta={marketCapDelta} />
          <HealthScore score={health.score} context={systemContext} companyName={meta.name} />
        </section>

        <div className="mt-8">
          <RevenueChart data={revenueChartData} />
        </div>

        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <GrowthChart data={growthData} />
          <StockChart data={stockData} />
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ChatPanel context={systemContext} companyName={meta.name} />
          </div>
          <div className="lg:col-span-1">
            <NewsFeed news={news} />
          </div>
        </section>
      </div>
    );
}

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ company?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const selectedCompany = params.company && isCompanyKey(params.company) ? params.company : COMPANY_OPTIONS[0].key;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/50 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute top-0 -right-40 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      
      <Navbar />
      <main className="mx-auto flex max-w-7xl flex-col px-6 py-8 relative z-10">
        <SearchBar selected={selectedCompany} />
        
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent selectedCompany={selectedCompany} />
        </Suspense>
      </main>
    </div>
  );
}
