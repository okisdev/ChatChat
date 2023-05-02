import { sendClaudeMessages } from '@/utils/provider/claude/messages';
import { sendCohereMessages } from '@/utils/provider/cohere/messages';
import { sendTeamStreamMessages } from '@/utils/provider/team/messages';
import { sendHuggingFaceMessages } from '@/utils/provider/huggingface/messages';
import { sendAzureMessages, sendAzureStreamMessages } from '@/utils/provider/azure/messages';
import { sendOpenAIMessages, sendOpenAIStreamMessages } from '@/utils/provider/openai/messages';

export const runtime = 'edge';

export async function POST(req: Request): Promise<Response> {
    const { stream, serviceProvider, config, messages } = await req.json();

    switch (serviceProvider) {
        default:
        case 'OpenAI':
            const openAIAPIKey = config?.apiKey as string;
            const openAIAPIEndpoint = config?.apiEndpoint as string;
            const opneAIAPIModel = (config?.apiModel as OpenAIModel) || 'gpt-3.5-turbo';
            const opneAIAPITemperature = (config?.apiTemperature as number) || 0.3;

            if (!messages) {
                return new Response('No messages in the request', { status: 400 });
            }

            const openAIPayload: OpenAIChatPayload = {
                model: opneAIAPIModel as OpenAIModel,
                messages: messages as OpenAIMessage[],
                temperature: opneAIAPITemperature as number,
                stream: stream as boolean,
            };

            if (stream) {
                const openAIStreamMessagesResponse = await sendOpenAIStreamMessages(openAIPayload, openAIAPIKey, openAIAPIEndpoint);

                return new Response(openAIStreamMessagesResponse);
            } else {
                const openAIMessagesResponse = await sendOpenAIMessages(openAIPayload, openAIAPIKey, openAIAPIEndpoint);

                return new Response(openAIMessagesResponse);
            }
        case 'Azure':
            const azureAPIKey = config?.apiKey as string;
            const azureAPIEndpoint = config?.apiEndpoint as string;
            const azureAPIModel = (config?.apiModel as OpenAIModel) || 'gpt-3.5-turbo';
            const azureAPITemperature = (config?.apiTemperature as number) || 0.3;
            const azureAPIDeploymentName = config?.apiDeploymentName as string;

            if (!messages) {
                return new Response('No messages in the request', { status: 400 });
            }

            const azurePayload: OpenAIChatPayload = {
                model: azureAPIModel as OpenAIModel,
                messages: messages as OpenAIMessage[],
                temperature: azureAPITemperature as number,
                stream: stream as boolean,
            };

            if (stream) {
                const azureStreamMessagesResponse = await sendAzureStreamMessages(azurePayload, azureAPIKey, azureAPIEndpoint, azureAPIDeploymentName);

                return new Response(azureStreamMessagesResponse);
            } else {
                const azureMessagesResponse = await sendAzureMessages(azurePayload, azureAPIKey, azureAPIEndpoint, azureAPIDeploymentName);

                return new Response(JSON.stringify(azureMessagesResponse));
            }
        case 'Team':
            const teamAccessCode = config?.accessCode as string;

            const teamPayload = {
                messages: messages as OpenAIMessage[],
            };

            const teamStreamMessagesResponse = await sendTeamStreamMessages(teamPayload, teamAccessCode);

            return new Response(teamStreamMessagesResponse);
        case 'Hugging Face':
            const huggingfaceModel = config?.model as string;
            const huggingfaceAccessToken = config?.accessToken as string;
            const huggingfaceMessage = messages[messages.length - 1]?.content;

            const huggingFaceMessagesResponse = await sendHuggingFaceMessages(huggingfaceModel, huggingfaceMessage, huggingfaceAccessToken);

            return new Response(JSON.stringify(huggingFaceMessagesResponse));
        case 'Cohere':
            const cohereModel = config?.model as string;
            const cohereMessage = messages[messages.length - 1]?.content;
            const cohereAPIKey = config?.apiKey as string;

            const cohereMessagesResponse = await sendCohereMessages(cohereModel, cohereMessage, cohereAPIKey);

            return new Response(JSON.stringify(cohereMessagesResponse));
        case 'Claude':
            const claudeModel = config?.model as string;
            const claudeMessage = messages[messages.length - 1]?.content;
            const claudeAPIKey = config?.apiKey as string;
            const claudeAPITemperature = config?.apiTemperature as number;

            const claudeMessagesResponse = await sendClaudeMessages(claudeModel, claudeMessage, claudeAPIKey, claudeAPITemperature);

            return new Response(JSON.stringify(claudeMessagesResponse));
    }
}
