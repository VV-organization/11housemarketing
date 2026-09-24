import { useId } from 'react'

/** Reference: layered optical rings, interrupted arcs and illuminated line symbols. */
export function WorkflowEmblem({ index }: { index: number }) {
  const id = useId().replace(/:/g, '')
  const tones = ['#85c8ff', '#367fc2', '#e4f7ff']
  const symbol = <>
    {index === 0 && <>
      {/* Rear spreadsheet, with a header and a restrained two-column grid. */}
      <path d="M39 24h15a3 3 0 0 1 3 3v26a3 3 0 0 1-3 3H37a3 3 0 0 1-3-3v-3M40 30h17" />
      <path d="M43 35h10M43 41h10M40 47h13M40 52h13M47 35v17" strokeWidth=".85" opacity=".65" />
      {/* Foreground conversation: folded tail and two distinct message lines. */}
      <path d="M25 27h19a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-9l-7 6v-6h-3a3 3 0 0 1-3-3V30a3 3 0 0 1 3-3Z" fill="#101c2c" />
      <path d="M28 33h13M28 38h9" />
      <circle cx="40.5" cy="38" r=".7" fill={tones[2]} stroke="none" />
    </>}
    {index === 1 && <>
      {/* Bound calendar, day grid and a pen resting across its lower corner. */}
      <path d="M46 55H26a3 3 0 0 1-3-3V28a3 3 0 0 1 3-3h24a3 3 0 0 1 3 3v10M23 33h30" />
      <path d="M31 22v7M45 22v7" strokeWidth="2.1" />
      <path d="M29 39h3M37 39h3M45 39h2M29 45h3M37 45h3M29 50h3" strokeWidth="1.2" />
      <rect x="35" y="36.5" width="7" height="5" rx="1" strokeWidth=".8" opacity=".7" />
      <path d="m42 50 12-12a2.5 2.5 0 0 1 3.5 3.5l-12 12-5 1.5Z" fill="#101c2c" />
      <path d="m52 40 3.5 3.5M42 50l3.5 3.5M46 49l6-6" strokeWidth=".9" />
    </>}
    {index === 2 && <>
      {/* Payment card, chip and two interlocking links instead of a generic arrow. */}
      <path d="M37 51H25a3 3 0 0 1-3-3V28a3 3 0 0 1 3-3h29a3 3 0 0 1 3 3v12M22 33h35M22 36h35" />
      <rect x="28" y="40" width="7" height="5" rx="1" strokeWidth="1" />
      <path d="M31.5 40v5M28 42.5h7M28 48h6M38 42h9" strokeWidth=".7" opacity=".65" />
      <path d="m42 47 3-3a5 5 0 0 1 7 7l-3 3M45 51l-3 3a5 5 0 0 1-7-7l3-3" fill="#101c2c" />
      <path d="m40 49 7-7" />
    </>}
    {index === 3 && <>
      {/* Consultation folio, folded paper corner and a miniature astrological wheel. */}
      <path d="M27 22h20l8 8v28H27ZM47 22v9h8" />
      <circle cx="40" cy="39" r="9" />
      <circle cx="40" cy="39" r="5.5" strokeWidth=".8" opacity=".75" />
      <path d="M40 30v3.5M40 44.5V48M31 39h3.5M45.5 39H49M33.6 32.6l2.5 2.5M43.9 42.9l2.5 2.5M33.6 45.4l2.5-2.5M43.9 35.1l2.5-2.5" strokeWidth=".8" />
      <path d="m36 42 5-7 3 7Z" strokeWidth=".9" />
      <circle cx="41" cy="35" r="1" fill={tones[2]} stroke="none" />
      <path d="M32 52h17M32 55h10" strokeWidth=".9" opacity=".8" />
    </>}
  </>
  return <span className="eh-task-emblem" aria-hidden="true"><svg viewBox="0 0 80 80" fill="none">
    <defs>
      <radialGradient id={`${id}-face`}><stop stopColor={tones[1]} stopOpacity=".14"/><stop offset=".75" stopColor={tones[1]} stopOpacity=".035"/><stop offset="1" stopColor={tones[0]} stopOpacity=".11"/></radialGradient>
      <linearGradient id={`${id}-ring`} x1="12" y1="9" x2="68" y2="73" gradientUnits="userSpaceOnUse"><stop stopColor={tones[0]} stopOpacity=".65"/><stop offset=".3" stopColor={tones[1]} stopOpacity=".2"/><stop offset=".7" stopColor={tones[0]} stopOpacity=".42"/><stop offset="1" stopColor={tones[1]} stopOpacity=".12"/></linearGradient>
      <filter id={`${id}-bloom`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <radialGradient id={`${id}-flare`}><stop stopColor="white"/><stop offset=".13" stopColor={tones[2]} stopOpacity=".95"/><stop offset=".35" stopColor={tones[0]} stopOpacity=".5"/><stop offset="1" stopColor={tones[0]} stopOpacity="0"/></radialGradient>
    </defs>
    <circle cx="40" cy="40" r="36" fill={`url(#${id}-face)`} stroke={`url(#${id}-ring)`} strokeWidth="1.1"/>
    <circle cx="40" cy="40" r="31.5" stroke={tones[0]} strokeOpacity=".16" strokeWidth=".6"/>
    <circle cx="40" cy="40" r="27.7" stroke={tones[0]} strokeOpacity=".3" strokeWidth=".55" strokeDasharray=".65 2.7"/>
    <path d="M11.2 18.4A36 36 0 0 1 43 4.1M72 56.5A36 36 0 0 1 61.6 68.8" stroke={tones[0]} strokeOpacity=".54" strokeWidth=".9"/>
    <path d="M17 61.5A31.5 31.5 0 0 1 10 30.4M55 12.3A31.5 31.5 0 0 1 71.4 42" stroke={tones[0]} strokeOpacity=".23" strokeWidth=".7"/>
    <g stroke={tones[0]} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" filter={`url(#${id}-bloom)`}>{symbol}</g>
    <g stroke={tones[2]} strokeOpacity=".72" strokeWidth=".65" strokeLinecap="round" strokeLinejoin="round">{symbol}</g>
    <g>
      <circle cx="11.5" cy="18" r="5.5" fill={`url(#${id}-flare)`}/><circle cx="69" cy="61.3" r="6" fill={`url(#${id}-flare)`}/>
      <path d="m10.1 19.4 2.8-2.8M67.5 63l3-3.3" stroke={tones[2]} strokeWidth=".8" strokeLinecap="round"/>
      <circle cx="11.5" cy="18" r=".85" fill="white"/><circle cx="69" cy="61.3" r=".9" fill="white"/>
    </g>
  </svg></span>
}
