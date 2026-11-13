import { useId } from 'react';

/**
 * Reusable CURIΣX SVG wordmark featuring the Antique Gold Queen chess piece as "I".
 * Uses useId() so multiple instances on the page have unique SVG gradient IDs.
 */
export default function CuriexLogo({ variant = 'hero' }) {
  const uid = useId();
  const pearlGradId = `${uid}-pearl`;
  const goldGradId = `${uid}-gold`;
  const isHero = variant === 'hero';

  return (
    <svg
      className={`curiex-logo ${isHero ? 'curiex-logo--hero' : 'curiex-logo--sm'}`}
      viewBox="0 0 520 118"
      width={isHero ? 460 : 144}
      height={isHero ? 104 : 32}
      role="img"
      aria-label="CURIEX"
    >
      <defs>
        <linearGradient id={pearlGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C3B3AD" />
          <stop offset="45%" stopColor="#B3928D" />
          <stop offset="100%" stopColor="#C3B3AD" />
        </linearGradient>
        <linearGradient id={goldGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C3B3AD" />
          <stop offset="30%" stopColor="#B88A3B" />
          <stop offset="100%" stopColor="#603D41" />
        </linearGradient>
      </defs>
      {/* C */}
      <path
        d="M68 22H26C16 22 10 28 10 38V74C10 84 16 90 26 90H68V78H28C23 78 21 76 21 71V41C21 36 23 34 28 34H68V22Z"
        fill={`url(#${pearlGradId})`}
      />
      {/* U */}
      <path
        d="M90 22H102V71C102 76 104 78 109 78H141C146 78 148 76 148 71V22H160V74C160 84 154 90 144 90H106C96 90 90 84 90 74V22Z"
        fill={`url(#${pearlGradId})`}
      />
      {/* R */}
      <path
        d="M182 22H228C238 22 245 28 245 38V47C245 55 240 61 231 63L248 90H234L219 64H194V90H182V22ZM194 33V53H226C231 53 233 50 233 46V40C233 36 231 33 226 33H194Z"
        fill={`url(#${pearlGradId})`}
      />
      {/* Queen Chess Piece (Antique Gold) */}
      <g fill={`url(#${goldGradId})`}>
        <circle cx="283" cy="11" r="4.8" />
        <path d="M263 18L271 31L277 16L283 31L289 16L295 31L303 18L297 38H269L263 18Z" />
        <rect x="267" y="40" width="32" height="5" rx="2" />
        <path d="M272 46.5C274 59 269 70 263 80H303C297 70 292 59 294 46.5H272Z" />
        <rect x="260" y="82" width="46" height="8" rx="3" />
      </g>
      {/* Sigma E */}
      <path
        d="M322 22H386V33H340L364 56L340 79H386V90H322V80L348 56L322 32V22Z"
        fill={`url(#${pearlGradId})`}
      />
      {/* X */}
      <path
        d="M406 22H420L448 50L476 22H490L456 56L492 90H478L448 61L418 90H404L440 56L406 22Z"
        fill={`url(#${pearlGradId})`}
      />
      {/* Metallic Double Bars */}
      <rect x="10" y="101" width="482" height="3" fill={`url(#${pearlGradId})`} opacity="0.88" />
      <rect x="10" y="108" width="482" height="2" fill={`url(#${pearlGradId})`} opacity="0.52" />
    </svg>
  );
}

