import { createOpenAI } from '@ai-sdk/openai';
import { experimental_streamObject, ExperimentalMessage } from 'ai';
import { createStreamableUI, createStreamableValue } from 'ai/rsc';
import { z } from 'zod';

import { Related } from '@/components/layout/search/block/related';
import { illustratorPrompt } from '@/lib/prompt';
import { SimpleModel } from '@/types/model';
import { TIllustrator } from '@/types/search';
import { ProviderSetting } from '@/types/settings';

export const illustratorSchema = z.object({
    items: z.array(z.object({ query: z.string() })).length(3),
});

export const illustrator = async (uiStream: ReturnType<typeof createStreamableUI>, messages: ExperimentalMessage[], model: SimpleModel, currentProviderSettings: ProviderSetting | null) => {
    'use server';

    const objectStream = createStreamableValue<TIllustrator>();

    uiStream.append(<Related relatedQueries={objectStream.value} />);

    const openai = createOpenAI({
        apiKey: currentProviderSettings?.OpenAI?.apiKey ?? process.env.OPENAI_API_KEY ?? '',
        // baseURL: currentProviderSettings?.OpenAI?.endpoint ?? process.env.OPENAI_API_ENDPOINT ?? 'https://api.openai.com/v1',
    });

    await experimental_streamObject({
        model: openai.chat(model.model_id ?? 'gpt-4-turbo'),
        system: illustratorPrompt,
        messages,
        schema: illustratorSchema,
    })
        .then(async (res) => {
            for await (const obj of res.partialObjectStream) {
                objectStream.update(obj);
            }
        })
        .finally(() => {
            objectStream.done();
        });
};
