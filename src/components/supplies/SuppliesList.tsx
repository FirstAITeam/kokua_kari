
import React, { useMemo } from 'react';
import { useSupplies } from '@/contexts/SuppliesContext';
import { useFilteredRecommendedItems } from '@/hooks/useRecommendedStockItems';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { calculateTotalPrice } from '@/utils/priceMapping';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const SuppliesList: React.FC = () => {
  const { selectedCorporateType, peopleCount, addToCart } = useSupplies();
  const { toast } = useToast();
  
  // peopleCountが空文字列の場合は0を渡すように修正
  const actualPeopleCount = typeof peopleCount === 'number' ? peopleCount : 0;
  
  const { filteredItems, isLoading: isLoadingItems } = useFilteredRecommendedItems(
    selectedCorporateType,
    actualPeopleCount
  );
  
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
  
  const totalPrice = useMemo(() => {
    if (!filteredItems) return 0;
    return calculateTotalPrice(filteredItems);
  }, [filteredItems]);
  
  const phaseOrder = ['発生前', '発生時', '発生直後', '数時間後', '数日後'];

  const handleAddToCart = (item: any) => {
    const roundedItem = {
      ...item,
      calculatedQty: Math.ceil(item.calculatedQty || 0)
    };
    
    addToCart(roundedItem);
    
    const price = item.reference_price || 0;
    const totalPrice = price * Math.ceil(item.calculatedQty || 0);
    
    toast({
      title: "カートに追加しました",
      description: `「${item.item_name}」を${Math.ceil(item.calculatedQty)} ${item.unit || '個'} (${totalPrice.toLocaleString()}円)追加しました`,
    });
  };
  
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
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-green-800">合計見積り金額:</h3>
          <p className="text-2xl font-bold text-green-700">{totalPrice.toLocaleString()}円</p>
        </div>
        <p className="text-sm text-green-600 mt-2">
          ※ 各商品の参考単価をもとに算出した概算金額です
        </p>
      </div>
      
      {phaseOrder.map(phase => {
        const items = itemsByPhase[phase] || [];
        if (items.length === 0) return null;
        
        const phaseTotal = calculateTotalPrice(items);
        
        return (
          <div key={phase} className="space-y-3">
            <h3 className="text-lg font-bold bg-gray-100 p-2 rounded flex justify-between">
              <span>{phase}の備蓄品（{peopleCount}人規模）</span>
              <span className="font-normal text-gray-600">小計: {phaseTotal.toLocaleString()}円</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((item) => {
                const roundedQty = Math.ceil(item.calculatedQty || 0);
                const displayUnit = item.unit || '個';
                const itemPrice = item.reference_price || 0;
                const totalItemPrice = itemPrice * roundedQty;
                
                // 災害タイプ名のマッピング
                const disasterTypeNames: Record<number, string> = {
                  1: '地震',
                  2: '水害',
                  3: '土砂災害',
                  4: '大雪'
                };
                
                // 災害タイプの表示用文字列を作成
                const disasterTypesDisplay = item.disaster_types?.map(
                  typeId => disasterTypeNames[typeId] || `タイプ${typeId}`
                ).join('、') || '全災害対応';
                
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
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center text-xs text-gray-500 mt-1 cursor-help">
                              <Info className="h-3 w-3 mr-1" />
                              <span>対応災害: {disasterTypesDisplay}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>この備蓄品が特に効果的な災害種別です</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="font-bold">{roundedQty} {displayUnit}</p>
                      <p className="text-xs text-gray-500">
                        (1人あたり {item.per_person_qty})
                      </p>
                      <p className="text-sm font-semibold text-green-700 whitespace-nowrap">
                        {totalItemPrice.toLocaleString()}円
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={() => handleAddToCart(item)}
                      >
                        <Plus className="h-3 w-3" />
                        <ShoppingCart className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )
              })}
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
