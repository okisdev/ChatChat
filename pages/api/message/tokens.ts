import { NextApiRequest, NextApiResponse } from 'next';

import { get_encoding } from '@dqbd/tiktoken';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { message } = req.query as { message: string };

    const { messages } = req.body as { messages: OpenAIMessage[] };

    if (!message && !messages) {
        return res.status(400).json({ error: 'Missing message' });
    }

    const encoding = get_encoding('gpt2');

    if (messages) {
        let extraCount = messages.map((message) => {
            let count;
            switch (message.role) {
                default:
                case 'user':
                case 'system':
                    count = 5;
                    break;
                case 'assistant':
                    count = 8;
                    break;
            }
            return count;
        });

        let AllExtraCount = extraCount.reduce((a, b) => a + b, 0);

        // let roleContents = messages.map((message) => {
        //     let roleContent;
        //     switch (message.role) {
        //         case 'system':
        //             roleContent = '<|im_start|>system\n' + message.content + '<|im_end|>\n';
        //             break;
        //         case 'assistant':
        //             roleContent = '<|im_start|>assistant\n' + message.content + '<|im_end|>\n';
        //             break;
        //         default:
        //         case 'user':
        //             roleContent = '<|im_start|>user\n' + message.content + '<|im_end|>\n';
        //             break;
        //     }
        //     return roleContent;
        // });

        // let joinedRoleContents = roleContents.join('');

        let joinedRoleContents = messages.map((message) => message.content).join(' ');

        const tokens = encoding.encode(joinedRoleContents);

        encoding.free();

        const tokenCount = tokens.length + AllExtraCount;

        return res.status(200).json({ tokenCount });
    } else {
        const tokens = encoding.encode(message);

        encoding.free();

        const tokenCount = tokens.length;

        return res.status(200).json({ tokenCount });
    }
}
