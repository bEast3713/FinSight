"use client";
import { useState } from "react";
import type { CompanyMeta } from "@/types";

export function CompanyHeader({ meta }: { meta: CompanyMeta }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = meta.description.length > 250;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-black text-lg font-bold text-white">
          {meta.ticker.slice(0, 1)}
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">{meta.name}</h1>
          <p className="text-sm text-slate-500">
            {meta.ticker} | {meta.sector} {meta.founded && meta.founded !== 0 ? `| Founded ${meta.founded}` : ""}
          </p>
        </div>
      </div>
      <div className="mt-3 text-slate-600 text-sm leading-relaxed">
        {expanded || !isLong ? meta.description : `${meta.description.slice(0, 250)}... `}
        {isLong && (
          <button onClick={() => setExpanded(!expanded)} className="font-medium text-blue-600 hover:underline">
            {expanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>
    </section>
  );
}
