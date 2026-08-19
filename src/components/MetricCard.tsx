import { DollarSign, TrendingUp, TrendingDown, Briefcase } from "lucide-react";

export function MetricCard({ title, value, delta }: { title: string; value: string | number; delta: number }) {
  const isPositive = delta >= 0;

  const getIcon = () => {
    if (title.toLowerCase().includes("revenue")) return <DollarSign className="h-5 w-5 text-blue-500" />;
    if (title.toLowerCase().includes("market cap")) return <Briefcase className="h-5 w-5 text-purple-500" />;
    return <DollarSign className="h-5 w-5 text-emerald-500" />;
  };

  return (
    <div className="group flex flex-col rounded-2xl border border-white/40 bg-white/40 p-6 shadow-lg backdrop-blur-xl transition-all hover:-translate-y-1 hover:bg-white/60 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wide text-slate-500 uppercase">{title}</h3>
        <div className="rounded-full bg-white/50 p-2 shadow-sm">{getIcon()}</div>
      </div>
      <div className="mt-4 flex items-baseline gap-3">
        <span className="text-3xl font-extrabold text-slate-800">{value}</span>
        <span className={`flex items-center text-sm font-bold ${isPositive ? "text-emerald-600" : "text-rose-600"}`}>
          {isPositive ? <TrendingUp className="mr-1 h-4 w-4" /> : <TrendingDown className="mr-1 h-4 w-4" />}
          {Math.abs(delta).toFixed(2)}%
        </span>
      </div>
    </div>
  );
}
