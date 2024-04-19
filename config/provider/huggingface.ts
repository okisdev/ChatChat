import { Model } from '@/types/model';

export type HuggingFaceModelId =
    | 'OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5'
    | 'CohereForAl/c4ai-command-r-plus'
    | 'meta-llama/Meta-Llama-3-70B-Instruct'
    | 'HuggingFaceH4/zephyr-orpo-141b-A35b-v0.1'
    | 'mistralai/Mixtral-8x7B-Instruct-v0.1'
    | 'google/gemma-1.1-7b-it'
    | 'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO'
    | 'mistralai/Mistral-7B-Instruct-v0.2';
export type HuggingFaceModelName =
    | 'OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5'
    | 'CohereForAl/c4ai-command-r-plus'
    | 'meta-llama/Meta-Llama-3-70B-Instruct'
    | 'HuggingFaceH4/zephyr-orpo-141b-A35b-v0.1'
    | 'mistralai/Mixtral-8x7B-Instruct-v0.1'
    | 'google/gemma-1.1-7b-it'
    | 'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO'
    | 'mistralai/Mistral-7B-Instruct-v0.2';

export const model: Model[] = [
    {
        id: 'OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5',
        name: 'OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5',
        maxInputTokens: null,
        maxOutputTokens: null,
        maxTokens: null,
        price: null,
    },
    {
        id: 'CohereForAl/c4ai-command-r-plus',
        name: 'CohereForAl/c4ai-command-r-plus',
        maxInputTokens: null,
        maxOutputTokens: null,
        maxTokens: null,
        price: null,
    },
    {
        id: 'meta-llama/Meta-Llama-3-70B-Instruct',
        name: 'meta-llama/Meta-Llama-3-70B-Instruct',
        maxInputTokens: null,
        maxOutputTokens: null,
        maxTokens: null,
        price: null,
    },
    {
        id: 'HuggingFaceH4/zephyr-orpo-141b-A35b-v0.1',
        name: 'HuggingFaceH4/zephyr-orpo-141b-A35b-v0.1',
        maxInputTokens: null,
        maxOutputTokens: null,
        maxTokens: null,
        price: null,
    },
    {
        id: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        name: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        maxInputTokens: null,
        maxOutputTokens: null,
        maxTokens: null,
        price: null,
    },
    {
        id: 'google/gemma-1.1-7b-it',
        name: 'google/gemma-1.1-7b-it',
        maxInputTokens: null,
        maxOutputTokens: null,
        maxTokens: null,
        price: null,
    },
    {
        id: 'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO',
        name: 'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO',
        maxInputTokens: null,
        maxOutputTokens: null,
        maxTokens: null,
        price: null,
    },
    {
        id: 'mistralai/Mistral-7B-Instruct-v0.2',
        name: 'mistralai/Mistral-7B-Instruct-v0.2',
        maxInputTokens: null,
        maxOutputTokens: null,
        maxTokens: null,
        price: null,
    },
];
