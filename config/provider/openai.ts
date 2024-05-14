import { Model } from '@/types/model';

export type OpenAIModelId =
    | 'gpt-4o'
    | 'gpt-4o-2024-05-13'
    | 'gpt-4'
    | 'gpt-4-0613'
    | 'gpt-4-1106-preview'
    | 'gpt-4-0125-preview'
    | 'gpt-4-vision-preview'
    | 'gpt-4-32k-0613'
    | 'gpt-4-turbo'
    | 'gpt-4-turbo-2024-04-09'
    | 'gpt-4-turbo-preview'
    | 'gpt-3.5-turbo'
    | 'gpt-3.5-turbo-1106'
    | 'gpt-3.5-turbo-0125';
export type OpenAIModelName =
    | 'GPT-4o'
    | 'GPT-4o 2024-05-13'
    | 'GPT-4'
    | 'GPT-4 0613'
    | 'GPT-4 1106 Preview'
    | 'GPT-4 0125 Preview'
    | 'GPT-4 Vision Preview'
    | 'GPT-4 32K 0613'
    | 'GPT-4 Turbo'
    | 'GPT-4 Turbo 2024-04-09'
    | 'GPT-4 Turbo Preview'
    | 'GPT-3.5 Turbo'
    | 'GPT-3.5 Turbo 1106'
    | 'GPT-3.5 Turbo 0125';

export const model: Model[] = [
    {
        id: 'gpt-4o',
        name: 'GPT-4o',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 128000,
        price: 18.0,
    },
    {
        id: 'gpt-4o-2024-05-13',
        name: 'GPT-4o 2024-05-13',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 128000,
        price: 18.0,
    },
    {
        id: 'gpt-4',
        name: 'GPT-4',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 8192,
        price: 18.0,
    },
    {
        id: 'gpt-4-0613',
        name: 'GPT-4 0613',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 8192,
        price: 18.0,
    },
    {
        id: 'gpt-4-1106-preview',
        name: 'GPT-4 1106 Preview',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 128000,
        price: 18.0,
    },
    {
        id: 'gpt-4-0125-preview',
        name: 'GPT-4 0125 Preview',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 128000,
        price: 18.0,
    },
    {
        id: 'gpt-4-vision-preview',
        name: 'GPT-4 Vision Preview',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 128000,
        price: 18.0,
        vision: true,
    },
    {
        id: 'gpt-4-32k-0613',
        name: 'GPT-4 32K 0613',
        maxInputTokens: null,
        maxOutputTokens: 32768,
        maxTokens: 32768,
        price: 18.0,
    },
    {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 128000,
        price: 18.0,
    },
    {
        id: 'gpt-4-turbo-2024-04-09',
        name: 'GPT-4 Turbo 2024-04-09',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 4096,
        price: 18.0,
    },
    {
        id: 'gpt-4-turbo-preview',
        name: 'GPT-4 Turbo Preview',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 128000,
        price: 18.0,
    },
    {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 4096,
        price: 18.0,
    },
    {
        id: 'gpt-3.5-turbo-1106',
        name: 'GPT-3.5 Turbo 1106',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 4096,
        price: 18.0,
    },
    {
        id: 'gpt-3.5-turbo-0125',
        name: 'GPT-3.5 Turbo 0125',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 4096,
        price: 18.0,
    },
];
