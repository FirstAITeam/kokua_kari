
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Waves, Mountain, Snowflake, AlertTriangle, Wind, ShieldAlert } from "lucide-react";
import { RiskData } from "@/hooks/useDisasterRisk_byPython";
import { useToast } from "@/hooks/use-toast";
import { useRecommendedStockItems, RecommendedStockItem } from "@/hooks/useRecommendedStockItems";

interface DisasterEffectCardProps {
  disasters: Array<{
    id: string;
    type: string;
    icon: any;
    risk: string;
    phase: string;
    level: string;
    score: number;
  }>;
  riskData: RiskData | null;
}

export const DisasterEffectCard = ({ disasters, riskData }: DisasterEffectCardProps) => {
  const { toast } = useToast();
  
  // 民間企業オフィス（corporate_type_id=1）の備蓄品データを取得
  const { data: stockItems } = useRecommendedStockItems(1);
  
  // リスクデータがあれば、対応する災害のリスクランクを更新
  const updatedDisasters = disasters.map(disaster => {
    if (riskData && riskData[disaster.id] && riskData[disaster.id].rank) {
      return {
        ...disaster,
        risk: riskData[disaster.id].rank,
        score: riskData[disaster.id].risk ? Math.min(Math.round(riskData[disaster.id].risk * 50), 100) : disaster.score
      };
    }
    return disaster;
  });

  // 災害リスクに基づいて対策情報を表示する関数
  const getDiagnosisInfo = (disasterId: string, riskLevel: string) => {
    if (riskLevel === "大") {
      // 災害タイプに基づく対策情報
      const diagnosisInfo = {
        earthquake: "特に地震対策として、ヘルメット、アルファ米、非常用トイレ、棚固定金具などの備蓄を強化してください。",
        flood: "水害対策として、止水板、防水シート、吸水土のう、ライフジャケットなどの準備が重要です。",
        tsunami: "津波対策として、高所避難経路の確保、ライフジャケット、防水バッグの準備が必要です。",
        dirtsand: "土砂災害リスクが高いため、早期避難計画の策定と防災ラジオの常備が必要です。",
        heavysnow: "大雪対策として、保温・防寒用品、スコップ、融雪剤の備蓄が重要です。"
      };
      
      // 対応する災害タイプIDを取得
      const disasterTypeIdMap: Record<string, number> = {
        earthquake: 1,
        flood: 2,
        tsunami: 2, // 水害に同じ
        dirtsand: 3,
        heavysnow: 4
      };
      
      const disasterTypeId = disasterTypeIdMap[disasterId];
      
      // この災害タイプで最も重要な備蓄品3つを抽出
      const importantItems = stockItems
        ?.filter(item => 
          item.disaster_types && 
          item.disaster_types.includes(disasterTypeId) && 
          item.phase === '発生前')
        ?.slice(0, 3)
        ?.map(item => item.item_name)
        ?.join('、') || '';
      
      const baseInfo = diagnosisInfo[disasterId as keyof typeof diagnosisInfo] || '';
      
      // 重要備蓄品情報を追加（あれば）
      if (importantItems) {
        return baseInfo + ` 特に『${importantItems}』の備えが優先事項です。`;
      }
      
      return baseInfo;
    }
    return "";
  };

  // 高リスク災害についてユーザーに通知する
  React.useEffect(() => {
    if (riskData) {
      const highRiskDisasters = updatedDisasters.filter(d => d.risk === "大");
      if (highRiskDisasters.length > 0) {
        toast({
          title: "高リスク災害が検出されました",
          description: `${highRiskDisasters.map(d => d.type).join('、')}のリスクが高い地域です。対策をご確認ください。`,
          variant: "destructive"
        });
      }
    }
  }, [riskData, toast]);

  return (
    <Card className="overflow-hidden border-4 border-[#40414F]">
      <CardHeader className="bg-[#40414F] text-white py-2">
        <CardTitle className="text-xl font-bold">災害リスク診断結果</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-sm text-gray-500 mb-4">
          {riskData && riskData.address ? 
            `住所「${riskData.address}」に基づいた災害リスク評価結果です。` : 
            "あなたの住所に基づいた災害リスク評価結果です。"}
        </p>
        <div className="space-y-4">
          {updatedDisasters.map((disaster) => (
            <div key={disaster.id} className="space-y-2">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  disaster.risk === "大" ? "bg-red-100" : 
                  disaster.risk === "中" ? "bg-amber-100" : 
                  disaster.risk === "小" ? "bg-green-100" : "bg-gray-100"
                }`}>
                  {React.createElement(disaster.icon, {
                    className: `w-6 h-6 ${
                      disaster.risk === "大" ? "text-red-600" : 
                      disaster.risk === "中" ? "text-amber-600" : 
                      disaster.risk === "小" ? "text-green-600" : "text-gray-600"
                    }`,
                  })}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{disaster.type}</h3>
                    <Badge
                      className={`${
                        disaster.risk === "大"
                          ? "bg-red-500"
                          : disaster.risk === "中"
                          ? "bg-amber-500"
                          : disaster.risk === "小"
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                    >
                      リスク: {disaster.risk}
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className={`h-2 rounded-full ${
                        disaster.risk === "大"
                          ? "bg-red-500"
                          : disaster.risk === "中"
                          ? "bg-amber-500"
                          : disaster.risk === "小"
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                      style={{ width: `${disaster.score}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* 高リスク災害の場合のみ対策情報を表示 */}
              {disaster.risk === "大" && (
                <div className="ml-12 p-3 bg-red-50 border border-red-200 rounded-md text-sm">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-red-800">{getDiagnosisInfo(disaster.id, disaster.risk)}</p>
                  </div>
                </div>
              )}
              
              {/* リスク中の災害の場合は備蓄品ショートカットを表示 */}
              {disaster.risk === "中" && (
                <div className="ml-12 p-3 bg-amber-50 border border-amber-200 rounded-md text-sm">
                  <div className="flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-amber-800">
                      {disaster.type}対策用の備蓄品リストを確認し、計画的に準備を進めましょう。
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
