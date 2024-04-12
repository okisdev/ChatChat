import { Input } from '@/components/ui/custom/input';
import { ProviderSetting } from '@/types/settings';

export const FireworksProvider = ({ fireworks, setFireworks }: { fireworks: ProviderSetting['Fireworks'] | null; setFireworks: (value: ProviderSetting['Fireworks'] | null) => void }) => {
    return (
        <div className='space-y-2'>
            <div className='space-y-0.5'>
                <p className='px-1 text-sm'>Fireworks API Key</p>
                <Input
                    type='text'
                    placeholder='sk-xxxx'
                    value={fireworks?.apiKey}
                    onChange={(e) => {
                        setFireworks({
                            apiKey: e.target.value,
                        });
                    }}
                />
            </div>
        </div>
    );
};
