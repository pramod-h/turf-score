type IconProps = { className?: string };

export function DuckIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-label="Duck">
      {/* Body */}
      <ellipse cx="17" cy="20" rx="10" ry="7" fill="#F59E0B" />
      {/* Head */}
      <circle cx="8" cy="14" r="5" fill="#F59E0B" />
      {/* Eye */}
      <circle cx="6.5" cy="12.5" r="1.2" fill="#1C1F35" />
      <circle cx="6.1" cy="12.1" r="0.4" fill="white" />
      {/* Bill */}
      <path d="M3 14.5 L0.5 15.5 L3 16 Z" fill="#FB923C" />
      {/* Wing accent */}
      <ellipse cx="18" cy="19" rx="6" ry="3.5" fill="#D97706" />
      {/* Tail */}
      <path d="M27 18 Q30 15 29 20 Q27 22 25 21 Z" fill="#D97706" />
    </svg>
  );
}

export function GoldenDuckIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-label="Golden Duck">
      {/* Gold star ring */}
      <circle cx="16" cy="16" r="14" fill="none" stroke="#FCD34D" strokeWidth="2" />
      {/* Body */}
      <ellipse cx="17" cy="20" rx="9" ry="6" fill="#FCD34D" />
      {/* Head */}
      <circle cx="9" cy="14.5" r="4.5" fill="#FCD34D" />
      {/* Eye */}
      <circle cx="7.5" cy="13" r="1.1" fill="#1C1F35" />
      <circle cx="7.1" cy="12.6" r="0.35" fill="white" />
      {/* Bill */}
      <path d="M5 14.5 L2.5 15.5 L5 16 Z" fill="#FB923C" />
      {/* Wing */}
      <ellipse cx="18" cy="19" rx="5.5" ry="3" fill="#F59E0B" />
      {/* Shimmer dots */}
      <circle cx="24" cy="11" r="1.2" fill="#FCD34D" opacity="0.8" />
      <circle cx="26" cy="15" r="0.8" fill="#FCD34D" opacity="0.6" />
      <circle cx="22" cy="8" r="0.8" fill="#FCD34D" opacity="0.6" />
    </svg>
  );
}

export function DiamondDuckIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-label="Diamond Duck">
      {/* Diamond shape */}
      <path d="M16 4 L28 14 L16 28 L4 14 Z" fill="#67E8F9" />
      {/* Diamond facet top */}
      <path d="M16 4 L28 14 L16 16 Z" fill="#A5F3FC" />
      {/* Diamond facet left */}
      <path d="M4 14 L16 16 L16 28 Z" fill="#0891B2" />
      {/* Diamond top edge shine */}
      <path d="M16 4 L22 11 L16 12 L10 11 Z" fill="white" opacity="0.3" />
      {/* Small duck silhouette inside */}
      <ellipse cx="16" cy="17" rx="4" ry="3" fill="#0E7490" opacity="0.6" />
      <circle cx="12.5" cy="14.5" r="2.2" fill="#0E7490" opacity="0.6" />
    </svg>
  );
}

export function FiftyIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-label="Fifty">
      {/* Star shape */}
      <path
        d="M16 3 L18.9 11.2 L27.7 11.2 L20.9 16.4 L23.4 24.6 L16 19.8 L8.6 24.6 L11.1 16.4 L4.3 11.2 L13.1 11.2 Z"
        fill="#22C55E"
      />
      {/* Text 50 */}
      <text
        x="16"
        y="18"
        textAnchor="middle"
        fontSize="8"
        fontWeight="800"
        fill="white"
        fontFamily="system-ui, sans-serif"
      >
        50
      </text>
    </svg>
  );
}

export function CenturyIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-label="Century">
      {/* Trophy cup */}
      <path d="M10 6 H22 L20 18 Q16 22 12 18 Z" fill="#FCD34D" />
      {/* Trophy handles */}
      <path d="M10 8 Q6 8 6 13 Q6 17 10 16" stroke="#F59E0B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M22 8 Q26 8 26 13 Q26 17 22 16" stroke="#F59E0B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Base stem */}
      <rect x="14.5" y="18" width="3" height="5" fill="#F59E0B" />
      {/* Base plate */}
      <rect x="10" y="23" width="12" height="2.5" rx="1.2" fill="#F59E0B" />
      {/* Shine */}
      <path d="M13 8 Q14 10 13.5 13" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5" />
      {/* 100 text */}
      <text
        x="16"
        y="15.5"
        textAnchor="middle"
        fontSize="6.5"
        fontWeight="800"
        fill="#92400E"
        fontFamily="system-ui, sans-serif"
      >
        100
      </text>
    </svg>
  );
}

export function HatTrickIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-label="Hat-trick">
      {/* Brim */}
      <ellipse cx="16" cy="22" rx="13" ry="3.5" fill="#1C1F35" stroke="#374151" strokeWidth="1" />
      {/* Hat body */}
      <rect x="10" y="8" width="12" height="15" rx="2" fill="#111827" />
      {/* Hat top */}
      <rect x="10" y="7" width="12" height="2.5" rx="1" fill="#111827" />
      {/* Band */}
      <rect x="10" y="18" width="12" height="2.5" fill="#22C55E" />
      {/* Cricket ball on top */}
      <circle cx="16" cy="5.5" r="3.5" fill="#EF4444" />
      <path d="M14 4 Q16 5.5 18 4" stroke="white" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M14 7 Q16 5.5 18 7" stroke="white" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}
