export async function sendHuggingFaceStreamMessages(huggingFacePayload: any, accessToken: string) {
    return null;
}

export async function sendHuggingFaceMessages(model: string, message: string, accessToken: string) {
    if (!accessToken) {
        return 'ERROR: No access token provided';
    }

    const response = await fetch(`https://api-inference.huggingface.co/models/` + model, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ inputs: message }),
    });

    const data = await response.json();

    return data[0].generated_text;
}
