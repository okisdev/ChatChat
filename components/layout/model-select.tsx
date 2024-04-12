import { IoChevronDown } from 'react-icons/io5';
import { useAtom } from 'jotai';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/custom/dropdown-menu';
import { Provider } from '@/config/provider';
// import { model as AmazonModel } from '@/config/provider/amazon';
import { model as AnthropicModel } from '@/config/provider/anthropic';
// import { model as AzureOpenAIModel } from '@/config/provider/azure';
import { model as CohereModel } from '@/config/provider/cohere';
import { model as FireworksModel } from '@/config/provider/fireworks';
import { model as GoogleModel } from '@/config/provider/google';
import { model as GroqModel } from '@/config/provider/groq';
import { model as HuggingFaceModel } from '@/config/provider/huggingface';
import { model as MistralModel } from '@/config/provider/mistral';
import { model as OpenAIModel } from '@/config/provider/openai';
import { model as PerplexityModel } from '@/config/provider/perplexity';
import store from '@/hooks/store';
import { Model, SimpleModel } from '@/types/model';
import { ProviderSetting } from '@/types/settings';

export const ModelSelect = () => {
    const t = useTranslations();

    const [currentUseModel, setCurrentUseModel] = useAtom<SimpleModel>(store.currentUseModelAtom);

    const [recentUsedModels, setRecentUsedModels] = useAtom<SimpleModel[] | null>(store.recentUsedModelsAtom);

    const [currentProviderSettings] = useAtom<ProviderSetting | null>(store.currentProviderSettingsAtom);

    const customProviderModel = useAtom<Model[] | null>(store.customProviderModelAtom);

    const handleModelChange = (newModel: SimpleModel) => {
        setCurrentUseModel(newModel);
        setRecentUsedModels((prevModels) => {
            if (!prevModels) return [newModel];
            const newModels = prevModels.filter((model) => model.model_id !== newModel.model_id);
            return [newModel, ...newModels].slice(0, 5);
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='flex flex-row items-center space-x-2 rounded-md px-2 py-1.5 outline-none transition duration-300 ease-in-out hover:bg-zinc-200/60 dark:hover:bg-neutral-500/40'>
                <Image src={`/img/${currentUseModel.provider}.png`} alt={currentUseModel.provider} width={16} height={16} />
                <p className='text-sm'>{currentUseModel.model_name}</p>
                <IoChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {recentUsedModels && recentUsedModels.length > 0 && (
                    <>
                        <DropdownMenuLabel className='text-xs text-neutral-700/70 dark:text-neutral-200/70'>{t('recent_used')}</DropdownMenuLabel>
                        {recentUsedModels.slice(0, 3).map((model) => (
                            <DropdownMenuItem key={model.model_id} onClick={() => handleModelChange(model)} className='flex cursor-pointer items-center space-x-2'>
                                <Image src={`/img/${model.provider}.png`} alt={model.provider} width={16} height={16} />
                                <p>{model.model_name}</p>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                    </>
                )}
                <DropdownMenuLabel className='text-xs text-neutral-700/70 dark:text-neutral-200/70'>{t('more_providers')}</DropdownMenuLabel>
                {/* <ModelSelector
                    label={Provider.Amazon}
                    models={AmazonModel}
                    recentUsedModel={currentUseModel}
                    setCurrentUseModel={handleModelChange}
                    currentProviderSettings={currentProviderSettings}
                /> */}
                <ModelSelector
                    label={Provider.Anthropic}
                    models={AnthropicModel}
                    recentUsedModel={currentUseModel}
                    setCurrentUseModel={handleModelChange}
                    currentProviderSettings={currentProviderSettings}
                    configured={process.env['NEXT_PUBLIC_ACCESS_ANTHROPIC'] == 'true'}
                />
                {/* <ModelSelector
                    label={Provider.Azure}
                    models={AzureOpenAIModel}
                    recentUsedModel={currentUseModel}
                    setCurrentUseModel={handleModelChange}
                    currentProviderSettings={currentProviderSettings}
                /> */}
                <ModelSelector
                    label={Provider.Cohere}
                    models={CohereModel}
                    recentUsedModel={currentUseModel}
                    setCurrentUseModel={handleModelChange}
                    currentProviderSettings={currentProviderSettings}
                    configured={process.env['NEXT_PUBLIC_ACCESS_COHERE'] == 'true'}
                />
                <ModelSelector
                    label={Provider.Fireworks}
                    models={FireworksModel}
                    recentUsedModel={currentUseModel}
                    setCurrentUseModel={handleModelChange}
                    currentProviderSettings={currentProviderSettings}
                    configured={process.env['NEXT_PUBLIC_ACCESS_FIREWORKS'] == 'true'}
                />
                <ModelSelector
                    label={Provider.Google}
                    models={GoogleModel}
                    recentUsedModel={currentUseModel}
                    setCurrentUseModel={handleModelChange}
                    currentProviderSettings={currentProviderSettings}
                    configured={process.env['NEXT_PUBLIC_ACCESS_GOOGLE'] == 'true'}
                />
                <ModelSelector
                    label={Provider.Groq}
                    models={GroqModel}
                    recentUsedModel={currentUseModel}
                    setCurrentUseModel={handleModelChange}
                    currentProviderSettings={currentProviderSettings}
                    configured={process.env['NEXT_PUBLIC_ACCESS_GROQ'] == 'true'}
                />
                <ModelSelector
                    label={Provider.HuggingFace}
                    models={HuggingFaceModel}
                    recentUsedModel={currentUseModel}
                    setCurrentUseModel={handleModelChange}
                    currentProviderSettings={currentProviderSettings}
                    configured={process.env['NEXT_PUBLIC_ACCESS_HUGGINGFACE'] == 'true'}
                />
                <ModelSelector
                    label={Provider.Mistral}
                    models={MistralModel}
                    recentUsedModel={currentUseModel}
                    setCurrentUseModel={handleModelChange}
                    currentProviderSettings={currentProviderSettings}
                    configured={process.env['NEXT_PUBLIC_ACCESS_MISTRAL'] == 'true'}
                />
                <ModelSelector
                    label={Provider.OpenAI}
                    models={OpenAIModel}
                    recentUsedModel={currentUseModel}
                    setCurrentUseModel={handleModelChange}
                    currentProviderSettings={currentProviderSettings}
                    configured={process.env['NEXT_PUBLIC_ACCESS_OPENAI'] == 'true'}
                    allowSearch
                />
                <ModelSelector
                    label={Provider.Perplexity}
                    models={PerplexityModel}
                    recentUsedModel={currentUseModel}
                    setCurrentUseModel={handleModelChange}
                    currentProviderSettings={currentProviderSettings}
                    configured={process.env['NEXT_PUBLIC_ACCESS_PERPLEXITY'] == 'true'}
                />
                <DropdownMenuSeparator />
                <CustomModelSelector
                    label={Provider.Custom}
                    // models={customProviderModel}
                    recentUsedModel={currentUseModel}
                    setCurrentUseModel={handleModelChange}
                    currentProviderSettings={currentProviderSettings}
                />
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const ModelSelector = ({
    label,
    models,
    recentUsedModel,
    setCurrentUseModel,
    currentProviderSettings,
    allowSearch = false,
    configured,
}: {
    label: Provider;
    models: Model[] | null;
    recentUsedModel: SimpleModel;
    setCurrentUseModel: (value: SimpleModel) => void;
    currentProviderSettings: ProviderSetting | null;
    allowSearch?: boolean;
    configured: boolean;
}) => {
    const t = useTranslations();

    const pathname = usePathname();

    const hasKeyStored = configured;

    const isProviderConfigured = (currentProviderSettings && currentProviderSettings[label] && currentProviderSettings[label] !== null) || hasKeyStored;

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger className={pathname == '/search' && !allowSearch ? 'hidden' : ''}>
                <div className='flex cursor-pointer items-center space-x-2'>
                    <Image src={`/img/${label}.png`} alt={label} width={16} height={16} />
                    <p>{label}</p>
                </div>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
                {!isProviderConfigured ? (
                    <>
                        <DropdownMenuLabel className='flex items-center space-x-1'>
                            <p className='text-xs text-red-600/90'>{t('provider_not_configured')}</p>
                        </DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link href={`?open=settings&tab=provider&provider=${label}`} className='cursor-pointer'>
                                {t('go_to_settings')}
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                    </>
                ) : (
                    hasKeyStored && (
                        <>
                            <DropdownMenuLabel className='flex items-center space-x-1'>
                                <p className='text-xs text-sky-600/90'>{t('provider_configured_globally')}</p>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                        </>
                    )
                )}
                <DropdownMenuRadioGroup
                    value={recentUsedModel.model_name}
                    onValueChange={(value) => {
                        const selectedModel = models?.find((model) => model.name === value);
                        if (selectedModel) {
                            setCurrentUseModel({ provider: label, model_id: selectedModel.id, model_name: selectedModel.name });
                        }
                    }}
                >
                    {models?.map(({ id, name, vision }) => (
                        <DropdownMenuRadioItem key={id} value={name} className='cursor-pointer space-x-1.5' disabled={!isProviderConfigured}>
                            <span>{name}</span>
                            {vision && <span>👀</span>}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
        </DropdownMenuSub>
    );
};

const CustomModelSelector = ({
    label,
    recentUsedModel,
    setCurrentUseModel,
    currentProviderSettings,
}: {
    label: Provider;
    recentUsedModel: SimpleModel;
    setCurrentUseModel: (value: SimpleModel) => void;
    currentProviderSettings: ProviderSetting | null;
}) => {
    const t = useTranslations();

    const isCustomConfigured = currentProviderSettings && currentProviderSettings['Custom'] && currentProviderSettings['Custom'] !== null;

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                <div className='flex cursor-pointer items-center space-x-2'>
                    <Image src={`/img/${label}.png`} alt={label} width={16} height={16} />
                    <p>{t('custom')}</p>
                </div>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
                <DropdownMenuLabel className='flex items-center space-x-1'>
                    <p className='text-xs text-red-600/90'>{!isCustomConfigured ? t('provider_not_configured') : t('add_mode_custom_provider')}</p>
                </DropdownMenuLabel>
                <DropdownMenuItem asChild>
                    <Link href={`?open=settings&tab=provider&provider=${label}`} className='cursor-pointer'>
                        {t('go_to_settings')}
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                    value={recentUsedModel.model_name}
                    onValueChange={(value) => {
                        if (value === null) return;

                        setCurrentUseModel({ provider: JSON.parse(value).basedProvider as Provider, model_id: JSON.parse(value).model, model_name: JSON.parse(value).model });
                    }}
                >
                    {currentProviderSettings?.Custom?.map((custom, index) => (
                        <DropdownMenuRadioItem key={index} value={JSON.stringify(custom)} className='cursor-pointer space-x-1.5' disabled={!isCustomConfigured}>
                            <span>{custom.model}</span>
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
        </DropdownMenuSub>
    );
};
