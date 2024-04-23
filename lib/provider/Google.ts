import { createGoogleGenerativeAI } from '@ai-sdk/google';

export const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY ?? '',
    // baseURL: process.env.OPENAI_API_ENDPOINT ?? '',
});
