import { experimental_generateObject, ExperimentalMessage } from 'ai';
import { OpenAI } from 'ai/openai';
import { z } from 'zod';

import { challengerPrompt } from '@/lib/prompt';
import { SimpleModel } from '@/types/model';
import { ProviderSetting } from '@/types/settings';

export const challengerSchema = z.object({
    next: z.enum(['proceed', 'challenge']),
});

export const challenger = async (messages: ExperimentalMessage[], model: SimpleModel, currentProviderSettings: ProviderSetting | null) => {
    'use server';

    const openai = new OpenAI({
        apiKey: currentProviderSettings?.OpenAI?.apiKey ?? process.env.OPENAI_API_KEY ?? '',
        // baseUrl: currentProviderSettings?.OpenAI?.endpoint ?? process.env.OPENAI_API_ENDPOINT ?? 'https://api.openai.com/v1',
    });

    return await experimental_generateObject({
        model: openai.chat(model.model_id ?? 'gpt-3.5-turbo'),
        system: challengerPrompt,
        messages,
        schema: challengerSchema,
    });
};
