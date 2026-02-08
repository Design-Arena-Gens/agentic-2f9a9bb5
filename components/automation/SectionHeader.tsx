type SectionHeaderProps = {
  stats: {
    id: string;
    label: string;
    value: string;
    trend: string;
    icon: JSX.Element;
  }[];
  onCreate: () => void;
};

export function SectionHeader({ stats, onCreate }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-muted bg-muted/30 p-6 shadow-lg shadow-black/10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Channel Operations Command</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-300">
            Monitor AI-assisted production, orchestrate post-production edits, and deploy content
            across every surface with automated metadata, captioning, and iteration loops.
          </p>
        </div>
        <button
          onClick={onCreate}
          className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background transition hover:bg-accent/90"
        >
          Spin Up Automation
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-black/40 p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-slate-400">{stat.label}</span>
              <span>{stat.icon}</span>
            </div>
            <p className="text-2xl font-semibold text-white">{stat.value}</p>
            <span className="text-xs text-success">{stat.trend}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
