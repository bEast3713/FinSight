import { TrendingDown, TrendingUp } from "lucide-react";

export function MetricCard({
  title,
  value,
  delta,
}: {
  title: string;
  value: string;
  delta: number;
}) {
  const trend = delta > 0 ? "up" : delta < 0 ? "down" : "flat";
  const trendClass =
    trend === "up" ? "text-emerald-600 bg-emerald-50" : trend === "down" ? "text-red-600 bg-red-50" : "text-slate-500 bg-slate-100";

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-1 text-3xl font-bold text-slate-800">{value}</p>
      <div className={`mt-3 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${trendClass}`}>
        {trend === "up" && <TrendingUp size={14} />}
        {trend === "down" && <TrendingDown size={14} />}
        <span>{delta > 0 ? "+" : ""}{delta.toFixed(1)}%</span>
      </div>
    </article>
  );
}
