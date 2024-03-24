import { Input } from '@/components/ui/custom/input';
import { GeneralProviderSettings } from '@/types/settings';

export const OpenAIProvider = ({ openAI, setOpenAI }: { openAI: GeneralProviderSettings['OpenAI'] | null; setOpenAI: (value: GeneralProviderSettings['OpenAI'] | null) => void }) => {
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
                            endpoint: openAI?.endpoint || '',
                        });
                    }}
                />
            </div>
            <div className='space-y-0.5'>
                <p className='px-1 text-sm'>OpenAI Endpoint</p>
                <Input
                    type='text'
                    placeholder='https://api.openai.com/v1'
                    value={openAI?.endpoint}
                    onChange={(e) => {
                        setOpenAI({
                            ...openAI,
                            apiKey: openAI?.apiKey || '',
                            endpoint: e.target.value,
                        });
                    }}
                />
            </div>
        </div>
    );
};
