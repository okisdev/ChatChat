import { useTranslations } from 'next-intl';

import { FiClipboard } from 'react-icons/fi';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const TeamServiceProvider = ({ accessCode, setAccessCode }: { accessCode: string; setAccessCode: (accessCode: string) => void }) => {
    const t = useTranslations('landing');

    return (
        <>
            <Alert>
                <FiClipboard />
                <AlertTitle>{t('Goodwill Reminders')}</AlertTitle>
                <AlertDescription>This is a feature for teams. You can create a team in dashboard. However, this feature is only available for fully setup deployment.</AlertDescription>
            </Alert>
            <div className='space-y-1'>
                <Label>Team Access Code</Label>
                <Input placeholder='Your team code. For example: 625390220.' value={accessCode} onChange={(e) => setAccessCode(e.target.value)} />
            </div>
        </>
    );
};

export default TeamServiceProvider;
