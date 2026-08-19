"use client";

import { useState, useEffect } from "react";
import { Bar, BarChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function GrowthChart({ data }: { data: { year: number; growth: number }[] }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-600">YoY Revenue Growth</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height={288}>
          <BarChart data={data}>
            <XAxis dataKey="year" />
            <YAxis unit="%" />
            <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
            <ReferenceLine y={0} stroke="#94A3B8" />
            <Bar dataKey="growth" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
