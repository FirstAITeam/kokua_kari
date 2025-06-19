
import { useState } from 'react';
import { QuestionDetail, DiagnosisResultItem, ProgressStep } from '@/types/chat';

export const useDiagnosisState = () => {
  const [selectedDetail, setSelectedDetail] = useState<'budget' | 'effectiveness' | 'categories' | 'quality' | 'quantity' | 'question'>('question');
  const [items, setItems] = useState([
    { name: "ヘルメット", pricePerUnit: 3000, quantity: 10 },
    { name: "非常食A", pricePerUnit: 5000, quantity: 10 },
    { name: "非常食B", pricePerUnit: 4500, quantity: 10 },
    { name: "防災バッグ", pricePerUnit: 8000, quantity: 10 },
    { name: "懐中電灯", pricePerUnit: 2500, quantity: 10 },
    { name: "救急セット", pricePerUnit: 6000, quantity: 10 },
    { name: "防災ラジオ", pricePerUnit: 4000, quantity: 10 },
    { name: "毛布", pricePerUnit: 3500, quantity: 10 },
    { name: "携帯トイレ", pricePerUnit: 2000, quantity: 10 },
    { name: "防災テント", pricePerUnit: 15000, quantity: 5 },
    { name: "発電機", pricePerUnit: 50000, quantity: 2 },
    { name: "浄水器", pricePerUnit: 12000, quantity: 5 },
    { name: "防災工具セット", pricePerUnit: 8500, quantity: 3 },
    { name: "防災マット", pricePerUnit: 4500, quantity: 10 },
  ]);
  const [displayQuestionDetail, setDisplayQuestionDetail] = useState(true);
  const [showDiagnosisResult, setShowDiagnosisResult] = useState(false);

  const [currentQuestionDetail, setCurrentQuestionDetail] = useState<QuestionDetail>({
    title: "診断開始",
    description: "防災備蓄品の最適な選定のため、いくつかの質問にお答えいただきます。",
    importance: "組織に適した防災備蓄品を選定することは、災害時の安全確保に重要です。",
    recommendations: [
      "質問には正直にお答えください",
      "具体的な状況を想定しながら回答してください",
      "不明な点がある場合は、より安全側の選択肢を選んでください"
    ]
  });

  const [diagnosisResultItems, setDiagnosisResultItems] = useState<DiagnosisResultItem[]>([
    { category: "食品類", productName: "アルファ米", quantity: "10人×3日分" },
    { category: "食品類", productName: "フリーズドライご飯", quantity: "10人×3日分" },
    { category: "食品類", productName: "缶詰", quantity: "10人×3日分" },
    { category: "食品類", productName: "保存水", quantity: "10人×3日分" },
    { category: "飲料水・給水用品類", productName: "給水バッグ", quantity: "10人分" },
    { category: "飲料水・給水用品類", productName: "携帯浄水器", quantity: "5台" },
    { category: "飲料水・給水用品類", productName: "大容量給水タンク", quantity: "2台" },
    { category: "トイレ用品類", productName: "非常用トイレ（単品・少回数）", quantity: "10人×3日分" },
    { category: "トイレ用品類", productName: "非常用トイレ（ブック収納型）", quantity: "10人分" },
    { category: "衛生用品類", productName: "紙おむつ", quantity: "必要に応じて" },
    { category: "衛生用品類", productName: "トイレットペーパー", quantity: "10人×5日分" },
    { category: "衛生用品類", productName: "防護用品類", quantity: "10人分" },
    { category: "衛生用品類", productName: "救急キット", quantity: "2セット" },
    { category: "防災用具類", productName: "懐中電灯", quantity: "10人分" },
    { category: "防災用具類", productName: "多機能ラジオ", quantity: "3台" },
    { category: "防災用具類", productName: "軍手・防災手袋", quantity: "10人分" },
    { category: "防災用具類", productName: "ヘルメット/防災頭巾", quantity: "10人分" },
    { category: "情報・通信類", productName: "携帯電話充電器（手動/ソーラー）", quantity: "5台" },
    { category: "情報・通信類", productName: "防災ラジオ", quantity: "3台" },
    { category: "防寒・暑さ対策", productName: "防寒シート", quantity: "10人分" },
    { category: "防寒・暑さ対策", productName: "使い捨てカイロ", quantity: "10人×3日分" },
    { category: "避難・緊急脱出用品", productName: "避難用リュック", quantity: "10人分" },
    { category: "避難・緊急脱出用品", productName: "笛（ホイッスル）", quantity: "10人分" }
  ]);

  return {
    selectedDetail,
    setSelectedDetail,
    items,
    setItems,
    displayQuestionDetail,
    setDisplayQuestionDetail,
    showDiagnosisResult,
    setShowDiagnosisResult,
    currentQuestionDetail,
    setCurrentQuestionDetail,
    diagnosisResultItems,
    setDiagnosisResultItems
  };
};
