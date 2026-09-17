import React from 'react';

interface SakhiLogoProps {
  size?: 'sm' | 'md' | 'lg';
  iconSize?: string;
  titleSize?: string;
  showTagline?: boolean;
  className?: string;
  inverse?: boolean;
}

export const SakhiLogo: React.FC<SakhiLogoProps> = ({
  size = 'md',
  iconSize,
  titleSize,
  showTagline = true,
  className = '',
  inverse = false,
}) => {
  const defaultIconSizes = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
  };

  const defaultTitleSizes = {
    sm: 'text-sm font-bold',
    md: 'text-base sm:text-lg font-bold',
    lg: 'text-2xl font-bold',
  };

  const activeIconSize = iconSize || defaultIconSizes[size];
  const activeTitleSize = titleSize || defaultTitleSizes[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Stylized Lotus Vector Icon matching the Sakhi brand identity */}
      <div
        className={`relative flex items-center justify-center rounded-2xl p-1.5 transition-transform hover:scale-105 shrink-0 ${
          inverse
            ? 'bg-white/10 text-white border border-white/20'
            : 'bg-rose-50 text-rose-700 border border-rose-100 shadow-xs'
        } ${activeIconSize}`}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Central Lotus Petal */}
          <path
            d="M24 6C24 6 29 16 29 27C29 32 26.5 37 24 39C21.5 37 19 32 19 27C19 16 24 6 24 6Z"
            fill="currentColor"
            fillOpacity="0.85"
          />
          {/* Left Wing Petal */}
          <path
            d="M19 14C19 14 10 20 10 29C10 34 14 38 18 39C19 35 19.5 30 19 26C18.6 22 19 14 19 14Z"
            fill="currentColor"
            fillOpacity="0.65"
          />
          {/* Right Wing Petal */}
          <path
            d="M29 14C29 14 38 20 38 29C38 34 34 38 30 39C29 35 28.5 30 29 26C29.4 22 29 14 29 14Z"
            fill="currentColor"
            fillOpacity="0.65"
          />
          {/* Base Calyx Foundation */}
          <path
            d="M13 36C17 41 31 41 35 36C31 38.5 17 38.5 13 36Z"
            fill="currentColor"
            fillOpacity="0.95"
          />
          {/* Subtle Dewdrop core */}
          <circle cx="24" cy="23" r="2.5" fill={inverse ? '#FFFFFF' : '#FDA4AF'} />
        </svg>
      </div>

      <div className="flex flex-col">
        <span
          className={`font-serif tracking-tight leading-none ${activeTitleSize} ${
            inverse ? 'text-white' : 'text-slate-900'
          }`}
        >
          Sakhi
        </span>
        {showTagline && (
          <span
            className={`text-[9px] tracking-wider uppercase font-medium mt-0.5 ${
              inverse ? 'text-rose-200' : 'text-slate-500'
            }`}
          >
            Safer Women. Stronger Tomorrow.
          </span>
        )}
      </div>
    </div>
  );
};
