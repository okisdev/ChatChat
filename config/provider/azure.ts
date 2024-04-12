import { Model } from '@/types/model';

export type AzureOpenAIModelId =
    | 'gpt-4'
    | 'gpt-4-0613'
    | 'gpt-4-1106-preview'
    | 'gpt-4-0125-preview'
    | 'gpt-4-vision-preview'
    | 'gpt-4-32k-0613'
    | 'gpt-35-turbo-0301'
    | 'gpt-35-turbo-0613'
    | 'gpt-35-turbo-1106'
    | 'gpt-35-turbo-0125'
    | 'gpt-35-turbo-16k-0613';
export type AzureOpenAIModelName =
    | 'GPT-4'
    | 'GPT-4 0613'
    | 'GPT-4 1106 Preview'
    | 'GPT-4 0125 Preview'
    | 'GPT-4 Vision Preview'
    | 'GPT-4 32K 0613'
    | 'GPT-3.5 Turbo 0301'
    | 'GPT-3.5 Turbo 0613'
    | 'GPT-3.5 Turbo 1106'
    | 'GPT-3.5 Turbo 0125'
    | 'GPT-3.5 Turbo 16K 0613';

export const model: Model[] = [
    {
        id: 'gpt-4',
        name: 'GPT-4',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18.0,
    },
    {
        id: 'gpt-4-0613',
        name: 'GPT-4 0613',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18.0,
    },
    {
        id: 'gpt-4-1106-preview',
        name: 'GPT-4 1106 Preview',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18.0,
    },
    {
        id: 'gpt-4-0125-preview',
        name: 'GPT-4 0125 Preview',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18.0,
    },
    {
        id: 'gpt-4-vision-preview',
        name: 'GPT-4 Vision Preview',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18.0,
    },
    {
        id: 'gpt-4-32k-0613',
        name: 'GPT-4 32K 0613',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18.0,
    },
    {
        id: 'gpt-35-turbo-0301',
        name: 'GPT-3.5 Turbo 0301',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18.0,
    },
    {
        id: 'gpt-35-turbo-0613',
        name: 'GPT-3.5 Turbo 0613',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18.0,
    },
    {
        id: 'gpt-35-turbo-1106',
        name: 'GPT-3.5 Turbo 1106',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18,
    },
];
