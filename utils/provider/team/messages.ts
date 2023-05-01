import { createParser, ParsedEvent, ReconnectInterval } from 'eventsource-parser';

const BASE_URL = () => {
    if (process.env.NODE_ENV === 'development') {
        return 'localhost:3000';
    } else {
        return process.env.BASE_URL;
    }
};

export async function sendTeamStreamMessages(teamPayload: any, accessCode: string) {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    let counter = 0;

    const response = await fetch(`https://${BASE_URL}/api/team/info?accessCode=${accessCode}`).then((res) => res.json());

    const { apiKey, apiEndpoint } = response;

    const payload: OpenAIChatPayload = {
        model: 'gpt-3.5-turbo' as OpenAIModel,
        messages: teamPayload.messages as OpenAIMessage[],
        // temperature: 1.0,
        stream: true as boolean,
    };

    const res = await fetch(`${apiEndpoint}/v1/chat/completions`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
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
