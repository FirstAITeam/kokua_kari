
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { DiagnosisRiskTable } from "./DiagnosisRiskTable";
import { DiagnosisDamageSection } from "./DiagnosisDamageSection";

interface DiagnosisResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
}

export const DiagnosisResultDialog = ({
  open,
  onOpenChange,
  onContinue,
}: DiagnosisResultDialogProps) => {
  // ダイアログの外側をクリックしても閉じないようにする処理
  const handleOpenChange = (newOpen: boolean) => {
    // バツ印を押した場合だけ閉じる（newOpenがfalseの場合）
    if (!newOpen) {
      onOpenChange(false);
    }
  };

  // 次へ進むボタンをクリックしたときの処理
  const handleContinue = () => {
    // ダイアログを閉じる
    onOpenChange(false);
    // 親コンポーネントのonContinueを呼び出して次のステップに進む
    onContinue();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="max-w-5xl p-0 h-[85vh] flex flex-col border-4 border-[#40414F] rounded-lg"
        onInteractOutside={(e) => {
          // 外側のクリックイベントをキャンセル
          e.preventDefault();
        }}
        hideCloseButton={true} // This hides the default close button from DialogContent
      >
        <DialogTitle className="sr-only">防災診断結果</DialogTitle>
        
        <div className="bg-gray-200 p-6">
          <h2 className="text-3xl font-bold">防災診断結果</h2>
        </div>
        
        <ScrollArea className="flex-grow p-8">
          {/* 災害リスク情報 */}
          <h2 className="text-2xl font-bold mb-6">あなたの法人における災害リスクは...</h2>
          <DiagnosisRiskTable />
          
          {/* 想定される被害と対策のポイント */}
          <h2 className="text-2xl font-bold mb-6 mt-10">想定される被害と対策のポイント</h2>
          <DiagnosisDamageSection />
          
          {/* 次のステップへのCTA */}
          <div className="flex justify-center mt-12 mb-8">
            <Button 
              onClick={handleContinue}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-md font-medium"
            >
              閉じる
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
