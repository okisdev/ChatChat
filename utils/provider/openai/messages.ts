import { createParser, ParsedEvent, ReconnectInterval } from 'eventsource-parser';

export async function sendOpenAIStreamMessages(payload: OpenAIChatPayload, apiKey: string, apiEndpoint: string) {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    let counter = 0;

    const API_KEY = apiKey != '' ? apiKey : process.env.OPENAI_API_KEY;
    const API_ENDPOINT = apiEndpoint != '' ? apiEndpoint : process.env.OPENAI_API_ENDPOINT || 'https://api.openai.com';

    const res = await fetch(`${API_ENDPOINT}/v1/chat/completions`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
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

export async function sendOpenAIMessages(payload: OpenAIChatPayload, apiKey: string, apiEndpoint: string) {
    const API_KEY = apiKey != '' ? apiKey : process.env.OPENAI_API_KEY;
    const API_ENDPOINT = apiEndpoint != '' ? apiEndpoint : process.env.OPENAI_API_ENDPOINT || 'https://api.openai.com';

    const res = await fetch(`${API_ENDPOINT}/v1/chat/completions`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
        },
        method: 'POST',
        body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.error) {
        return 'ERROR: ' + data.error.message;
    }

    return data.choices[0].message.content;
}
