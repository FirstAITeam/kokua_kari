import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";

export interface RecommendedStockItem {
  recommended_stock_item_id: number;
  item_name: string;
  phase: string;
  per_person_qty: number;
  per_10_person_qty: number | null;
  basis: string | null;
  unit: string | null;
  category_id: number | null;
  reference_price: number | null; // Added reference_price field
  // Optional database fields that may not always be present
  quality_level?: string | null;
  remarks?: string | null;
  substitute_group_id?: number | null;
  cover_count?: string | null; // Changed from number to string
  representative_product_id?: number | null; // 追加: 代表商品ID
  // Custom fields we add through processing
  corporate_types?: number[];
  disaster_types?: number[];
  calculatedQty?: number;
}

// 企業形態の対応表
const CORPORATE_TYPE_MAP = {
  1: "民間企業オフィス",
  2: "民間企業店舗",
  3: "教育機関",
  4: "自治会・自主防災組織"
};

// 災害種類の対応表
const DISASTER_TYPE_MAP = {
  1: "地震",
  2: "水害", // 洪水/台風/津波
  3: "土砂災害",
  4: "大雪"
};

// デモ用のフォールバックデータ
const fallbackStockItems: RecommendedStockItem[] = [
  {
    recommended_stock_item_id: 1,
    item_name: "アルファ米",
    phase: "数時間後",
    per_person_qty: 3,
    per_10_person_qty: 30,
    basis: "3食分/人",
    unit: "食",
    category_id: null,
    reference_price: 300,
    corporate_types: [1, 2, 3, 4],
    disaster_types: [1, 2],
    calculatedQty: 30
  },
  {
    recommended_stock_item_id: 2,
    item_name: "保存水",
    phase: "数時間後",
    per_person_qty: 9,
    per_10_person_qty: 90,
    basis: "3リットル/日×3日分",
    unit: "ℓ",
    category_id: null,
    reference_price: 150,
    corporate_types: [1, 2, 3, 4],
    disaster_types: [1, 2],
    calculatedQty: 90
  },
  {
    recommended_stock_item_id: 3,
    item_name: "非常用トイレ（少回数）",
    phase: "数時間後",
    per_person_qty: 6,
    per_10_person_qty: 60,
    basis: "1日2回×3日分",
    unit: "回分",
    category_id: null,
    reference_price: 2000,
    corporate_types: [1, 2, 3, 4],
    disaster_types: [1, 2],
    calculatedQty: 60
  },
  {
    recommended_stock_item_id: 4,
    item_name: "ヘルメット",
    phase: "発生時",
    per_person_qty: 1,
    per_10_person_qty: 10,
    basis: "頭部保護",
    unit: "個",
    category_id: null,
    reference_price: 3600,
    corporate_types: [1, 2, 3, 4],
    disaster_types: [1],
    calculatedQty: 10
  },
  {
    recommended_stock_item_id: 5,
    item_name: "救急セット",
    phase: "発生直後",
    per_person_qty: 0.2,
    per_10_person_qty: 2,
    basis: "応急処置用",
    unit: "セット",
    category_id: null,
    reference_price: 3000,
    corporate_types: [1, 2, 3, 4],
    disaster_types: [1, 2],
    calculatedQty: 2
  },
  {
    recommended_stock_item_id: 6,
    item_name: "カセットコンロ",
    phase: "数日後",
    per_person_qty: 0.1,
    per_10_person_qty: 1,
    basis: "調理用",
    unit: "台",
    category_id: null,
    reference_price: 3000,
    corporate_types: [1, 2, 4],
    disaster_types: [1, 2],
    calculatedQty: 1
  },
  {
    recommended_stock_item_id: 7,
    item_name: "棚固定金具セット",
    phase: "発生前",
    per_person_qty: 0.3,
    per_10_person_qty: 3,
    basis: "転倒防止のため",
    unit: "個",
    category_id: null,
    reference_price: 2500,
    corporate_types: [1, 3],
    disaster_types: [1],
    calculatedQty: 3
  },
  {
    recommended_stock_item_id: 8,
    item_name: "止水板",
    phase: "発生前",
    per_person_qty: 0.3,
    per_10_person_qty: 3,
    basis: "浸水防止",
    unit: "枚",
    category_id: null,
    reference_price: 20000,
    corporate_types: [1, 2, 3, 4],
    disaster_types: [2],
    calculatedQty: 3
  }
];

