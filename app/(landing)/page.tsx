import dynamic from 'next/dynamic';

const ChatMode = dynamic(() => import('@/app/(landing)/mode/chat/page'), {});

export default function LandingPage() {
    return <ChatMode />;
}
