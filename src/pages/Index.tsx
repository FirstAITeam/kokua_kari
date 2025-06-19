
import React, { useCallback, useEffect, useState } from "react";
import { Header } from "../components/layout/Header";
import { DiagnosisSection } from "../components/diagnosis/DiagnosisSection";
import { ChatSection } from "../components/diagnosis/ChatSection";
import { useDiagnosisState } from "../hooks/useDiagnosisState";
import { useProgressManager } from "../hooks/useProgressManager";
import { useLocation } from "react-router-dom";
import { Message } from "@/types/chat";

const Index = () => {
  const location = useLocation();
  const goToStep4 = location.state?.goToStep4 || false;
  const preserveChat = location.state?.preserveChat || false;
  
  // ストレージからチャット履歴を復元するための状態
  const [initialChatHistory, setInitialChatHistory] = useState<Message[] | null>(null);

  const {
    selectedDetail,
    setSelectedDetail,
    showDiagnosisResult,
    setShowDiagnosisResult,
    currentQuestionDetail,
    setCurrentQuestionDetail,
    diagnosisResultItems
  } = useDiagnosisState();

  const {
    currentStep,
    completedSteps,
    updateProgressStep,
    steps,
    setCurrentStep,
    setCompletedSteps
  } = useProgressManager();

  const [reopenDiagnosisDialog, setReopenDiagnosisDialog] = React.useState<(() => void) | undefined>(undefined);

  const handleShowDiagnosisResult = () => {
    setShowDiagnosisResult(true);
  };

  // 診断結果表示時のステップ更新をuseEffectで管理
  useEffect(() => {
    if (showDiagnosisResult && currentStep !== 'step6') {
      setCurrentStep('step6');
      setCompletedSteps(['step1', 'step2', 'step3', 'step4', 'step5']);
    }
  }, [showDiagnosisResult, currentStep, setCurrentStep, setCompletedSteps]);

  // 戻るボタンからSTEP4に直接戻る場合の処理
  useEffect(() => {
    if (goToStep4) {
      setCurrentStep('step4');
      setCompletedSteps(['step1', 'step2', 'step3']);
      
      // チャット履歴をローカルストレージから復元（preserveChatがtrueの場合）
      if (preserveChat) {
        try {
          const savedMessages = localStorage.getItem('chatMessages');
          if (savedMessages) {
            const parsedMessages = JSON.parse(savedMessages);
            setInitialChatHistory(parsedMessages);
          }
        } catch (error) {
          console.error('チャット履歴の復元に失敗しました:', error);
        }
      }
      
      // ステートをリセットして新しい遷移でフラグが残らないようにする
      window.history.replaceState({}, document.title);
    }
  }, [goToStep4, preserveChat, setCurrentStep, setCompletedSteps]);

  const handleReopenDialogCallback = useCallback((reopenFn: () => void) => {
    setReopenDiagnosisDialog(() => reopenFn);
  }, []);

  return (
    <div className="min-h-screen max-w-[100vw] overflow-x-hidden">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 justify-center">
          <DiagnosisSection
            showDiagnosisResult={showDiagnosisResult}
            steps={steps}
            currentStep={currentStep}
            completedSteps={completedSteps}
            diagnosisResultItems={diagnosisResultItems}
            onReopenDiagnosisDialog={reopenDiagnosisDialog}
          />

          <ChatSection
            currentQuestionDetail={currentQuestionDetail}
            setCurrentQuestionDetail={setCurrentQuestionDetail}
            setSelectedDetail={setSelectedDetail}
            updateProgressStep={updateProgressStep}
            currentStep={currentStep}
            onShowDiagnosisResult={handleShowDiagnosisResult}
            onReopenDiagnosisDialog={handleReopenDialogCallback}
            initialChatHistory={initialChatHistory}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
