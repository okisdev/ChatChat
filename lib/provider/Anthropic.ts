import { Anthropic } from '@ai-sdk/anthropic';

export const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY ?? '',
});
