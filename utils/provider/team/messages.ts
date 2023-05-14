import { createParser, ParsedEvent, ReconnectInterval } from 'eventsource-parser';

export async function sendTeamStreamMessages(teamPayload: any, accessCode: string) {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    let counter = 0;

    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/team/info?accessCode=${accessCode}`).then((res) => res.json());

    const { defaultServiceProvider, openAIKey, openAIEndpoint, azureAPIKey, azureAPIEndpoint, azureDeploymentName, claudeAPIKey } = response;

    let res: Response;

    switch (defaultServiceProvider) {
        case 'OpenAI':
            const openAIPayload: OpenAIChatPayload = {
                model: 'gpt-3.5-turbo' as OpenAIModel,
                messages: teamPayload.messages as OpenAIMessage[],
                // temperature: 1.0,
                stream: true as boolean,
            };

            res = await fetch(`${openAIEndpoint}/v1/chat/completions`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${openAIKey}`,
                },
                method: 'POST',
                body: JSON.stringify(openAIPayload),
            });
            break;

        case 'Azure':
            const azurePayload: OpenAIChatPayload = {
                model: 'gpt-3.5-turbo' as OpenAIModel,
                messages: teamPayload.messages as OpenAIMessage[],
                // temperature: 1.0,
                stream: true as boolean,
            };

            res = await fetch(`${azureAPIEndpoint}/openai/deployments/${azureDeploymentName}/chat/completions?api-version=2023-03-15-preview`, {
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': azureAPIKey,
                },
                method: 'POST',
                body: JSON.stringify(azurePayload),
            });
            break;

        case 'Claude':
            const HUMAN_PROMPT = '\n\nHuman:' + teamPayload.messages.content;
            const AI_PROMPT = '\n\nAssistant:';

            const claudePayload = {
                model: 'claude-v1',
                prompt: `${HUMAN_PROMPT}${AI_PROMPT}`,
                max_tokens_to_sample: 3000,
                temperature: 1.0,
            };

            res = await fetch('https://api.anthropic.com/v1/complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': claudeAPIKey,
                },
                body: JSON.stringify(claudePayload),
            });
            break;
    }

    const stream = new ReadableStream({
        async start(controller) {
            function onParse(event: ParsedEvent | ReconnectInterval) {
                if (event.type === 'event') {
                    const data = event.data;
                    if (data === '[DONE]') {
                        controller.close();
                        return;
                    }
                    try {
                        const json = JSON.parse(data);
                        const text = json.choices[0].delta?.content || '';
                        if (counter < 2 && (text.match(/\n/) || []).length) {
                            return;
                        }
                        const queue = encoder.encode(text);
                        controller.enqueue(queue);
                        counter++;
                    } catch (e) {
                        controller.error(e);
                    }
                }
            }

            const parser = createParser(onParse);
            for await (const chunk of res.body as any) {
                parser.feed(decoder.decode(chunk));
            }
        },
    });

    return stream;
}
