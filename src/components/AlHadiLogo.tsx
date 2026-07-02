import React from 'react';

interface AlHadiLogoProps {
  className?: string;
  showText?: boolean;
}

export const AlHadiLogo: React.FC<AlHadiLogoProps> = ({ className = "w-32 h-32" }) => {
  return (
    <div className={`relative rounded-full overflow-hidden shadow-md border-2 border-[#c59b27] bg-white flex items-center justify-center shrink-0 ${className}`}>
      <img
        src="logo.png"
        alt="Al-Hadi Goods Logo"
        className="w-full h-full object-contain p-1.5"
        onError={(e) => {
          if (!e.currentTarget.src.endsWith('/logo.png')) {
            e.currentTarget.src = '/logo.png';
          }
        }}
      />
    </div>
  );
};
