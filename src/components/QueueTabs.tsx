import { memo } from 'react';
import { ChevronDown } from '../lib/icons';

interface Tab {
  id: string;
  label: string;
  dropdown?: boolean;
}

interface QueueTabsProps {
  tabs: Tab[];
  activeId: string;
  onSelect: (id: string) => void;
  toggles?: { label: string; checked: boolean; onChange: (checked: boolean) => void }[];
}

function QueueTabs({ tabs, activeId, onSelect, toggles }: QueueTabsProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelect(tab.id)}
              className={`inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeId === tab.id ? 'bg-neutral-800 text-white' : 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300'
              }`}
            >
              {tab.label}
              {tab.dropdown && <ChevronDown />}
            </button>
          ))}
        </div>
        {toggles?.length ? (
          <div className="flex flex-wrap items-center gap-4">
            {toggles.map((t) => (
              <label key={t.label} className="inline-flex items-center gap-2 cursor-pointer">
                <span className="text-sm font-medium text-neutral-700">{t.label}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={t.checked}
                  onClick={() => t.onChange(!t.checked)}
                  className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 ${
                    t.checked ? 'bg-brand' : 'bg-neutral-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform mt-0.5 ${
                      t.checked ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </label>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default memo(QueueTabs);
