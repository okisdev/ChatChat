import { Input } from '@/components/ui/custom/input';
import { ProviderSetting } from '@/types/settings';

export const MistralProvider = ({ mistral, setMistral }: { mistral: ProviderSetting['Mistral'] | null; setMistral: (value: ProviderSetting['Mistral'] | null) => void }) => {
    return (
        <div className='space-y-2'>
            <div className='space-y-0.5'>
                <p className='px-1 text-sm'>Mistral API Key</p>
                <Input
                    type='text'
                    placeholder='sk-xxxx'
                    value={mistral?.apiKey}
                    onChange={(e) => {
                        setMistral({
                            apiKey: e.target.value,
                        });
                    }}
                />
            </div>
        </div>
    );
};
