
import { Button } from "@/components/ui/button";
import { FileText, ShoppingCart, Edit, Book, Building2, Waves, Wind, Cloud, Flame, Mountain, Snowflake, LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DisasterEffectCard } from "@/components/effectiveness/DisasterEffectCard";
import { ProductList } from "@/components/diagnosis/ProductList";
import { ActionButtons } from "@/components/diagnosis/ActionButtons";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { useDisasterRisk } from '@/hooks/useDisasterRisk_byPython';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useSupplies } from "@/contexts/SuppliesContext";

const DiagnosisResult = () => {
  const navigate = useNavigate();
  const { concreteCartItems } = useSupplies();
  const [isLoading, setIsLoading] = useState(true);

  // useChatMessages から currentAddress を取得（他の関数は不要なら空関数で代用）
  const { currentAddress } = useChatMessages({
    setCurrentQuestionDetail: () => {},
    setSelectedDetail: () => {},
    updateProgressStep: () => {}
  });

  // currentAddress が空の場合はフォールバック値を使う
  const addressToUse = currentAddress || "不明な住所";

  // 住所情報をもとにリスク情報を取得
  const { riskData, error, isLoadingRisk } = useDisasterRisk(addressToUse);

  // データのロード状態を監視
  useEffect(() => {
    // カートアイテムとリスクデータがロードされたらローディング状態を解除
    if (!isLoadingRisk && concreteCartItems) {
      // 少し遅延を入れてUIの表示をスムーズにする
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoadingRisk, concreteCartItems]);

  const disasters = [
    {
      id: 'earthquake',
      type: "地震",
      icon: Building2,
      risk: "未評価",
      phase: "避難まで",
      level: "震度7",
      score: 50
    },
    {
      id: 'flood',
      type: "洪水",
      icon: Waves,
      risk: "未評価",
      phase: "避難まで",
      level: "浸水深2m以上",
      score: 50
    },
    {
      id: 'tsunami',
      type: "津波",
      icon: Waves,
      risk: "未評価",
      phase: "避難まで",
      level: "最大10m",
      score: 70
    },
    {
      id: 'dirtsand',
      type: "土砂災害",
      icon: Mountain,
      risk: "未評価",
      phase: "避難まで",
      level: "警戒レベル4",
      score: 0
    },
    {
      id: 'heavysnow',
      type: "大雪",
      icon: Snowflake,
      risk: "未評価",
      phase: "避難まで",
      level: "積雪50cm",
      score: 40
    }
  ];

  if (isLoading || isLoadingRisk) {
    return (
      <div className="min-h-screen">
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

        <div className="max-w-[1200px] mx-auto p-4 space-y-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-[60%] h-full">
              <div className="bg-white rounded-lg p-6 shadow-sm border-4 border-[#40414F] lg:h-[calc(100vh-9rem)]">
                <div className="flex flex-col items-center justify-center h-full space-y-6">
                  <div className="relative">
                    <LoaderCircle className="w-12 h-12 text-primary animate-spin" />
                    <div className="absolute inset-0 animate-pulse">
                      <div className="w-12 h-12 bg-primary/20 rounded-full" />
                    </div>
                  </div>
                  <div className="text-xl text-gray-600 font-medium">商品情報を読み込み中...</div>
                  <div className="w-full max-w-md space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-[40%] space-y-4">
              <DisasterEffectCard disasters={disasters} riskData={riskData} />
              <ActionButtons />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
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

      <div className="max-w-[1200px] mx-auto p-4 space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-[60%] h-full">
            <ProductList />
          </div>
          <div className="lg:w-[40%] space-y-4">
            <DisasterEffectCard disasters={disasters} riskData={riskData} />
            <ActionButtons />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisResult;
