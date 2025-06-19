import { Card } from "@/components/ui/card";
import React from 'react';

interface DetailCardProps {
  children: React.ReactNode;
  title: string;
  className?: string;
  isFlipping?: boolean;
}

export const DetailCard = ({ children, title, className = "", isFlipping = false }: DetailCardProps) => {
  return (
    <Card 
      className={`p-3 lg:p-6 h-[260px] lg:h-[450px] overflow-hidden perspective-1000 relative bg-gradient-to-br from-gray-50 to-white border-4 border-[#40414F] ${
        isFlipping ? 'animate-flip' : ''
      } ${className}`}
      style={{
        boxShadow: "0px 155px 62px rgba(0, 0, 0, 0.01), 0px 87px 52px rgba(0, 0, 0, 0.05), 0px 39px 39px rgba(0, 0, 0, 0.09), 0px 10px 21px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="absolute top-0 right-0 w-64 h-64 -mr-16 -mt-16 opacity-10">
        <div className="relative w-full h-full">
          <div className="cloud front absolute top-12 left-8">
            <div className="w-16 h-16 rounded-full bg-gray-200 inline-block" />
            <div className="w-12 h-12 rounded-full bg-gray-200 inline-block -ml-6" />
          </div>
          <div className="cloud back absolute top-4 left-24 animate-clouds-slow">
            <div className="w-8 h-8 rounded-full bg-gray-200 inline-block" />
            <div className="w-10 h-10 rounded-full bg-gray-200 inline-block -ml-4" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 animate-sunshine" />
          </div>
        </div>
      </div>
      
      <h2 className="text-xl lg:text-2xl font-bold mb-2 lg:mb-4 text-gray-700">
        {title}
      </h2>
      
      {children}
    </Card>
  );
};