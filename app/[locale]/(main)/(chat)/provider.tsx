import { AIChatProvider } from '@/contexts/ai/chat';

export default function ChatProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AIChatProvider>{children}</AIChatProvider>;
}
