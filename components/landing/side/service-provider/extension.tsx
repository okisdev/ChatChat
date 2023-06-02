import { useTranslations } from 'next-intl';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const ExtensionServiceProvider = ({}: {}) => {
    const t = useTranslations('landing');

    return (
        <>
            <div className='space-y-1'>
                <Label>{t('Entry Point')}</Label>
                <Input placeholder='http://localhost:9999' />
            </div>
        </>
    );
};

export default ExtensionServiceProvider;
