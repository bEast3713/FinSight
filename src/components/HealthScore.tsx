"use client";

import { useEffect, useState } from "react";

export function HealthScore({ score, context, companyName }: { score: number; context: string; companyName: string }) {
  const [summary, setSummary] = useState("Loading insight...");
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = score <= 40 ? "#EF4444" : score <= 70 ? "#F59E0B" : "#10B981";

  useEffect(() => {
    const run = async () => {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", content: `Summarise ${companyName} financial health in one sentence.` }],
            systemContext: context,
            companyName,
          }),
        });
        const data = await response.json();
        setSummary(data.reply ?? "AI summary unavailable right now.");
      } catch {
        setSummary("AI summary unavailable right now.");
      }
    };
    void run();
  }, [companyName, context]);

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">Company Health Score</p>
      <div className="mt-4 grid place-items-center">
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r={radius} stroke="#E2E8F0" strokeWidth="12" fill="none" />
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke={color}
            strokeWidth="12"
            fill="none"
            strokeDasharray={`${progress} ${circumference}`}
            strokeLinecap="round"
            transform="rotate(-90 70 70)"
          />
          <text x="70" y="68" textAnchor="middle" className="fill-slate-800 text-2xl font-bold">
            {score}
          </text>
          <text x="70" y="88" textAnchor="middle" className="fill-slate-500 text-[11px]">
            Health Score
          </text>
        </svg>
      </div>
      <p className="mt-3 text-sm text-slate-600">{summary}</p>
    </article>
  );
}
