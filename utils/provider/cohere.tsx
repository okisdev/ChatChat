import { Cohere } from 'cohere-ai';

export const toCohereRole = (role: string): Cohere.ChatMessageRole => {
    if (role === 'user') {
        return Cohere.ChatMessageRole.User;
    }
    return Cohere.ChatMessageRole.Chatbot;
};
