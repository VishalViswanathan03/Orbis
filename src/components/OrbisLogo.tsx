import React from 'react';

interface OrbisLogoProps {
  className?: string;
  size?: number;
}

export const OrbisLogo: React.FC<OrbisLogoProps> = ({ className = '', size = 32 }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter drop-shadow-[0_0_8px_rgba(255,122,0,0.5)]"
      >
        <defs>
          <linearGradient id="orbisConeGrad" x1="50" y1="12" x2="50" y2="88" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFA439" />
            <stop offset="45%" stopColor="#FF6600" />
            <stop offset="100%" stopColor="#C93200" />
          </linearGradient>
          <linearGradient id="orbisRing" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Orbit outer ring */}
        <circle cx="50" cy="50" r="45" stroke="#FF7A00" strokeWidth="2.5" strokeDasharray="6 8" opacity="0.35" />

        {/* Base stand */}
        <ellipse cx="50" cy="80" rx="32" ry="8" fill="url(#orbisConeGrad)" opacity="0.9" />

        {/* Cone body */}
        <path d="M 44 22 C 44 18 56 18 56 22 L 74 74 C 75 78 25 78 26 74 Z" fill="url(#orbisConeGrad)" />

        {/* Top Glowing Orb */}
        <circle cx="50" cy="20" r="7" fill="#FFA533" />
        <circle cx="48" cy="18" r="2.5" fill="#FFFFFF" opacity="0.9" />

        {/* Curved VLC stripes */}
        <path d="M 40 42 C 45 44 55 44 60 42 L 63 50 C 55 53 45 53 37 50 Z" fill="url(#orbisRing)" />
        <path d="M 34 60 C 43 63 57 63 66 60 L 70 68 C 58 71 42 71 30 68 Z" fill="url(#orbisRing)" />

        {/* Orbital curved path */}
        <ellipse cx="50" cy="50" rx="44" ry="16" transform="rotate(-28 50 50)" stroke="#FFB066" strokeWidth="2" strokeDasharray="100 40" strokeLinecap="round" opacity="0.8" />
        <circle cx="85" cy="34" r="3.5" fill="#FFFFFF" />
      </svg>
    </div>
  );
};
