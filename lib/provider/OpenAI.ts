import { OpenAI } from 'ai/openai';

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY ?? '',
    // baseUrl: process.env.OPENAI_API_ENDPOINT ?? '',
});
