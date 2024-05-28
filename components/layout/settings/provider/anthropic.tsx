import { Input } from '@/components/ui/custom/input';
import { ProviderSetting } from '@/types/settings';

export const AnthropicProvider = ({ anthropic, setAnthropic }: { anthropic: ProviderSetting['Anthropic'] | null; setAnthropic: (value: ProviderSetting['Anthropic'] | null) => void }) => {
    return (
        <div className='space-y-2'>
            <div className='space-y-0.5'>
                <p className='px-1 text-sm'>Anthropic API Key</p>
                <Input
                    type='text'
                    placeholder='sk-ant-xxxx'
                    value={anthropic?.apiKey}
                    onChange={(e) => {
                        setAnthropic({
                            apiKey: e.target.value,
                        });
                    }}
                />
            </div>
        </div>
    );
};
