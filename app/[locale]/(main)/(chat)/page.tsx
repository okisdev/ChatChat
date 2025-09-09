'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Loader2, MessageCircle, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Response } from '@/components/ai-elements/response';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export default function ChatPage() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() && status !== 'streaming') {
      try {
        await sendMessage({
          parts: [{ type: 'text', text: input.trim() }],
        });
        setInput('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className='flex h-full flex-col'>
      {/* Chat Messages Area */}
      <ScrollArea className='flex-1 px-4 py-6' ref={scrollAreaRef}>
        {messages.length === 0 ? (
          /* Welcome State */
          <div className='flex h-full items-center justify-center'>
            <div className='text-center'>
              <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted'>
                <MessageCircle className='h-6 w-6 text-muted-foreground' />
              </div>
              <h2 className='mb-2 font-semibold text-foreground text-xl'>
                Welcome to ChatChat
              </h2>
              <p className='max-w-md text-muted-foreground text-sm leading-relaxed'>
                Start a conversation by typing a message below. Ask questions,
                explore ideas, or just have a friendly chat.
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
                          return <span key={i}>{part.text}</span>;
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
      <div className='border-t bg-background p-4'>
        <div className='mx-auto max-w-4xl'>
          <div className='flex items-end gap-2'>
            <div className='flex-1'>
              <Input
                className='min-h-[44px] resize-none border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:ring-1'
                disabled={status === 'streaming'}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder='Type your message here...'
                value={input}
              />
            </div>
            <Button
              className='h-[44px] w-[44px] shrink-0'
              disabled={!input.trim() || status === 'streaming'}
              onClick={handleSendMessage}
              size='icon'
            >
              {status === 'streaming' ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <Send className='h-4 w-4' />
              )}
              <span className='sr-only'>Send message</span>
            </Button>
          </div>
          <p className='mt-2 text-center text-muted-foreground text-xs'>
            Press Enter to send, Shift + Enter for a new line
          </p>
        </div>
      </div>
    </div>
  );
}
