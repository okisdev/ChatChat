import { SimpleModel } from '@/types/model';
import { SpecifiedProviderSetting } from '@/types/settings';

export interface ApiConfig {
    // apiKey?: string;
    // endpoint?: string;
    provider: SpecifiedProviderSetting;
    model: SimpleModel;
    stream: boolean | undefined;
    numberOfContext: number;
}
