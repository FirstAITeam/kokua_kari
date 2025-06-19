
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSupplies } from "@/contexts/SuppliesContext";
import { useState, useEffect } from "react";
import { ShoppingCart, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  asin: string;
  condition: string;
  reviews: number;
  rating: number;
  image: string;
  recommended_stock_item_id: number;
}

interface ProductListProps {
  products?: Product[];
}

export const ProductList = ({ products: initialProducts }: ProductListProps) => {
  const navigate = useNavigate();
  // SuppliesContextから買い物かごに入っている商品を取得
  const { cartItems, removeFromCart, concreteCartItems, removeFromConcreteCart } = useSupplies();
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 買い物かごに入っている具体的な商品情報を取得
  useEffect(() => {
    const prepareDisplayProducts = () => {
      if (!concreteCartItems || concreteCartItems.length === 0) {
        setDisplayProducts([]);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const products: Product[] = [];
        
        // concreteCartItemsの商品情報のみを表示
        for (const concreteItem of concreteCartItems) {
          // 対応するcartItemを見つける（数量を取得するため）
          const cartItem = cartItems.find(item => 
            item.recommended_stock_item_id === concreteItem.recommended_stock_item_id
          );
          
          const quantity = cartItem ? Math.ceil(cartItem.calculatedQty || 0) : 1;
          
          products.push({
            id: concreteItem.id,
            name: concreteItem.product_name,
            price: concreteItem.unit_price || 1200,
            quantity: quantity,
            asin: concreteItem.product_code || `CP${concreteItem.id}`,
            condition: "新品",
            reviews: 0,
            rating: 4.5,
            image: concreteItem.image_url || "/lovable-uploads/6db1a93f-476e-44e1-a174-c72ae003e967.png",
            recommended_stock_item_id: concreteItem.recommended_stock_item_id
          });
        }
        
        setDisplayProducts(products);
      } catch (error) {
        console.error('Error processing products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    prepareDisplayProducts();
  }, [cartItems, concreteCartItems]);

  // 初期値が提供されている場合はそれを使用
  const products = initialProducts || displayProducts;

  // カートが空かどうかを確認
  const isCartEmpty = !products || products.length === 0;

  // 合計金額を計算
  const totalPrice = products.reduce((total, product) => total + (product.price * product.quantity), 0);

  // 商品を買い物かごから削除するハンドラー
  const handleRemoveItem = (product: Product) => {
    // 具体的な商品のカートから削除
    if (product.id > 0) {
      removeFromConcreteCart(product.id);
    }
    
    // 一般的な商品カートからも削除
    removeFromCart(product.recommended_stock_item_id);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border-4 border-[#40414F] lg:h-[calc(100vh-9rem)] flex items-center justify-center">
        <div className="text-xl text-gray-600">商品情報を読み込み中...</div>
      </div>
    );
  }

  if (isCartEmpty) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border-4 border-[#40414F] lg:h-[calc(100vh-9rem)] flex flex-col items-center justify-center">
        <ShoppingCart size={64} className="text-gray-400 mb-4" />
        <div className="text-xl text-gray-600 mb-2">カートは空です</div>
        <p className="text-gray-500 text-center mb-6">
          診断結果に基づいた防災備蓄品をカートに追加しましょう
        </p>
        <Button variant="default" onClick={() => navigate('/edit-products')}>
          備蓄品を手動で選択 <Edit className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border-4 border-[#40414F] lg:h-[calc(100vh-9rem)] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">買い物かごの商品リスト</h2>
        <div className="text-lg font-semibold text-green-700">
          合計: {totalPrice.toLocaleString()}円（税込）
        </div>
      </div>
      
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4">
          {products.map((product) => {
            // 商品ごとの合計金額
            const productTotal = product.price * product.quantity;
            
            return (
              <div 
                key={product.id} 
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  <div className="w-[120px] h-[120px] bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-bold text-gray-800">{product.name}</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRemoveItem(product)}
                              className="text-red-500 h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>カートから削除</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center text-yellow-500">
                        {"★".repeat(Math.floor(product.rating))}
                        {"☆".repeat(5 - Math.floor(product.rating))}
                      </div>
                      <span className="text-sm text-gray-500">
                        ({product.reviews}件の評価)
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">必要数量: {product.quantity}</p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-lg font-bold text-blue-600">
                        ¥{product.price.toLocaleString()} (税込)
                      </p>
                      <p className="text-sm font-semibold text-green-600">
                        合計: ¥{productTotal.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      ASIN: {product.asin} | {product.condition}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-gray-600">
            {products.length}点の商品
          </div>
          <Button onClick={() => navigate('/edit-products')}>
            備蓄品を手動で選択 <Edit className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
