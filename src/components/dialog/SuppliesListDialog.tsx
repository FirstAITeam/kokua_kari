
import React, { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { useSupplies, Supply } from '@/contexts/SuppliesContext';
import { SuppliesCart } from "../supplies/ShoppingCart";
import { useFilteredRecommendedItems, useAllRecommendedStockItems } from '@/hooks/useRecommendedStockItems';
import { toast } from "@/hooks/use-toast";
import { calculateTotalPrice } from "@/utils/priceMapping";

interface SuppliesListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SuppliesListDialog = ({
  open,
  onOpenChange,
}: SuppliesListDialogProps) => {
  const navigate = useNavigate();

  // 人数情報とコンテキストデータを取得
  const { 
    supplies, 
    setSupplies, 
    peopleCount, 
    selectedCorporateType, 
    setFullStockItems,
    setDisasterInfoItems,
    setAllStockItems,
    clearCart,
    addToCart,
    fullStockItems,
    allStockItems,
    cartItems
  } = useSupplies();

  // 初回のみロードするための状態
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // 企業形態と人数に基づく推奨備蓄品を取得
  const { filteredItems, isLoading } = useFilteredRecommendedItems(
    selectedCorporateType,
    peopleCount
  );
  
  // すべての備蓄品アイテムを取得（法人形態でフィルタリングしない）
  const { data: allItems } = useAllRecommendedStockItems(peopleCount);

  // カート内のアイテムから合計金額を計算
  const totalPrice = useMemo(() => {
    return calculateTotalPrice(cartItems);
  }, [cartItems]);

  // データが未ロードでダイアログが開かれた時だけ、推奨備蓄品をロードする
  useEffect(() => {
    if (open && !initialLoadDone) {
      if (filteredItems && (!fullStockItems || fullStockItems.length === 0)) {
        console.log("初回: Saving filtered stock items to context:", filteredItems.length, "items");
        
        // 法人形態でフィルタリングされたアイテムデータを保存
        setFullStockItems(filteredItems);
        
        // 災害種情報を抽出して保存
        const disasterInfo = filteredItems.map(item => ({
          itemId: item.recommended_stock_item_id,
          disasterTypes: item.disaster_types || []
        }));
        setDisasterInfoItems(disasterInfo);
        
        // カートをクリアして推奨アイテムを追加
        clearCart();
        filteredItems.forEach(item => {
          const roundedItem = {
            ...item,
            calculatedQty: Math.ceil(item.calculatedQty || 0)
          };
          addToCart(roundedItem);
        });
        
        toast({
          title: "買い物かごを更新しました",
          description: `${filteredItems.length}件の推奨備蓄品を自動的に追加しました`,
        });
      }
      
      if (allItems && (!allStockItems || allStockItems.length === 0)) {
        console.log("初回: Saving all stock items to context:", allItems.length, "items");
        // 全てのアイテムデータを保存（法人形態でフィルタリングしない）
        setAllStockItems(allItems);
        
        toast({
          title: "備蓄品情報を保存しました",
          description: `${allItems.length}件の備蓄品データがセッションに保存されました`,
        });
      }
      
      // 初回ロード完了をマーク
      setInitialLoadDone(true);
    }
  }, [open, filteredItems, allItems, fullStockItems, allStockItems, setFullStockItems, setDisasterInfoItems, setAllStockItems, clearCart, addToCart, initialLoadDone]);

  // 商品選択画面へ移動する関数
  const handleProceedToProductSelection = () => {
    onOpenChange(false); // ダイアログを閉じる
    navigate("/diagnosis-result"); // 結果表示画面へ遷移
  };

  // ダイアログを閉じて対話画面に戻る関数
  const handleReturnToChat = () => {
    onOpenChange(false); // ダイアログを閉じるだけ
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl p-0 h-[85vh] flex flex-col border-4 border-[#40414F] rounded-lg"
        onInteractOutside={(e) => {
          // 外側のクリックイベントをキャンセル
          e.preventDefault();
        }}
        hideCloseButton={true} // デフォルトの閉じるボタンを非表示にする
      >
        <DialogTitle className="sr-only">買い物かご</DialogTitle>

        <div className="bg-gray-200 p-6 flex flex-col">
          <h2 className="text-3xl font-bold mb-6">
            あなたの十分な対策のためには...
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded p-4 border-2 border-dashed border-gray-400 text-center">
              <p className="font-bold text-lg">重度な地震&水害</p>
            </div>
            <div className="bg-white rounded p-4 border-2 border-dashed border-gray-400 text-center">
              <p className="font-bold text-lg">{peopleCount}人分 (3日分)</p>
            </div>
            <div className="bg-white rounded p-4 border-2 border-dashed border-gray-400 text-center">
              <p className="font-bold text-lg">総計：{totalPrice.toLocaleString()}円</p>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-6 bg-white">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">買い物かご</h2>
            <SuppliesCart showRecommendedInfo={true} />
          </div>
        </ScrollArea>

        <div className="bg-gray-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-2 border-dashed border-gray-400 p-4 rounded-lg">
            <div className="text-center space-y-2">
              <p className="font-bold text-lg">
                見積額に納得したため、<br />
                実際に具体的な商品選択へ進む
              </p>
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 w-full"
                onClick={handleProceedToProductSelection}
              >
                次へ進む
              </Button>
            </div>
          </div>
          <div className="border-2 border-dashed border-gray-400 p-4 rounded-lg">
            <div className="text-center space-y-2">
              <p className="font-bold text-lg">
                AIと対話しながら、<br />
                備蓄品と数量を適切に減らす
              </p>
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 w-full"
                onClick={handleReturnToChat}
              >
                次へ進む
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