// 全ての推奨備蓄品を取得するカスタムフック（法人形態でフィルタリングしない）
export const useAllRecommendedStockItems = (peopleCount: number = 10) => {
  return useQuery({
    queryKey: ['allRecommendedStockItems', peopleCount],
    queryFn: async () => {
      try {
        // まず推奨備蓄品をすべて取得（法人形態でフィルタリングしない）
        const { data: items, error: itemsError } = await supabase
          .from('recommended_stock_items')
          .select('*');
        
        if (itemsError) {
          console.error("Error fetching all recommended stock items:", itemsError);
          throw new Error("Failed to fetch all recommended stock items");
        }
        
        // データが空の場合はフォールバックデータを返す
        if (!items || items.length === 0) {
          console.log("No data found in recommended_stock_items table, using fallback data");
          return fallbackStockItems;
        }
        
        // 中間テーブルから法人形態の関係を取得（全ての法人形態）
        const { data: corporateRelations, error: corpError } = await supabase
          .from('item_corporate_types')
          .select('*');
        
        if (corpError) {
          console.error("Error fetching all corporate type relations:", corpError);
          throw new Error("Failed to fetch corporate type relations");
        }
        
        // 中間テーブルから災害種類の関係を取得（すべての災害タイプ）
        const { data: disasterRelations, error: disError } = await supabase
          .from('item_disaster_types')
          .select('*');
        
        if (disError) {
          console.error("Error fetching all disaster type relations:", disError);
          throw new Error("Failed to fetch disaster type relations");
        }
        
        // 各商品に関連する法人形態と災害種類のIDを追加
        const enhancedItems: RecommendedStockItem[] = items.map(item => {
          // この商品に関連する法人形態IDを取得
          const corpTypes = corporateRelations
            .filter(rel => rel.recommended_stock_item_id === item.recommended_stock_item_id)
            .map(rel => rel.corporate_type_id);
          
          // この商品に関連する災害種類IDを取得
          const disTypes = disasterRelations
            .filter(rel => rel.recommended_stock_item_id === item.recommended_stock_item_id)
            .map(rel => rel.disaster_type_id);
          
          // 人数に基づいて基本的な必要数を計算
          const baseQty = item.per_person_qty * peopleCount;
          const calculatedQty = Math.ceil(baseQty * 10) / 10;
          
          return {
            ...item,
            corporate_types: corpTypes,
            disaster_types: disTypes,
            calculatedQty
          } as RecommendedStockItem;
        });
        
        return enhancedItems;
      } catch (error) {
        console.error("Error in useAllRecommendedStockItems:", error);
        return fallbackStockItems;
      }
    },
    staleTime: 5 * 60 * 1000, // 5分間キャッシュを保持
  });
};

