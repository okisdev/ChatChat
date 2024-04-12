import { Model } from '@/types/model';

export type CohereModelId = 'command-light' | 'command-light-nightly' | 'command' | 'command-nightly' | 'command-r' | 'command-r-plus';
export type CohereModelName = 'Command Light' | 'Command Light Nightly' | 'Command' | 'Command Nightly' | 'Command R' | 'Command R +';

export const model: Model[] = [
    {
        id: 'command-light',
        name: 'Command Light',
        maxInputTokens: 4096,
        maxOutputTokens: 4096,
        maxTokens: 4096,
        price: 18.0,
    },
    {
        id: 'command-light-nightly',
        name: 'Command Light Nightly',
        maxInputTokens: 8192,
        maxOutputTokens: 8192,
        maxTokens: 8192,
        price: 1.5,
    },
    {
        id: 'command',
        name: 'Command',
        maxInputTokens: 4096,
        maxOutputTokens: 4096,
        maxTokens: 4096,
        price: 90.0,
    },
    {
        id: 'command-nightly',
        name: 'Command Nightly',
        maxInputTokens: 8192,
        maxOutputTokens: 8192,
        maxTokens: 8192,
        price: 90.0,
    },
    {
        id: 'command-r',
        name: 'Command R',
        maxInputTokens: 128000,
        maxOutputTokens: 4096,
        maxTokens: 128000,
        price: 90.0,
    },
    {
        id: 'command-r-plus',
        name: 'Command R +',
        maxInputTokens: 128000,
        maxOutputTokens: 4096,
        maxTokens: 128000,
        price: 90.0,
    },
];
