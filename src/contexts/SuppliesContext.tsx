import React, { createContext, useContext, useState, ReactNode } from 'react';
import { RecommendedStockItem } from '@/hooks/useRecommendedStockItems';

// Define the Supply interface to be used in multiple components
export interface Supply {
  name: string;
  description?: string;
  quantity: string;
  category?: string;
}

// 商品ごとの有効災害種情報
export interface StockItemDisasterInfo {
  itemId: number;
  disasterTypes: number[];
}

// 具体的な商品情報
export interface ConcreteProduct {
  id: number;
  product_name: string;
  unit_price: number;
  image_url: string;
  product_code: string;
  recommended_stock_item_id: number;
  quantity: number;
}

interface SuppliesContextType {
  cartItems: RecommendedStockItem[];
  addToCart: (item: RecommendedStockItem) => void;
  removeFromCart: (itemId: number) => void;
  removeFromCartByName: (name: string) => void;
  clearCart: () => void;
  updateItemQuantity: (itemId: number, quantity: number) => void;
  selectedCorporateType: number;
  setSelectedCorporateType: (type: number) => void;
  peopleCount: number | '';
  setPeopleCount: (count: number | '' | ((prev: number | '') => number | '')) => void;
  supplies: Supply[];
  setSupplies: (supplies: Supply[]) => void;
  // 完全なアイテムデータ保存用のステート
  fullStockItems: RecommendedStockItem[];
  setFullStockItems: (items: RecommendedStockItem[]) => void;
  // 災害種情報用のステート
  disasterInfoItems: StockItemDisasterInfo[];
  setDisasterInfoItems: (items: StockItemDisasterInfo[]) => void;
  // 全商品データを格納するためのステート（法人形態でフィルタリングしない）
  allStockItems: RecommendedStockItem[];
  setAllStockItems: (items: RecommendedStockItem[]) => void;
  // 具体的な商品の買い物かご用のステート
  concreteCartItems: ConcreteProduct[];
  addToConcreteCart: (product: ConcreteProduct) => void;
  removeFromConcreteCart: (productId: number) => void;
  clearConcreteCart: () => void;
  updateConcreteItemQuantity: (productId: number, quantity: number) => void;
  getConcreteCartItemByStockItemId: (stockItemId: number) => ConcreteProduct | undefined;
}

const SuppliesContext = createContext<SuppliesContextType | undefined>(undefined);

