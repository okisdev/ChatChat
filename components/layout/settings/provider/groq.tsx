import { Input } from '@/components/ui/custom/input';
import { ProviderSetting } from '@/types/settings';

export const GroqProvider = ({ groq, setGroq }: { groq: ProviderSetting['Groq'] | null; setGroq: (value: ProviderSetting['Groq'] | null) => void }) => {
    return (
        <div className='space-y-2'>
            <div className='space-y-0.5'>
                <p className='px-1 text-sm'>Groq API Key</p>
                <Input
                    type='text'
                    placeholder='gsk_xxxxx'
                    value={groq?.apiKey}
                    onChange={(e) => {
                        setGroq({
                            apiKey: e.target.value,
                        });
                    }}
                />
            </div>
        </div>
    );
};
