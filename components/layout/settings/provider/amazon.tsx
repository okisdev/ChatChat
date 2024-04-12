import { Input } from '@/components/ui/custom/input';
import { ProviderSetting } from '@/types/settings';

export const AmazonProvider = ({ amazon, setAmazon }: { amazon: ProviderSetting['Amazon'] | null; setAmazon: (value: ProviderSetting['Amazon'] | null) => void }) => {
    return (
        <div className='space-y-2'>
            <div className='space-y-0.5'>
                <p className='px-1 text-sm'>Amazon API Key</p>
                <Input
                    type='text'
                    placeholder='sk-xxxx'
                    value={amazon?.apiKey}
                    onChange={(e) => {
                        setAmazon({
                            apiKey: e.target.value,
                        });
                    }}
                />
            </div>
            <div className='space-y-0.5'>
                <p className='px-1 text-sm'>Amazon Secret Key</p>
                <Input
                    type='text'
                    placeholder='sk-xxxx'
                    value={amazon?.secretKey}
                    onChange={(e) => {
                        setAmazon({
                            secretKey: e.target.value,
                        });
                    }}
                />
            </div>
            <div className='space-y-0.5'>
                <p className='px-1 text-sm'>Amazon Region</p>
                <Input
                    type='text'
                    placeholder='sk-xxxx'
                    value={amazon?.region}
                    onChange={(e) => {
                        setAmazon({
                            region: e.target.value,
                        });
                    }}
                />
            </div>
        </div>
    );
};
