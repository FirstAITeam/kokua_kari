
import React, { useRef, useEffect } from 'react';
import { Message } from "@/types/chat";
import { ChatMessage } from "../chat/ChatMessage";

interface MessageContainerProps {
  messages: Message[];
  onOptionClick: (option: string, messageIndex: number) => void;
}

export const MessageContainer: React.FC<MessageContainerProps> = ({
  messages,
  onOptionClick
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 p-4 overflow-y-auto space-y-4">
      {messages.map((msg, index) => (
        <ChatMessage 
          key={index}
          message={msg}
          index={index}
          onOptionClick={onOptionClick}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
