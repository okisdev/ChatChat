import { Input } from '@/components/ui/custom/input';
import { GeneralProviderSettings } from '@/types/settings';

export const FireworksProvider = ({
    fireworks,
    setFireworks,
}: {
    fireworks: GeneralProviderSettings['Fireworks'] | null;
    setFireworks: (value: GeneralProviderSettings['Fireworks'] | null) => void;
}) => {
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
