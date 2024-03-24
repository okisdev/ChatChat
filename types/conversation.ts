import { Message } from 'ai';

export interface Conversation {
    id: string;
    createdAt: string;
    conversation: Message[];
}
