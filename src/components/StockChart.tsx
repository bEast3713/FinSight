"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const ranges = ["1Y", "3Y", "5Y", "All"] as const;

export function StockChart({ data }: { data: { date: string; close: number }[] }) {
  const [range, setRange] = useState<(typeof ranges)[number]>("All");

  const filtered = useMemo(() => {
    if (range === "All") return data;
    const months = range === "1Y" ? 2 : range === "3Y" ? 6 : 10;
    return data.slice(-months);
  }, [data, range]);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-600">Stock Price History</h3>
        <div className="flex gap-1">
          {ranges.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setRange(item)}
              className={`rounded-md px-2 py-1 text-xs ${range === item ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-600"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filtered}>
            <XAxis dataKey="date" tickFormatter={(d: string) => d.slice(0, 7)} />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="close" stroke="#2563EB" fill="#93C5FD" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
