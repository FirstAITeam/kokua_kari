import { useState, useCallback } from 'react';

type DialogProps = {
  initiatePeopleInputQuestion: () => void;
  updateProgressStep?: (stepId: string, isActive: boolean, isCompleted: boolean) => void;
};

export const useDiagnosisDialog = ({
  initiatePeopleInputQuestion,
  updateProgressStep
}: DialogProps) => {
  const [showDiagnosisDialog, setShowDiagnosisDialog] = useState(false);

  const handleDiagnosisContinue = useCallback(() => {
    setShowDiagnosisDialog(false);

    // 状態更新を条件付きで行う
    if (updateProgressStep) {
      // 現在のステップを確認してから更新
      updateProgressStep('step3', true, false);
      updateProgressStep('people', true, false);
    }

    // 人数入力画面を表示
    initiatePeopleInputQuestion();
  }, [updateProgressStep, initiatePeopleInputQuestion]);

  const reopenDiagnosisDialog = useCallback(() => {
    setShowDiagnosisDialog(true);
  }, []);

  return {
    showDiagnosisDialog,
    setShowDiagnosisDialog,
    handleDiagnosisContinue,
    reopenDiagnosisDialog
  };
};
