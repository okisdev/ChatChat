import { Model } from '@/types/model';

export type MistralModelId = 'open-mistral-7b' | 'open-mixtral-8x7b' | 'mistral-small-latest' | 'mistral-medium-latest' | 'mistral-large-latest';
export type MistralModelName = 'open-mistral-7b' | 'open-mixtral-8x7b' | 'mistral-small-latest' | 'mistral-medium-latest' | 'mistral-large-latest';

export const model: Model[] = [
    {
        id: 'open-mistral-7b',
        name: 'open-mistral-7b',
        maxInputTokens: null,
        maxOutputTokens: null,
        maxTokens: null,
        price: null,
    },
    {
        id: 'open-mixtral-8x7b',
        name: 'open-mixtral-8x7b',
        maxInputTokens: null,
        maxOutputTokens: null,
        maxTokens: null,
        price: null,
    },
    {
        id: 'mistral-small-latest',
        name: 'mistral-small-latest',
        maxInputTokens: null,
        maxOutputTokens: null,
        maxTokens: null,
        price: null,
    },
    {
        id: 'mistral-medium-latest',
        name: 'mistral-medium-latest',
        maxInputTokens: null,
        maxOutputTokens: null,
        maxTokens: null,
        price: null,
    },
    {
        id: 'mistral-large-latest',
        name: 'mistral-large-latest',
        maxInputTokens: null,
        maxOutputTokens: null,
        maxTokens: null,
        price: null,
    },
];
