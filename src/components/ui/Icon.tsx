export type IconName = "menu" | "close" | "play" | "road" | "arch" | "data" | "event" | "ai" | "fullscreen" | "check";

export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return <svg aria-hidden="true" fill="none" height={size} viewBox="0 0 24 24" width={size}>{renderIcon(name)}</svg>;
}

function renderIcon(name: IconName) {
  switch (name) {
    case "menu": return <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />;
    case "close": return <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />;
    case "play": return <path d="m8 5 11 7-11 7V5Z" fill="currentColor" />;
    case "road": return <path d="M6 21 10 3m4 0 4 18M12 5v3m0 3v3m0 3v3" stroke="currentColor" strokeWidth="1.8" />;
    case "arch": return <><circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.8" /><circle cx="19" cy="6" r="2" stroke="currentColor" strokeWidth="1.8" /><circle cx="19" cy="18" r="2" stroke="currentColor" strokeWidth="1.8" /><path d="M7 12h5m2-1 3.5-3.5M14 13l3.5 3.5" stroke="currentColor" strokeWidth="1.8" /></>;
    case "data": return <><ellipse cx="12" cy="5" rx="8" ry="3" stroke="currentColor" strokeWidth="1.8" /><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" stroke="currentColor" strokeWidth="1.8" /></>;
    case "event": return <><path d="M4 6h16v12H4V6Z" stroke="currentColor" strokeWidth="1.8" /><path d="m4 8 8 5 8-5" stroke="currentColor" strokeWidth="1.8" /></>;
    case "ai": return <><rect x="5" y="6" width="14" height="12" rx="3" stroke="currentColor" strokeWidth="1.8" /><path d="M9 11h.01M15 11h.01M9 15h6M12 3v3M3 12h2m14 0h2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></>;
    case "fullscreen": return <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />;
    case "check": return <path d="m5 12 4 4 10-10" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />;
  }
}
