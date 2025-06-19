import { useState } from 'react';
import { ScenarioStep, DiagnosisResult } from '@/types/chat';

interface UseOptionHandlerProps {
  onShowDiagnosisResult?: () => void;
  addUserMessage: (content: string) => void;
  addAIMessage: (content: string, options?: string[]) => void;
  updateMessageWithOption: (messageIndex: number, option: string) => void;
  setAwaitingZipCodeInput: (value: boolean) => void;
  handleOrgTypeSelection: (option: string) => void;
  setShowDiagnosisDialog: (show: boolean) => void;
  moveToNextStep: () => void;
  currentStepOptions: any[];
  setSupplies: (supplies: any[]) => void;
  activateConversation: () => void;
}

export const useOptionHandler = ({
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
}: UseOptionHandlerProps) => {

  const handleOptionClick = async (option: string, messageIndex: number) => {
    console.log("Option clicked:", option, "at index:", messageIndex);
    if (option === "住所を入力する") {
      updateMessageWithOption(messageIndex, option);
      addUserMessage(option);
      addAIMessage("法人/団体の住所で入力してください。");
      setAwaitingZipCodeInput(true);
      return;
    }

    if (
      ["民間企業 オフィス", "民間企業 店舗", "自治会・自主防災組織", "教育機関"].includes(option)
    ) {
      handleOrgTypeSelection(option);
      updateMessageWithOption(messageIndex, option);
      setShowDiagnosisDialog(true);
      return;
    }

    updateMessageWithOption(messageIndex, option);

    if (option === "診断結果を見る") {
      if (onShowDiagnosisResult) {
        onShowDiagnosisResult();
      }
      addUserMessage(option);
      addAIMessage(
        "診断結果を表示しました。左側の備蓄品リストをご確認ください。何か質問があればお気軽にお聞きください。"
      );
      const initialSupplies = [
        {
          name: "アルファ米",
          description:
            "調理不要で長期保存可能。お湯や水を入れるだけで食べられるため、災害時に便利です。",
          quantity: "10人×3日分",
          category: "食料"
        },
        {
          name: "フリーズドライご飯",
          description:
            "軽量で保存期間が長く、栄養価も保持されています。調理が簡単なのが特徴です。",
          quantity: "10人×3日分",
          category: "食料"
        },
        {
          name: "缶詰",
          description:
            "長期保存が可能で、そのまま食べられるため災害時の貴重な栄養源になります。",
          quantity: "10人×3日分",
          category: "食料"
        },
        {
          name: "保存水",
          description:
            "飲用水として必須。調理や清潔保持にも使用できます。",
          quantity: "10人×3日分",
          category: "水"
        },
        {
          name: "給水バッグ",
          description: "断水時に給水所から水を運ぶために必要です。",
          quantity: "10人分",
          category: "水"
        },
        {
          name: "携帯浄水器",
          description:
            "水道水が使えない場合に、雨水や川の水を浄化できます。",
          quantity: "5台",
          category: "水"
        },
        {
          name: "大容量給水タンク",
          description:
            "多人数での使用や長期間の断水に備えて大量の水を確保できます。",
          quantity: "2台",
          category: "水"
        },
        {
          name: "非常用トイレ",
          description:
            "水が使えない状況でも衛生的にトイレを使用できます。",
          quantity: "10人×3日分",
          category: "衛生"
        },
      ];
      setSupplies(initialSupplies);
      activateConversation();
      return;
    }

    try {
      const selectedOption = currentStepOptions.find(
        (opt) => opt.option_text === option
      );

      if (!selectedOption) {
        console.error("Selected option not found:", option);
        return;
      }

      if (!selectedOption.next_step_id) {
        moveToNextStep();
        addUserMessage(option);
        addAIMessage(
          "診断が完了しました。あなたの組織に最適な備蓄品をご提案させていただきます。",
          ["診断結果を見る"]
        );
      } else {
        moveToNextStep();
        addUserMessage(option);
        addAIMessage(
          "次のステップに進みます。",
          currentStepOptions.map((opt: any) => opt.option_text)
        );
      }
    } catch (error) {
      console.error("Error handling option click:", error);
    }
  };

  return {
    handleOptionClick
  };
};
