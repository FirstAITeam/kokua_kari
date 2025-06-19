
import { Message } from "@/types/chat";
import { ChatOptionsButtons } from "../chat-interface/ChatOptionsButtons";

interface ChatMessageProps {
  message: Message;
  index: number;
  onOptionClick: (option: string, messageIndex: number) => void;
}

export const ChatMessage = ({ message, index, onOptionClick }: ChatMessageProps) => {
  const hasOptions = message.options && message.options.length > 0;
  
  const handleOptionClick = (option: string) => {
    onOptionClick(option, index);
  };
  
  return (
    <div className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`w-12 h-12 rounded-full flex-shrink-0 overflow-hidden ${
        message.role === 'ai' ? 'bg-[#40414F]/10 border-2 border-[#40414F]' : 'bg-[#40414F]/10'
      } flex items-center justify-center`}>
        {message.role === 'ai' ? (
          <img src="/lovable-uploads/d7173975-bfa2-4b1d-9d20-430fc839f6a3.png" alt="AI" className="w-full h-full object-cover" />
        ) : (
          <div className="text-2xl">👤</div>
        )}
      </div>
      <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
        <div 
          className={`rounded-[20px] p-4 relative ${
            message.role === 'user' 
              ? 'bg-[#40414F] text-white' 
              : 'bg-white border-2 border-[#40414F]/20'
          }`}
        >
          <p className="leading-relaxed whitespace-pre-wrap text-base">
            {message.content}
          </p>
          {hasOptions && (
            <>
              {/* 選択肢がある場合のみ区切り線を表示 */}
              <div className="pt-4 border-t border-[#40414F]/20"></div>
              <ChatOptionsButtons
                options={message.options}
                selectedOption={message.selectedOption}
                onOptionClick={handleOptionClick}
                disabled={message.selectedOption !== undefined}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
