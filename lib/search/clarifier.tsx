import { createOpenAI } from '@ai-sdk/openai';
import { experimental_streamObject, ExperimentalMessage } from 'ai';
import { createStreamableUI, createStreamableValue } from 'ai/rsc';
import { z } from 'zod';

import { Clarifier } from '@/components/layout/search/block/clarifier';
import { clarifierPrompt } from '@/lib/prompt';
import { SimpleModel } from '@/types/model';
import { TClarifier } from '@/types/search';
import { ProviderSetting } from '@/types/settings';

export const clarifierSchema = z.object({
    question: z.string().describe('The clarify question'),
    options: z.array(z.object({ value: z.string(), content: z.string() })).describe('The clarify options'),
    allowsInput: z.boolean().describe('Whether the clarify allows for input'),
    clarifyLabel: z.string().optional().describe('The clarify label for input'),
    clarifyPlaceholder: z.string().optional().describe('The clarify placeholder for input'),
});

export const clarifier = async (uiStream: ReturnType<typeof createStreamableUI>, messages: ExperimentalMessage[], model: SimpleModel, currentProviderSettings: ProviderSetting | null) => {
    'use server';

    const objectStream = createStreamableValue<TClarifier>();

    uiStream.update(<Clarifier clarify={objectStream.value} />);

    let clarifierResponse: TClarifier = {};

    const openai = createOpenAI({
        apiKey: currentProviderSettings?.OpenAI?.apiKey ?? process.env.OPENAI_API_KEY ?? '',
        // baseURL: currentProviderSettings?.OpenAI?.endpoint ?? process.env.OPENAI_API_ENDPOINT ?? 'https://api.openai.com/v1',
    });

    await experimental_streamObject({
        model: openai.chat(model.model_id ?? 'gpt-4-turbo'),
        system: clarifierPrompt,
        messages,
        schema: clarifierSchema,
    })
        .then(async (res) => {
            for await (const obj of res.partialObjectStream) {
                if (obj) {
                    objectStream.update(obj);
                    clarifierResponse = obj;
                }
            }
        })
        .finally(() => {
            objectStream.done();
        });

    return clarifierResponse;
};
