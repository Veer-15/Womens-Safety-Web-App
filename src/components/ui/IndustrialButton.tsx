import React from 'react';

interface IndustrialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'alert';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const IndustrialButton: React.FC<IndustrialButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  children,
  icon,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs min-h-[36px]',
    md: 'px-5 py-2.5 text-xs tracking-wider min-h-[44px]',
    lg: 'px-7 py-3.5 text-sm tracking-wider min-h-[50px]',
    xl: 'px-8 py-4 text-base tracking-wider min-h-[56px]',
  };

  const variantClasses = {
    // High-visibility Safety Orange
    primary:
      'bg-[#ff4757] text-white shadow-[5px_5px_12px_rgba(166,50,60,0.45),-4px_-4px_10px_rgba(255,120,130,0.45),inset_1px_1px_0_rgba(255,255,255,0.35)] active:shadow-[inset_4px_4px_8px_rgba(130,20,30,0.7),inset_-4px_-4px_8px_rgba(255,120,130,0.3)] hover:brightness-105',
    // Base ABS plastic chassis button
    secondary:
      'bg-[#e0e5ec] text-[#2d3436] shadow-[6px_6px_14px_#babecc,-6px_-6px_14px_#ffffff,inset_1px_1px_0_rgba(255,255,255,0.8)] active:shadow-[inset_4px_4px_8px_#babecc,inset_-4px_-4px_8px_#ffffff] hover:text-[#ff4757]',
    // Sunken recessed flat key
    ghost:
      'bg-[#e0e5ec] text-[#4a5568] hover:shadow-[inset_2px_2px_5px_#babecc,inset_-2px_-2px_5px_#ffffff] hover:text-[#ff4757]',
    // Red pulse emergency trigger
    alert:
      'bg-linear-to-b from-[#ff4757] to-[#e83b4b] text-white shadow-[6px_6px_16px_rgba(180,30,45,0.5),-4px_-4px_12px_rgba(255,110,120,0.5),inset_1px_1px_0_rgba(255,255,255,0.4)] active:shadow-[inset_5px_5px_10px_rgba(120,10,25,0.8),inset_-5px_-5px_10px_rgba(255,110,120,0.3)] border border-[#ff6b7b]/50',
  };

  return (
    <button
      className={`relative uppercase font-bold transition-all duration-150 rounded-xl flex items-center justify-center gap-2.5 active:translate-y-[2px] disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
