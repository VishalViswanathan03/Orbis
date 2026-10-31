import React from 'react';

interface OrbisLogoProps {
  className?: string;
  size?: number;
}

export const OrbisLogo: React.FC<OrbisLogoProps> = ({ className = '' }) => {
  return (
    <span className={`font-black text-2xl tracking-tighter lowercase flex items-center select-none ${className}`}>
      <span>orbis</span>
      <span className="w-2 h-2 rounded-full ml-1.5 inline-block bg-orbis-500 shadow-sm" />
    </span>
  );
};
