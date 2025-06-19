import { Building2, Waves, Wind, Cloud, Flame, Mountain, Snowflake } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DisasterEffect {
  type: string;
  icon: any;
  risk: string;
  phase: string;
  level: string;
  score: number;
}

interface DisasterEffectListProps {
  disasters: DisasterEffect[];
}

export const DisasterEffectList = ({ disasters }: DisasterEffectListProps) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border-2 border-gray-800">
      <h2 className="text-xl font-bold text-gray-800 mb-4">防災効果</h2>
      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-4">
          {disasters.map((disaster, index) => (
            <div key={index} className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white rounded-lg">
                    <disaster.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-800">{disaster.type}</div>
                    <div className="text-sm text-gray-600">
                      リスク: {disaster.risk} | 対応フェーズ: {disaster.phase} | 想定被害レベル: {disaster.level}
                    </div>
                  </div>
                </div>
                <div className="relative h-16 w-16">
                  <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                  <div 
                    className="absolute inset-0 rounded-full border-4 border-blue-500 animate-progress"
                    style={{
                      clipPath: `polygon(0 0, ${disaster.score}% 0, ${disaster.score}% 100%, 0 100%)`
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold">{disaster.score}点</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="text-right mt-4 pt-4 border-t">
        <div className="text-4xl font-black">70点</div>
      </div>
    </div>
  );
};