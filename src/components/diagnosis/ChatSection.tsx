
import React from 'react';
import { ChatInterface } from "../ChatInterface";
import { QuestionDetail } from '@/types/chat';

interface ChatSectionProps {
  currentQuestionDetail: QuestionDetail;
  setCurrentQuestionDetail: React.Dispatch<React.SetStateAction<QuestionDetail>>;
  setSelectedDetail: React.Dispatch<React.SetStateAction<'budget' | 'effectiveness' | 'categories' | 'quality' | 'quantity' | 'question'>>;
  updateProgressStep: (stepId: string, isActive: boolean, isCompleted: boolean) => void;
  currentStep: string;
  onShowDiagnosisResult: () => void;
  onReopenDiagnosisDialog?: (reopenFn: () => void) => void;
}

export const ChatSection: React.FC<ChatSectionProps> = ({
  currentQuestionDetail,
  setCurrentQuestionDetail,
  setSelectedDetail,
  updateProgressStep,
  currentStep,
  onShowDiagnosisResult,
  onReopenDiagnosisDialog
}) => {
  // If we're at step 6 (AI interaction), update the question detail
  React.useEffect(() => {
    if (currentStep === 'step6') {
      setCurrentQuestionDetail({
        title: "AI対話による絞り込み",
        description: "商品リストを最適化するためにAIと対話しましょう。",
        importance: "リストを絞り込むことで、より予算に合った備蓄計画を立てることができます。",
        recommendations: [
          "予算に合わせて商品数を調整できます",
          "特定の災害対策を優先できます",
          "好みの商品に変更することもできます"
        ]
      });
    }
  }, [currentStep, setCurrentQuestionDetail]);

  return (
    <div className="w-full lg:w-2/5">
      <div className="h-[calc(100vh-12rem)] max-h-[800px]">
        <ChatInterface
          currentQuestionDetail={currentQuestionDetail}
          setCurrentQuestionDetail={setCurrentQuestionDetail}
          setSelectedDetail={setSelectedDetail}
          updateProgressStep={updateProgressStep}
          currentStep={currentStep}
          onShowDiagnosisResult={onShowDiagnosisResult}
          onReopenDiagnosisDialog={onReopenDiagnosisDialog}
        />
      </div>
    </div>
  );
};
