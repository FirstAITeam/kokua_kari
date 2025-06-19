
import React from 'react';

interface MessageProcessingIndicatorProps {
  isAnalyzingRisk?: boolean;
  isProcessingAI?: boolean;
}

export const MessageProcessingIndicator: React.FC<MessageProcessingIndicatorProps> = ({
  isAnalyzingRisk = false,
  isProcessingAI = false
}) => {
  // どちらのインジケータも表示する必要がない場合は何も表示しない
  if (!isAnalyzingRisk && !isProcessingAI) {
    return null;
  }

  return (
    <div className="px-4 pb-2">
      {isAnalyzingRisk && (
        <p className="text-blue-500 text-sm">災害リスク情報を分析中です...</p>
      )}
      {isProcessingAI && (
        <p className="text-blue-500 text-sm">備蓄品リストを処理中です...</p>
      )}
    </div>
  );
};
