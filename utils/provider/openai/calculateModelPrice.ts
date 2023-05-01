import { openAIModelConfig } from '@/config/provider/openai.config';

const calculateModelPrice = (model: OpenAIModel, tokenCount: number) => {
    const modelPrice = openAIModelConfig.find((item) => item.model === model)?.price;

    if (!modelPrice) {
        return 0;
    }

    const price = modelPrice * tokenCount;

    return price;
};

export default calculateModelPrice;
