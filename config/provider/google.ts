import { Model } from '@/types/model';

export type GoogleModelId = 'gemini-1.5-pro-latest' | 'gemini-pro';
export type GoogleModelName = 'Gemini 1.5 Pro' | 'Gemini Pro';

export const model: Model[] = [
    {
        id: 'gemini-pro',
        name: 'Gemini Pro',
        maxInputTokens: 30720,
        maxOutputTokens: 2048,
        maxTokens: 1000,
        price: 0.06,
    },
    {
        id: 'gemini-1.5-pro-latest',
        name: 'Gemini 1.5 Pro',
        maxInputTokens: 1048576,
        maxOutputTokens: 8192,
        maxTokens: 1000,
        price: 0.06,
    },
];
