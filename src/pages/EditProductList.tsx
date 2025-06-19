import { useState, useEffect } from "react";
import { ProductListHeader } from "@/components/product/ProductListHeader";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSupplies, ConcreteProduct } from "@/contexts/SuppliesContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ShoppingCart, AlertCircle, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const EditProductList = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    concreteCartItems, 
    addToConcreteCart,
    removeFromConcreteCart,
    getConcreteCartItemByStockItemId
  } = useSupplies();
  
  const [loading, setLoading] = useState(true);
  const [stockItemsWithProducts, setStockItemsWithProducts] = useState<{
    stockItemId: number;
    stockItemName: string;
    requiredQuantity: number;
    concreteProducts: any[]; // 一時的に any で対応
    selectedProductId: number | null;
  }[]>([]);

  // カート内の商品に関連する具体的な商品を取得
  useEffect(() => {
    const fetchConcreteProducts = async () => {
      if (!cartItems || cartItems.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const stockItemsData = [];
        
        // カート内の各商品に対して具体的な商品を取得
        for (const cartItem of cartItems) {
          console.log(`商品類ID ${cartItem.recommended_stock_item_id} の商品を検索中...`);
          
          const { data: concreteProducts, error } = await supabase
            .from('concrete_products')
            .select('*')
            .eq('stock_item_id', cartItem.recommended_stock_item_id);
            
          if (error) {
            console.error('Error fetching concrete products:', error);
            continue;
          }
          
          console.log(`商品類ID ${cartItem.recommended_stock_item_id} に対して ${concreteProducts?.length || 0} 件の商品が見つかりました`);
          
          // 代表プロダクトIDを使用した検索処理を削除
          let productsForItem = concreteProducts || [];
          
          // 現在選択されている具体的な商品を取得
          const selectedProduct = getConcreteCartItemByStockItemId(cartItem.recommended_stock_item_id);
          console.log("選択されている商品:", selectedProduct);
          
          stockItemsData.push({
            stockItemId: cartItem.recommended_stock_item_id,
            stockItemName: cartItem.item_name,
            requiredQuantity: Math.ceil(cartItem.calculatedQty || 0),
            concreteProducts: productsForItem,
            selectedProductId: selectedProduct ? selectedProduct.id : null
          });
        }
        
        setStockItemsWithProducts(stockItemsData);
      } catch (error) {
        console.error('Error processing stock items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConcreteProducts();
  }, [cartItems, getConcreteCartItemByStockItemId, concreteCartItems]);

  // 製品が選択されているかどうかを確認する関数
  const isProductSelected = (stockItemId: number, productId: number): boolean => {
    // concreteCartItemsを直接参照して、その商品が選択されているかどうかを確認
    return concreteCartItems.some(item => 
      item.recommended_stock_item_id === stockItemId && item.id === productId
    );
  };

  // 具体的な商品を選択するハンドラー
  const handleSelectProduct = (stockItemId: number, product: any, quantity: number) => {
    // すでに選択済みの場合は何もしない
    if (isProductSelected(stockItemId, product.id)) {
      toast({
        title: "すでに選択済みです",
        description: `${product.product_name}はすでに買い物かごに追加されています`,
      });
      return;
    }
    
    // 同じカテゴリーの別の商品が選択されていれば、まずそれを削除
    const existingProduct = getConcreteCartItemByStockItemId(stockItemId);
    if (existingProduct) {
      removeFromConcreteCart(existingProduct.id);
    }
    
    // ConcreteProductの型に合わせて必要なフィールドがすべて含まれていることを確認
    const concreteProduct: ConcreteProduct = {
      id: product.id,
      product_name: product.product_name,
      unit_price: product.unit_price || 1200,
      image_url: product.image_url || "/lovable-uploads/6db1a93f-476e-44e1-a174-c72ae003e967.png",
      product_code: product.product_code || `CP${product.id}`,
      recommended_stock_item_id: stockItemId,
      quantity: quantity
    };
    
    addToConcreteCart(concreteProduct);
    
    // 選択状態を更新
    setStockItemsWithProducts(prev => 
      prev.map(item => 
        item.stockItemId === stockItemId 
          ? { ...item, selectedProductId: product.id } 
          : item
      )
    );
    
    toast({
      title: "商品を選択しました",
      description: `${product.product_name}を買い物かごに追加しました`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">商品情報を読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/diagnosis-result')}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900">備蓄品の選択</h1>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <ShoppingCart className="h-5 w-5 mr-1" />
              <span className="font-medium">{concreteCartItems.length} 商品</span>
            </div>
            <Button onClick={() => navigate('/diagnosis-result')}>
              買い物かごを確認
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">具体的な商品を選択</h2>
          <p className="text-gray-600">各備蓄品について、具体的な商品を選択してください。</p>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {stockItemsWithProducts.map((stockItem) => (
            <Card key={stockItem.stockItemId} className="overflow-hidden">
              <div className="p-4 bg-gray-50 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{stockItem.stockItemName}</h3>
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    必要数量: {stockItem.requiredQuantity}
                  </div>
                </div>
              </div>
              
              <CardContent className="p-4">
                <Tabs defaultValue="products" className="w-full">
                  <TabsList>
                    <TabsTrigger value="products">商品一覧 ({stockItem.concreteProducts.length})</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="products" className="mt-4">
                    {stockItem.concreteProducts.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                        <AlertCircle className="h-12 w-12 mb-2 text-gray-400" />
                        <p>この商品カテゴリーには商品がありません</p>
                      </div>
                    ) : (
                      <ScrollArea className="w-full whitespace-nowrap pb-4">
                        <div className="flex space-x-4">
                          {stockItem.concreteProducts.map((product) => {
                            // concreteCartItemsに基づいて選択状態を判定
                            const isSelected = isProductSelected(stockItem.stockItemId, product.id);
                            
                            return (
                              <div 
                                key={product.id} 
                                className="flex-shrink-0 w-[260px]"
                              >
                                <div 
                                  className={`border rounded-lg overflow-hidden hover:shadow-md transition-shadow h-full ${
                                    isSelected ? 'border-blue-500 ring-2 ring-blue-200' : ''
                                  }`}
                                >
                                  {isSelected && (
                                    <div className="bg-blue-500 text-white text-xs font-medium py-1 px-3 absolute right-0 top-0 rounded-bl flex items-center">
                                      <Check className="h-3 w-3 mr-1" />
                                      選択中
                                    </div>
                                  )}
                                  <div className="h-48 overflow-hidden bg-gray-200 relative">
                                    <img 
                                      src={product.image_url || "/lovable-uploads/6db1a93f-476e-44e1-a174-c72ae003e967.png"} 
                                      alt={product.product_name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  
                                  <div className="p-4">
                                    <h4 className="font-medium mb-2 line-clamp-2 h-12">{product.product_name}</h4>
                                    <p className="text-lg font-bold text-blue-600 mb-3">
                                      ¥{(product.unit_price || 1200).toLocaleString()} (税込)
                                    </p>
                                    
                                    <Button 
                                      variant={isSelected ? "secondary" : "default"} 
                                      className="w-full"
                                      onClick={() => handleSelectProduct(stockItem.stockItemId, product, stockItem.requiredQuantity)}
                                    >
                                      {isSelected ? '選択中' : '選択する'}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Separator className="my-8" />
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate('/diagnosis-result')}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            診断結果に戻る
          </Button>
          
          <Button onClick={() => navigate('/diagnosis-result')} className="flex items-center">
            <ShoppingCart className="h-4 w-4 mr-2" />
            買い物かごを確認
          </Button>
        </div>
      </main>
    </div>
  );
};

export default EditProductList;
