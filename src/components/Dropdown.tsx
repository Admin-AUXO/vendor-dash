import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from '../lib/icons';

interface DropdownProps {
  label: string;
  options: { id: string; label: string }[];
  onSelect: (id: string) => void;
  className?: string;
}

export default function Dropdown({ label, options, onSelect, className = '' }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', fn);
    return () => document.removeEventListener('click', fn);
  }, []);

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-800 text-white text-sm font-medium hover:bg-neutral-700"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {label}
        <ChevronDown className="w-4 h-4" />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute top-full left-0 mt-1 min-w-[10rem] py-1 rounded-lg bg-white border border-neutral-200 shadow-lg z-50"
        >
          {options.map((opt) => (
            <li key={opt.id} role="option">
              <button
                type="button"
                className="w-full text-left px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-100"
                onClick={() => {
                  onSelect(opt.id);
                  setOpen(false);
                }}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
