import dynamic from 'next/dynamic';

const ChatMode = dynamic(() => import('@/app/[locale]/(landing)/mode/chat/page'), {});

export default function LandingPage() {
    return <ChatMode />;
}