// 特定用途に基づく必要数量調整関数
const adjustQuantityForCorporateAndDisaster = (
  item: RecommendedStockItem,
  corporateTypeId: number,
  peopleCount: number
): number => {
  // アイテム名を基準に特別な調整ロジックを適用
  const itemName = item.item_name.toLowerCase();
  const phase = item.phase;
  
  // 基本計算: 人数 × 1人あたり必要数
  let baseQty = item.per_person_qty * peopleCount;
  
  // 企業タイプが民間オフィスの場��の特別な調整
  if (corporateTypeId === 1) {
    // 事前対策フェーズの特定アイテム
    if (phase === "発生前") {
      if (itemName.includes("棚固定金具") || itemName.includes("転倒防止器具")) {
        return Math.ceil((0.75 * peopleCount) * 10) / 10; // 0.75個/人
      }
      if (itemName.includes("ガラス飛散防止フィルム")) {
        return Math.ceil((1 * peopleCount) * 10) / 10; // 1枚/人
      }
      if (itemName.includes("無停電電源装置") || itemName.includes("ups")) {
        return Math.ceil((0.1 * peopleCount) * 10) / 10; // 0.1台/人
      }
    }
    
    // 発生時の特定アイテム
    if (phase === "発生時") {
      if (itemName.includes("ヘルメット")) {
        return Math.ceil((1 * peopleCount) * 10) / 10; // 1個/人
      }
      if (itemName.includes("防災ずきん")) {
        return Math.ceil((1.5 * peopleCount) * 10) / 10; // 1.5枚/人
      }
      if (itemName.includes("ホイッスル") || itemName.includes("笛")) {
        return Math.ceil((1 * peopleCount) * 10) / 10; // 1個/人
      }
    }
    
    // 発生直後の特定アイテム
    if (phase === "発生直後") {
      if (itemName.includes("救急セット")) {
        return Math.ceil((0.1 * peopleCount) * 10) / 10; // 0.1セット/人
      }
      if (itemName.includes("aed") || itemName.includes("自動体外式除細動器")) {
        return Math.ceil((0.1 * peopleCount) * 10) / 10; // 0.1台/人
      }
      if (itemName.includes("防災ラジオ") || itemName.includes("ラジオライト")) {
        return Math.ceil((0.1 * peopleCount) * 10) / 10; // 0.1台/人
      }
      if (itemName.includes("ランタン")) {
        return Math.ceil((0.1 * peopleCount) * 10) / 10; // 0.1台/人
      }
      if (itemName.includes("非常用持出セット")) {
        return Math.ceil((1 * peopleCount) * 10) / 10; // 1セット/人
      }
    }
    
    // 数時間後の特定アイテム
    if (phase === "数時間後") {
      if (itemName.includes("アルファ米")) {
        return Math.ceil((3 * peopleCount) * 10) / 10; // 3食/人
      }
      if (itemName.includes("保存水")) {
        return Math.ceil((3 * peopleCount) * 10) / 10; // 3本/人
      }
      if (itemName.includes("非常用トイレ") && (itemName.includes("単品") || itemName.includes("少回数"))) {
        return Math.ceil((0.4 * peopleCount) * 10) / 10; // 0.4パック/人
      }
      if (itemName.includes("ウェットティッシュ") || itemName.includes("清拭関連")) {
        return Math.ceil((0.12 * peopleCount) * 10) / 10; // 0.12パック/人
      }
      if (itemName.includes("アルミシート") || itemName.includes("ブランケット")) {
        return Math.ceil((1 * peopleCount) * 10) / 10; // 1枚/人
      }
      if (itemName.includes("ランタン") && !itemName.includes("追加")) {
        return Math.ceil((0.1 * peopleCount) * 10) / 10; // 0.1台/人
      }
      if (itemName.includes("乾電池")) {
        return Math.ceil((0.12 * peopleCount) * 10) / 10; // 0.12パック/人
      }
      if (itemName.includes("トランシーバー")) {
        return Math.ceil((0.1 * peopleCount) * 10) / 10; // 0.1台/人
      }
      if (itemName.includes("ポータブル電源")) {
        return Math.ceil((0.1 * peopleCount) * 10) / 10; // 0.1台/人
      }
    }
    
    // 数日後の特定アイテム
    if (phase === "数日後") {
      if (itemName.includes("セット商品") && (itemName.includes("食+水") || itemName.includes("食品"))) {
        return Math.ceil((3 * peopleCount) * 10) / 10; // 3セット/人
      }
      if (itemName.includes("非常用トイレ") && (itemName.includes("大容量"))) {
        return Math.ceil((0.1 * peopleCount) * 10) / 10; // 0.1セット/人
      }
      if (itemName.includes("段ボール間仕���り")) {
        return Math.ceil((0.1 * peopleCount) * 10) / 10; // 0.1キット/人
      }
      if (itemName.includes("ブルーシート")) {
        return Math.ceil((0.2 * peopleCount) * 10) / 10; // 0.2枚/人
      }
      if (itemName.includes("簡易寝具")) {
        return Math.ceil((1 * peopleCount) * 10) / 10; // 1セット/人
      }
      if (itemName.includes("ガスコンロ")) {
        return Math.ceil((0.1 * peopleCount) * 10) / 10; // 0.1台/人
      }
      if (itemName.includes("カセットガス")) {
        return Math.ceil((0.1 * peopleCount) * 10) / 10; // 0.1パック/人
      }
      if (itemName.includes("ソーラーパネル")) {
        return Math.ceil((0.1 * peopleCount) * 10) / 10; // 0.1枚/人
      }
    }
  }
  
  // 民間店舗の場合
  else if (corporateTypeId === 2) {
    if (phase === "発生前") {
      if (itemName.includes("止水板")) {
        return Math.ceil((0.5 * peopleCount) * 10) / 10; // 0.5枚/人
      }
      if (itemName.includes("発電機")) {
        return Math.ceil((0.05 * peopleCount) * 10) / 10; // 0.05台/人
      }
    }
    if (phase === "発生時") {
      if (itemName.includes("拡声器")) {
        return Math.ceil((0.05 * peopleCount) * 10) / 10; // 0.05台/人
      }
      if (itemName.includes("軍手")) {
        return Math.ceil((1 * peopleCount) * 10) / 10; // 1双/人
      }
    }
    if (phase === "発生直後") {
      if (itemName.includes("懐中電灯")) {
        return Math.ceil((0.5 * peopleCount) * 10) / 10; // 0.5個/人
      }
      if (itemName.includes("作業用手袋")) {
        return Math.ceil((0.5 * peopleCount) * 10) / 10; // 0.5双/人
      }
    }
    if (phase === "数時間後") {
      if (itemName.includes("粉ミルク")) {
        return Math.ceil((0.1 * peopleCount) * 10) / 10; // 0.1缶/人
      }
      if (itemName.includes("哺乳瓶")) {
        return Math.ceil((0.1 * peopleCount) * 10) / 10; // 0.1個/人
      }
      if (itemName.includes("紙おむつ")) {
        return Math.ceil((0.2 * peopleCount) * 10) / 10; // 0.2パック/人
      }
    }
    if (phase === "数日後") {
      if (itemName.includes("簡易ベッド")) {
        return Math.ceil((0.2 * peopleCount) * 10) / 10; // 0.2台/人
      }
      if (itemName.includes("簡易シャワー")) {
        return Math.ceil((0.05 * peopleCount) * 10) / 10; // 0.05個/人
      }
    }
  }
  
  // 教育機関の場合
  else if (corporateTypeId === 3) {
    if (phase === "発生前") {
      if (itemName.includes("耐震マット")) {
        return Math.ceil((0.8 * peopleCount) * 10) / 10; // 0.8枚/人
      }
      if (itemName.includes("防火シート")) {
        return Math.ceil((0.2 * peopleCount) * 10) / 10; // 0.2枚/人
      }
    }
    if (phase === "発生時") {
      if (itemName.includes("運動靴")) {
        return Math.ceil((1 * peopleCount) * 10) / 10; // 1足/人
      }
      if (itemName.includes("防煙マスク")) {
        return Math.ceil((0.5 * peopleCount) * 10) / 10; // 0.5個/人
      }
    }
    if (phase === "発生直後") {
      if (itemName.includes("包帯")) {
        return Math.ceil((0.1 * peopleCount) * 10) / 10; // 0.1個/人
      }
      if (itemName.includes("消毒液")) {
        return Math.ceil((0.05 * peopleCount) * 10) / 10; // 0.05本/人
      }
    }
    if (phase === "数時間後") {
      if (itemName.includes("生理用品")) {
        return Math.ceil((0.3 * peopleCount) * 10) / 10; // 0.3パック/人
      }
      if (itemName.includes("タオル")) {
        return Math.ceil((1 * peopleCount) * 10) / 10; // 1枚/人
      }
    }
    if (phase === "数日後") {
      if (itemName.includes("簡易テント")) {
        return Math.ceil((0.1 * peopleCount) * 10) / 10; // 0.1張/人
      }
      if (itemName.includes("毛布")) {
        return Math.ceil((1 * peopleCount) * 10) / 10; // 1枚/人
      }
    }
  }
  
  // 自治会・自主防災組織の場合
  else if (corporateTypeId === 4) {
    if (phase === "発生前") {
      if (itemName.includes("防災マップ")) {
        return Math.ceil((0.2 * peopleCount) * 10) / 10; // 0.2枚/人
      }
      if (itemName.includes("非常用発電機")) {
        return Math.ceil((0.03 * peopleCount) * 10) / 10; // 0.03台/人
      }
    }
    if (phase === "発生時") {
      if (itemName.includes("拡声器")) {
        return Math.ceil((0.03 * peopleCount) * 10) / 10; // 0.03台/人
      }
      if (itemName.includes("ロープ")) {
        return Math.ceil((0.05 * peopleCount) * 10) / 10; // 0.05本/人
      }
    }
    if (phase === "発生直後") {
      if (itemName.includes("救助用工具")) {
        return Math.ceil((0.02 * peopleCount) * 10) / 10; // 0.02セット/人
      }
      if (itemName.includes("担架")) {
        return Math.ceil((0.05 * peopleCount) * 10) / 10; // 0.05台/人
      }
    }
    if (phase === "数時間後") {
      if (itemName.includes("簡易トイレ")) {
        return Math.ceil((0.3 * peopleCount) * 10) / 10; // 0.3個/人
      }
      if (itemName.includes("ポリタンク")) {
        return Math.ceil((0.1 * peopleCount) * 10) / 10; // 0.1個/人
      }
    }
    if (phase === "数日後") {
      if (itemName.includes("炊き出しセット")) {
        return Math.ceil((0.01 * peopleCount) * 10) / 10; // 0.01セット/人
      }
      if (itemName.includes("給水車")) {
        return Math.ceil((0.005 * peopleCount) * 10) / 10; // 0.005台/人
      }
    }
  }
  
  // 上記以外の組み合わせや、特別な調整がないアイテムは基本計算を使用
  return Math.ceil(baseQty * 10) / 10;
};

