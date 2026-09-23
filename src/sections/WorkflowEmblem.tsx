/** Bespoke task emblems: scattered records, appointment dial, linked payment, reading folio. */
export function WorkflowEmblem({ index }: { index: number }) {
  return <span className="eh-task-emblem" aria-hidden="true"><svg viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="40" r="36" stroke="currentColor" opacity=".35" />
    <circle cx="40" cy="40" r="30" stroke="currentColor" opacity=".2" strokeDasharray="2 5" />
    <path d="M12 30A30 30 0 0 1 49 11" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="49" cy="11" r="2" fill="currentColor" />
    <g stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
      {index === 0 && <><path d="M24 27h26v20H38l-8 6v-6h-6z" /><path d="M34 23h22v19M30 34h14M30 39h9" /><path d="M45 50h13M45 55h8" /></>}
      {index === 1 && <><circle cx="40" cy="40" r="17" /><path d="M40 27v13l10 6M40 20v3M40 57v3M20 40h3M57 40h3" /><circle cx="40" cy="40" r="2" fill="currentColor" /><path d="M53 21l5 5M25 22l-4 5" /></>}
      {index === 2 && <><rect x="22" y="26" width="29" height="21" rx="4" /><path d="M23 33h27M28 40h7M40 50l5-5a6 6 0 0 1 8 8l-5 5a6 6 0 0 1-8-8ZM45 53l7-7" /></>}
      {index === 3 && <><path d="M26 22h23l7 7v29H26zM49 22v8h7M31 49h18M31 53h12" /><circle cx="40" cy="37" r="7" /><path d="M40 27v4M40 43v4M30 37h4M46 37h4M35 32l10 10M35 42l10-10" /></>}
    </g>
  </svg></span>
}
