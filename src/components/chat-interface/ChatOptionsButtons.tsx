
import React from 'react';
import { Button } from "../ui/button";

interface ChatOptionsButtonsProps {
  options: string[];
  selectedOption?: string;
  onOptionClick: (option: string) => void;
  disabled?: boolean;
}

export const ChatOptionsButtons: React.FC<ChatOptionsButtonsProps> = ({
  options,
  selectedOption,
  onOptionClick,
  disabled = false
}) => {
  if (!options || options.length === 0) return null;

  return (
    <div className="space-y-2 pt-2">
      {options.map((option, optIndex) => (
        <Button 
          key={optIndex}
          variant={selectedOption === option ? "default" : "outline"}
          className={`w-full justify-start rounded-xl transition-colors py-6 text-base ${
            selectedOption === option 
              ? 'bg-[#40414F] text-white cursor-not-allowed'
              : 'hover:bg-[#40414F] hover:text-white border-[#40414F]/20'
          }`}
          onClick={() => onOptionClick(option)}
          disabled={disabled || selectedOption !== undefined}
        >
          {option}
        </Button>
      ))}
    </div>
  );
};
