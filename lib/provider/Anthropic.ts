import { createAnthropic } from '@ai-sdk/anthropic';

export const anthropic = createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY ?? '',
});
