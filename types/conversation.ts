import { Message } from 'ai';

export interface Conversation {
    id: string;
    conversation: Message[];
    createdAt: string;
    updatedAt?: string;
}
