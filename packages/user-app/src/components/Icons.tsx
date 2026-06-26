/** SVG icons — clean, consistent, no emoji */
import type { SVGProps } from 'react'

function Svg({ children, size = 24, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>{children}</svg>
}

export function IconRobot({ size = 24, ...p }: { size?: number } & SVGProps<SVGSVGElement>) {
  return <Svg size={size} {...p}><rect x="3" y="7" width="18" height="13" rx="3"/><circle cx="8.5" cy="13" r="1.2" fill="currentColor" stroke="none"/><circle cx="15.5" cy="13" r="1.2" fill="currentColor" stroke="none"/><line x1="12" y1="16" x2="12" y2="18"/><circle cx="12" cy="3" r="1.5"/><line x1="9" y1="4" x2="9.5" y2="6.5"/><line x1="15" y1="4" x2="14.5" y2="6.5"/><circle cx="5" cy="9" r="0.8" fill="currentColor" stroke="none"/><circle cx="19" cy="9" r="0.8" fill="currentColor" stroke="none"/></Svg>
}

export function IconSparkle({ size = 24, ...p }: { size?: number } & SVGProps<SVGSVGElement>) {
  return <Svg size={size} {...p}><path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5z"/><path d="M18 14l0.7 2.3L21 17l-2.3 0.7L18 20l-0.7-2.3L15 17l2.3-0.7z"/></Svg>
}

export function IconHeart({ size = 24, filled, ...p }: { size?: number; filled?: boolean } & SVGProps<SVGSVGElement>) {
  if (filled) return <Svg size={size} fill="currentColor" stroke="none" {...p}><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></Svg>
  return <Svg size={size} {...p}><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></Svg>
}

export function IconWork({ size = 24, ...p }: { size?: number } & SVGProps<SVGSVGElement>) {
  return <Svg size={size} {...p}><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></Svg>
}

export function IconHandshake({ size = 24, ...p }: { size?: number } & SVGProps<SVGSVGElement>) {
  return <Svg size={size} {...p}><path d="M7 11l-3 3v3h3l2-2"/><path d="M17 11l3 3v3h-3l-2-2"/><path d="M9 15l3 3 3-3"/><path d="M12 18v-4"/><path d="M8 8c-.5-.5-1-1-1.5-1.5C5.5 5.5 4 5 4 7s1.5 2 2.5 1.5C7 8 7.5 7.5 8 8z"/><path d="M16 8c.5-.5 1-1 1.5-1.5C18.5 5.5 20 5 20 7s-1.5 2-2.5 1.5C17 8 16.5 7.5 16 8z"/></Svg>
}

export function IconHeartSmall({ size = 24, ...p }: { size?: number } & SVGProps<SVGSVGElement>) {
  return <Svg size={size} {...p}><path d="M17.5 3C15.8 3 14.2 3.8 13.3 5 12.4 3.8 10.8 3 9 3 6.2 3 4 5.2 4 8c0 3.3 3 5.8 8.3 10.5.4.4 1 .4 1.4 0C19 13.8 22 11.3 22 8c0-2.8-2.2-5-5-5h.5z"/></Svg>
}

export function IconParty({ size = 24, ...p }: { size?: number } & SVGProps<SVGSVGElement>) {
  return <Svg size={size} {...p}><circle cx="7" cy="7" r="3"/><circle cx="17" cy="7" r="3"/><circle cx="12" cy="14" r="4"/><path d="M12 2v2M3 10h2M19 10h2M5.5 4.5l1.5 1.5M17 6l1.5-1.5"/></Svg>
}

export function IconDress({ size = 24, ...p }: { size?: number } & SVGProps<SVGSVGElement>) {
  return <Svg size={size} {...p}><path d="M12 2l3 6h2l-2 4v8H9v-8l-2-4h2z"/><circle cx="12" cy="5" r="0.8" fill="currentColor" stroke="none"/></Svg>
}

export function IconSearch({ size = 24, ...p }: { size?: number } & SVGProps<SVGSVGElement>) {
  return <Svg size={size} {...p}><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/></Svg>
}

export function IconHome({ size = 24, ...p }: { size?: number } & SVGProps<SVGSVGElement>) {
  return <Svg size={size} {...p}><path d="M3 10l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></Svg>
}

export function IconBookmark({ size = 24, filled, ...p }: { size?: number; filled?: boolean } & SVGProps<SVGSVGElement>) {
  if (filled) return <Svg size={size} fill="currentColor" stroke="none" {...p}><path d="M5 3h14a2 2 0 0 1 2 2v16l-7-4-7 4V5a2 2 0 0 1 2-2z"/></Svg>
  return <Svg size={size} {...p}><path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></Svg>
}

export function IconSettings({ size = 24, ...p }: { size?: number } & SVGProps<SVGSVGElement>) {
  return <Svg size={size} {...p}><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></Svg>
}

export function IconCamera({ size = 24, ...p }: { size?: number } & SVGProps<SVGSVGElement>) {
  return <Svg size={size} {...p}><path d="M23 7l-3-3h-5l-1-2H10L9 4H4L1 7v13a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7z"/><circle cx="12" cy="14" r="4"/></Svg>
}

export function IconSend({ size = 24, ...p }: { size?: number } & SVGProps<SVGSVGElement>) {
  return <Svg size={size} {...p}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></Svg>
}

export function IconBell({ size = 24, ...p }: { size?: number } & SVGProps<SVGSVGElement>) {
  return <Svg size={size} {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></Svg>
}
