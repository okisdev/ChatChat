import { Model } from '@/types/model';

export type GroqModelId = 'llama2-70b-4096' | 'mixtral-8x7b-32768' | 'gemma-7b-it';
export type GroqModelName = 'LLaMA2 70b Chat' | 'Mixtral 8x7b Instruct v0.1' | 'Gemma 7b it';

export const model: Model[] = [
    {
        id: 'llama2-70b-4096',
        name: 'LLaMA2 70b Chat',
        maxInputTokens: null,
        maxOutputTokens: null,
        maxTokens: 4096,
        price: 0.06,
    },
    {
        id: 'mixtral-8x7b-32768',
        name: 'Mixtral 8x7b Instruct v0.1',
        maxInputTokens: null,
        maxOutputTokens: null,
        maxTokens: 32768,
        price: 0.06,
    },
    {
        id: 'gemma-7b-it',
        name: 'Gemma 7b it',
        maxInputTokens: null,
        maxOutputTokens: null,
        maxTokens: 8192,
        price: 0.06,
    },
];
