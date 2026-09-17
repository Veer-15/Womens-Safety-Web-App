import React from 'react';

interface LedIndicatorProps {
  status?: 'active' | 'standby' | 'alert' | 'offline';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LedIndicator: React.FC<LedIndicatorProps> = ({
  status = 'active',
  label,
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3.5 h-3.5',
  };

  const statusStyles = {
    active: 'bg-emerald-500 shadow-[0_0_10px_2px_rgba(34,197,94,0.85)] animate-pulse',
    alert: 'bg-[#ff4757] shadow-[0_0_10px_2px_rgba(255,71,87,0.9)] animate-pulse',
    standby: 'bg-amber-400 shadow-[0_0_8px_1px_rgba(245,158,11,0.8)]',
    offline: 'bg-slate-400 shadow-none opacity-40',
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className="p-0.5 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_2px_#babecc,inset_-1px_-1px_2px_#ffffff] flex items-center justify-center">
        <span className={`rounded-full ${sizeMap[size]} ${statusStyles[status]}`} />
      </div>
      {label && (
        <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#4a5568]">
          {label}
        </span>
      )}
    </div>
  );
};
