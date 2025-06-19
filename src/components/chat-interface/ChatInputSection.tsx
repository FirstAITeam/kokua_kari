
import React from 'react';
import { ChatInput } from "../chat/ChatInput";
import { MessageProcessingIndicator } from "../chat/MessageProcessingIndicator";

interface ChatInputSectionProps {
  message: string;
  setMessage: (message: string) => void;
  handleSend: () => void;
  awaitingZipCodeInput: boolean;
  zipCodeError: string | null;
  disableInput: boolean;
  isAnalyzingRisk?: boolean;
  isProcessing?: boolean;
}

export const ChatInputSection: React.FC<ChatInputSectionProps> = ({
  message,
  setMessage,
  handleSend,
  awaitingZipCodeInput,
  zipCodeError,
  disableInput,
  isAnalyzingRisk = false,
  isProcessing = false
}) => {
  return (
    <>
      {zipCodeError && awaitingZipCodeInput && (
        <div className="px-4 pb-2">
          <p className="text-red-500 text-sm">{zipCodeError}</p>
        </div>
      )}
      <ChatInput 
        message={message}
        setMessage={setMessage}
        handleSend={handleSend}
        placeholder={awaitingZipCodeInput ? "住所を入力してください（例: 東京都北区西ケ原三丁目）" : "メッセージを入力"}
        disabled={disableInput || isAnalyzingRisk || isProcessing}
      />
    </>
  );
};
