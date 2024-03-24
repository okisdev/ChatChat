import { GeneralProviderSettings } from '@/types/settings';
import { Input } from '@/components/ui/custom/input';

export const GoogleProvider = ({ google, setGoogle }: { google: GeneralProviderSettings['Google'] | null; setGoogle: (value: GeneralProviderSettings['Google'] | null) => void }) => {
    return (
        <div className='space-y-2'>
            <div className='space-y-0.5'>
                <p className='px-1 text-sm'>Google AI Studio API Key</p>
                <Input
                    type='text'
                    placeholder='AIxxxxxxxxx'
                    value={google?.apiKey}
                    onChange={(e) => {
                        setGoogle({
                            apiKey: e.target.value,
                        });
                    }}
                />
            </div>
        </div>
    );
};
