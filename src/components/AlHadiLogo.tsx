import React, { useState, useEffect } from 'react';
import { Truck } from 'lucide-react';

interface AlHadiLogoProps {
  className?: string;
  showText?: boolean;
}

export const AlHadiLogo: React.FC<AlHadiLogoProps> = ({ className = "w-32 h-32", showText = false }) => {
  const [hasCustomImg, setHasCustomImg] = useState(false);
  const [imgChecked, setImgChecked] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = 'logo.png';
    img.onload = () => {
      setHasCustomImg(true);
      setImgChecked(true);
    };
    img.onerror = () => {
      setHasCustomImg(false);
      setImgChecked(true);
    };
  }, []);

  if (hasCustomImg) {
    return (
      <div className={`relative rounded-full overflow-hidden shadow-xl border-2 border-[#c59b27] bg-white flex items-center justify-center ${className}`}>
        <img src="logo.png" alt="Al-Hadi Goods Logo" className="w-full h-full object-cover" />
      </div>
    );
  }

  // Exact vector badge reproduction of input_file_0.png
  return (
    <div className={`relative select-none ${className}`}>
      <svg
        viewBox="0 0 500 500"
        className="w-full h-full drop-shadow-xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer White Circle */}
        <circle cx="250" cy="250" r="240" fill="white" />

        {/* Double Rings: Navy & Gold */}
        <circle cx="250" cy="250" r="236" stroke="#162a4d" strokeWidth="8" />
        <circle cx="250" cy="250" r="222" stroke="#c59b27" strokeWidth="4" />

        {/* Speed Lines */}
        <path d="M 110 160 H 220" stroke="#1e40af" strokeWidth="8" strokeLinecap="round" />
        <path d="M 90 195 H 190" stroke="#1e40af" strokeWidth="8" strokeLinecap="round" />
        <path d="M 120 230 H 170" stroke="#1e40af" strokeWidth="8" strokeLinecap="round" />

        {/* Truck Body Graphic */}
        <path
          d="M 180 130 H 320 V 210 H 380 L 410 240 V 280 H 400 A 25 25 0 0 1 350 280 H 240 A 25 25 0 0 1 190 280 H 160 C 145 280 140 265 150 250 L 180 200 Z"
          fill="#1e40af"
        />
        {/* Truck Cabin Window */}
        <path d="M 330 215 H 370 L 390 240 H 330 Z" fill="white" />
        {/* Truck Wheels */}
        <circle cx="215" cy="280" r="18" fill="white" stroke="#162a4d" strokeWidth="8" />
        <circle cx="375" cy="280" r="18" fill="white" stroke="#162a4d" strokeWidth="8" />

        {/* Golden Stylized Highway Arrow 'A' Overlay */}
        <path
          d="M 160 260 C 190 200 240 140 310 135 L 295 115 M 310 135 L 285 155"
          stroke="#c59b27"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 230 190 L 255 240"
          stroke="#c59b27"
          strokeWidth="14"
          strokeLinecap="round"
        />

        {/* Globe Arc Meridian Lines */}
        <path d="M 150 310 Q 250 285 350 310" stroke="#1e40af" strokeWidth="3" />
        <path d="M 130 325 Q 250 295 370 325" stroke="#1e40af" strokeWidth="3" />
        <path d="M 200 300 L 175 330" stroke="#1e40af" strokeWidth="2" />
        <path d="M 250 295 V 330" stroke="#1e40af" strokeWidth="2" />
        <path d="M 300 300 L 325 330" stroke="#1e40af" strokeWidth="2" />

        {/* Text: AL-HADI GOODS */}
        <text x="250" y="340" textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontSize="24" letterSpacing="2">
          <tspan fill="#162a4d">AL-HADI </tspan>
          <tspan fill="#c59b27">GOODS</tspan>
        </text>

        {/* Urdu Calligraphy Text: الحادی گڈز */}
        <text x="250" y="420" textAnchor="middle" fontFamily="serif" fontWeight="bold" fontSize="72" fill="#162a4d">
          الحادی گڈز
        </text>

        {/* Bottom Subtitle */}
        <text x="250" y="450" textAnchor="middle" fontFamily="sans-serif" fontWeight="800" fontSize="13" fill="#162a4d" letterSpacing="1.5">
          TRANSPORT &amp; LOGISTICS
        </text>
      </svg>
    </div>
  );
};
