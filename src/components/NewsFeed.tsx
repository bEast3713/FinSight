import { ExternalLink, Newspaper } from "lucide-react";
import type { NewsDatum } from "@/types";

function formatTimeAgo(timestamp: number | string | Date) {
  const date = new Date(timestamp);
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function NewsFeed({ news }: { news: NewsDatum[] }) {
  if (!news || news.length === 0) {
    return (
      <section className="rounded-2xl border border-white/40 bg-white/40 p-6 shadow-xl backdrop-blur-xl">
        <h3 className="flex items-center text-lg font-semibold text-slate-800">
          <Newspaper className="mr-2 h-5 w-5 text-blue-600" />
          Latest News
        </h3>
        <p className="mt-4 text-sm text-slate-500">No recent news available for this company.</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-white/40 bg-white/40 p-6 shadow-xl backdrop-blur-xl">
      <h3 className="mb-4 flex items-center text-lg font-semibold text-slate-800">
        <Newspaper className="mr-2 h-5 w-5 text-blue-600" />
        Latest News
      </h3>
      <div className="flex flex-col space-y-4">
        {news.slice(0, 5).map((item) => (
          <a
            key={item.uuid}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-between rounded-xl border border-white/50 bg-white/50 p-4 transition-all hover:bg-white hover:shadow-md sm:flex-row sm:items-center"
          >
            <div className="flex flex-col">
              <h4 className="text-base font-medium text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-2">
                {item.title}
              </h4>
              <div className="mt-2 flex items-center space-x-3 text-sm text-slate-500">
                <span className="font-semibold text-slate-600">{item.publisher}</span>
                <span>•</span>
                <span>{formatTimeAgo(item.providerPublishTime)}</span>
              </div>
            </div>
            <ExternalLink className="mt-3 hidden h-5 w-5 text-slate-400 group-hover:text-blue-600 sm:mt-0 sm:block" />
          </a>
        ))}
      </div>
    </section>
  );
}
