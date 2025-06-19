
import React from "react";
import { ChevronDown } from "lucide-react";

interface ScrollIndicatorProps {
  show: boolean;
}

export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ show }) => {
  if (!show) return null;
  
  return (
    <div className="flex flex-col items-center justify-center py-4 animate-bounce">
      <p className="text-gray-500 mb-2">下にスクロールしてください</p>
      <ChevronDown className="h-6 w-6 text-gray-500" />
    </div>
  );
};
