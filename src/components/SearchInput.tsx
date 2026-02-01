import { memo } from 'react';
import { MagnifyingGlass } from '../lib/icons';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  'aria-label'?: string;
  className?: string;
}

function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  'aria-label': ariaLabel = 'Search',
  className = '',
}: SearchInputProps) {
  return (
    <label className={`flex items-center gap-2 rounded-lg border border-neutral-300 bg-white text-neutral-800 focus-within:ring-2 focus-within:ring-brand focus-within:border-transparent w-48 ${className}`}>
      <span className="pl-3 flex items-center shrink-0 text-neutral-400" aria-hidden>
        <MagnifyingGlass className="w-4 h-4" />
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="flex-1 min-w-0 py-2 pr-3 bg-transparent text-sm border-0 focus:outline-none focus:ring-0 placeholder:text-neutral-400"
      />
    </label>
  );
}

export default memo(SearchInput);
