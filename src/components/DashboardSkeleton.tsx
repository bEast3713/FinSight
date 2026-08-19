export function DashboardSkeleton() {
  return (
    <div className="w-full animate-pulse mt-8">
      {/* Header Skeleton */}
      <div className="h-10 w-64 rounded-md bg-white/40 shadow-sm backdrop-blur-xl"></div>
      <div className="mt-4 h-20 w-full max-w-2xl rounded-lg bg-white/40 shadow-sm backdrop-blur-xl"></div>
      
      {/* Metric Cards Skeleton */}
      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="h-32 rounded-2xl bg-white/40 shadow-sm backdrop-blur-xl"></div>
        <div className="h-32 rounded-2xl bg-white/40 shadow-sm backdrop-blur-xl"></div>
        <div className="h-32 rounded-2xl bg-white/40 shadow-sm backdrop-blur-xl"></div>
        <div className="h-32 rounded-2xl bg-white/40 shadow-sm backdrop-blur-xl"></div>
      </section>
      
      {/* Charts Skeleton */}
      <div className="mt-8 h-96 rounded-2xl bg-white/40 shadow-sm backdrop-blur-xl"></div>
    </div>
  );
}
