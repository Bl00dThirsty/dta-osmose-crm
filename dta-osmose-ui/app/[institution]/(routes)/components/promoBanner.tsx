"use client";

import { Tag } from "lucide-react";

interface PromoBannerProps {
  message?: string;
}

const PromoBanner = ({ message = "Des promotions sont disponibles" }: PromoBannerProps) => {
  return (
     <div className="mb-2 p-2 bg-gradient-to-r from-gray-500 via-blue-700 to-green-800 text-white rounded-lg shadow-lg flex items-center gap-2"> 
    <Tag className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" /> 
    <div className="min-w-0"> 
      <p className="font-semibold text-sm sm:text-base md:text-lg leading-tight truncate">
        {/* Version adaptative */}
        <span className="xs:hidden">🎉</span>
        <span className="hidden xs:inline sm:hidden">🎉 Promo</span>
        <span className="hidden sm:inline">{message}</span>
      </p> 
    </div> 
  </div> 
  );
};

export default PromoBanner;
