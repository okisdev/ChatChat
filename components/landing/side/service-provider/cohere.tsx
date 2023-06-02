import Link from 'next/link';

import { useTranslations } from 'next-intl';

import { FiClipboard } from 'react-icons/fi';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

import { cohereModelConfig } from '@/config/provider/cohere.config';

const CohereServiceProvider = ({
    cohereAPIKey,
    cohereModel,
    setCohereAPIKey,
    setCohereModel,
}: {
    cohereAPIKey: string;
    cohereModel: string;
    setCohereAPIKey: (cohereAPIKey: string) => void;
    setCohereModel: (cohereModel: string) => void;
}) => {
    const t = useTranslations('landing');

    return (
        <>
            <Alert>
                <FiClipboard />
                <AlertTitle>{t('Goodwill Reminders')}</AlertTitle>
                <AlertDescription>
                    You need to provide the{' '}
                    <Link href='https://dashboard.cohere.ai/api-keys' target='_blank' className='underline'>
                        Cohere API Key
                    </Link>{' '}
                    to use this service.
                </AlertDescription>
            </Alert>
            <div className='space-y-1'>
                <Label className='px-1 font-medium'>Model</Label>
                <Select value={cohereModel} onValueChange={(value) => setCohereModel(value)}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {cohereModelConfig.map((model, index) => {
                            return (
                                <SelectItem key={index} value={model.model} className='text-sm'>
                                    {model.model}
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
            </div>
            <div className='space-y-1'>
                <Label className='px-1 font-medium'>API Key</Label>
                <Input placeholder='tlYBXue......' value={cohereAPIKey} onChange={(e) => setCohereAPIKey(e.target.value)} />
            </div>
        </>
    );
};

export default CohereServiceProvider;
