'use client';

import { MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<
    Array<{ id: string; text: string; isUser: boolean }>
  >([]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: message.trim(),
        isUser: true,
      };
      setMessages((prev) => [...prev, newMessage]);
      setMessage('');
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
      <ScrollArea className='flex-1 px-4 py-6'>
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
            {messages.map((msg) => (
              <div
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                key={msg.id}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    msg.isUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className='text-sm leading-relaxed'>{msg.text}</p>
                </div>
              </div>
            ))}
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
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder='Type your message here...'
                value={message}
              />
            </div>
            <Button
              className='h-[44px] w-[44px] shrink-0'
              disabled={!message.trim()}
              onClick={handleSendMessage}
              size='icon'
            >
              <Send className='h-4 w-4' />
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
