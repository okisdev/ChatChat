import { Input } from '@/components/ui/custom/input';
import { ProviderSetting } from '@/types/settings';

export const HuggingFaceProvider = ({
    huggingFace,
    setHuggingFace,
}: {
    huggingFace: ProviderSetting['HuggingFace'] | null;
    setHuggingFace: (value: ProviderSetting['HuggingFace'] | null) => void;
}) => {
    return (
        <div className='space-y-2'>
            <div className='space-y-0.5'>
                <p className='px-1 text-sm'>HuggingFace API Key</p>
                <Input
                    type='text'
                    placeholder='sk-xxxx'
                    value={huggingFace?.apiKey}
                    onChange={(e) => {
                        setHuggingFace({
                            apiKey: e.target.value,
                        });
                    }}
                />
            </div>
        </div>
    );
};
