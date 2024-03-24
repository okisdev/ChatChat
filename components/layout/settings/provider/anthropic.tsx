import { GeneralProviderSettings } from '@/types/settings';
import { Input } from '@/components/ui/custom/input';

export const AnthropicProvider = ({
    anthropic,
    setAnthropic,
}: {
    anthropic: GeneralProviderSettings['Anthropic'] | null;
    setAnthropic: (value: GeneralProviderSettings['Anthropic'] | null) => void;
}) => {
    return (
        <div className='space-y-2'>
            <div className='space-y-0.5'>
                <p className='px-1 text-sm'>Anthropic API Key</p>
                <Input
                    type='text'
                    placeholder='sk-xxxx'
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
