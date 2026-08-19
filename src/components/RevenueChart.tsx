"use client";

import { useState, useEffect } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Row = {
  year: number;
  revenue: number;
  netIncome: number;
  forecastRevenue?: number;
  forecastNetIncome?: number;
};

export function RevenueChart({ data }: { data: Row[] }) {
  console.log("RevenueChart data:", data);
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-600">Revenue & Net Income</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data}>
            <XAxis dataKey="year" />
            <YAxis unit="B" />
            <Tooltip formatter={(value) => `$${Number(value).toFixed(1)}B`} />
            <Line type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="netIncome" stroke="#14B8A6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="forecastRevenue" stroke="#2563EB" strokeDasharray="5 5" dot={false} />
            <Line type="monotone" dataKey="forecastNetIncome" stroke="#14B8A6" strokeDasharray="5 5" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-slate-500">Forecast based on linear regression - not financial advice.</p>
    </section>
  );
}
