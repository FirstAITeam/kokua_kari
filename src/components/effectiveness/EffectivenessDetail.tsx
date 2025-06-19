import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Building2, Waves, Wind, Cloud, Flame, Mountain, Snowflake } from 'lucide-react';

interface EffectivenessDetailProps {
  effectiveness: number;
}

export const EffectivenessDetail = ({ effectiveness }: EffectivenessDetailProps) => {
  const disasters = [
    {
      icon: Building2,
      name: "地震",
      risk: "大",
      phase: "避難まで",
      level: "震度7",
      score: 100
    },
    {
      icon: Waves,
      name: "津波",
      risk: "大",
      phase: "避難まで",
      level: "最大10m",
      score: 100
    },
    {
      icon: Cloud,
      name: "豪雨",
      risk: "中",
      phase: "避難まで",
      level: "時間雨量80mm",
      score: 100
    },
    {
      icon: Wind,
      name: "台風",
      risk: "大",
      phase: "避難まで",
      level: "風速40m/s",
      score: 100
    },
    {
      icon: Mountain,
      name: "土砂災害",
      risk: "中",
      phase: "避難まで",
      level: "警戒レベル4",
      score: 100
    },
    {
      icon: Flame,
      name: "火災",
      risk: "中",
      phase: "初期消火",
      level: "中規模",
      score: 100
    },
    {
      icon: Snowflake,
      name: "大雪",
      risk: "小",
      phase: "避難まで",
      level: "積雪50cm",
      score: 100
    },
    {
      icon: Building2,
      name: "火山噴火",
      risk: "小",
      phase: "避難まで",
      level: "警戒レベル3",
      score: 100
    },
    {
      icon: Wind,
      name: "竜巻",
      risk: "小",
      phase: "避難まで",
      level: "F2規模",
      score: 100
    },
    {
      icon: Cloud,
      name: "熱波",
      risk: "中",
      phase: "避難まで",
      level: "気温40度以上",
      score: 100
    }
  ];

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="h-[140px] lg:h-[300px] pr-2 mb-0">
        <div className="space-y-4 pr-1">
          {disasters.map((disaster, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg ${
                index % 2 === 0 ? 'bg-[rgba(243,244,246,0.5)]' : 'bg-[rgba(243,244,246,0.2)]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white rounded-lg">
                    <disaster.icon className="w-6 h-6 lg:w-8 lg:h-8" />
                  </div>
                  <div className="flex-1 flex items-center gap-4 lg:gap-8">
                    <div className="text-base lg:text-xl font-bold text-gray-700">
                      {disaster.name}
                    </div>
                    <div className="flex gap-2 lg:gap-8">
                      <div>
                        <div className="text-xs lg:text-sm text-gray-500">リスク</div>
                        <div className="text-sm lg:text-base font-bold text-gray-700">{disaster.risk}</div>
                      </div>
                      <div>
                        <div className="text-xs lg:text-sm text-gray-500">対応フェーズ</div>
                        <div className="text-sm lg:text-base font-bold text-gray-700">{disaster.phase}</div>
                      </div>
                      <div>
                        <div className="text-xs lg:text-sm text-gray-500">想定被害レベル</div>
                        <div className="text-sm lg:text-base font-bold text-gray-700">{disaster.level}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative h-12 w-12 lg:h-16 lg:w-16">
                  <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                  <div 
                    className="absolute inset-0 rounded-full border-4 border-gray-500 animate-progress"
                    style={{
                      clipPath: `polygon(0 0, ${disaster.score}% 0, ${disaster.score}% 50%, 0 50%)`,
                      transform: 'rotate(-90deg)'
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-base lg:text-lg font-bold text-gray-700">{disaster.score}点</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t pt-4 bg-gray-50">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-gray-700">総合点</span>
          <span className="text-4xl font-bold text-gray-700">
            {effectiveness}点
          </span>
        </div>
      </div>
    </div>
  );
};