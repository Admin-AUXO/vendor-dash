import { format } from 'date-fns';
import { cn } from '../ui/utils';
import { LucideIcon } from 'lucide-react';

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp: Date | string;
  icon?: LucideIcon;
  status?: 'success' | 'warning' | 'error' | 'info';
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

const statusColors = {
  success: { bg: 'var(--status-success)', border: 'var(--status-success)' },
  warning: { bg: 'var(--warning)', border: 'var(--warning)' },
  error: { bg: 'var(--destructive)', border: 'var(--destructive)' },
  info: { bg: 'var(--info)', border: 'var(--info)' },
};

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn('relative', className)}>
      {/* Vertical line */}
      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />

      <div className="space-y-4">
        {items.map((item) => {
          const timestamp = typeof item.timestamp === 'string' ? new Date(item.timestamp) : item.timestamp;
          const Icon = item.icon;
          const statusColor = item.status 
            ? statusColors[item.status] 
            : { bg: 'var(--gray-400)', border: 'var(--gray-400)' };

          return (
            <div key={item.id} className="relative flex items-start gap-4">
              {/* Icon/Dot */}
              <div className="relative z-10 flex items-center justify-center">
                {Icon ? (
                  <div
                    className="w-10 h-10 rounded-full border-2 flex items-center justify-center bg-white"
                    style={{
                      backgroundColor: statusColor.bg,
                      borderColor: statusColor.border,
                    }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                ) : (
                  <div
                    className="w-3 h-3 rounded-full border-2 bg-white"
                    style={{
                      backgroundColor: statusColor.bg,
                      borderColor: statusColor.border,
                    }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>
                    {item.description && (
                      <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                    )}
                  </div>
                  <time className="text-xs text-gray-500 whitespace-nowrap">
                    {format(timestamp, 'MMM dd, yyyy HH:mm')}
                  </time>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

