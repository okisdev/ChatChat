import { Input } from '@/components/ui/custom/input';
import { ProviderSetting } from '@/types/settings';

export const CohereProvider = ({ cohere, setCohere }: { cohere: ProviderSetting['Cohere'] | null; setCohere: (value: ProviderSetting['Cohere'] | null) => void }) => {
    return (
        <div className='space-y-2'>
            <div className='space-y-0.5'>
                <p className='px-1 text-sm'>Cohere API Key</p>
                <Input
                    type='text'
                    placeholder='sk-xxxx'
                    value={cohere?.apiKey}
                    onChange={(e) => {
                        setCohere({
                            apiKey: e.target.value,
                        });
                    }}
                />
            </div>
        </div>
    );
};
