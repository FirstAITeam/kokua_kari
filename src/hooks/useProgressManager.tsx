
import { useState, useCallback } from 'react';
import { ProgressStep, StepData } from '@/types/chat';

export const useProgressManager = () => {
  const [currentStep, setCurrentStep] = useState('step1');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([
    {
      id: 'address',
      label: '住所を入力',
      isActive: true,
      isCompleted: false
    },
    {
      id: 'orgType',
      label: '法人形態を選択',
      isActive: false,
      isCompleted: false
    },
    {
      id: 'people',
      label: '人数規模を入力',
      isActive: false,
      isCompleted: false
    }
  ]);

  const updateProgressStep = useCallback((stepId: string, isActive: boolean, isCompleted: boolean) => {
    setProgressSteps(prevSteps =>
      prevSteps.map(step =>
        step.id === stepId
          ? { ...step, isActive, isCompleted }
          : step
      )
    );

    // ステップの更新を条件付きで行う
    if (stepId === 'address' && isCompleted && currentStep === 'step1') {
      setCurrentStep('step2');
      setCompletedSteps(['step1']);
    } else if (stepId === 'orgType' && isCompleted && currentStep === 'step2') {
      setCurrentStep('step3');
      setCompletedSteps(['step1', 'step2']);
    } else if (stepId === 'people' && isCompleted && currentStep === 'step3') {
      setCurrentStep('step4');
      setCompletedSteps(['step1', 'step2', 'step3']);
    }
  }, [currentStep]);

  const steps: StepData[] = [
    { id: 'step1', label: 'STEP①', sublabel: '住所入力' },
    { id: 'step2', label: 'STEP②', sublabel: '法人選択' },
    { id: 'step3', label: 'リスク診断\n対策提案' },
    { id: 'step4', label: 'STEP④', sublabel: 'AIと絞り込み' },
    { id: 'step5', label: '理想備蓄品\nと見積もり' },
    { id: 'step6', label: 'STEP④', sublabel: 'AIと絞り込み' },
    { id: 'step7', label: 'STEP⑤', sublabel: '商品選択' },
    { id: 'step8', label: 'カート追加' }
  ];

  const interactiveAISteps = [
    {
      id: 'input-conditions',
      label: '条件や拘りを入力',
      isActive: false,
      isCompleted: false
    },
    {
      id: 'manual-selection',
      label: '手動で取捨選択',
      isActive: false,
      isCompleted: false
    },
    {
      id: 'confirm-products',
      label: '具体的な商品を確定する',
      isActive: false,
      isCompleted: false
    }
  ];

  return {
    currentStep,
    setCurrentStep,
    completedSteps,
    setCompletedSteps,
    progressSteps,
    setProgressSteps,
    updateProgressStep,
    steps,
    interactiveAISteps
  };
};
