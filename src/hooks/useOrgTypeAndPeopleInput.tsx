import { useState, useCallback, useEffect } from 'react';
import { QuestionDetail } from "@/types/chat";
import { Dispatch, SetStateAction } from 'react';
import { useSupplies } from '@/contexts/SuppliesContext';

interface UseOrgTypeAndPeopleInputProps {
  setCurrentQuestionDetail: Dispatch<SetStateAction<QuestionDetail>>;
  setSelectedDetail: Dispatch<SetStateAction<'budget' | 'effectiveness' | 'categories' | 'quality' | 'quantity' | 'question'>>;
  updateProgressStep?: (stepId: string, isActive: boolean, isCompleted: boolean) => void;
  addUserMessage: (content: string) => void;
  addAIMessage: (content: string, options?: string[]) => void;
}

export const useOrgTypeAndPeopleInput = ({
  setCurrentQuestionDetail,
  setSelectedDetail,
  updateProgressStep,
  addUserMessage,
  addAIMessage
}: UseOrgTypeAndPeopleInputProps) => {
  // デバッグ用
  console.log("useOrgTypeAndPeopleInput hook initialized");

  const [selectedOrgType, setSelectedOrgType] = useState<string | null>(null);
  const [awaitingPeopleInput, setAwaitingPeopleInput] = useState(false);
  const [peopleCount, setPeopleCount] = useState<number | ''>('');
  const [peoplePercent, setPeoplePercent] = useState<number | ''>('');
  const [visitorCount, setVisitorCount] = useState<number | ''>('');
  const [studentCount, setStudentCount] = useState<number | ''>('');
  const [hasDiagnosisBeenHandled, setHasDiagnosisBeenHandled] = useState(false);

  // SuppliesContextから人数設定関数を取得
  const { setPeopleCount: setContextPeopleCount, setSelectedCorporateType } = useSupplies();

  // 値の変更をデバッグ用にログ出力する関数
  const setPeopleCountWithLogging = useCallback((value: number | '') => {
    console.log(`Setting peopleCount to: ${value}, type: ${typeof value}`);
    setPeopleCount(value);

    // SuppliesContext の peopleCount を更新
    // 空文字の場合は 0 として扱う
    if (value !== '') {
      setContextPeopleCount(value);
    } else {
      setContextPeopleCount(0);
    }
  }, [setContextPeopleCount]);

  // 組織タイプの選択を処理する関数
  const handleOrgTypeSelection = useCallback((option: string) => {
    console.log(`Selected org type: ${option}`);
    setSelectedOrgType(option);

    // 選択された組織タイプに応じて企業タイプIDを設定
    if (option === '民間企業 オフィス') {
      setSelectedCorporateType(1);
    } else if (option === '民間企業 店舗') {
      setSelectedCorporateType(2);
    } else if (option === '教育機関') {
      setSelectedCorporateType(3);
    } else if (option === '自治会・自主防災組織') {
      setSelectedCorporateType(4);
    }

    if (updateProgressStep) {
      updateProgressStep('orgType', false, true);
    }
  }, [setSelectedCorporateType, updateProgressStep]);

  // 人数入力の送信を処理する関数
  const handlePeopleInputSubmit = useCallback(() => {
    if (!selectedOrgType) return;

    console.log(`Submitting people input for org type: ${selectedOrgType}`);
    console.log(`peopleCount: ${peopleCount}, type: ${typeof peopleCount}`);
    console.log(`peoplePercent: ${peoplePercent}, type: ${typeof peoplePercent}`);
    console.log(`visitorCount: ${visitorCount}, type: ${typeof visitorCount}`);
    console.log(`studentCount: ${studentCount}, type: ${typeof studentCount}`);

    let userResponse = '';
    let explanation = '';
    let actualPeopleCount = 0;

    if (selectedOrgType === '民間企業 オフィス') {
      if (peopleCount === '' || peoplePercent === '') return;

      // 実際の人数を計算（出社率を考慮）
      actualPeopleCount = typeof peopleCount === 'number' ?
        Math.ceil(peopleCount * (typeof peoplePercent === 'number' ? peoplePercent / 100 : 1)) : 0;

      userResponse = `従業員数: ${peopleCount}人、出社率: ${peoplePercent}%`;
      explanation = `従業員数${peopleCount}人、出社率${peoplePercent}%の情報をもとに、必要な防災備蓄品を算出します。`;
    }
    else if (selectedOrgType === '民間企業 店舗') {
      if (peopleCount === '' || visitorCount === '') return;

      // 従業員と来客の合計人数
      actualPeopleCount = (typeof peopleCount === 'number' ? peopleCount : 0) +
                         (typeof visitorCount === 'number' ? visitorCount : 0);

      userResponse = `従業員数: ${peopleCount}人、店舗利用者数(平均): ${visitorCount}人`;
      explanation = `従業員数${peopleCount}人、店舗利用者数(平均)${visitorCount}人の情報をもとに、必要な防災備蓄品を算出します。`;
    }
    else if (selectedOrgType === '自治会・自主防災組織') {
      if (peopleCount === '') return;

      actualPeopleCount = typeof peopleCount === 'number' ? peopleCount : 0;

      userResponse = `自治会所属人数: ${peopleCount}人`;
      explanation = `自治会所属人数${peopleCount}人の情報をもとに、必要な防災備蓄品を算出します。`;
    }
    else if (selectedOrgType === '教育機関') {
      if (peopleCount === '' || studentCount === '') return;

      // 教職員と学生の合計人数
      actualPeopleCount = (typeof peopleCount === 'number' ? peopleCount : 0) +
                         (typeof studentCount === 'number' ? studentCount : 0);

      userResponse = `教職員数: ${peopleCount}人、学生/子供数: ${studentCount}人`;
      explanation = `教職員数${peopleCount}人、学生/子供数${studentCount}人の情報をもとに、必要な防災備蓄品を算出します。`;
    }

    console.log(`Calculated actual people count: ${actualPeopleCount}`);

    // グローバルな人数コンテキストを更新
    if (actualPeopleCount > 0) {
      console.log(`実際の人数を設定: ${actualPeopleCount}人`);
      setContextPeopleCount(actualPeopleCount);
    }

    addUserMessage(userResponse);
    addAIMessage(
      `${explanation}\n\n防災備蓄品のご提案をいたします。`,
      ['診断結果を見る']
    );

    setAwaitingPeopleInput(false);
    setHasDiagnosisBeenHandled(true);

    if (updateProgressStep) {
      updateProgressStep('people', false, true);
      setTimeout(() => {
        updateProgressStep('step4', true, false);
      }, 500);
    }

    setCurrentQuestionDetail({
      title: "診断結果",
      description: "入力いただいた情報をもとに、最適な防災備蓄品をご提案いたします。",
      importance: "災害時の人数に応じて必要な備蓄量が変わるため、正確な人数情報が重要です。",
      recommendations: [
        "提案された備蓄品リストは最低限必要なものです",
        "実際の災害状況によっては、さらに追加の備蓄が必要になる場合があります",
        "定期的に備蓄品の点検と更新を行うことをお勧めします"
      ]
    });
    setSelectedDetail('question');

    resetPeopleInputValues();
  }, [selectedOrgType, peopleCount, peoplePercent, visitorCount, studentCount, addUserMessage, addAIMessage, updateProgressStep]);

  // 入力値をリセットする関数
  const resetPeopleInputValues = useCallback(() => {
    setPeopleCount('');
    setPeoplePercent('');
    setVisitorCount('');
    setStudentCount('');
  }, []);

  // 人数入力画面を表示する関数
  const initiatePeopleInputQuestion = useCallback(() => {
    console.log("Initiating people input question");
    setAwaitingPeopleInput(true);

    let peopleInputMessage = '';

    if (selectedOrgType === '民間企業 オフィス') {
      peopleInputMessage = 'オフィスの従業員数と出社率を教えてください。';
      setCurrentQuestionDetail({
        title: "人数確認 - オフィス",
        description: "オフィスの従業員数と出社率を入力してください。これらの情報をもとに必要な防災備蓄品の種類と数量を算出します。",
        importance: "実際に出社している人数に合わせた備蓄品の準備が重要です。災害時の滞在者数を正確に把握することで、過不足のない備蓄計画が可能になります。",
        recommendations: [
          "平均的な出社率を入力してください",
          "災害発生時に同時に出社している最大人数を考慮するとより安全です",
          "来客者数も考慮することをお勧めします"
        ]
      });
    }
    else if (selectedOrgType === '民間企業 店舗') {
      peopleInputMessage = '店舗の従業員数と店舗利用者数の平均を教えてください。';
      setCurrentQuestionDetail({
        title: "人数確認 - 店舗",
        description: "店舗の従業員数と平均的な利用者数を入力してください。これらの情報をもとに必要な防災備蓄品の種類と数量を算出します。",
        importance: "店舗には従業員だけでなく、顧客も滞在しています。災害時には顧客の安全確保も店舗の責任となるため、利用者数も考慮した備蓄が重要です。",
        recommendations: [
          "平均的な店舗利用者数を入力してください",
          "繁忙期の最大利用者数を考慮するとより安全です",
          "滞在時間が長い店舗の場合、より多くの備蓄が必要になることがあります"
        ]
      });
    }
    else if (selectedOrgType === '自治会・自主防災組織') {
      peopleInputMessage = '自治会に所属する人の人数を教えてください。';
      setCurrentQuestionDetail({
        title: "人数確認 - 自治会・自主防災組織",
        description: "自治会に所属する人の総数を入力してください。この情報をもとに必要な防災備蓄品の種類と数量を算出します。",
        importance: "自治会や自主防災組織は地域全体の防災の要となります。所属する全員が災害時に適切なサポートを受けられるよう、十分な備蓄が必要です。",
        recommendations: [
          "世帯数ではなく、人数を入力してください",
          "高齢者や要配慮者の人数も考慮することをお勧めします",
          "地域の避難所収容人数も考慮に入れると良いでしょう"
        ]
      });
    }
    else if (selectedOrgType === '教育機関') {
      peopleInputMessage = '教職員数と学生/子供の人数を教えてください。';
      setCurrentQuestionDetail({
        title: "人数確認 - 教育機関",
        description: "教職員の人数と学生/子供の人数を入力してください。これらの情報をもとに必要な防災備蓄品の種類と数量を算出します。",
        importance: "教育機関は多くの子供や学生が長時間滞在する場所です。災害時に適切なケアができるよう、年齢層を考慮した備蓄計画が重要です。",
        recommendations: [
          "在校生の総数を入力してください",
          "年齢層に応じた備蓄品（特に食料品）の準備が重要です",
          "宿泊施設がある場合は、その収容人数も考慮してください"
        ]
      });
    }

    addAIMessage(peopleInputMessage);
    setSelectedDetail('question');
  }, [selectedOrgType, setCurrentQuestionDetail, addAIMessage, setSelectedDetail]);

  // 初期化時の処理
  useEffect(() => {
    console.log("useOrgTypeAndPeopleInput hook initialized");
  }, []);

  return {
    selectedOrgType,
    awaitingPeopleInput,
    setPeopleCount: setPeopleCountWithLogging,
    peoplePercent,
    setPeoplePercent,
    visitorCount,
    setVisitorCount,
    studentCount,
    setStudentCount,
    hasDiagnosisBeenHandled,
    setHasDiagnosisBeenHandled,
    handleOrgTypeSelection,
    handlePeopleInputSubmit,
    initiatePeopleInputQuestion,
    resetPeopleInputValues
  };
};
