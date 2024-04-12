import { Input } from '@/components/ui/custom/input';
import { ProviderSetting } from '@/types/settings';

export const OpenAIProvider = ({ openAI, setOpenAI }: { openAI: ProviderSetting['OpenAI'] | null; setOpenAI: (value: ProviderSetting['OpenAI'] | null) => void }) => {
    return (
        <div className='space-y-2'>
            <div className='space-y-0.5'>
                <p className='px-1 text-sm'>OpenAI API Key</p>
                <Input
                    type='text'
                    placeholder='sk-xxxx'
                    value={openAI?.apiKey}
                    onChange={(e) => {
                        setOpenAI({
                            ...openAI,
                            apiKey: e.target.value,
                        });
                    }}
                />
            </div>
            <div className='space-y-0.5'>
                <p className='px-1 text-sm'>OpenAI Endpoint</p>
                <Input
                    type='text'
                    placeholder='https://api.openai.com/v1'
                    value={openAI?.endpoint ?? 'https://api.openai.com/v1'}
                    onChange={(e) => {
                        setOpenAI({
                            ...openAI,
                            endpoint: e.target.value,
                        });
                    }}
                />
            </div>
        </div>
    );
};
