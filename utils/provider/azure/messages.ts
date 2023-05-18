import { createParser, ParsedEvent, ReconnectInterval } from 'eventsource-parser';

export async function sendAzureStreamMessages(payload: OpenAIChatPayload, apiKey: string, apiEndpoint: string, deploymentName: string) {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    let counter = 0;

    if (!apiKey) {
        return 'ERROR: No API key provided';
    }

    if (!apiEndpoint) {
        return 'ERROR: No API endpoint provided';
    }

    if (!deploymentName) {
        return 'ERROR: No deployment name provided';
    }

    const API_ENDPOINT = apiEndpoint;

    const res = await fetch(`${API_ENDPOINT}/openai/deployments/${deploymentName}/chat/completions?api-version=2023-03-15-preview`, {
        headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey,
        },
        method: 'POST',
        body: JSON.stringify(payload),
    });

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

export async function sendAzureMessages(payload: OpenAIChatPayload, apiKey: string, apiEndpoint: string, deploymentName: string) {
    if (!apiKey) {
        return 'ERROR: No API key provided';
    }

    if (!apiEndpoint) {
        return 'ERROR: No API endpoint provided';
    }

    if (!deploymentName) {
        return 'ERROR: No deployment name provided';
    }

    const API_ENDPOINT = apiEndpoint;

    const res = await fetch(`${API_ENDPOINT}/openai/deployments/${deploymentName}/chat/completions?api-version=2023-03-15-preview`, {
        headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey,
        },
        method: 'POST',
        body: JSON.stringify(payload),
    });

    const data = await res.json();

    return data.choices[0].message.content;
}
