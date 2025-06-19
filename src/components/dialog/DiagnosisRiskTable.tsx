
import React from "react";
import { useDisasterRisk } from "@/hooks/useDisasterRisk_byPython";
import { useChatMessages } from "@/hooks/useChatMessages";

export const DiagnosisRiskTable: React.FC = () => {
  // useChatMessages から currentAddress を取得
  const { currentAddress } = useChatMessages({
    setCurrentQuestionDetail: () => {},
    setSelectedDetail: () => {},
    updateProgressStep: () => {}
  });
  
  // 住所情報をもとにリスク情報を取得
  const addressToUse = currentAddress || "大阪府"; // デフォルト値を設定
  const { riskData, error, isLoadingRisk } = useDisasterRisk(addressToUse);

  // ランクに基づいて背景色を決定する関数
  const getRiskBgColor = (rank: string) => {
    if (!rank) return "bg-gray-100";
    
    switch (rank) {
      case "大":
        return "bg-red-100";
      case "中":
        return "bg-yellow-100";
      case "小":
        return "bg-blue-100";
      case "なし":
        return "bg-green-100";
      default:
        return "bg-gray-100";
    }
  };

  // リスクの説明テキストを取得する関数
  const getRiskDescription = (type: string, rank: string) => {
    if (!rank || rank === "不明") return "リスク情報を取得できませんでした。";
    if (rank === "なし") return `この地域では${type}のリスクは低いようです。`;
    
    const descriptions: {[key: string]: {[key: string]: string}} = {
      earthquake: {
        "大": "大きな地震のリスクがあります。耐震対策が必要です。",
        "中": "地震のリスクがあります。基本的な対策を行いましょう。",
        "小": "地震のリスクは比較的低いですが、備えは必要です。"
      },
      flood: {
        "大": "洪水のリスクが高い地域です。浸水対策が重要です。",
        "中": "洪水のリスクがある地域です。避難経路を確認しましょう。",
        "小": "洪水のリスクは低いですが、大雨時には注意が必要です。"
      },
      tsunami: {
        "大": "津波のリスクが高い地域です。高台への避難経路を確認しましょう。",
        "中": "津波のリスクがあります。避難場所を把握しておきましょう。",
        "小": "津波のリスクは比較的低いですが、海岸付近では注意が必要です。"
      },
      dirtsand: {
        "大": "土砂災害のリスクが高い地域です。警報発令時は迅速に避難しましょう。",
        "中": "土砂災害のリスクがあります。大雨時には注意が必要です。",
        "小": "土砂災害のリスクは低いですが、近隣の斜面には注意しましょう。"
      },
      heavysnow: {
        "大": "大雪のリスクが高い地域です。積雪対策が必要です。",
        "中": "大雪のリスクがあります。冬季は注意しましょう。",
        "小": "大雪のリスクは低いですが、冬季の備えは必要です。"
      }
    };
    
    return descriptions[type]?.[rank] || `${type}のリスクがあります（${rank}）。適切な対策を検討しましょう。`;
  };

  // ローディング中表示
  if (isLoadingRisk) {
    return (
      <div className="bg-white rounded-md overflow-hidden mb-8 border border-gray-200 p-4">
        <p className="text-center text-gray-500">リスク情報を読み込み中...</p>
      </div>
    );
  }

  // エラー表示
  if (error) {
    return (
      <div className="bg-white rounded-md overflow-hidden mb-8 border border-gray-200 p-4">
        <p className="text-center text-red-500">リスク情報の取得中にエラーが発生しました。</p>
      </div>
    );
  }

  // リスクデータがない場合
  if (!riskData) {
    return (
      <div className="bg-white rounded-md overflow-hidden mb-8 border border-gray-200 p-4">
        <p className="text-center text-gray-500">リスク情報がありません。住所を入力してください。</p>
      </div>
    );
  }

  // 住所の不一致チェック（入力された住所と取得された住所が異なる場合）
  const addressMismatch = riskData.input_address && riskData.address && 
                          riskData.input_address !== riskData.address;

  return (
    <div className="bg-white rounded-md overflow-hidden mb-8 border border-gray-200">
      {addressMismatch && (
        <div className="p-3 bg-yellow-100 border-b border-yellow-200 text-sm">
          <p>入力された住所「{riskData.input_address}」は「{riskData.address}」として評価されました。</p>
        </div>
      )}

      <div className="border-b">
        <div className="grid grid-cols-2">
          <div className="p-4 border-r font-bold bg-gray-50">
            地震のリスク
          </div>
          <div className={`p-4 ${getRiskBgColor(riskData.earthquake?.rank)}`}>
            {getRiskDescription("earthquake", riskData.earthquake?.rank)}
          </div>
        </div>
      </div>
      
      <div className="border-b">
        <div className="grid grid-cols-2">
          <div className="p-4 border-r font-bold bg-gray-50">
            洪水のリスク
          </div>
          <div className={`p-4 ${getRiskBgColor(riskData.flood?.rank)}`}>
            {getRiskDescription("flood", riskData.flood?.rank)}
          </div>
        </div>
      </div>
      
      <div className="border-b">
        <div className="grid grid-cols-2">
          <div className="p-4 border-r font-bold bg-gray-50">
            土砂災害のリスク
          </div>
          <div className={`p-4 ${getRiskBgColor(riskData.dirtsand?.rank)}`}>
            {getRiskDescription("dirtsand", riskData.dirtsand?.rank)}
          </div>
        </div>
      </div>
      
      <div className="border-b">
        <div className="grid grid-cols-2">
          <div className="p-4 border-r font-bold bg-gray-50">
            津波のリスク
          </div>
          <div className={`p-4 ${getRiskBgColor(riskData.tsunami?.rank)}`}>
            {getRiskDescription("tsunami", riskData.tsunami?.rank)}
          </div>
        </div>
      </div>
      
      <div>
        <div className="grid grid-cols-2">
          <div className="p-4 border-r font-bold bg-gray-50">
            大雪のリスク
          </div>
          <div className={`p-4 ${getRiskBgColor(riskData.heavysnow?.rank)}`}>
            {getRiskDescription("heavysnow", riskData.heavysnow?.rank)}
          </div>
        </div>
      </div>
    </div>
  );
};
