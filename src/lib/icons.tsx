import type { ReactNode } from 'react';
const Svg = ({ className, children }: { className?: string; children: ReactNode }) => (
  <svg className={className ?? 'w-5 h-5'} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    {children}
  </svg>
);

export const Building = (p: { className?: string }) => (
  <Svg className={p.className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></Svg>
);
export const MapPin = (p: { className?: string }) => (
  <Svg className={p.className ?? 'w-4 h-4 shrink-0'}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </Svg>
);
export const Wrench = (p: { className?: string }) => (
  <Svg className={p.className ?? 'w-4 h-4 shrink-0'}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </Svg>
);
export const Dollar = (p: { className?: string }) => (
  <Svg className={p.className ?? 'w-4 h-4 shrink-0'}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></Svg>
);
export const Rupee = (p: { className?: string }) => (
  <Svg className={p.className ?? 'w-6 h-6'}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></Svg>
);
export const Users = (p: { className?: string }) => (
  <Svg className={p.className ?? 'w-4 h-4 shrink-0'}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></Svg>
);
export const Trophy = (p: { className?: string }) => (
  <Svg className={p.className ?? 'w-4 h-4 shrink-0'}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 3v4m4-4v4M4 6h4m5 0l2 8m-6 0h4m-4 0h4m-4 0h2M7 14h10" /></Svg>
);
export const Shield = (p: { className?: string }) => (
  <Svg className={p.className ?? 'w-4 h-4 shrink-0'}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></Svg>
);
export const ChevronUp = (p: { className?: string }) => (
  <Svg className={p.className ?? 'w-5 h-5'}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></Svg>
);
export const ChevronDown = (p: { className?: string }) => (
  <Svg className={p.className ?? 'w-4 h-4'}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></Svg>
);
export const FilterIcon = (p: { className?: string }) => (
  <Svg className={p.className ?? 'w-5 h-5'}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></Svg>
);
export const Clock = (p: { className?: string }) => (
  <Svg className={p.className ?? 'w-6 h-6'}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></Svg>
);
export const Exclamation = (p: { className?: string }) => (
  <Svg className={p.className ?? 'w-6 h-6'}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></Svg>
);
export const MagnifyingGlass = (p: { className?: string }) => (
  <Svg className={p.className ?? 'w-4 h-4 shrink-0'}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></Svg>
);
export const Document = (p: { className?: string }) => (
  <Svg className={p.className ?? 'w-5 h-5'}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></Svg>
);

const IRX_BAR = [40, 65, 45, 80, 55, 70, 60, 75, 65, 80];
export function IrxBar() {
  return (
    <>
      {IRX_BAR.map((h, i) => (
        <div key={i} className="flex-1 min-w-0 bg-brand rounded-t" style={{ height: `${h}%` }} />
      ))}
    </>
  );
}
