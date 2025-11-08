import { useState } from 'react';
import { MapPin, Wrench, Clock, Tag, User, Calendar, Building2, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { PriorityBadge } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';
import { format } from 'date-fns';
import type { WorkOrder } from '../../data/types';

interface InboxWorkOrderCardProps {
  workOrder: WorkOrder;
  onViewDetails?: () => void;
  onAction?: () => void;
  actionLabel?: string;
  actionVariant?: 'default' | 'destructive' | 'outline';
  className?: string;
}

/**
 * InboxWorkOrderCard Component
 * 
 * A specialized card component for the Inbox section with improved layout,
 * more details, and action buttons with expandable details section.
 */
export function InboxWorkOrderCard({ 
  workOrder, 
  onViewDetails, 
  onAction,
  actionLabel,
  actionVariant = 'default',
  className 
}: InboxWorkOrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  // Calculate time elapsed
  const getTimeElapsed = (date: Date): string => {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(date).getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInDays > 0) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }
  };

  const statusType = 
    workOrder.status === 'completed' ? 'success' :
    workOrder.status === 'in-progress' ? 'info' :
    workOrder.status === 'cancelled' ? 'error' :
    'pending';

  const statusLabel = workOrder.status
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Format due date
  const dueDate = format(new Date(workOrder.dueDate), 'MMM dd, yyyy');
  const isOverdue = new Date(workOrder.dueDate) < new Date() && workOrder.status !== 'completed';

  return (
    <div
      className={cn(
        'group relative bg-white border border-gray-200 rounded-lg',
        'hover:shadow-md hover:border-gray-300 transition-all duration-200',
        'overflow-hidden',
        className
      )}
    >
      {/* Main Card Content */}
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Left Icon */}
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center shadow-sm">
            <Wrench className="w-6 h-6 text-yellow-700" />
          </div>

          {/* Content Section - Takes more space */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Header Row - ID and Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-base text-gray-900 font-mono">
                {workOrder.workOrderId}
              </h3>
              <PriorityBadge priority={workOrder.priority} size="sm" />
              <StatusBadge status={statusType} label={statusLabel} size="sm" />
              <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md capitalize font-medium">
                {workOrder.serviceCategory}
              </span>
            </div>

            {/* Service Description */}
            <p className="text-sm text-gray-800 font-semibold">
              {workOrder.serviceDescription}
            </p>

            {/* Details Grid - More information in a better layout */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-2">
              {/* Location */}
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <MapPin className="w-3.5 h-3.5 text-yellow-600 flex-shrink-0" />
                <span className="truncate" title={workOrder.propertyAddress}>
                  {workOrder.propertyAddress.split(',')[0]}
                </span>
              </div>

              {/* Client */}
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <Building2 className="w-3.5 h-3.5 text-yellow-600 flex-shrink-0" />
                <span className="truncate" title={workOrder.clientName}>
                  {workOrder.clientName}
                </span>
              </div>

              {/* Requested Date */}
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <Clock className="w-3.5 h-3.5 text-yellow-600 flex-shrink-0" />
                <span className="truncate">Requested {getTimeElapsed(new Date(workOrder.requestDate))}</span>
              </div>

              {/* Due Date */}
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <Calendar className="w-3.5 h-3.5 text-yellow-600 flex-shrink-0" />
                <span className={cn('truncate', isOverdue && 'text-red-600 font-semibold')}>
                  Due: {dueDate}
                </span>
              </div>

              {/* Cost */}
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <Tag className="w-3.5 h-3.5 text-yellow-600 flex-shrink-0" />
                <span className="font-semibold text-gray-700 truncate">
                  ${(workOrder.estimatedCost || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              {/* Assigned Technician */}
              {workOrder.assignedTechnician && (
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <User className="w-3.5 h-3.5 text-yellow-600 flex-shrink-0" />
                  <span className="truncate">{workOrder.assignedTechnician}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons Section - Right Side */}
          <div className="flex-shrink-0 flex flex-col gap-2 items-end justify-start min-w-[140px]">
            {/* View Details Button - Toggles Expansion */}
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
                if (!isExpanded && onViewDetails) {
                  onViewDetails();
                }
              }}
              variant="outline"
              size="sm"
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium border-yellow-600 shadow-sm w-full"
            >
              <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 ml-1" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-1" />
              )}
            </Button>

            {/* Action Button (Move to In Progress, Reject, Archive) */}
            {onAction && actionLabel && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onAction?.();
                }}
                variant={actionVariant}
                size="sm"
                className={cn(
                  'w-full',
                  actionVariant === 'default' && 'bg-blue-600 hover:bg-blue-700 text-white',
                  actionVariant === 'destructive' && 'bg-red-600 hover:bg-red-700 text-white',
                  actionVariant === 'outline' && 'border-gray-300 hover:bg-gray-50 text-gray-700'
                )}
              >
                {actionLabel}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Details Section */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50 transition-all duration-300 ease-in-out">
          <div className="p-4">
            {/* Compact Multi-Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Column 1: Client Information */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1.5 border-b border-gray-300">
                  <Building2 className="w-3.5 h-3.5 text-yellow-600" />
                  <h4 className="text-xs font-semibold text-gray-900 uppercase">Client</h4>
                </div>
                <div className="space-y-2.5">
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Name</div>
                    <div className="text-sm text-gray-900 font-medium">{workOrder.clientName}</div>
                  </div>
                  {workOrder.clientContact && (
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Contact</div>
                      <div className="text-sm text-gray-900">{workOrder.clientContact}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Phone</div>
                    <a href={`tel:${workOrder.clientPhone}`} className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium">
                      {workOrder.clientPhone}
                    </a>
                  </div>
                  {workOrder.clientEmail && (
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Email</div>
                      <a href={`mailto:${workOrder.clientEmail}`} className="text-sm text-blue-600 hover:text-blue-700 hover:underline truncate block">
                        {workOrder.clientEmail}
                      </a>
                    </div>
                  )}
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Client ID</div>
                    <div className="text-sm text-gray-900 font-mono">{workOrder.clientId}</div>
                  </div>
                </div>
              </div>

              {/* Column 2: Property & Service Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1.5 border-b border-gray-300">
                  <MapPin className="w-3.5 h-3.5 text-yellow-600" />
                  <h4 className="text-xs font-semibold text-gray-900 uppercase">Property & Service</h4>
                </div>
                <div className="space-y-2.5">
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Address</div>
                    <div className="text-sm text-gray-900 leading-snug">{workOrder.propertyAddress}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Type</div>
                    <div className="text-sm text-gray-900 capitalize">{workOrder.propertyType.replace('-', ' ')}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Category</div>
                    <div className="text-sm text-gray-900 capitalize font-medium">{workOrder.serviceCategory}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Description</div>
                    <div className="text-sm text-gray-900 leading-snug">{workOrder.serviceDescription}</div>
                  </div>
                </div>
              </div>

              {/* Column 3: Timeline & Assignment */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1.5 border-b border-gray-300">
                  <Clock className="w-3.5 h-3.5 text-yellow-600" />
                  <h4 className="text-xs font-semibold text-gray-900 uppercase">Timeline</h4>
                </div>
                <div className="space-y-2.5">
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Requested</div>
                    <div className="text-sm text-gray-900 font-medium">{format(new Date(workOrder.requestDate), 'MMM dd, yyyy')}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Due</div>
                    <div className={cn("text-sm font-medium", isOverdue ? "text-red-600" : "text-gray-900")}>
                      {format(new Date(workOrder.dueDate), 'MMM dd, yyyy')}
                      {isOverdue && <span className="ml-1 text-xs">(Overdue)</span>}
                    </div>
                  </div>
                  {workOrder.completedDate && (
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Completed</div>
                      <div className="text-sm text-gray-900 font-medium">{format(new Date(workOrder.completedDate), 'MMM dd, yyyy')}</div>
                    </div>
                  )}
                  {workOrder.assignedTechnician && (
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Technician</div>
                      <div className="text-sm text-gray-900 font-medium">{workOrder.assignedTechnician}</div>
                    </div>
                  )}
                  {workOrder.assignedTeam && (
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Team</div>
                      <div className="text-sm text-gray-900 font-medium">{workOrder.assignedTeam}</div>
                    </div>
                  )}
                  {workOrder.estimatedHours && (
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Est. Hours</div>
                      <div className="text-sm text-gray-900 font-medium">{workOrder.estimatedHours}h</div>
                    </div>
                  )}
                  {workOrder.actualHours && (
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Actual Hours</div>
                      <div className="text-sm text-gray-900 font-medium">
                        {workOrder.actualHours}h
                        {workOrder.estimatedHours && (
                          <span className={cn(
                            "ml-1 text-xs",
                            workOrder.actualHours > workOrder.estimatedHours ? 'text-red-600' : 
                            workOrder.actualHours < workOrder.estimatedHours ? 'text-green-600' : 'text-gray-500'
                          )}>
                            ({workOrder.actualHours > workOrder.estimatedHours ? '+' : ''}{workOrder.actualHours - workOrder.estimatedHours}h)
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Column 4: Cost & Status */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1.5 border-b border-gray-300">
                  <Tag className="w-3.5 h-3.5 text-yellow-600" />
                  <h4 className="text-xs font-semibold text-gray-900 uppercase">Cost & Status</h4>
                </div>
                <div className="space-y-2.5">
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Est. Cost</div>
                    <div className="text-base text-gray-900 font-semibold">
                      ${(workOrder.estimatedCost || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  {workOrder.actualCost && (
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Actual Cost</div>
                      <div className="text-base text-gray-900 font-semibold">
                        ${workOrder.actualCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        {workOrder.estimatedCost && (
                          <span className={cn(
                            "ml-1 text-xs font-normal",
                            workOrder.actualCost > workOrder.estimatedCost ? 'text-red-600' : 
                            workOrder.actualCost < workOrder.estimatedCost ? 'text-green-600' : 'text-gray-500'
                          )}>
                            ({workOrder.actualCost > workOrder.estimatedCost ? '+' : ''}${(workOrder.actualCost - workOrder.estimatedCost).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {workOrder.estimatedCost && workOrder.actualCost && (
                    <div className="pt-1 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-700">Variance</span>
                        <span className={cn(
                          "text-xs font-semibold",
                          workOrder.actualCost > workOrder.estimatedCost ? 'text-red-600' : 
                          workOrder.actualCost < workOrder.estimatedCost ? 'text-green-600' : 'text-gray-600'
                        )}>
                          {workOrder.actualCost > workOrder.estimatedCost ? '+' : ''}
                          ${Math.abs(workOrder.actualCost - workOrder.estimatedCost).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          {' '}({((Math.abs(workOrder.actualCost - workOrder.estimatedCost) / workOrder.estimatedCost) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Priority</div>
                    <PriorityBadge priority={workOrder.priority} size="sm" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Status</div>
                    <StatusBadge status={statusType} label={statusLabel} size="sm" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Work Order ID</div>
                    <div className="text-sm text-gray-900 font-mono font-semibold">{workOrder.workOrderId}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes & Attachments - Full Width */}
            {(workOrder.notes || (workOrder.attachments && workOrder.attachments.length > 0)) && (
              <div className="mt-4 pt-4 border-t border-gray-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Notes */}
                  {workOrder.notes && (
                    <div>
                      <div className="flex items-center gap-2 pb-1.5 mb-2">
                        <FileText className="w-3.5 h-3.5 text-yellow-600" />
                        <h4 className="text-xs font-semibold text-gray-900 uppercase">Notes</h4>
                      </div>
                      <div className="p-3 bg-white border border-gray-200 rounded-md">
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{workOrder.notes}</p>
                      </div>
                    </div>
                  )}

                  {/* Attachments */}
                  {workOrder.attachments && workOrder.attachments.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 pb-1.5 mb-2">
                        <FileText className="w-3.5 h-3.5 text-yellow-600" />
                        <h4 className="text-xs font-semibold text-gray-900 uppercase">Attachments ({workOrder.attachments.length})</h4>
                      </div>
                      <div className="space-y-2">
                        {workOrder.attachments.map((attachment) => (
                          <div key={attachment.id} className="p-2 bg-white border border-gray-200 rounded-md flex items-center gap-2">
                            <FileText className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-gray-900 font-medium truncate">{attachment.name}</div>
                              <div className="text-xs text-gray-500">{format(new Date(attachment.uploadedAt), 'MMM dd, yyyy')}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

