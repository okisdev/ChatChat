import { Model } from '@/types/model';

export type PerplexityModelId = 'sonar-small-chat' | 'sonar-small-online' | 'sonar-medium-chat' | 'sonar-medium-online' | 'mistral-7b-instruct' | 'mixtral-8x7b-instruct';
export type PerplexityModelName = 'Sonar Small Chat' | 'Sonar Small Online' | 'Sonar Medium Chat' | 'Sonar Medium Online' | 'Mistral 7B Instruct' | 'Mixtral 8x7B Instruct';

export const model: Model[] = [
    {
        id: 'sonar-small-chat',
        name: 'Sonar Small Chat',
        maxInputTokens: null,
        maxOutputTokens: null,
        maxTokens: null,
        price: null,
    },
    {
        id: 'sonar-small-online',
        name: 'Sonar Small Online',
        maxInputTokens: null,
        maxOutputTokens: null,
        maxTokens: null,
        price: null,
    },
    {
        id: 'sonar-medium-chat',
        name: 'Sonar Medium Chat',
        maxInputTokens: null,
        maxOutputTokens: null,
        maxTokens: null,
        price: null,
    },
    {
        id: 'sonar-medium-online',
        name: 'Sonar Medium Online',
        maxInputTokens: null,
        maxOutputTokens: null,
        maxTokens: null,
        price: null,
    },
    {
        id: 'mistral-7b-instruct',
        name: 'Mistral 7B Instruct',
        maxInputTokens: null,
        maxOutputTokens: null,
        maxTokens: null,
        price: null,
    },
    {
        id: 'mixtral-8x7b-instruct',
        name: 'Mixtral 8x7B Instruct',
        maxInputTokens: null,
        maxOutputTokens: null,
        maxTokens: null,
        price: null,
    },
];
