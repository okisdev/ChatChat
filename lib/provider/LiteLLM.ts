import OpenAI from 'openai';

export const litellm = new OpenAI({
    apiKey: process.env.LITELLM_API_KEY ?? '',
    baseURL: process.env.LITELLM_BASE_URL ?? 'http://localhost:4000/v1',
});
