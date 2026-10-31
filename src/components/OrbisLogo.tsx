import React from 'react';

interface OrbisLogoProps {
  className?: string;
  size?: number;
}

export const OrbisLogo: React.FC<OrbisLogoProps> = ({ className = '', size = 32 }) => {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter drop-shadow-[0_2px_10px_rgba(255,122,0,0.35)] transition-transform duration-300"
      >
        <defs>
          <linearGradient id="orbisCoreGrad" x1="8" y1="6" x2="40" y2="42" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFA126" />
            <stop offset="55%" stopColor="#FF6600" />
            <stop offset="100%" stopColor="#DC3600" />
          </linearGradient>
          <linearGradient id="orbisRingGrad" x1="4" y1="24" x2="44" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFB366" />
            <stop offset="100%" stopColor="#FF7A00" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="stripeGrad" x1="16" y1="18" x2="32" y2="18" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#FFF1E6" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* Orbit Back Ring */}
        <path
          d="M 7 28 C 7 21 21 16 35 18 C 39 18.5 42 20 43 22"
          stroke="url(#orbisRingGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* Geometric Cone Body */}
        <path
          d="M 22.2 7.2 C 23.0 5.8 25.0 5.8 25.8 7.2 L 37.3 27.5 C 38.2 29.1 37.0 31.0 35.1 31.0 L 12.9 31.0 C 11.0 31.0 9.8 29.1 10.7 27.5 L 22.2 7.2 Z"
          fill="url(#orbisCoreGrad)"
        />

        {/* Upper Curved Stripe */}
        <path
          d="M 18.5 17.5 C 22.0 18.6 26.0 18.6 29.5 17.5 L 31.8 21.5 C 27.0 23.0 21.0 23.0 16.2 21.5 Z"
          fill="url(#stripeGrad)"
        />

        {/* Lower Subtle Stripe */}
        <path
          d="M 14.8 24.2 C 20.5 25.6 27.5 25.6 33.2 24.2 L 34.6 27.0 C 28.0 28.4 20.0 28.4 13.4 27.0 Z"
          fill="url(#stripeGrad)"
          opacity="0.9"
        />

        {/* Base Stand */}
        <rect x="10" y="32" width="28" height="3.5" rx="1.75" fill="url(#orbisCoreGrad)" />

        {/* Orbit Front Ring */}
        <path
          d="M 43 23 C 44 26 39 31 24 33 C 13 34.5 5 32.5 5 29"
          stroke="url(#orbisRingGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Orbit Node */}
        <circle cx="41.5" cy="22.5" r="3" fill="#FFFFFF" />
        <circle cx="41.5" cy="22.5" r="1.5" fill="#FF7A00" />
      </svg>
    </div>
  );
};
