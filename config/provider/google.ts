import { Model } from '@/types/model';

export type GoogleModelId = 'gemini-pro';
export type GoogleModelName = 'Gemini Pro';

export const model: Model[] = [
    {
        id: 'gemini-pro',
        name: 'Gemini Pro',
        maxInputTokens: 30720,
        maxOutputTokens: 2048,
        maxTokens: 1000,
        price: 0.06,
    },
];
