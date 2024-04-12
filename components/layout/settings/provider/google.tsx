import { Input } from '@/components/ui/custom/input';
import { ProviderSetting } from '@/types/settings';

export const GoogleProvider = ({ google, setGoogle }: { google: ProviderSetting['Google'] | null; setGoogle: (value: ProviderSetting['Google'] | null) => void }) => {
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
