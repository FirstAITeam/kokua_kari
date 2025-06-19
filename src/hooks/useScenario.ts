
import { useQuery } from "@tanstack/react-query";
import { ScenarioStep } from "@/types/chat";

// モック実装: シナリオステップデータ
const MOCK_SCENARIO_DATA = {
  currentStep: {
    step_id: 1001,
    question_text: "あなたの事業所は何区分ですか？",
    options: [
      { option_id: 1, option_text: "民間企業オフィス", next_step_id: 1002 },
      { option_id: 2, option_text: "民間企業店舗", next_step_id: 1003 },
      { option_id: 3, option_text: "教育機関", next_step_id: 1004 },
      { option_id: 4, option_text: "自治会・自主防災組織", next_step_id: 1005 }
    ]
  }
};

// モック実装: 次のステップデータ
const MOCK_NEXT_STEPS = {
  1002: {
    step_id: 1002,
    question_text: "事業所の所在地を教えてください",
    options: [
      { option_id: 5, option_text: "住所を入力する", next_step_id: 1006 }
    ]
  },
  1003: {
    step_id: 1003,
    question_text: "店舗の所在地を教えてください",
    options: [
      { option_id: 6, option_text: "住所を入力する", next_step_id: 1006 }
    ]
  },
  1004: {
    step_id: 1004,
    question_text: "教育機関の所在地を教えてください",
    options: [
      { option_id: 7, option_text: "住所を入力する", next_step_id: 1006 }
    ]
  },
  1005: {
    step_id: 1005,
    question_text: "地域の所在地を教えてください",
    options: [
      { option_id: 8, option_text: "住所を入力する", next_step_id: 1006 }
    ]
  },
  1006: {
    step_id: 1006,
    question_text: "人数規模を教えてください",
    options: [
      { option_id: 9, option_text: "5人以下", next_step_id: null },
      { option_id: 10, option_text: "6〜10人", next_step_id: null },
      { option_id: 11, option_text: "11〜20人", next_step_id: null },
      { option_id: 12, option_text: "21〜50人", next_step_id: null },
      { option_id: 13, option_text: "51人以上", next_step_id: null }
    ]
  }
};

// モック実装: 診断結果
const MOCK_DIAGNOSIS_RESULTS = {
  1006: {
    output_text: "あなたの事業所は災害リスクがあります。適切な防災対策を行いましょう。",
    recommended_products: JSON.stringify({
      products: [
        { id: 1, name: "防災セット", price: 15000 },
        { id: 2, name: "非常食", price: 5000 },
        { id: 3, name: "防災ラジオ", price: 3000 }
      ]
    })
  }
};

export const useScenario = () => {
  const { data: scenarioData, isLoading } = useQuery({
    queryKey: ['scenario-steps'],
    queryFn: async () => {
      console.log('Fetching first step...');
      // モックデータを返す
      return MOCK_SCENARIO_DATA;
    },
  });

  const fetchNextStep = async (nextStepId: number) => {
    console.log('Fetching next step...', nextStepId);
    
    // モックデータから次のステップを取得
    const nextStep = MOCK_NEXT_STEPS[nextStepId as keyof typeof MOCK_NEXT_STEPS];
    
    if (!nextStep) {
      throw new Error(`Step ID ${nextStepId} not found`);
    }
    
    return nextStep as ScenarioStep;
  };

  const fetchDiagnosisResult = async (stepId: number) => {
    console.log('Fetching diagnosis result...', stepId);
    
    // モックデータから診断結果を取得
    const result = MOCK_DIAGNOSIS_RESULTS[stepId as keyof typeof MOCK_DIAGNOSIS_RESULTS];
    
    if (!result) {
      return {
        output_text: "診断結果が見つかりませんでした。",
        recommended_products: JSON.stringify({ products: [] })
      };
    }
    
    return result;
  };

  return {
    scenarioData,
    isLoading,
    fetchNextStep,
    fetchDiagnosisResult,
  };
};
