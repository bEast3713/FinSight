import type { CompanyMeta } from "@/types";

export function CompanyHeader({ meta }: { meta: CompanyMeta }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-black text-lg font-bold text-white">
          {meta.ticker.slice(0, 1)}
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">{meta.name}</h1>
          <p className="text-sm text-slate-500">
            {meta.ticker} | {meta.sector} | Founded {meta.founded}
          </p>
        </div>
      </div>
      <p className="mt-3 text-slate-600">{meta.description}</p>
    </section>
  );
}
