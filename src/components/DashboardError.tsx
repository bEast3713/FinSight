export function DashboardError({ error }: { error: Error }) {
  return (
    <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-white/40 p-12 text-center shadow-lg backdrop-blur-xl">
      <div className="rounded-full bg-rose-100 p-4 text-rose-600 shadow-sm">
        <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="mt-6 text-xl font-bold text-slate-800">Company Not Found or Data Unavailable</h2>
      <p className="mt-2 text-slate-600 max-w-md">
        {error.message || "We encountered an error fetching live data. Please try searching for a different ticker."}
      </p>
    </div>
  );
}
