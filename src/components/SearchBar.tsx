"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Clock } from "lucide-react";

export function SearchBar({ selected }: { selected: string }) {
  const router = useRouter();
  const [ticker, setTicker] = useState("");
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("finsight_recent");
      if (stored) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRecent(JSON.parse(stored));
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRecent(["AAPL", "GOOGL", "MSFT", "IBM", "JPM"]);
      }
    } catch {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRecent(["AAPL", "GOOGL", "MSFT", "IBM", "JPM"]);
    }
  }, []);

  const saveRecent = (newTicker: string) => {
    const cleanTicker = newTicker.toUpperCase().trim();
    if (!cleanTicker) return;
    const updated = [cleanTicker, ...recent.filter((t) => t !== cleanTicker)].slice(0, 6);
    setRecent(updated);
    localStorage.setItem("finsight_recent", JSON.stringify(updated));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker.trim()) return;
    saveRecent(ticker);
    router.push(`/?company=${ticker.toUpperCase()}`);
    setTicker("");
  };

  const handleChipClick = (chip: string) => {
    saveRecent(chip);
    router.push(`/?company=${chip}`);
  };

  return (
    <section className="rounded-2xl border border-white/40 bg-white/40 p-6 shadow-xl backdrop-blur-xl">
      <form onSubmit={handleSearch} className="relative flex items-center">
        <div className="absolute left-4 text-slate-400">
          <Search size={20} />
        </div>
        <input
          name="company"
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          placeholder="Search for any stock ticker (e.g., TSLA, NVDA)..."
          className="w-full rounded-xl border-none bg-white/60 py-4 pl-12 pr-4 text-lg font-medium text-slate-800 shadow-inner outline-none ring-2 ring-transparent transition-all placeholder:text-slate-400 focus:bg-white focus:ring-blue-500"
        />
        <button
          type="submit"
          className="absolute right-2 rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white shadow-md transition-colors hover:bg-blue-700"
        >
          Analyze
        </button>
      </form>

      {recent.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Clock size={16} className="text-slate-400 mr-1" />
          {recent.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => handleChipClick(chip)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
                chip === selected
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                  : "bg-white/60 text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
