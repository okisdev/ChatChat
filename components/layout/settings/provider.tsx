import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

// import { AmazonProvider } from '@/components/layout/settings/provider/amazon';
import { AnthropicProvider } from '@/components/layout/settings/provider/anthropic';
// import { AzureProvider } from '@/components/layout/settings/provider/azure';
import { CohereProvider } from '@/components/layout/settings/provider/cohere';
import { CustomProvider } from '@/components/layout/settings/provider/custom';
import { FireworksProvider } from '@/components/layout/settings/provider/fireworks';
import { GoogleProvider } from '@/components/layout/settings/provider/google';
import { GroqProvider } from '@/components/layout/settings/provider/groq';
import { HuggingFaceProvider } from '@/components/layout/settings/provider/huggingface';
import { MistralProvider } from '@/components/layout/settings/provider/mistral';
import { OpenAIProvider } from '@/components/layout/settings/provider/openai';
import { PerplexityProvider } from '@/components/layout/settings/provider/perplexity';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/custom/select';
import { Provider, Providers } from '@/config/provider';
import { ProviderSetting } from '@/types/settings';

export const ProviderSettings = ({
    currentProvider,
    setCurrentProvider,
    amazon,
    setAmazon,
    anthropic,
    setAnthropic,
    azure,
    setAzure,
    cohere,
    setCohere,
    fireworks,
    setFireworks,
    google,
    setGoogle,
    groq,
    setGroq,
    huggingFace,
    setHuggingFace,
    mistral,
    setMistral,
    openAI,
    setOpenAI,
    perplexity,
    setPerplexity,

    custom,
    setCustom,
}: {
    currentProvider: Provider;
    setCurrentProvider: (value: Provider) => void;
    amazon: ProviderSetting['Amazon'] | null;
    setAmazon: (value: ProviderSetting['Amazon'] | null) => void;
    anthropic: ProviderSetting['Anthropic'] | null;
    setAnthropic: (value: ProviderSetting['Anthropic'] | null) => void;
    azure: ProviderSetting['Azure'] | null;
    setAzure: (value: ProviderSetting['Azure'] | null) => void;
    cohere: ProviderSetting['Cohere'] | null;
    setCohere: (value: ProviderSetting['Cohere'] | null) => void;
    fireworks: ProviderSetting['Fireworks'] | null;
    setFireworks: (value: ProviderSetting['Fireworks'] | null) => void;
    google: ProviderSetting['Google'] | null;
    setGoogle: (value: ProviderSetting['Google'] | null) => void;
    groq: ProviderSetting['Groq'] | null;
    setGroq: (value: ProviderSetting['Groq'] | null) => void;
    huggingFace: ProviderSetting['HuggingFace'] | null;
    setHuggingFace: (value: ProviderSetting['HuggingFace'] | null) => void;
    mistral: ProviderSetting['Mistral'] | null;
    setMistral: (value: ProviderSetting['Mistral'] | null) => void;
    openAI: ProviderSetting['OpenAI'] | null;
    setOpenAI: (value: ProviderSetting['OpenAI'] | null) => void;
    perplexity: ProviderSetting['Perplexity'] | null;
    setPerplexity: (value: ProviderSetting['Perplexity'] | null) => void;

    custom: ProviderSetting['Custom'] | null;
    setCustom: (value: ProviderSetting['Custom'] | null) => void;
}) => {
    const t = useTranslations();

    const router = useRouter();

    const RenderProviderSettings = () => {
        switch (currentProvider) {
            // case Provider.Amazon:
            // return <AmazonProvider amazon={amazon} setAmazon={setAmazon} />;
            case Provider.Anthropic:
                return <AnthropicProvider anthropic={anthropic} setAnthropic={setAnthropic} />;
            // case Provider.Azure:
            // return <AzureProvider azure={azure} setAzure={setAzure} />;
            case Provider.Cohere:
                return <CohereProvider cohere={cohere} setCohere={setCohere} />;
            case Provider.Fireworks:
                return <FireworksProvider fireworks={fireworks} setFireworks={setFireworks} />;
            case Provider.Google:
                return <GoogleProvider google={google} setGoogle={setGoogle} />;
            case Provider.Groq:
                return <GroqProvider groq={groq} setGroq={setGroq} />;
            case Provider.HuggingFace:
                return <HuggingFaceProvider huggingFace={huggingFace} setHuggingFace={setHuggingFace} />;
            case Provider.Mistral:
                return <MistralProvider mistral={mistral} setMistral={setMistral} />;
            case Provider.OpenAI:
                return <OpenAIProvider openAI={openAI} setOpenAI={setOpenAI} />;
            case Provider.Perplexity:
                return <PerplexityProvider perplexity={perplexity} setPerplexity={setPerplexity} />;
            case Provider.Custom:
                return <CustomProvider custom={custom} setCustom={setCustom} />;
            default:
                return null;
        }
    };

    return (
        <div className='space-y-2 rounded-xl bg-neutral-100/70 pt-3 dark:bg-neutral-600'>
            <div className='space-y-2 px-4'>
                <p className='text-sm'>{t('provider')}</p>
                <Select
                    onValueChange={(value) => {
                        router.push('?open=settings&tab=provider&provider=' + value);
                        setCurrentProvider(Providers.find((provider) => provider.name === value)!.name);
                    }}
                >
                    <SelectTrigger className='w-full'>
                        <SelectValue
                            placeholder={
                                <div className='flex flex-row space-x-2'>
                                    <Image src={`/img/${currentProvider}.png`} alt={currentProvider} width={20} height={20} />
                                    <p className='text-sm'>{currentProvider}</p>
                                </div>
                            }
                        />
                    </SelectTrigger>
                    <SelectContent>
                        {Providers.filter((provider) => provider.name !== 'Amazon' && provider.name !== 'Azure')
                            .toSorted((a, b) => a.name.localeCompare(b.name))
                            .map((provider) => (
                                <SelectItem key={provider.id} value={provider.name}>
                                    <div className='flex flex-row space-x-2'>
                                        <Image src={`/img/${provider.name}.png`} alt={provider.name} width={20} height={20} />
                                        <p className='text-sm'>{provider.name}</p>
                                    </div>
                                </SelectItem>
                            ))}
                    </SelectContent>
                </Select>
            </div>
            <div className='space-y-3 rounded-xl bg-neutral-200/30 p-4 dark:bg-neutral-700/50'>
                <RenderProviderSettings />
            </div>
        </div>
    );
};
