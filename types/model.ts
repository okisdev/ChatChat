import { AllModelId, AllModelName } from '@/config/provider';
import { Provider } from '@/config/provider';

export interface Model {
    id: AllModelId;
    name: AllModelName;
    maxInputTokens?: number | null;
    maxOutputTokens?: number | null;
    maxTokens?: number | null;
    price?: number | null;
}

export interface GeneralModel {
    provider: Provider;
    model_id: Model['id'];
    model_name: Model['name'];
}
