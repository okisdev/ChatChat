'use client';

import { useChat } from '@ai-sdk/react';
import { Loader2, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSharedAIChatContext } from '@/contexts/ai/chat';
import { authClient } from '@/lib/auth.client';
import { cn } from '@/lib/utils';

export default function ChatPage() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');
  const router = useRouter();
  const { data: session } = authClient.useSession();

  // Use shared chat context
  const { chat } = useSharedAIChatContext();
  const { messages, sendMessage, status } = useChat({
    chat,
  });

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
      // Clear input immediately when sending
      setInput('');

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
      } catch (error) {
        console.error('Error sending message:', error);
        // Restore the message text if sending fails
        setInput(message.text || '');
      }
    }
  };

  return (
    <div className='flex h-full min-h-0 flex-1 flex-col'>
      {/* Chat Messages Area */}
      {messages.length === 0 ? (
        /* Welcome State */
        <div className='flex h-0 flex-1 items-center justify-center p-4'>
          <div className='mx-auto max-w-md text-center'>
            <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted'>
              <MessageCircle className='h-6 w-6 text-muted-foreground' />
            </div>
            <h2 className='mb-2 font-semibold text-foreground text-xl'>
              Welcome to ChatChat
            </h2>
            <p className='text-muted-foreground text-sm leading-relaxed'>
              {session?.user
                ? 'Start a conversation by typing a message below. Ask questions, explore ideas, or just have a friendly chat.'
                : 'Start chatting below! Sign in to save your conversations.'}
            </p>
            {!session?.user && (
              <Button className='mt-4' onClick={() => router.push('/login')}>
                Sign In to Save Conversations
              </Button>
            )}
          </div>
        </div>
      ) : (
        <ScrollArea className='h-0 flex-1 px-2' ref={scrollAreaRef}>
          {/* Messages List */}
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
        </ScrollArea>
      )}

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
            {!session?.user && (
              <>
                <p>⚠️ Chat not saved (sign in to save)</p>
                <span>•</span>
              </>
            )}
            <p>Verify the AI's answers</p>
            <span>•</span>
            <p>Press Enter to send, Shift + Enter for a new line</p>
          </div>
        </div>
      </div>
    </div>
  );
}