export const useRecommendedStockItems = (
  corporateTypeId: number = 1, 
  peopleCount: number = 10
) => {
  return useQuery({
    queryKey: ['recommendedStockItems', corporateTypeId, peopleCount],
    queryFn: async () => {
      try {
        // まず推奨備蓄品をすべて取得
        const { data: items, error: itemsError } = await supabase
          .from('recommended_stock_items')
          .select('*');
        
        if (itemsError) {
          console.error("Error fetching recommended stock items:", itemsError);
          throw new Error("Failed to fetch recommended stock items");
        }
        
        // データが空の場合はフォールバックデータを返す
        if (!items || items.length === 0) {
          console.log("No data found in recommended_stock_items table, using fallback data");
          return generateFallbackData(corporateTypeId, peopleCount);
        }
        
        // 中間テーブルから法人形態の関係を取得
        const { data: corporateRelations, error: corpError } = await supabase
          .from('item_corporate_types')
          .select('*')
          .eq('corporate_type_id', corporateTypeId);
        
        if (corpError) {
          console.error("Error fetching corporate type relations:", corpError);
          throw new Error("Failed to fetch corporate type relations");
        }
        
        // 中間テーブルのデータがない場合もフォールバックデータを返す
        if (!corporateRelations || corporateRelations.length === 0) {
          console.log("No data found in item_corporate_types table, using fallback data");
          return generateFallbackData(corporateTypeId, peopleCount);
        }
        
        // 中間テーブルから災害種類の関係を取得（すべての災害タイプを含む）
        const { data: disasterRelations, error: disError } = await supabase
          .from('item_disaster_types')
          .select('*');
        
        if (disError) {
          console.error("Error fetching disaster type relations:", disError);
          throw new Error("Failed to fetch disaster type relations");
        }
        
        // 災害関係のデータがない場合もフォールバックデータを返す
        if (!disasterRelations || disasterRelations.length === 0) {
          console.log("No data found in item_disaster_types table, using fallback data");
          return generateFallbackData(corporateTypeId, peopleCount);
        }
        
        // 法人形態で絞り込んだ商品IDリスト
        const corporateItemIds = corporateRelations.map(rel => rel.recommended_stock_item_id);
        
        // 法人形態に一致する商品をフィルタリング（災害タイプによるフィルタリングを削除）
        let filteredItems = items.filter(item => 
          corporateItemIds.includes(item.recommended_stock_item_id)
        );
        
        // フィルタリングの結果が空の場合もフォールバックデータを返す
        if (filteredItems.length === 0) {
          console.log("No items match the filter criteria, using fallback data");
          return generateFallbackData(corporateTypeId, peopleCount);
        }
        
        // 各商品に関連する法人形態と災害種類のIDを追加
        const enhancedItems: RecommendedStockItem[] = filteredItems.map(item => {
          // この商品に関連する法人形態IDを取得
          const corpTypes = corporateRelations
            .filter(rel => rel.recommended_stock_item_id === item.recommended_stock_item_id)
            .map(rel => rel.corporate_type_id);
          
          // この商品に関連する災害種類IDを取得（情報として保持）
          const disTypes = disasterRelations
            .filter(rel => rel.recommended_stock_item_id === item.recommended_stock_item_id)
            .map(rel => rel.disaster_type_id);
          
          // 人数と企業タイプに基づいて必要数を調整計算（災害タイプは考慮しない）
          const calculatedQty = adjustQuantityForCorporateAndDisaster(
            item as RecommendedStockItem,
            corporateTypeId,
            peopleCount
          );
          
          return {
            ...item,
            corporate_types: corpTypes,
            disaster_types: disTypes,
            calculatedQty
          } as RecommendedStockItem;
        });
        
        return enhancedItems;
      } catch (error) {
        console.error("Error in useRecommendedStockItems:", error);
        // エラー発生時もフォールバックデータを返す
        return generateFallbackData(corporateTypeId, peopleCount);
      }
    },
    staleTime: 5 * 60 * 1000, // 5分間キャッシュを保持
  });
};

