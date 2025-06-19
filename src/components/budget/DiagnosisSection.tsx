
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSupplies } from '@/contexts/SuppliesContext';
import { supabase } from "@/integrations/supabase/client";

interface DiagnosisSectionProps {
  totalBudget: number;
  effectiveness: number;
  categories: number;
  quality: string;
  people: number;
  days: number;
  items: Array<{
    name: string;
    pricePerUnit: number;
    quantity: number;
  }>;
  currentQuestionDetail?: {
    title: string;
    description: string;
    importance: string;
    recommendations: string[];
  };
  onDetailChange: (detail: 'budget' | 'effectiveness' | 'categories' | 'quality' | 'quantity' | 'question') => void;
}

export const DiagnosisSection = ({ 
  totalBudget, 
  effectiveness, 
  categories,
  quality,
  people,
  days,
  items,
  currentQuestionDetail,
  onDetailChange 
}: DiagnosisSectionProps) => {
  const navigate = useNavigate();
  
  const { 
    cartItems, 
    addToConcreteCart,
    concreteCartItems 
  } = useSupplies();

  // 代表製品IDから具体的な商品情報を取得する関数
  const fetchConcreteProduct = async (representativeProductId: number, stockItemId: number, quantity: number) => {
    try {
      const { data, error } = await supabase
        .from('concrete_products')
        .select('*')
        .eq('id', representativeProductId)
        .single();

      if (error) {
        console.error("Error fetching concrete product:", error);
        return null;
      }

      if (data) {
        return {
          id: data.id,
          product_name: data.product_name,
          unit_price: data.unit_price,
          image_url: data.image_url,
          product_code: data.product_code || `CP${data.id}`,
          recommended_stock_item_id: stockItemId,
          quantity: quantity
        };
      }
    } catch (err) {
      console.error("Exception when fetching concrete product:", err);
    }
    return null;
  };
  
  const handleNextStepClick = async () => {
    // すでに具体的な商品が選択されているアイテムはスキップするためのIDリスト
    const existingConcreteItemIds = concreteCartItems.map(item => item.recommended_stock_item_id);
    
    // 代表製品IDを持つがまだ具体的な商品が選択されていないアイテムを処理
    const itemsToProcess = cartItems.filter(item => 
      item.representative_product_id && 
      !existingConcreteItemIds.includes(item.recommended_stock_item_id)
    );

    // 各アイテムの代表製品を取得して追加
    for (const item of itemsToProcess) {
      if (item.representative_product_id) {
        const quantity = Math.ceil(item.calculatedQty || 0);
        const product = await fetchConcreteProduct(
          item.representative_product_id, 
          item.recommended_stock_item_id, 
          quantity
        );
        
        if (product) {
          addToConcreteCart(product);
        }
      }
    }

    // 処理完了後、結果ページに遷移
    navigate('/diagnosis-result');
  };
  
  return (
    <div className="w-full rounded-lg p-6 bg-white shadow-md">
      <h2 className="text-xl font-bold mb-4">予算診断</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600">予算総額</p>
          <p className="text-2xl font-bold">{totalBudget.toLocaleString()}円</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">人数 x 日数</p>
          <p className="text-2xl font-bold">{people}人 x {days}日</p>
        </div>
      </div>
      
      <div className="flex justify-end mt-6">
        <button 
          onClick={handleNextStepClick}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          次のステップへ
        </button>
      </div>
    </div>
  );
};
