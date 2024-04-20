import { OpenAI } from '@ai-sdk/openai';

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY ?? '',
    // baseURL: process.env.OPENAI_API_ENDPOINT ?? '',
});
