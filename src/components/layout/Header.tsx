
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 border-b backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <h1 
              className="text-4xl font-black text-[#2A303C]" 
              style={{ fontFamily: "'M PLUS 1p', sans-serif" }}
            >
              <span className="text-5xl mr-2">AI</span>
              防災診断
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};
