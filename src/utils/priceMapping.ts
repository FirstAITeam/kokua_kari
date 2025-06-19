
/**
 * 備蓄品の参考価格マッピングデータ
 * アイテム名から価格を検索するためのユーティリティ
 */

/**
 * 商品名から参考価格を取得する関数
 * データベースから直接参照価格が提供される場合はそれを使用する
 * @param item 商品情報またはアイテム名
 * @returns 参考価格（円）
 */
export const getPriceByItemName = (
  item: string | { item_name: string; reference_price?: number | null }
): number => {
  // オブジェクトが渡された場合
  if (typeof item !== 'string') {
    // データベースのreference_priceを確認
    if (item.reference_price !== undefined && item.reference_price !== null) {
      return item.reference_price;
    }
    // reference_priceがない場合は0を返す
    return 0;
  }

  // 文字列の場合（アイテム名）は0を返す
  return 0;
};

/**
 * 商品リストから合計金額を計算する関数
 * @param items 商品リスト
 * @returns 合計金額（円）
 */
export const calculateTotalPrice = (
  items: Array<{ 
    item_name: string; 
    calculatedQty?: number; 
    reference_price?: number | null 
  }>
): number => {
  return items.reduce((total, item) => {
    const price = getPriceByItemName(item);
    const quantity = Math.ceil(item.calculatedQty || 0);
    return total + (price * quantity);
  }, 0);
};
