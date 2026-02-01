import { useState, memo, useCallback } from 'react';
import type { Project } from '../types/projects';
import {
  Building,
  MapPin,
  Wrench,
  Dollar,
  Users,
  Trophy,
  Shield,
  ChevronUp,
  IrxBar,
} from '../lib/icons';

interface ProjectCardProps extends Project {
  showDescription?: boolean;
}

function ProjectCard({
  id,
  title,
  type,
  workOrdersStatus,
  workOrdersTag,
  cost,
  activeVendors,
  irxScore,
  compliance,
  progress,
  description,
  showDescription,
}: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);
  const toggle = useCallback(() => setExpanded((e) => !e), []);

  return (
    <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="shrink-0 w-10 h-10 rounded-full bg-brand flex items-center justify-center text-neutral-800">
              <Building className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-neutral-900 truncate">{id} | {title}</h3>
              <p className="flex items-center gap-1.5 text-sm text-neutral-600 mt-0.5">
                <MapPin />
                <span className="truncate">{type}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={toggle}
            className="shrink-0 p-1 rounded hover:bg-neutral-100 text-neutral-600"
            aria-expanded={expanded}
          >
            <span className={expanded ? 'rotate-180 inline-block' : ''}>
              <ChevronUp />
            </span>
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-neutral-700">
          <span className="flex items-center gap-1.5">
            <Wrench />
            {workOrdersStatus}
            {workOrdersTag && (
              <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                {workOrdersTag}
              </span>
            )}
          </span>
          <span className="flex items-center gap-1.5"><Dollar />{cost}</span>
          <span className="flex items-center gap-1.5"><Users />Active Vendors: {activeVendors}</span>
          <span className="flex items-center gap-1.5">
            <Trophy />
            IRX Score:{' '}
            <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
              {irxScore}
            </span>
          </span>
          <span className="flex items-center gap-1.5"><Shield />{compliance}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div className="h-full bg-brand rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-sm font-medium text-neutral-700 shrink-0">{progress}%</span>
        </div>
      </div>
      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t border-neutral-100 space-y-4">
          {showDescription && description && (
            <p className="text-sm text-neutral-600 pt-3">{description}</p>
          )}
          <div className="rounded border border-neutral-200 bg-neutral-50 p-3">
            <p className="text-xs font-medium text-neutral-500 mb-2">IRX</p>
            <div className="h-24 flex items-end gap-0.5">
              <IrxBar />
            </div>
            <p className="text-xs text-neutral-500 mt-1">Days</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="px-4 py-2 rounded-lg bg-neutral-800 text-white text-sm font-medium hover:bg-neutral-700">
              View
            </button>
            <button type="button" className="px-4 py-2 rounded-lg bg-neutral-800 text-white text-sm font-medium hover:bg-neutral-700">
              Edit
            </button>
            <button type="button" className="px-4 py-2 rounded-lg bg-neutral-800 text-white text-sm font-medium hover:bg-neutral-700">
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(ProjectCard);