export const SuppliesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<RecommendedStockItem[]>([]);
  const [selectedCorporateType, setSelectedCorporateType] = useState<number>(1); // デフォルトは民間企業オフィス
  const [peopleCount, setPeopleCount] = useState<number | ''>('');
  const [supplies, setSupplies] = useState<Supply[]>([]);
  // 完全なアイテムデータ保存用のステート
  const [fullStockItems, setFullStockItems] = useState<RecommendedStockItem[]>([]);
  // 災害種情報用のステート
  const [disasterInfoItems, setDisasterInfoItems] = useState<StockItemDisasterInfo[]>([]);
  // 全商品データを格納するためのステート（法人形態でフィルタリングしない）
  const [allStockItems, setAllStockItems] = useState<RecommendedStockItem[]>([]);
  // 具体的な商品の買い物かご用のステート
  const [concreteCartItems, setConcreteCartItems] = useState<ConcreteProduct[]>([]);

  const addToCart = (item: RecommendedStockItem) => {
    // カートに追加する前に、選択された法人形態と関連があるアイテムかどうか確認
    const isRelatedToCorporateType = item.corporate_types?.includes(selectedCorporateType);
    
    if (!isRelatedToCorporateType) {
      console.warn(`Item ${item.item_name} is not related to the selected corporate type (${selectedCorporateType})`);
      return; // 関連がない場合は追加しない
    }
    
    setCartItems(prev => {
      // すでに同じアイテムがあるか確認
      const existingItemIndex = prev.findIndex(i => i.recommended_stock_item_id === item.recommended_stock_item_id);
      
      if (existingItemIndex >= 0) {
        // すでに存在する場合は数量を更新
        const updatedItems = [...prev];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          calculatedQty: (updatedItems[existingItemIndex].calculatedQty || 0) + (item.calculatedQty || 0)
        };
        return updatedItems;
      } else {
        // 存在しない場合は新しく追加
        return [...prev, item];
      }
    });
  };

  const removeFromCart = (itemId: number) => {
    setCartItems(prev => prev.filter(item => item.recommended_stock_item_id !== itemId));
    
    // 関連する具体的な商品もカートから削除
    setConcreteCartItems(prev => prev.filter(item => item.recommended_stock_item_id !== itemId));
  };

  // 名前でカート内のアイテムを削除する新しいメソッド
  const removeFromCartByName = (name: string) => {
    const itemToRemove = cartItems.find(item => item.item_name === name);
    setCartItems(prev => prev.filter(item => item.item_name !== name));
    
    // 関連する具体的な商品もカートから削除
    if (itemToRemove) {
      setConcreteCartItems(prev => 
        prev.filter(item => item.recommended_stock_item_id !== itemToRemove.recommended_stock_item_id)
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
    // 具体的な商品のカートもクリア
    setConcreteCartItems([]);
  };

  const updateItemQuantity = (itemId: number, quantity: number) => {
    setCartItems(prev => 
      prev.map(item => 
        item.recommended_stock_item_id === itemId 
          ? { ...item, calculatedQty: quantity } 
          : item
      )
    );
    
    // 関連する具体的な商品の数量も更新
    const concreteItem = concreteCartItems.find(item => item.recommended_stock_item_id === itemId);
    if (concreteItem) {
      updateConcreteItemQuantity(concreteItem.id, quantity);
    }
  };

  // 具体的な商品カート用のメソッド
  const addToConcreteCart = (product: ConcreteProduct) => {
    // 修正: カートに追加する前に、recommended_stock_item_idがcartItemsに存在するか確認
    const stockItemExists = cartItems.some(item => item.recommended_stock_item_id === product.recommended_stock_item_id);
    
    if (!stockItemExists) {
      console.warn(`商品類ID ${product.recommended_stock_item_id} はcartItemsに存在しません。この商品は追加されません。`, product);
      return; // cartItemsに対応する商品類が存在しない場合は追加しない
    }
    
    setConcreteCartItems(prev => {
      // すでに同じ商品があるか確認
      const existingItemIndex = prev.findIndex(i => i.id === product.id);
      
      if (existingItemIndex >= 0) {
        // すでに存在する場合は数量を更新
        const updatedItems = [...prev];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: product.quantity
        };
        return updatedItems;
      } else {
        // 同じrecommended_stock_item_idを持つ商品がある場合は置き換え
        const sameStockItemIndex = prev.findIndex(i => 
          i.recommended_stock_item_id === product.recommended_stock_item_id
        );
        
        if (sameStockItemIndex >= 0) {
          const updatedItems = [...prev];
          updatedItems[sameStockItemIndex] = product;
          return updatedItems;
        }
        
        // 存在しない場合は新しく追加
        return [...prev, product];
      }
    });
  };

  const removeFromConcreteCart = (productId: number) => {
    setConcreteCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const clearConcreteCart = () => {
    setConcreteCartItems([]);
  };

  const updateConcreteItemQuantity = (productId: number, quantity: number) => {
    setConcreteCartItems(prev => 
      prev.map(item => 
        item.id === productId 
          ? { ...item, quantity: quantity } 
          : item
      )
    );
  };

  // recommended_stock_item_idに基づいて具体的な商品を取得するヘルパーメソッド
  const getConcreteCartItemByStockItemId = (stockItemId: number): ConcreteProduct | undefined => {
    return concreteCartItems.find(item => item.recommended_stock_item_id === stockItemId);
  };

  return (
    <SuppliesContext.Provider 
      value={{ 
        cartItems, 
        addToCart, 
        removeFromCart,
        removeFromCartByName,
        clearCart, 
        updateItemQuantity,
        selectedCorporateType,
        setSelectedCorporateType,
        peopleCount,
        setPeopleCount,
        supplies,
        setSupplies,
        fullStockItems,
        setFullStockItems,
        disasterInfoItems,
        setDisasterInfoItems,
        allStockItems,
        setAllStockItems,
        concreteCartItems,
        addToConcreteCart,
        removeFromConcreteCart,
        clearConcreteCart,
        updateConcreteItemQuantity,
        getConcreteCartItemByStockItemId
      }}
    >
      {children}
    </SuppliesContext.Provider>
  );
};

export const useSupplies = () => {
  const context = useContext(SuppliesContext);
  if (context === undefined) {
    throw new Error('useSupplies must be used within a SuppliesProvider');
  }
  return context;
};
