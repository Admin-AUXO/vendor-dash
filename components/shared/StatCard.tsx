import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { cn } from '../ui/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
  tooltip?: string;
}

/**
 * StatCard Component
 * 
 * Displays key performance indicators with icons and trend indicators
 * 
 * @example
 * <StatCard
 *   title="Active Work Orders"
 *   value={24}
 *   change="+3 new today"
 *   trend="up"
 *   icon={ClipboardList}
 * />
 */
export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  trend = 'neutral',
  className,
  tooltip,
}: StatCardProps) {
  const changeColor =
    trend === 'up'
      ? 'text-status-success'
      : trend === 'down'
      ? 'text-status-error'
      : 'text-gray-600';

  const cardContent = (
    <Card className={cn('border-0 shadow-md hover:shadow-lg transition-shadow h-full', className)}>
      <CardContent className="p-5 h-full flex flex-col">
        <div className="flex items-center justify-between gap-4 flex-1">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500 mb-1 font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 mb-0.5">{value}</h3>
            <p className={cn('text-xs font-medium min-h-[16px]', changeColor)}>
              {change || '\u00A0'}
            </p>
          </div>
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'var(--gold-50)' }}
          >
            <Icon
              className="w-7 h-7"
              style={{ color: 'var(--gold-600)' }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {cardContent}
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="text-sm">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return cardContent;
}

