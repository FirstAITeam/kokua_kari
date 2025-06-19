import { useState, useCallback } from 'react';
import { Message, QuestionDetail } from "@/types/chat";
import { Supply } from '@/contexts/SuppliesContext';
import { RecommendedStockItem } from '@/hooks/useRecommendedStockItems';
import { toast } from "@/hooks/use-toast";
import { filterSuppliesWithAI, callOpenAIChat } from './useSuppliesProcessor';

interface UseMessageHandlerProps {
  messages: Message[];
  addUserMessage: (content: string) => void;
  addAIMessage: (content: string, options?: string[]) => void;
  updateMessageWithOption: (messageIndex: number, option: string) => void;
  supplies: Supply[];
  setSupplies: (supplies: Supply[]) => void;
  fullStockItems: RecommendedStockItem[];
  allStockItems: RecommendedStockItem[];
  removeFromCartByName: (name: string) => void;
  awaitingZipCodeInput: boolean;
  awaitingPeopleInput: boolean;
  handleZipCodeInput: (zipCode: string) => void;
  handlePeopleInputSubmit: () => void;
  onAddressInput?: (address: string) => void;
}

export const useMessageHandler = ({
  messages,
  addUserMessage,
  addAIMessage,
  updateMessageWithOption,
  supplies,
  setSupplies,
  fullStockItems,
  allStockItems,
  removeFromCartByName,
  awaitingZipCodeInput,
  awaitingPeopleInput,
  handleZipCodeInput,
  handlePeopleInputSubmit,
  onAddressInput
}: UseMessageHandlerProps) => {
  const [message, setMessage] = useState("");
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [isConversationActive, setIsConversationActive] = useState(false);

  // 通常の送信処理。会話がアクティブなら OpenAI を呼び出す
  const handleSend = useCallback(async () => {
    if (awaitingPeopleInput) {
      handlePeopleInputSubmit();
      return;
    }
    if (!message.trim()) return;
    if (awaitingZipCodeInput) {
      handleZipCodeInput(message);
      if (onAddressInput) {
        onAddressInput(message);
      }
      return;
    }

    // ユーザーのメッセージが備蓄品データのフィルタリング要求の場合
    if (isConversationActive) {
      const userRequestText = message;
      addUserMessage(userRequestText);
      setMessage("");
      setIsProcessingAI(true); // 処理開始

      try {
        // 更新前の備蓄品リストをディープコピー（比較用）
        const previousSupplies = JSON.stringify(supplies);

        // AI処理で備蓄品リストを更新（カートアイテム削除用のメソッドも渡す）
        const { newSupplies, explanation, removedItems } = await filterSuppliesWithAI(
          userRequestText,
          supplies,
          fullStockItems,
          allStockItems,
          removeFromCartByName
        );

        // 削除されたアイテムがあるかログ出力
        if (removedItems && removedItems.length > 0) {
          console.log(`削除されたアイテム: ${removedItems.join(', ')}`);

          // トースト通知で削除されたアイテムを表示
          toast({
            title: "次のアイテムを削除しました",
            description: removedItems.join(', '),
          });
        }

        // 備蓄品リストの変更を確認
        const hasChanged = previousSupplies !== JSON.stringify(newSupplies);
        console.log(`備蓄品リストは変更されました: ${hasChanged}`);
        console.log(`更新前: ${previousSupplies}`);
        console.log(`更新後: ${JSON.stringify(newSupplies)}`);

        // 新しい備蓄品リストを保存 - 変更があった場合のみ
        if (hasChanged) {
          console.log("備蓄品リストを更新します");
          setSupplies(newSupplies);

          if (!(removedItems && removedItems.length > 0)) {
            toast({
              title: "備蓄品リストを更新しました",
              description: "AIによる処理が完了しました",
            });
          }
        }

        // AIの説明を表示
        addAIMessage(explanation);
      } catch (error) {
        console.error("備蓄品データ更新中にエラー:", error);
        addAIMessage("申し訳ありません。備蓄品リストの更新に失敗しました。");

        // エラーの場合もトースト通知
        toast({
          title: "エラーが発生しました",
          description: "備蓄品リストの更新に失敗しました",
          variant: "destructive"
        });
      } finally {
        setIsProcessingAI(false); // 処理完了
      }
      return;
    }

    addUserMessage(message);
    setMessage("");
  }, [
    message,
    awaitingPeopleInput,
    awaitingZipCodeInput,
    isConversationActive,
    addUserMessage,
    addAIMessage,
    supplies,
    fullStockItems,
    allStockItems,
    removeFromCartByName,
    setSupplies,
    handleZipCodeInput,
    handlePeopleInputSubmit,
    onAddressInput
  ]);

  // OpenAI API を呼ぶ会話用の送信処理
  const handleSendOpenAI = useCallback(async () => {
    if (!message.trim()) return;
    addUserMessage(message);
    try {
      const response = await callOpenAIChat(message);
      addAIMessage(response);
    } catch (error) {
      console.error("OpenAI API error:", error);
      addAIMessage("申し訳ありません。会話に問題が発生しました。");
    }
    setMessage("");
  }, [message, addUserMessage, addAIMessage]);

  const activateConversation = useCallback(() => {
    setIsConversationActive(true);
  }, []);

  return {
    message,
    setMessage,
    isProcessingAI,
    isConversationActive,
    activateConversation,
    handleSend,
    handleSendOpenAI
  };
};
