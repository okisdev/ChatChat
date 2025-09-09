'use client';

import { useChat } from '@ai-sdk/react';
import type { UIMessage } from 'ai';
import { AlertCircle, Loader2, MessageCircle } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  PromptInput,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from '@/components/ai-elements/prompt-input';
import { Response } from '@/components/ai-elements/response';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSharedAIChatContext } from '@/contexts/ai/chat';
import { authClient } from '@/lib/auth.client';
import { cn } from '@/lib/utils';

interface MessageData {
  id: string;
  role: string;
  parts: unknown;
  createdAt: Date;
}

interface ConversationData {
  conversation: {
    id: string;
    title: string | null;
    projectId: string;
    createdById: string;
    visibility: string;
    createdAt: Date;
    updatedAt: Date;
  };
  messages: MessageData[];
}

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const conversationId = params.id as string;
  const projectId = searchParams.get('projectId');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');
  const [conversationData, setConversationData] =
    useState<ConversationData | null>(null);
  const [isLoadingConversation, setIsLoadingConversation] = useState(true);
  const [conversationError, setConversationError] = useState<string | null>(
    null
  );

  const { data: session } = authClient.useSession();

  // Use shared chat context with conversation ID and project ID
  const { createChatForConversation } = useSharedAIChatContext();
  const [conversationChat] = useState(() =>
    createChatForConversation(conversationId, projectId || undefined)
  );

  const { messages, sendMessage, status, setMessages } = useChat({
    chat: conversationChat,
  });

  // Load conversation data
  useEffect(() => {
    async function handleConversationResponse(response: Response) {
      if (response.status === 404) {
        setConversationError('Conversation not found');
        return null;
      }

      if (!response.ok) {
        throw new Error('Failed to load conversation');
      }

      return response.json();
    }

    async function loadConversation() {
      if (!(conversationId && session?.user)) {
        setIsLoadingConversation(false);
        return;
      }

      try {
        setIsLoadingConversation(true);
        setConversationError(null);

        const response = await fetch(
          `/api/chat?conversationId=${conversationId}`
        );

        const data = await handleConversationResponse(response);

        if (data) {
          setConversationData(data);

          // Set existing messages in the chat
          if (data.messages?.length > 0) {
            const formattedMessages = data.messages.map((msg: MessageData) => ({
              id: msg.id,
              role: msg.role as 'user' | 'assistant',
              parts: msg.parts,
              createdAt: new Date(msg.createdAt),
            }));

            setMessages(formattedMessages as UIMessage[]);
          }
        }
      } catch (error) {
        console.error('Error loading conversation:', error);
        setConversationError('Failed to load conversation');
      } finally {
        setIsLoadingConversation(false);
      }
    }

    loadConversation();
  }, [conversationId, session?.user, setMessages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector(
          '[data-radix-scroll-area-viewport]'
        );
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      }
    }, 0);

    return () => clearTimeout(timer);
  });

  const handleSubmit = async (message: PromptInputMessage) => {
    const hasText = Boolean(message.text?.trim());
    const hasFiles = Boolean(message.files?.length);

    if ((hasText || hasFiles) && status !== 'streaming') {
      try {
        await sendMessage({
          parts: [
            {
              type: 'text',
              text: message.text?.trim() || 'Sent with attachments',
            },
            ...(message.files || []),
          ],
        });
        setInput('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  // Show loading state while checking auth and loading conversation
  if (!session?.user || isLoadingConversation) {
    return (
      <div className='flex h-full items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='mx-auto h-8 w-8 animate-spin text-muted-foreground' />
          <p className='mt-2 text-muted-foreground text-sm'>
            {session?.user
              ? 'Loading conversation...'
              : 'Checking authentication...'}
          </p>
        </div>
      </div>
    );
  }

  // Handle conversation not found or error
  if (conversationError) {
    return (
      <div className='flex h-full items-center justify-center p-4'>
        <Alert className='max-w-md'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            {conversationError}. Would you like to{' '}
            <button
              className='underline underline-offset-4 hover:text-primary'
              onClick={() => router.push('/')}
              type='button'
            >
              start a new conversation
            </button>
            ?
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className='flex h-full min-h-0 flex-1 flex-col'>
      {/* Chat Header */}
      {conversationData && (
        <div className='border-b bg-background/95 px-4 py-3'>
          <h1 className='font-medium text-foreground'>
            {conversationData.conversation.title || 'Untitled Conversation'}
          </h1>
        </div>
      )}

      {/* Chat Messages Area */}
      <ScrollArea className='h-0 flex-1 px-2' ref={scrollAreaRef}>
        {messages.length === 0 ? (
          /* Welcome State or Empty Conversation */
          <div className='flex h-full items-center justify-center'>
            <div className='text-center'>
              <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted'>
                <MessageCircle className='h-6 w-6 text-muted-foreground' />
              </div>
              <h2 className='mb-2 font-semibold text-foreground text-xl'>
                {conversationData?.conversation.title ||
                  'Continue this conversation'}
              </h2>
              <p className='max-w-md text-muted-foreground text-sm leading-relaxed'>
                {conversationData
                  ? 'This conversation is empty. Start by sending a message below.'
                  : 'Start a conversation by typing a message below. Ask questions, explore ideas, or just have a friendly chat.'}
              </p>
            </div>
          </div>
        ) : (
          /* Messages List */
          <div className='space-y-4'>
            {messages.map((message) => (
              <div
                className={cn(
                  'flex',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
                key={message.id}
              >
                <div
                  className={cn(
                    'max-w-[70%] rounded-lg px-4 py-2',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  )}
                >
                  {message.role === 'user' ? (
                    <p className='text-sm leading-relaxed'>
                      {message.parts.map((part, i) => {
                        if (part.type === 'text') {
                          return (
                            <span key={`${message.id}-part-${i}`}>
                              {part.text}
                            </span>
                          );
                        }
                        return null;
                      })}
                    </p>
                  ) : (
                    <div className='text-sm leading-relaxed'>
                      <Response>
                        {message.parts
                          .filter((part) => part.type === 'text')
                          .map((part) => part.text)
                          .join('')}
                      </Response>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {status === 'streaming' && (
              <div className='flex justify-start'>
                <div className='max-w-[70%] rounded-lg bg-muted px-4 py-2 text-foreground'>
                  <div className='flex items-center gap-2 text-sm'>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    <span>AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input Area */}
      <div className='shrink-0 bg-background px-4 py-2'>
        <div className='mx-auto max-w-4xl'>
          <PromptInput globalDrop multiple onSubmit={handleSubmit}>
            <PromptInputBody>
              <PromptInputAttachments>
                {(attachment) => <PromptInputAttachment data={attachment} />}
              </PromptInputAttachments>
              <PromptInputTextarea
                disabled={status === 'streaming'}
                onChange={(e) => setInput(e.target.value)}
                placeholder='Type your message here...'
                value={input}
              />
            </PromptInputBody>
            <PromptInputToolbar>
              <div />
              <PromptInputSubmit disabled={!input.trim()} status={status} />
            </PromptInputToolbar>
          </PromptInput>
          <div className='mt-2 flex w-full items-center justify-center gap-2 text-center text-muted-foreground text-xs'>
            <p>Verify the AI's answers</p>
            <span>•</span>
            <p>Press Enter to send, Shift + Enter for a new line</p>
          </div>
        </div>
      </div>
    </div>
  );
}
