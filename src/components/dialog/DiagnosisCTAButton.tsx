
import React from "react";

interface DiagnosisCTAButtonProps {
  onContinue: () => void;
}

export const DiagnosisCTAButton: React.FC<DiagnosisCTAButtonProps> = ({ onContinue }) => {
  const handleContinue = () => {
    // Close the dialog and trigger the onContinue function
    onContinue();
  };

  return (
    <div className="text-center mb-16">
      <p className="text-2xl font-bold mb-8">
        次に「STEP3」にて人数規模を入力し、<br />
        「購入するべき数量」と「見積額」を知りましょう！
      </p>
      <button 
        onClick={handleContinue}
        className="bg-[#40414F] hover:bg-[#40414F]/80 text-white font-bold py-4 px-12 rounded-md text-xl transition-colors"
      >
        次へ進む
      </button>
    </div>
  );
};
