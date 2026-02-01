import { memo } from 'react';
import type { ReactNode } from 'react';

interface KPICardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
}

function KPICard({ label, value, icon }: KPICardProps) {
  return (
    <div className="rounded-lg bg-brand px-4 py-4 flex items-center gap-4 min-w-0">
      <div className="shrink-0 text-neutral-800">{icon}</div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-neutral-800 truncate">{label}</p>
        <p className="text-lg font-semibold text-neutral-900 truncate">{value}</p>
      </div>
    </div>
  );
}

export default memo(KPICard);
