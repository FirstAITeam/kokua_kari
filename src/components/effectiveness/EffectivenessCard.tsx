import { Card } from "@/components/ui/card";
import { Shield } from "lucide-react";

interface EffectivenessCardProps {
  effectiveness: number;
  onClick: () => void;
}

export const EffectivenessCard = ({ effectiveness, onClick }: EffectivenessCardProps) => {
  return (
    <Card 
      className="h-full w-full cursor-pointer transition-all hover:scale-105 relative overflow-hidden bg-gradient-to-br from-gray-50 to-white group"
      onClick={onClick}
    >
      <div className="absolute top-0 left-0 p-1 lg:p-2 bg-[#2A303C] text-white text-[10px] lg:text-sm font-bold rounded-br-lg">
        防災効果
      </div>
      <div className="absolute right-2 lg:right-2 top-2">
        <Shield className="w-3 h-3 lg:w-6 lg:h-6 text-red-500 opacity-80 transition-transform group-hover:scale-110 animate-float ml-[25px] lg:ml-0" />
      </div>
      <div className="h-full flex flex-col justify-end pb-2 lg:pb-4 relative z-10">
        <div className="text-center">
          <div className="text-base lg:text-2xl font-black text-[#2A303C]">
            {effectiveness}
          </div>
          <div className="text-[10px] lg:text-sm font-bold text-gray-500">
            点
          </div>
        </div>
      </div>
    </Card>
  );
};