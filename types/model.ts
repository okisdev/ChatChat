import { AllModelId, AllModelName, Provider } from '@/config/provider';

export interface Model {
    id: AllModelId;
    name: AllModelName;
    maxInputTokens?: number | null;
    maxOutputTokens?: number | null;
    maxTokens?: number | null;
    price?: number | null;
    vision?: boolean;
}

export interface SimpleModel {
    provider: Provider;
    model_id: Model['id'];
    model_name: Model['name'];
}
