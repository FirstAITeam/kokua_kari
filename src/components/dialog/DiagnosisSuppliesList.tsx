
import React, { useMemo } from "react";
import { useFilteredRecommendedItems } from "@/hooks/useRecommendedStockItems";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSupplies } from '@/contexts/SuppliesContext';
import { calculateTotalPrice } from "@/utils/priceMapping";

export const DiagnosisSuppliesList: React.FC = () => {
  // SuppliesContextから人数情報を取得
  const { peopleCount, setPeopleCount, selectedCorporateType } = useSupplies();
  
  // 数値として扱うために変換
  const numericPeopleCount = typeof peopleCount === 'number' ? peopleCount : 0;
  
  // 通知のためのtoast
  const { toast } = useToast();
  
  // 人数増減の処理
  const handleIncreasePeople = () => {
    setPeopleCount(prev => {
      // 0の場合は初期値として5に設定
      const baseValue = typeof prev !== 'number' || prev === 0 ? 5 : prev;
      const newCount = baseValue + 5;
      toast({
        title: "人数を増やしました",
        description: `必要備蓄品の数量が${baseValue === 0 ? 0 : prev}人分から${newCount}人分に変更されました。`,
      });
      return newCount;
    });
  };
  
  const handleDecreasePeople = () => {
    setPeopleCount(prev => {
      if (typeof prev !== 'number' || prev <= 5) return prev;
      const newCount = prev - 5;
      toast({
        title: "人数を減らしました",
        description: `必要備蓄品の数量が${prev}人分から${newCount}人分に変更されました。`,
      });
      return newCount;
    });
  };
  
  // 企業形態のみに基づく推奨備蓄品を取得（災害リスクは考慮しない）
  const { filteredItems, isLoading: isLoadingItems } = useFilteredRecommendedItems(
    selectedCorporateType,
    numericPeopleCount
  );
  
  // フェーズごとに備蓄品をグループ化
  const itemsByPhase = useMemo(() => {
    if (!filteredItems) return {};
    
    return filteredItems.reduce((acc, item) => {
      if (!acc[item.phase]) {
        acc[item.phase] = [];
      }
      acc[item.phase].push(item);
      return acc;
    }, {} as Record<string, typeof filteredItems>);
  }, [filteredItems]);
  
  // 備蓄品の合計金額を計算
  const totalPrice = useMemo(() => {
    if (!filteredItems) return 0;
    return calculateTotalPrice(filteredItems);
  }, [filteredItems]);

  // フェーズの表示順
  const phaseOrder = ['発生前', '発生時', '発生直後', '数時間後', '数日後'];
  
  if (isLoadingItems) {
    return (
      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="space-y-4">
          {Array(5).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }
  
  if (!filteredItems || filteredItems.length === 0) {
    return (
      <div className="text-center p-4 bg-gray-100 rounded-md">
        <p>現在の設定では推奨備蓄品データを取得できませんでした。</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8 mb-8">
      {/* 人数設定コントロール */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h3 className="text-lg font-medium text-blue-800">対象人数を調整</h3>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleDecreasePeople}
              disabled={numericPeopleCount <= 5}
              className="h-8 w-8 rounded-full"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-xl font-bold min-w-[80px] text-center">
              {numericPeopleCount > 0 ? `${numericPeopleCount}人` : ""}
            </span>
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleIncreasePeople}
              className="h-8 w-8 rounded-full"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-blue-600 mt-2">
          ※ 人数を変更すると、必要な備蓄品の数量が自動的に調整されます
        </p>
      </div>

      {/* 合計金額表示 */}
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-green-800">総計見積り金額:</h3>
          <p className="text-2xl font-bold text-green-700">{totalPrice.toLocaleString()}円</p>
        </div>
        <p className="text-sm text-green-600 mt-2">
          ※ 各商品の参考単価をもとに算出した概算金額です
        </p>
      </div>
      
      {phaseOrder.map(phase => {
        const items = itemsByPhase[phase] || [];
        if (items.length === 0) return null;
        
        // フェーズごとの小計を計算
        const phaseTotal = calculateTotalPrice(items);
        
        return (
          <div key={phase} className="space-y-3">
            <h3 className="text-lg font-bold bg-gray-100 p-2 rounded flex justify-between">
              <span>{phase}の備蓄品（{numericPeopleCount}人規模）</span>
              <span className="font-normal text-gray-600">小計: {phaseTotal.toLocaleString()}円</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((item) => {
                // 数量を整数に切り上げる
                const roundedQty = Math.ceil(item.calculatedQty || 0);
                // 単位がない場合は個を表示、ある場合はその単位を表示
                const displayUnit = item.unit || '個';
                // 商品価格を取得
                const itemPrice = item.reference_price || 0;
                // この商品の合計金額
                const totalItemPrice = itemPrice * roundedQty;
                
                return (
                <div key={item.recommended_stock_item_id} className="p-3 border border-gray-200 rounded-md bg-white flex justify-between items-center">
                  <div className="flex-1">
                    <p className="font-medium">{item.item_name}</p>
                    <div className="flex justify-between mt-1">
                      {item.unit && (
                        <p className="text-sm text-gray-500">単位: {item.unit}</p>
                      )}
                      <p className="text-sm text-gray-500">単価: {itemPrice.toLocaleString()}円</p>
                    </div>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <p className="font-bold">{roundedQty} {displayUnit}</p>
                    <p className="text-xs text-gray-600">
                      (1人あたり {item.per_person_qty})
                    </p>
                    <p className="text-sm font-semibold text-green-700">
                      {totalItemPrice.toLocaleString()}円
                    </p>
                  </div>
                </div>
              )})}
            </div>
          </div>
        );
      })}
      
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md text-sm">
        <p className="font-medium text-blue-800">
          ※この備蓄品リストは、あなたの組織タイプに基づいて生成されています。
          実際の導入にあたっては、組織の特性や施設の状況に合わせて調整してください。
        </p>
      </div>
    </div>
  );
};
