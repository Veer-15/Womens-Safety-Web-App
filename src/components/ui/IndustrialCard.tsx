import React from 'react';

interface IndustrialCardProps {
  children: React.ReactNode;
  className?: string;
  screws?: boolean;
  ventSlots?: boolean;
  label?: string;
  elevated?: boolean;
}

export const IndustrialCard: React.FC<IndustrialCardProps> = ({
  children,
  className = '',
  screws = true,
  ventSlots = false,
  label,
  elevated = false,
}) => {
  return (
    <div
      className={`relative rounded-2xl p-6 sm:p-8 bg-[#e0e5ec] text-[#2d3436] transition-all duration-300 ${
        elevated
          ? 'shadow-[12px_12px_24px_#babecc,-12px_-12px_24px_#ffffff]'
          : 'shadow-[8px_8px_16px_#babecc,-8px_-8px_16px_#ffffff]'
      } ${className}`}
    >
      {/* Precision Screws at 12px margins */}
      {screws && (
        <>
          <span className="absolute top-3 left-3 w-2.5 h-2.5 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1.5px_#a3b1c6,inset_-1px_-1px_1.5px_#ffffff] flex items-center justify-center pointer-events-none">
            <span className="w-1.5 h-[1px] bg-[#8a99ad] rotate-45" />
          </span>
          <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1.5px_#a3b1c6,inset_-1px_-1px_1.5px_#ffffff] flex items-center justify-center pointer-events-none">
            <span className="w-1.5 h-[1px] bg-[#8a99ad] -rotate-45" />
          </span>
          <span className="absolute bottom-3 left-3 w-2.5 h-2.5 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1.5px_#a3b1c6,inset_-1px_-1px_1.5px_#ffffff] flex items-center justify-center pointer-events-none">
            <span className="w-1.5 h-[1px] bg-[#8a99ad] -rotate-12" />
          </span>
          <span className="absolute bottom-3 right-3 w-2.5 h-2.5 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1.5px_#a3b1c6,inset_-1px_-1px_1.5px_#ffffff] flex items-center justify-center pointer-events-none">
            <span className="w-1.5 h-[1px] bg-[#8a99ad] rotate-30" />
          </span>
        </>
      )}

      {/* Recessed Vent Slots (Pill shaped grooves in top-right) */}
      {ventSlots && (
        <div className="absolute top-4 right-8 flex items-center gap-1 pointer-events-none">
          <div className="h-5 w-1 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_2px_#a3b1c6,inset_-1px_-1px_2px_#ffffff]" />
          <div className="h-5 w-1 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_2px_#a3b1c6,inset_-1px_-1px_2px_#ffffff]" />
          <div className="h-5 w-1 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_2px_#a3b1c6,inset_-1px_-1px_2px_#ffffff]" />
        </div>
      )}

      {/* Stamped Hardware Label */}
      {label && (
        <div className="mb-4">
          <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#d1d9e6] shadow-[inset_1px_1px_2px_#babecc,inset_-1px_-1px_2px_#ffffff] text-[10px] font-mono font-bold tracking-widest text-[#4a5568] uppercase">
            {label}
          </span>
        </div>
      )}

      {children}
    </div>
  );
};
