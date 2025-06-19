
// ChatInterface.tsx
import { useRef, useEffect, useState, useMemo } from "react";
import { QuestionDetail, Message } from "@/types/chat";
import { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useOrgTypeAndPeopleInput } from "@/hooks/useOrgTypeAndPeopleInput";
import { useScenarioSteps } from "@/hooks/useScenarioSteps";
import { useDiagnosisDialog } from "@/hooks/useDiagnosisDialog";
import { useSupplies } from '@/contexts/SuppliesContext';
import { useMessageHandler } from "@/hooks/useMessageHandler";
import { useOptionHandler } from "@/hooks/useOptionHandler";
import { MessageContainer } from "./chat-interface/MessageContainer";
import { ChatInputSection } from "./chat-interface/ChatInputSection";
import { PeopleInputFormContainer } from "./chat/PeopleInputFormContainer";
import { MessageProcessingIndicator } from "./chat/MessageProcessingIndicator";
import { DiagnosisDialogContainer } from "./chat/DiagnosisDialogContainer";
import { AddressConfirmation } from "./AddressConfirmation";

interface ChatInterfaceProps {
  currentQuestionDetail: QuestionDetail;
  setCurrentQuestionDetail: Dispatch<SetStateAction<QuestionDetail>>;
  setSelectedDetail: Dispatch<
    SetStateAction<"budget" | "effectiveness" | "categories" | "quality" | "quantity" | "question">
  >;
  updateProgressStep?: (stepId: string, isActive: boolean, isCompleted: boolean) => void;
  currentStep?: string;
  onShowDiagnosisResult?: () => void;
  onReopenDiagnosisDialog?: (reopenFn: () => void) => void;
  initialChatHistory?: Message[] | null;
}

