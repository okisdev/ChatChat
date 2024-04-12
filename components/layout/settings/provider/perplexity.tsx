import { Input } from '@/components/ui/custom/input';
import { ProviderSetting } from '@/types/settings';

export const PerplexityProvider = ({ perplexity, setPerplexity }: { perplexity: ProviderSetting['Perplexity'] | null; setPerplexity: (value: ProviderSetting['Perplexity'] | null) => void }) => {
    return (
        <div className='space-y-2'>
            <div className='space-y-0.5'>
                <p className='px-1 text-sm'>Perplexity API Key</p>
                <Input
                    type='text'
                    placeholder='sk-xxxx'
                    value={perplexity?.apiKey}
                    onChange={(e) => {
                        setPerplexity({
                            apiKey: e.target.value,
                        });
                    }}
                />
            </div>
            <div className='space-y-0.5'>
                <p className='px-1 text-sm'>Perplexity Endpoint</p>
                <Input
                    type='text'
                    placeholder='https://api.perplexity.ai/'
                    value={perplexity?.endpoint}
                    onChange={(e) => {
                        setPerplexity({
                            endpoint: e.target.value,
                        });
                    }}
                />
            </div>
        </div>
    );
};
