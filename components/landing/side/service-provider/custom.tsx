import { useTranslations } from 'next-intl';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const CustomServiceProvider = () => {
    const t = useTranslations('landing');

    return (
        <>
            <div className='space-y-1'>
                <Label>API Key</Label>
                <Input placeholder='fk...' />
            </div>
            <div className='space-y-1'>
                <Label>API Endpoint</Label>
                <Input placeholder='https://api.example.com' />
            </div>
        </>
    );
};

export default CustomServiceProvider;
