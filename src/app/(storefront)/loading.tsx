export default function StorefrontLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-10">
      <div className="mb-6 h-8 w-1/3 rounded-lg bg-brand-border/60" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-3">
            <div className="aspect-[4/3] w-full rounded-2xl bg-brand-border/60" />
            <div className="h-3 w-2/3 rounded bg-brand-border/60" />
            <div className="h-4 w-1/2 rounded bg-brand-border/60" />
          </div>
        ))}
      </div>
    </div>
  );
}
