
// 災害リスクの算出

import { useState, useEffect } from 'react';

// API から返されるリスク情報の型定義（任意のキーと文字列の値）
export interface RiskData {
  earthquake?: { rank: string; risk: number };
  flood?: { rank: string; risk: number };
  tsunami?: { rank: string; risk: number };
  dirtsand?: { rank: string; risk: number };
  heavysnow?: { rank: string; risk: number };
  address?: string;
  input_address?: string;
  [key: string]: any;
}

interface UseDisasterRiskResult {
  riskData: RiskData | null;
  error: Error | null;
  isLoadingRisk: boolean;
}

// グローバルキャッシュ：address をキーとして RiskData を保存
const riskCache: { [address: string]: RiskData } = {};

export function useDisasterRisk(address: string): UseDisasterRiskResult {
  const [riskData, setRiskData] = useState<RiskData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoadingRisk, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!address) {
      setIsLoading(false);
      return;
    }

    console.log(`住所に基づいてリスク情報を取得します: ${address}`);

    // キャッシュに同じ address のデータがあれば、それを使って再計算をスキップする
    if (riskCache[address]) {
      console.log(`キャッシュからリスク情報を取得: ${address}`);
      setRiskData(riskCache[address]);
      setIsLoading(false);
      return;
    }

    // API エンドポイントの URL を生成（エンコードも実施）
    // 相対パスを使用してプロキシを経由するようにする
    const apiUrl = `/api/calc-risk?address=${encodeURIComponent(address)}`;
    console.log(`APIリクエスト: ${apiUrl}`);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: RiskData) => {
        console.log('リスク評価結果:', data);

        // Unicode エスケープシーケンスを実際の日本語文字に変換
        // 例: "\u306a\u3057" -> "なし"
        Object.keys(data).forEach(key => {
          if (data[key] && typeof data[key] === 'object' && data[key].rank) {
            if (typeof data[key].rank === 'string') {
              // Unicode エスケープシーケンスを日本語文字に変換
              try {
                // 既にデコードされている可能性がある文字列は処理しない
                const rankValue = data[key].rank;
                if (rankValue.includes('\\u')) {
                  data[key].rank = JSON.parse(`"${rankValue}"`);
                }
              } catch (e) {
                console.error('日本語文字のデコードに失敗:', e);
                // デコードに失敗した場合は元の文字列を使用
              }
            }
          }
        });

        if (data.error === "住所が存在しません") {
          // 入力をやり直してください
          console.error('API エラー:', data.error);
          setError(new Error(data.error));
          setIsLoading(false);
        }
        else {
          // キャッシュに保存
          riskCache[address] = data;
          setRiskData(data);
          setIsLoading(false);
        }
      })
      .catch((err: Error) => {
        console.error('API エラー:', err);
        setError(err);
        setIsLoading(false);
      });
  }, [address]);

  return { riskData, error, isLoadingRisk };
}
