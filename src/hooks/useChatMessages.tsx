
import { useState, useEffect, useCallback } from 'react';
import { Message, QuestionDetail } from "@/types/chat";
import { Dispatch, SetStateAction } from 'react';
import { useDisasterRisk } from '@/hooks/useDisasterRisk_byPython';
import { useAddress } from "@/contexts/AddressContext"; // ここでグローバルな住所管理を読み込み

interface UseChatMessagesProps {
  setCurrentQuestionDetail: Dispatch<SetStateAction<QuestionDetail>>;
  setSelectedDetail: Dispatch<SetStateAction<'budget' | 'effectiveness' | 'categories' | 'quality' | 'quantity' | 'question'>>;
  updateProgressStep?: (stepId: string, isActive: boolean, isCompleted: boolean) => void;
  initialMessages?: Message[];
}

export const useChatMessages = ({
  setCurrentQuestionDetail,
  setSelectedDetail,
  updateProgressStep,
  initialMessages
}: UseChatMessagesProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages || []);
  const [awaitingZipCodeInput, setAwaitingZipCodeInput] = useState(false);
  const [zipCodeError, setZipCodeError] = useState<string | null>(null);
  const [isAnalyzingRisk, setIsAnalyzingRisk] = useState(false);
  const [shouldAnalyzeRisk, setShouldAnalyzeRisk] = useState(false);

  // グローバルな住所情報を AddressContext から取得する
  const { currentAddress, setCurrentAddress } = useAddress();

  // currentAddress の変更に応じてリスクデータを更新する
  const { riskData, error, isLoadingRisk } = useDisasterRisk(shouldAnalyzeRisk ? currentAddress : null);

  useEffect(() => {
    if (!messages.length && !initialMessages) {
      setMessages([
        {
          role: 'ai',
          content: 'こんばんは。AI診断サービスへようこそ。あなたにおすすめの防災備蓄品を診断します。まずはじめに、法人/団体の住所を教えていただけますか？',
          options: ['住所を入力する']
        }
      ]);

      setCurrentQuestionDetail({
        title: "住所の入力",
        description: "法人/団体の所在地に基づいて、想定される災害リスクを分析します。",
        importance: "所在地によって想定される災害リスクが異なるため、適切な防災備蓄品を選定するために重要な情報です。",
        recommendations: ["住所を入力してください", "例: 東京都北区西ケ原三丁目"]
      });

      setSelectedDetail('question');

      if (updateProgressStep) {
        updateProgressStep('address', true, false);
      }
    }
  }, [messages.length, initialMessages, setCurrentQuestionDetail, setSelectedDetail, updateProgressStep]); // 初期メッセージの有無も考慮

  useEffect(() => {
    console.log("currentAddress updated:", currentAddress);
  }, [currentAddress]);

  const handleZipCodeInput = (message: string) => {
    if (!message.trim()) return;

    const zipCode = message.trim();
    setZipCodeError(null);

    // グローバルな住所を更新する
    setCurrentAddress(zipCode);

    // メッセージを更新
    setMessages(prev => [
      ...prev,
      { role: 'user', content: zipCode }
    ]);
    setAwaitingZipCodeInput(false);
  };

  const startRiskAnalysis = useCallback(() => {
    if (!currentAddress) return;

    // リスク分析を開始
    setShouldAnalyzeRisk(true);

    // リスク分析中のフラグを立てる
    setIsAnalyzingRisk(true);

    setMessages(prev => [
      ...prev,
      {
        role: 'ai',
        content: `「${currentAddress}」の災害リスク情報を分析しています...`
      }
    ]);

    if (updateProgressStep) {
      updateProgressStep('address', false, true);
      updateProgressStep('orgType', true, false);
    }

    setCurrentQuestionDetail({
      title: "組織タイプの確認",
      description: "組織の種類によって必要な防災備蓄品が異なります。組織の特性に合わせた備蓄品を選定するために、組織の種類をお聞かせください。",
      importance: "組織の特性に応じた適切な備蓄計画を立てることで、災害時の対応をより効果的に行うことができます。特に、利用者の年齢層や活動内容によって必要な備蓄品が大きく異なってきます。",
      recommendations: [
        "組織の主な活動時間帯を考慮してください",
        "利用者の年齢層や特性を考慮してください",
        "建物の構造や立地条件も考慮に入れてください",
        "災害時の想定される滞在者数を考慮してください"
      ]
    });
  }, [currentAddress, updateProgressStep, setCurrentQuestionDetail]);

  const resetRiskAnalysis = useCallback(() => {
    setShouldAnalyzeRisk(false);
    setIsAnalyzingRisk(false);
  }, []);

  useEffect(() => {
    if (!isLoadingRisk && riskData && currentAddress) {
      // APIからのレスポンスが取得できたらメッセージを更新
      setMessages(prevMessages => {
        const hasRiskAnalysisMessage = prevMessages.some(msg =>
          msg.role === 'ai' && (
            msg.content.includes('の災害リスク情報を取得中です') ||
            msg.content.includes('の災害リスク情報を分析しています')
          )
        );

        if (!hasRiskAnalysisMessage) return prevMessages;

        return prevMessages.map(msg => {
          if (msg.role === 'ai' && (
              msg.content.includes('の災害リスク情報を取得中です') ||
              msg.content.includes('の災害リスク情報を分析しています')
            )) {
            // 各リスクのランクを取得
            const earthquakeRank = riskData.earthquake?.rank || '不明';
            const floodRank = riskData.flood?.rank || '不明';
            const dirtsandRank = riskData.dirtsand?.rank || '不明';
            const tsunamiRank = riskData.tsunami?.rank || '不明';
            const heavysnowRank = riskData.heavysnow?.rank || '不明';

            // 分析結果メッセージの作成
            return {
              ...msg,
              content: `「${riskData.address || currentAddress}」の災害リスク情報を分析しています...\n\n分析結果：\n・地震リスク: ${earthquakeRank}\n・洪水浸水リスク: ${floodRank}\n・土砂災害リスク: ${dirtsandRank}\n・津波リスク: ${tsunamiRank}\n・雪崩リスク: ${heavysnowRank}\n\nそれでは、防災備蓄品の診断を続けていきましょう。あなたの組織についてお聞かせください。`,
              options: ['民間企業 オフィス', '民間企業 店舗', '自治会・自主防災組織', '教育機関']
            };
          }
          return msg;
        });
      });

      // リスク分析完了のフラグを下ろす
      setIsAnalyzingRisk(false);
    }
  }, [isLoadingRisk, riskData, currentAddress]);

  const addUserMessage = useCallback((content: string) => {
    setMessages(prev => [...prev, { role: 'user', content }]);
  }, []);

  const addAIMessage = useCallback((content: string, options: string[] = []) => {
    setMessages(prev => [...prev, { role: 'ai', content, options }]);
  }, []);

  const updateMessageWithOption = useCallback((messageIndex: number, option: string) => {
    setMessages(prev => prev.map((msg, idx) =>
      idx === messageIndex
        ? { ...msg, selectedOption: option }
        : msg
    ));
  }, []);

  return {
    messages,
    setMessages,
    awaitingZipCodeInput,
    setAwaitingZipCodeInput,
    zipCodeError,
    setZipCodeError,
    handleZipCodeInput,
    startRiskAnalysis,
    resetRiskAnalysis,
    addUserMessage,
    addAIMessage,
    updateMessageWithOption,
    currentAddress,
    setCurrentAddress,
    isAnalyzingRisk
  };
};
