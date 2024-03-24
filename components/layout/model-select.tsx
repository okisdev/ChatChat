import { IoChevronDown } from 'react-icons/io5';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSubContent,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { model as OpenAIModel } from '@/config/provider/openai';
import { model as AnthropicModel } from '@/config/provider/anthropic';
import { model as AzureOpenAIModel } from '@/config/provider/azure';
import { model as GoogleModel } from '@/config/provider/google';
import { model as GroqModel } from '@/config/provider/groq';
import { model as CohereModel } from '@/config/provider/cohere';
import { model as FireworksModel } from '@/config/provider/fireworks';
import { model as PerplexityModel } from '@/config/provider/perplexity';
import { model as HuggingFaceModel } from '@/config/provider/huggingface';
import { model as MistralModel } from '@/config/provider/mistral';
import { useAtom } from 'jotai';
import store from '@/hooks/store';
import { useRouter } from 'next/navigation';
import { GeneralModel, Model } from '@/types/model';
import { GeneralProviderSettings } from '@/types/settings';
import { Provider } from '@/config/provider';
import Link from 'next/link';
import Image from 'next/image';

export default function ModelSelect() {
    const router = useRouter();

    const [currentUseModel, setCurrentUseModel] = useAtom<GeneralModel>(store.currentUseModelAtom);

    const [recentUsedModels, setRecentUsedModels] = useAtom<GeneralModel[] | null>(store.recentUsedModelsAtom);

    const [generalProviderSettings] = useAtom<GeneralProviderSettings | null>(store.generalProviderSettingsAtom);

    const handleModelChange = (newModel: GeneralModel) => {
        setCurrentUseModel(newModel);
        setRecentUsedModels((prevModels) => {
            if (!prevModels) return [newModel];
            const newModels = prevModels.filter((model) => model.model_id !== newModel.model_id);
            return [newModel, ...newModels].slice(0, 5);
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='flex flex-row items-center space-x-2 rounded-md px-2 py-1.5 outline-none transition duration-300 ease-in-out hover:bg-zinc-200/60'>
                <Image src={`/img/${currentUseModel.provider}.png`} alt={currentUseModel.provider} width={16} height={16} />
                <p className='text-sm'>{currentUseModel.model_name}</p>
                <IoChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {recentUsedModels && recentUsedModels.length > 0 && (
                    <>
                        <DropdownMenuLabel className='text-xs text-stone-700/70'>Recent Used</DropdownMenuLabel>
                        {recentUsedModels.slice(0, 3).map((model) => (
                            <DropdownMenuItem key={model.model_id} onClick={() => handleModelChange(model)} className='flex cursor-pointer items-center space-x-2'>
                                <Image src={`/img/${model.provider}.png`} alt={model.provider} width={16} height={16} />
                                <p>{model.model_name}</p>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                    </>
                )}
                <DropdownMenuLabel className='text-xs text-stone-700/70'>More Providers</DropdownMenuLabel>
                <ModelSelector
                    label={Provider.Anthropic}
                    models={AnthropicModel}
                    recentUsedModel={currentUseModel}
                    setCurrentUseModel={handleModelChange}
                    generalProviderSettings={generalProviderSettings}
                />
                <ModelSelector
                    label={Provider.Azure}
                    models={AzureOpenAIModel}
                    recentUsedModel={currentUseModel}
                    setCurrentUseModel={handleModelChange}
                    generalProviderSettings={generalProviderSettings}
                />
                <ModelSelector
                    label={Provider.Cohere}
                    models={CohereModel}
                    recentUsedModel={currentUseModel}
                    setCurrentUseModel={handleModelChange}
                    generalProviderSettings={generalProviderSettings}
                />
                <ModelSelector
                    label={Provider.Fireworks}
                    models={FireworksModel}
                    recentUsedModel={currentUseModel}
                    setCurrentUseModel={handleModelChange}
                    generalProviderSettings={generalProviderSettings}
                />
                <ModelSelector
                    label={Provider.Google}
                    models={GoogleModel}
                    recentUsedModel={currentUseModel}
                    setCurrentUseModel={handleModelChange}
                    generalProviderSettings={generalProviderSettings}
                />
                <ModelSelector label={Provider.Groq} models={GroqModel} recentUsedModel={currentUseModel} setCurrentUseModel={handleModelChange} generalProviderSettings={generalProviderSettings} />
                <ModelSelector
                    label={Provider.HuggingFace}
                    models={HuggingFaceModel}
                    recentUsedModel={currentUseModel}
                    setCurrentUseModel={handleModelChange}
                    generalProviderSettings={generalProviderSettings}
                />
                <ModelSelector
                    label={Provider.Mistral}
                    models={MistralModel}
                    recentUsedModel={currentUseModel}
                    setCurrentUseModel={handleModelChange}
                    generalProviderSettings={generalProviderSettings}
                />
                <ModelSelector
                    label={Provider.OpenAI}
                    models={OpenAIModel}
                    recentUsedModel={currentUseModel}
                    setCurrentUseModel={handleModelChange}
                    generalProviderSettings={generalProviderSettings}
                />
                <ModelSelector
                    label={Provider.Perplexity}
                    models={PerplexityModel}
                    recentUsedModel={currentUseModel}
                    setCurrentUseModel={handleModelChange}
                    generalProviderSettings={generalProviderSettings}
                />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

const ModelSelector = ({
    label,
    models,
    recentUsedModel,
    setCurrentUseModel,
    generalProviderSettings,
}: {
    label: Provider;
    models: Model[];
    recentUsedModel: GeneralModel;
    setCurrentUseModel: (value: GeneralModel) => void;
    generalProviderSettings: GeneralProviderSettings | null;
}) => {
    const isProviderConfigured = generalProviderSettings && generalProviderSettings[label] && generalProviderSettings[label] !== null && generalProviderSettings[label]?.apiKey !== '';

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                <div className='flex cursor-pointer items-center space-x-2'>
                    <Image src={`/img/${label}.png`} alt={label} width={16} height={16} />
                    <p>{label}</p>
                </div>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
                {!isProviderConfigured && (
                    <>
                        <DropdownMenuLabel className='flex items-center space-x-1'>
                            <p className='text-xs text-red-600/90'>Provider is not configured</p>
                        </DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link href={`?open=settings&tab=provider&provider=${label}`} className='cursor-pointer'>
                                Go to Settings
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                    </>
                )}
                <DropdownMenuRadioGroup
                    value={recentUsedModel.model_name}
                    onValueChange={(value) => {
                        const selectedModel = models.find((model) => model.name === value);
                        if (selectedModel) {
                            setCurrentUseModel({ provider: label, model_id: selectedModel.id, model_name: selectedModel.name });
                        }
                    }}
                >
                    {models.map(({ id, name }) => (
                        <DropdownMenuRadioItem key={id} value={name} className='cursor-pointer' disabled={!isProviderConfigured}>
                            {name}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
        </DropdownMenuSub>
    );
};
