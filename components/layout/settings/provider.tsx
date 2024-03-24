import { GeneralProviderSettings } from '@/types/settings';
import { Provider, Providers } from '@/config/provider';

import Image from 'next/image';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/custom/select';

import { AnthropicProvider } from '@/components/layout/settings/provider/anthropic';
import { AzureProvider } from '@/components/layout/settings/provider/azure';
import { GoogleProvider } from '@/components/layout/settings/provider/google';
import { CohereProvider } from '@/components/layout/settings/provider/cohere';
import { FireworksProvider } from '@/components/layout/settings/provider/fireworks';
import { HuggingFaceProvider } from '@/components/layout/settings/provider/huggingface';
import { OpenAIProvider } from '@/components/layout/settings/provider/openai';
import { GroqProvider } from '@/components/layout/settings/provider/groq';
import { MistralProvider } from '@/components/layout/settings/provider/mistral';
import { PerplexityProvider } from '@/components/layout/settings/provider/perplexity';

export const ProviderSettings = ({
    currentProvider,
    setCurrentProvider,
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
}: {
    currentProvider: Provider;
    setCurrentProvider: (value: Provider) => void;
    anthropic: GeneralProviderSettings['Anthropic'] | null;
    setAnthropic: (value: GeneralProviderSettings['Anthropic'] | null) => void;
    azure: GeneralProviderSettings['Azure'] | null;
    setAzure: (value: GeneralProviderSettings['Azure'] | null) => void;
    cohere: GeneralProviderSettings['Cohere'] | null;
    setCohere: (value: GeneralProviderSettings['Cohere'] | null) => void;
    fireworks: GeneralProviderSettings['Fireworks'] | null;
    setFireworks: (value: GeneralProviderSettings['Fireworks'] | null) => void;
    google: GeneralProviderSettings['Google'] | null;
    setGoogle: (value: GeneralProviderSettings['Google'] | null) => void;
    groq: GeneralProviderSettings['Groq'] | null;
    setGroq: (value: GeneralProviderSettings['Groq'] | null) => void;
    huggingFace: GeneralProviderSettings['HuggingFace'] | null;
    setHuggingFace: (value: GeneralProviderSettings['HuggingFace'] | null) => void;
    mistral: GeneralProviderSettings['Mistral'] | null;
    setMistral: (value: GeneralProviderSettings['Mistral'] | null) => void;
    openAI: GeneralProviderSettings['OpenAI'] | null;
    setOpenAI: (value: GeneralProviderSettings['OpenAI'] | null) => void;
    perplexity: GeneralProviderSettings['Perplexity'] | null;
    setPerplexity: (value: GeneralProviderSettings['Perplexity'] | null) => void;
}) => {
    const RenderProviderSettings = () => {
        switch (currentProvider) {
            case Provider.Anthropic:
                return <AnthropicProvider anthropic={anthropic} setAnthropic={setAnthropic} />;
            case Provider.Azure:
                return <AzureProvider azure={azure} setAzure={setAzure} />;
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
            default:
                return null;
        }
    };

    return (
        <div className='space-y-3 rounded-xl bg-neutral-100/70 pt-3'>
            <div className='space-y-2 px-4'>
                <p className='text-sm'>Provider Settings</p>
                <Select
                    onValueChange={(value) => {
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
                        {Providers.toSorted((a, b) => a.name.localeCompare(b.name)).map((provider) => (
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
            <div className='rounded-xl bg-neutral-200/30 px-4 py-4'>
                <RenderProviderSettings />
            </div>
        </div>
    );
};
