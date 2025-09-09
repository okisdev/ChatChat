import ChatProvider from '@/app/[locale]/(main)/(chat)/provider';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChatProvider>{children}</ChatProvider>;
}
