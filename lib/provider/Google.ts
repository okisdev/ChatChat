import { Google } from '@ai-sdk/google';

export const google = new Google({
    apiKey: process.env.GOOGLE_API_KEY ?? '',
    // baseURL: process.env.OPENAI_API_ENDPOINT ?? '',
});
