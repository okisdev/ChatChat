'use client';

import { Chat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { createContext, type ReactNode, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface AIChatContextValue {
  chat: Chat<UIMessage>;
  clearChat: () => void;
  createChatForConversation: (
    conversationId: string,
    projectId?: string
  ) => Chat<UIMessage>;
}

const AIChatContext = createContext<AIChatContextValue | undefined>(undefined);

function createChat(conversationId?: string, projectId?: string) {
  return new Chat<UIMessage>({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: {
        ...(conversationId && { conversationId }),
        ...(projectId && { projectId }),
      },
    }),
    generateId: uuidv4,
  });
}

export function AIChatProvider({ children }: { children: ReactNode }) {
  const [chat, setChat] = useState(() => createChat());

  const clearChat = () => {
    setChat(createChat());
  };

  const createChatForConversation = (
    conversationId: string,
    projectId?: string
  ) => {
    return createChat(conversationId, projectId);
  };

  return (
    <AIChatContext.Provider
      value={{
        chat,
        clearChat,
        createChatForConversation,
      }}
    >
      {children}
    </AIChatContext.Provider>
  );
}

export function useSharedAIChatContext() {
  const context = useContext(AIChatContext);
  if (!context) {
    throw new Error(
      'useSharedChatContext must be used within a AIChatProvider'
    );
  }
  return context;
}
