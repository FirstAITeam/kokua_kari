import React, { useCallback, useEffect } from "react";
import { Header } from "../components/layout/Header";
import { DiagnosisSection } from "../components/diagnosis/DiagnosisSection";
import { ChatSection } from "../components/diagnosis/ChatSection";
import { useDiagnosisState } from "../hooks/useDiagnosisState";
import { useProgressManager } from "../hooks/useProgressManager";

const Index = () => {
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
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
