
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { KeyboardEvent } from "react";

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  handleSend: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export const ChatInput = ({ 
  message, 
  setMessage, 
  handleSend, 
  placeholder = "メッセージを入力", 
  disabled = false 
}: ChatInputProps) => {
  
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim()) {
        handleSend();
      }
    }
  };

  return (
    <div className="p-4 border-t border-[#40414F]/20">
      <div className="flex gap-2 relative bg-[#40414F] rounded-xl shadow-[5px_5px_#34343f]">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none text-base py-6 pr-16 text-white placeholder:text-gray-400 font-bold focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          onKeyDown={handleKeyPress}
          disabled={disabled}
        />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[30px] w-[1px] bg-[#40414F]/20 mr-12" />
        <Button 
          onClick={handleSend} 
          size="icon" 
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent hover:bg-[#40414F]/20 rounded-xl w-10 h-10 transition-colors duration-300"
          disabled={disabled || !message.trim()}
        >
          <Send className="h-5 w-5 text-white/70" />
        </Button>
      </div>
    </div>
  );
};
