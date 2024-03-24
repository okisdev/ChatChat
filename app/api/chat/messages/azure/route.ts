// import { GeneralModel } from '@/types/model';
// import { OpenAIClient, AzureKeyCredential } from '@azure/openai';
// import { OpenAIStream, StreamingTextResponse } from 'ai';

// const client = new OpenAIClient(process.env.AZURE_OPENAI_ENDPOINT ?? '', new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY ?? ''));

// export const runtime = 'edge';

// export async function POST(req: Request) {
//     const {
//         messages,
//         model,
//     }: {
//         messages: any[];
//         model: GeneralModel;
//     } = await req.json();

//     const response = await client.streamChatCompletions(process.env.AZURE_OPENAI_DEPLOY_INSTANCE_NAME || '', messages);

//     const stream = OpenAIStream(response);

//     return new StreamingTextResponse(stream);
// }

export async function GET(req: Request) {
    return Response.json({ error: 'Method Not Allowed' }, { status: 405 });
}