export const ChatInterface = ({
  currentQuestionDetail,
  setCurrentQuestionDetail,
  setSelectedDetail,
  updateProgressStep,
  currentStep,
  onShowDiagnosisResult,
  onReopenDiagnosisDialog,
  initialChatHistory
}: ChatInterfaceProps) => {
  // 各種コンテキストとフックの初期化
  const {
    supplies,
    setSupplies,
    fullStockItems,
    allStockItems,
    removeFromCartByName,
    peopleCount
  } = useSupplies();

  // チャットメッセージ関連のフック
  const {
    messages,
    setMessages,
    awaitingZipCodeInput,
    setAwaitingZipCodeInput,
    zipCodeError,
    handleZipCodeInput,
    startRiskAnalysis,
    resetRiskAnalysis,
    addUserMessage,
    addAIMessage,
    updateMessageWithOption,
    isAnalyzingRisk
  } = useChatMessages({
    setCurrentQuestionDetail,
    setSelectedDetail,
    updateProgressStep,
    initialMessages: initialChatHistory || undefined
  });

  // 組織タイプと人数入力のためのフック
  const {
    selectedOrgType,
    awaitingPeopleInput,
    setPeopleCount,
    peoplePercent,
    setPeoplePercent,
    visitorCount,
    setVisitorCount,
    studentCount,
    setStudentCount,
    handleOrgTypeSelection,
    handlePeopleInputSubmit,
    initiatePeopleInputQuestion,
  } = useOrgTypeAndPeopleInput({
    setCurrentQuestionDetail,
    setSelectedDetail,
    updateProgressStep,
    addUserMessage,
    addAIMessage,
  });

  // シナリオステップ管理のためのフック
  const {
    currentStep: scenarioStep,
    setCurrentStep,
    currentStepOptions,
    moveToNextStep,
    isLoading,
  } = useScenarioSteps();

  // 診断ダイアログのためのフック
  const {
    showDiagnosisDialog,
    setShowDiagnosisDialog,
    handleDiagnosisContinue,
    reopenDiagnosisDialog,
  } = useDiagnosisDialog({
    initiatePeopleInputQuestion,
    updateProgressStep,
  });

  const [showAddressConfirmation, setShowAddressConfirmation] = useState(false);
  const [inputAddress, setInputAddress] = useState("");
  const [isAddressConfirmed, setIsAddressConfirmed] = useState(false);

  // チャット履歴をローカルストレージに保存するための処理
  useEffect(() => {
    if (messages && messages.length > 0) {
      try {
        localStorage.setItem('chatMessages', JSON.stringify(messages));
      } catch (error) {
        console.error('チャット履歴の保存に失敗しました:', error);
      }
    }
  }, [messages]);

  // 初期チャット履歴を設定
  useEffect(() => {
    if (initialChatHistory && initialChatHistory.length > 0) {
      setMessages(initialChatHistory);
      
      // 最後のメッセージが AI からのものでオプションがある場合、会話を再開できるようにする
      const lastMessage = initialChatHistory[initialChatHistory.length - 1];
      if (lastMessage.role === 'ai' && lastMessage.options && lastMessage.options.length > 0) {
        // 会話を再開できるように必要な状態を設定
        // ここで必要に応じて追加の状態設定を行う
      }
    }
  }, [initialChatHistory, setMessages]);

  const handleAddressConfirm = () => {
    setShowAddressConfirmation(false);
    setIsAddressConfirmed(true);
    // 住所確認後に分析を開始
    startRiskAnalysis();
    // 次のステップへ進む
    moveToNextStep();
  };

  const handleAddressCancel = () => {
    setShowAddressConfirmation(false);
    setIsAddressConfirmed(false);
    // リスク分析をリセット
    resetRiskAnalysis();
    // 住所入力に戻る
    setCurrentStep(0);
    // 住所入力を有効化
    setAwaitingZipCodeInput(true);
  };

  // メッセージ処理のためのフック
  const {
    message,
    setMessage,
    isProcessingAI,
    isConversationActive,
    activateConversation,
    handleSend
  } = useMessageHandler({
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
    onAddressInput: (address) => {
      if (!isAddressConfirmed) {
        setInputAddress(address);
        setShowAddressConfirmation(true);
      }
    }
  });

  // オプション処理のためのフック
  const { handleOptionClick } = useOptionHandler({
    onShowDiagnosisResult,
    addUserMessage,
    addAIMessage,
    updateMessageWithOption,
    setAwaitingZipCodeInput,
    handleOrgTypeSelection,
    setShowDiagnosisDialog,
    moveToNextStep,
    currentStepOptions,
    setSupplies,
    activateConversation
  });

  // 診断ダイアログ再表示のためのコールバック登録
  useEffect(() => {
    if (onReopenDiagnosisDialog && reopenDiagnosisDialog) {
      onReopenDiagnosisDialog(reopenDiagnosisDialog);
    }
  }, [onReopenDiagnosisDialog, reopenDiagnosisDialog]);

  // 入力フォームを無効にするかどうか
  const shouldDisableInput = useMemo(() =>
    !awaitingZipCodeInput &&
    messages.length > 0 &&
    messages[messages.length - 1].options?.length > 0,
    [awaitingZipCodeInput, messages]
  );

  // ローディング中の表示
  if (isLoading && !awaitingZipCodeInput && !awaitingPeopleInput) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full bg-white/95 backdrop-blur-sm rounded-lg border-4 border-[#40414F]">
      {/* メッセージ表示エリア */}
      <MessageContainer messages={messages} onOptionClick={handleOptionClick} />

      {/* 住所確認ダイアログ */}
      {showAddressConfirmation && !isAddressConfirmed && (
        <AddressConfirmation
          address={inputAddress}
          onConfirm={handleAddressConfirm}
          onCancel={handleAddressCancel}
        />
      )}

      {/* 人数入力フォーム */}
      <PeopleInputFormContainer
        selectedOrgType={selectedOrgType}
        peopleCount={peopleCount}
        setPeopleCount={setPeopleCount}
        peoplePercent={peoplePercent}
        setPeoplePercent={setPeoplePercent}
        visitorCount={visitorCount}
        setVisitorCount={setVisitorCount}
        studentCount={studentCount}
        setStudentCount={setStudentCount}
        handlePeopleInputSubmit={handlePeopleInputSubmit}
        awaitingPeopleInput={awaitingPeopleInput}
      />

      {/* 処理状態インジケーター */}
      <MessageProcessingIndicator
        isAnalyzingRisk={isAnalyzingRisk}
        isProcessingAI={isProcessingAI}
      />

      {/* チャット入力部分（人数入力フォームが表示されていない場合のみ表示） */}
      {!awaitingPeopleInput && (
        <ChatInputSection
          message={message}
          setMessage={setMessage}
          handleSend={handleSend}
          awaitingZipCodeInput={awaitingZipCodeInput}
          zipCodeError={zipCodeError}
          disableInput={shouldDisableInput}
          isAnalyzingRisk={isAnalyzingRisk}
          isProcessing={isProcessingAI}
        />
      )}

      {/* 診断結果ダイアログ */}
      <DiagnosisDialogContainer
        showDiagnosisDialog={showDiagnosisDialog}
        setShowDiagnosisDialog={setShowDiagnosisDialog}
        handleDiagnosisContinue={handleDiagnosisContinue}
      />
    </div>
  );
};
