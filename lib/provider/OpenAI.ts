import { createOpenAI } from '@ai-sdk/openai';

export const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY ?? '',
    // baseURL: process.env.OPENAI_API_ENDPOINT ?? '',
});
