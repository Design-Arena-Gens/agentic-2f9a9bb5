type StatCardProps = {
  label: string;
  value: string;
  badge: string;
};

export function StatCard({ label, value, badge }: StatCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-black/30 p-4">
      <span className="text-xs uppercase tracking-wide text-slate-400">{label}</span>
      <p className="text-2xl font-semibold text-white">{value}</p>
      <span className="text-xs text-slate-400">{badge}</span>
    </div>
  );
}
