
import React from 'react';
import { useSupplies } from '@/contexts/SuppliesContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, Download, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/hooks/use-toast';

interface SuppliesCartProps {
  showRecommendedInfo?: boolean;
}

export const SuppliesCart: React.FC<SuppliesCartProps> = ({ showRecommendedInfo = false }) => {
  const { cartItems, removeFromCart, updateItemQuantity, clearCart } = useSupplies();

  const handleQuantityChange = (itemId: number, newQty: string) => {
    const qty = parseInt(newQty);
    if (!isNaN(qty) && qty > 0) {
      updateItemQuantity(itemId, qty);
      toast({
        title: "数量を更新しました",
        description: `アイテムの数量を${qty}に変更しました`,
      });
    }
  };

  const handleRemoveItem = (itemId: number, itemName: string) => {
    removeFromCart(itemId);
    toast({
      title: "アイテムを削除しました",
      description: `「${itemName}」をカートから削除しました`,
    });
  };

  const handleExportCSV = () => {
    // カートアイテムをCSV形式に変換
    const headers = ["品目名", "数量", "単位", "フェーズ"];
    const csvData = cartItems.map(item => [
      item.item_name,
      item.calculatedQty,
      item.unit || '個',
      item.phase
    ]);
    
    // CSVデータ作成
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    // Blob作成とダウンロード
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', '防災備蓄品リスト.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "CSVファイルをエクスポートしました",
      description: "防災備蓄品リストをCSV形式で保存しました",
    });
  };

  const handleClearCart = () => {
    if (window.confirm('カートの中身を全て削除してもよろしいですか？')) {
      clearCart();
      toast({
        title: "カートをクリアしました",
        description: "すべてのアイテムがカートから削除されました",
      });
    }
  };

  // カート内のアイテムをフェーズごとにグループ化
  const itemsByPhase = cartItems.reduce((acc, item) => {
    if (!acc[item.phase]) {
      acc[item.phase] = [];
    }
    acc[item.phase].push(item);
    return acc;
  }, {} as Record<string, typeof cartItems>);

  // フェーズの表示順
  const phaseOrder = ['発生前', '発生時', '発生直後', '数時間後', '数日後'];
  
  // カート内の総額を計算
  const totalAmount = cartItems.reduce((total, item) => {
    const price = item.reference_price || 0;
    const quantity = Math.ceil(item.calculatedQty || 0);
    return total + (price * quantity);
  }, 0);

  if (cartItems.length === 0) {
    return (
      <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
        <ShoppingCart className="h-10 w-10 mx-auto text-gray-400 mb-3" />
        <p className="text-gray-500">備蓄品リストは空です</p>
        <p className="text-sm text-gray-400 mt-1">組織形態と人数を選択すると自動的に生成されます</p>
      </div>
    );
  }

  const title = showRecommendedInfo ? "推奨防災備蓄品リスト" : "買い物かご";

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          {title}
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleClearCart}>
            <Trash2 className="h-4 w-4 mr-1" /> 全削除
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-1" /> CSVエクスポート
          </Button>
        </div>
      </div>
      
      {/* 合計金額表示 */}
      <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-green-800">合計見積り金額:</h3>
          <p className="text-2xl font-bold text-green-700">{totalAmount.toLocaleString()}円</p>
        </div>
        <p className="text-sm text-green-600 mt-2">
          ※ 各商品の参考単価をもとに算出した概算金額です
        </p>
      </div>

      <div className="space-y-6">
        {phaseOrder.map(phase => {
          const items = itemsByPhase[phase];
          if (!items || items.length === 0) return null;
          
          // フェーズごとの小計を計算
          const phaseTotal = items.reduce((total, item) => {
            const price = item.reference_price || 0;
            const quantity = Math.ceil(item.calculatedQty || 0);
            return total + (price * quantity);
          }, 0);

          return (
            <div key={phase} className="space-y-2">
              <h4 className="font-medium text-sm bg-gray-100 p-1 px-2 rounded flex justify-between">
                <span>{phase}</span>
                <span className="text-gray-600">小計: {phaseTotal.toLocaleString()}円</span>
              </h4>
              {items.map(item => {
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
                
                // 単価と合計金額
                const itemPrice = item.reference_price || 0;
                const totalItemPrice = itemPrice * Math.ceil(item.calculatedQty || 0);
                
                return (
                  <div key={item.recommended_stock_item_id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div className="flex-1">
                      <p className="font-medium">{item.item_name}</p>
                      <div className="flex justify-between mt-1">
                        {item.unit && (
                          <p className="text-xs text-gray-500">単位: {item.unit}</p>
                        )}
                        <p className="text-xs text-gray-500">単価: {itemPrice.toLocaleString()}円</p>
                      </div>
                      {showRecommendedInfo && (
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
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-col items-end">
                        <div className="flex items-center">
                          <input
                            type="number"
                            value={item.calculatedQty}
                            onChange={(e) => handleQuantityChange(item.recommended_stock_item_id, e.target.value)}
                            className="w-16 border rounded p-1 text-right text-sm"
                            min="1"
                          />
                          <span className="ml-1 text-sm">{item.unit || '個'}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          (1人あたり {item.per_person_qty})
                        </p>
                        <p className="text-sm font-semibold text-green-700 text-right">
                          {totalItemPrice.toLocaleString()}円
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveItem(item.recommended_stock_item_id, item.item_name)}
                        className="text-red-500 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <Separator className="my-4" />
      
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md text-sm">
        <p className="font-medium text-blue-800">
          ※この備蓄品リストは、あなたの組織タイプに基づいて生成されています。
          実際の導入にあたっては、組織の特性や施設の状況に合わせて調整してください。
        </p>
      </div>
      
      <div className="text-right text-sm text-gray-500 mt-4">
        <p>合計: {cartItems.length}品目</p>
      </div>
    </div>
  );
};
