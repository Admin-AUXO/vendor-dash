import { memo } from 'react';

const STATUS_CLASS: Record<string, string> = {
  draft: 'bg-neutral-200 text-neutral-700',
  issued: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-amber-100 text-amber-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-neutral-200 text-neutral-600',
  sent: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
  pending: 'bg-amber-100 text-amber-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-neutral-200 text-neutral-600',
  open: 'bg-amber-100 text-amber-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-neutral-200 text-neutral-600',
};

function formatStatus(s: string): string {
  return s.replace(/_/g, ' ');
}

function StatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase();
  const cls = STATUS_CLASS[key] ?? 'bg-neutral-100 text-neutral-700';
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium capitalize ${cls}`}>
      {formatStatus(key)}
    </span>
  );
}

export default memo(StatusBadge);