// フォールバックデータを生成する関数
const generateFallbackData = (
  corporateTypeId: number,
  peopleCount: number
): RecommendedStockItem[] => {
  // 企業タイプでフィルタリング（災害タイプによるフィルタリングを削除）
  let filteredItems = fallbackStockItems.filter(item => 
    item.corporate_types?.includes(corporateTypeId)
  );
  
  // 人数に応じた数量を再計算
  return filteredItems.map(item => {
    const baseQty = item.per_person_qty * peopleCount;
    return {
      ...item,
      calculatedQty: Math.ceil(baseQty * 10) / 10
    };
  });
};

// 法人形態のみでフィルタリングした備蓄品を取得するカスタムフック
export const useFilteredRecommendedItems = (
  corporateTypeId: number = 1,
  peopleCount: number = 10
) => {
  // 全ての備蓄品を企業形態だけに基づいて取得（災害リスクは考慮しない）
  const { data: allItems, isLoading, error } = useRecommendedStockItems(corporateTypeId, peopleCount);
  
  return { filteredItems: allItems, isLoading, error };
};

// Update the calculateTotalPrice function to use reference_price from the database
export const calculateTotalPrice = (items: Array<RecommendedStockItem>): number => {
  return items.reduce((total, item) => {
    const price = item.reference_price || 0;
    const quantity = Math.ceil(item.calculatedQty || 0);
    return total + (price * quantity);
  }, 0);
};
