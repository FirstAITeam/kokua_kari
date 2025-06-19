import { useState, useCallback } from 'react';
import { ScenarioStep } from '@/types/chat';

export const useScenarioSteps = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [steps, setSteps] = useState<ScenarioStep[]>([
    {
      step_id: 1,
      question_text: '住所を入力してください',
      options: [
        {
          option_id: 1,
          option_text: '次へ',
          next_step_id: 2
        }
      ]
    },
    {
      step_id: 2,
      question_text: '入力された住所でよろしいですか？',
      options: [
        {
          option_id: 1,
          option_text: 'はい',
          next_step_id: 3
        },
        {
          option_id: 2,
          option_text: 'いいえ',
          next_step_id: 1
        }
      ]
    },
    {
      step_id: 3,
      question_text: '法人形態を選択してください',
      options: [
        {
          option_id: 1,
          option_text: '株式会社',
          next_step_id: 4
        },
        {
          option_id: 2,
          option_text: '合同会社',
          next_step_id: 4
        }
      ]
    },
    {
      step_id: 4,
      question_text: '人数規模を入力してください',
      options: [
        {
          option_id: 1,
          option_text: '次へ',
          next_step_id: 5
        }
      ]
    }
  ]);

  const updateStepStatus = useCallback((stepId: number, isCompleted: boolean) => {
    setSteps(prevSteps =>
      prevSteps.map(step =>
        step.step_id === stepId
          ? { ...step, isCompleted }
          : step
      )
    );
  }, []);

  const moveToNextStep = useCallback(() => {
    setCurrentStep(prev => prev + 1);
  }, []);

  const moveToPreviousStep = useCallback(() => {
    setCurrentStep(prev => prev - 1);
  }, []);

  const getCurrentStepOptions = useCallback(() => {
    const currentStepData = steps.find(step => step.step_id === currentStep + 1);
    return currentStepData?.options || [];
  }, [currentStep, steps]);

  const getCurrentStepText = useCallback(() => {
    const currentStepData = steps.find(step => step.step_id === currentStep + 1);
    return currentStepData?.question_text || '';
  }, [currentStep, steps]);

  return {
    currentStep,
    setCurrentStep,
    steps,
    updateStepStatus,
    moveToNextStep,
    moveToPreviousStep,
    currentStepOptions: getCurrentStepOptions(),
    currentStepText: getCurrentStepText(),
    isLoading: false
  };
};
