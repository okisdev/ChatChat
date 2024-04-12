// import { BedrockRuntimeClient, InvokeModelWithResponseStreamCommand } from '@aws-sdk/client-bedrock-runtime';
// import { AWSBedrockAnthropicStream, StreamingTextResponse } from 'ai';
// import { experimental_buildAnthropicPrompt } from 'ai/prompts';

// import { ApiConfig } from '@/types/app';

// export const runtime = 'edge';

// export const dynamic = 'force-dynamic';

// const amazon = new BedrockRuntimeClient({
//     region: process.env.AWS_REGION ?? 'us-east-1',
//     credentials: {
//         accessKeyId: process.env.AWS_ACCESS_KEY ?? '',
//         secretAccessKey: process.env.AWS_SECRET_KEY ?? '',
//     },
// });

// export async function POST(req: Request) {
//     const {
//         messages,
//         config,
//         stream,
//     }: {
//         messages: any[];
//         config: ApiConfig;
//         stream: boolean;
//     } = await req.json();

//     const response = await amazon.send(
//         new InvokeModelWithResponseStreamCommand({
//             modelId: config.model.model_id,
//             contentType: 'application/json',
//             accept: 'application/json',
//             body: JSON.stringify({
//                 prompt: experimental_buildAnthropicPrompt(messages),
//                 max_tokens_to_sample: 300,
//                 stream: stream,
//             }),
//         })
//     );

//     const output = AWSBedrockAnthropicStream(response);

//     return new StreamingTextResponse(output);
// }


export async function GET(req: Request) {
    return Response.json({ error: 'Method Not Allowed' }, { status: 405 });
}
