
import React from 'react';
import { DiagnosisResultDialog } from "../dialog/DiagnosisResultDialog";

interface DiagnosisDialogContainerProps {
  showDiagnosisDialog: boolean;
  setShowDiagnosisDialog: (show: boolean) => void;
  handleDiagnosisContinue: () => void;
}

export const DiagnosisDialogContainer: React.FC<DiagnosisDialogContainerProps> = ({
  showDiagnosisDialog,
  setShowDiagnosisDialog,
  handleDiagnosisContinue
}) => {
  return (
    <DiagnosisResultDialog
      open={showDiagnosisDialog}
      onOpenChange={setShowDiagnosisDialog}
      onContinue={handleDiagnosisContinue}
    />
  );
};
