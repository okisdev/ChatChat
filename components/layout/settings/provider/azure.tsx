import { Input } from '@/components/ui/custom/input';
import { ProviderSetting } from '@/types/settings';

export const AzureProvider = ({ azure, setAzure }: { azure: ProviderSetting['Azure'] | null; setAzure: (value: ProviderSetting['Azure'] | null) => void }) => {
    return (
        <div className='space-y-2'>
            <div className='space-y-0.5'>
                <p className='px-1 text-sm'>Azure API Key</p>
                <Input
                    type='text'
                    placeholder='sk-xxxx'
                    value={azure?.apiKey}
                    onChange={(e) => {
                        setAzure({
                            apiKey: e.target.value,
                        });
                    }}
                />
            </div>
            <div className='space-y-0.5'>
                <p className='px-1 text-sm'>Azure Endpoint</p>
                <Input
                    type='text'
                    placeholder='https://api.openai.com/v1'
                    value={azure?.endpoint}
                    onChange={(e) => {
                        setAzure({
                            endpoint: e.target.value,
                        });
                    }}
                />
            </div>
            <div className='space-y-0.5'>
                <p className='px-1 text-sm'>Azure Deployment Name</p>
                <Input
                    type='text'
                    placeholder='https://api.openai.com/v1'
                    value={azure?.deploymentName}
                    onChange={(e) => {
                        setAzure({
                            deploymentName: e.target.value,
                        });
                    }}
                />
            </div>
        </div>
    );
};
