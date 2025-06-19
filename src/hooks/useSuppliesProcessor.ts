
import { Supply } from '@/contexts/SuppliesContext';
import { RecommendedStockItem } from '@/hooks/useRecommendedStockItems';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Supabese Edge Functionを呼び出して備蓄品リストを処理する関数
export async function processSuppliesWithSupabaseFunction(
  userRequest: string,
  currentSupplies: Supply[],
  fullStockItemsData: RecommendedStockItem[],
  allStockItemsData: RecommendedStockItem[]
): Promise<{newSupplies: Supply[], explanation: string, removedItems: string[]}> {
  try {
    console.log("Calling Supabase Edge Function for supplies processing");
    
    const { data, error } = await supabase.functions.invoke('process-supplies', {
      body: {
        userRequest,
        currentSupplies,
        fullStockItems: fullStockItemsData,
        allStockItems: allStockItemsData
      },
    });

    if (error) {
      console.error('Supabase Edge Function error:', error);
      throw new Error(`Supabase Edge Function error: ${error.message}`);
    }

    console.log("Supabase Edge Function response:", data);
    
    if (!data || !data.newSupplies || !data.explanation) {
      throw new Error('無効なレスポンス形式です');
    }
    
    return {
      newSupplies: data.newSupplies,
      explanation: data.explanation,
      removedItems: data.removedItems || []
    };
  } catch (error) {
    console.error("備蓄品処理中にエラー:", error);
    return { 
      newSupplies: currentSupplies,
      explanation: "申し訳ありません。備蓄品リストの処理中にエラーが発生しました。",
      removedItems: []
    };
  }
}

// OpenAI APIを直接呼び出してSuppliesリストを処理する関数
export async function callOpenAIChat(userMessage: string): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('chat', {
      body: { prompt: userMessage }
    });

    if (error) {
      console.error('エラー:', error);
      return "申し訳ありません。会話中にエラーが発生しました。";
    }

    return data.generatedText || "応答を生成できませんでした。";
  } catch (error) {
    console.error('OpenAI API呼び出しエラー:', error);
    return "申し訳ありません。会話中にエラーが発生しました。";
  }
}

// ユーザーの要求と現在の備蓄品データから、不要な備蓄品を削除した新たな Supplies リストを生成する関数
export async function filterSuppliesWithAI(
  userRequest: string,
  currentSupplies: Supply[],
  fullStockItemsData: RecommendedStockItem[],
  allStockItemsData: RecommendedStockItem[],
  removeFromCartByName: (name: string) => void // カートから名前でアイテムを削除する関数を追加
): Promise<{newSupplies: Supply[], explanation: string, removedItems: string[]}> {
  try {
    // リクエスト前にデータをログ出力
    console.log("Request to process supplies:", {
      userRequest,
      suppliesCount: currentSupplies.length,
      suppliesItems: currentSupplies.map(item => item.name)
    });
    
    // Supabase Edge Function を呼び出して処理
    const result = await processSuppliesWithSupabaseFunction(
      userRequest,
      currentSupplies,
      fullStockItemsData,
      allStockItemsData
    );
    
    const { newSupplies, explanation, removedItems } = result;
    
    // 削除されたアイテムがあるかログ出力
    if (removedItems && removedItems.length > 0) {
      console.log(`削除されたアイテム: ${removedItems.join(', ')}`);
      
      // 削除されたアイテムを買い物かごからも削除
      removedItems.forEach(itemName => {
        console.log(`カートから削除: ${itemName}`);
        removeFromCartByName(itemName);
      });
    }
    
    return {
      newSupplies,
      explanation,
      removedItems
    };
  } catch (error) {
    console.error("LLMによる備蓄品リスト更新処理でエラー:", error);
    return { 
      newSupplies: currentSupplies,
      explanation: "申し訳ありません。備蓄品リストの処理中にエラーが発生しました。",
      removedItems: []
    };
  }
}
