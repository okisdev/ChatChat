import { GenerateContentRequest } from '@google/generative-ai';
import { Message } from 'ai';

export const toGoogleMessage = (messages: Message[]): GenerateContentRequest => ({
    contents: messages
        .filter((message) => message.role === 'user' || message.role === 'assistant')
        .map((message) => ({
            role: message.role === 'user' ? 'user' : 'model',
            parts: [{ text: message.content }],
        })),
});
