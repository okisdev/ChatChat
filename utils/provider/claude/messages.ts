export async function sendClaudeMessages(model: string, message: string, apiKey: string, claudeAPITemperature: number) {
    if (!apiKey) {
        return 'ERROR: No API key provided';
    }

    const HUMAN_PROMPT = '\n\nHuman:' + message;
    const AI_PROMPT = '\n\nAssistant:';

    const response = await fetch('https://api.anthropic.com/v1/complete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey,
        },
        body: JSON.stringify({
            model: model,
            prompt: `${HUMAN_PROMPT}${AI_PROMPT}`,
            max_tokens_to_sample: 3000,
            temperature: claudeAPITemperature || 1.0,
        }),
    });

    const data = await response.json();

    return data.completion;
}
