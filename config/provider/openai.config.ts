interface openAIModelConfig {
    model: OpenAIModel;
    maxTokens: number;
    price: number;
}

export const openAIModelConfig: openAIModelConfig[] = [
    {
        model: 'gpt-4',
        maxTokens: 8192,
        price: 0.06 / 1000,
    },
    {
        model: 'gpt-4-32k',
        maxTokens: 32768,
        price: 0.12 / 1000,
    },
    {
        model: 'gpt-3.5-turbo',
        maxTokens: 4096,
        price: 0.002 / 1000,
    },
    {
        model: 'gpt-3.5-turbo-16k',
        maxTokens: 16384,
        price: 0.004 / 1000,
    },
];
