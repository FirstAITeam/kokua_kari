import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  onClick: () => void;
  value: string;
  unit?: string;
  subValue?: string;
}

export const StatsCard = ({ title, icon: Icon, iconColor, onClick, value, unit, subValue }: StatsCardProps) => {
  return (
    <Card 
      className="h-full w-full cursor-pointer transition-all hover:scale-105 relative overflow-hidden bg-gradient-to-br from-gray-50 to-white group flex flex-col"
      onClick={onClick}
    >
      <div className="absolute top-0 left-0 p-1 lg:p-2 bg-[#2A303C] text-white text-[10px] lg:text-sm font-bold rounded-br-lg">
        {title}
      </div>
      <div className="absolute right-2 lg:right-2 top-2">
        <Icon className={`w-3 h-3 lg:w-6 lg:h-6 ${iconColor} opacity-80 transition-transform group-hover:scale-110 animate-float ml-[25px] lg:ml-0`} />
      </div>
      <div className="flex-1 flex flex-col justify-end pb-2 lg:pb-4">
        <div className="text-center">
          <div className="text-base lg:text-2xl font-black text-[#2A303C]">
            {value}
          </div>
          {unit && (
            <div className="text-[10px] lg:text-sm font-bold text-gray-500">
              {unit}
            </div>
          )}
          {subValue && (
            <div className="text-[8px] lg:text-xs text-gray-400 mt-0.5 lg:mt-1">
              {subValue}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};