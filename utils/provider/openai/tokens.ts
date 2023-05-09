import { get_encoding } from '@dqbd/tiktoken';

const getTokenCount = (message: string) => {
    const encoding = get_encoding('gpt2');

    const tokens = encoding.encode(message);

    encoding.free();

    return tokens.length;
};

const getTokenCountByConversation = (conversation: OpenAIMessage[]) => {
    const encoding = get_encoding('gpt2');

    const tokens = encoding.encode(conversation.map((message) => message.content).join(' '));

    encoding.free();

    return tokens.length;
};

export { getTokenCount, getTokenCountByConversation };
