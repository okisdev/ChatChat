import Link from 'next/link';

import { useTranslations } from 'next-intl';

import { FiClipboard } from 'react-icons/fi';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

import { huggingFaceModelConfig } from '@/config/provider/huggingface.config';

const HuggingFaceServiceProvider = ({
    accessToken,
    huggingFaceModel,
    setAccessToken,
    setHuggingFaceModel,
}: {
    accessToken: string;
    huggingFaceModel: string;
    setAccessToken: (accessToken: string) => void;
    setHuggingFaceModel: (huggingFaceModel: string) => void;
}) => {
    const t = useTranslations('landing');

    return (
        <>
            <Alert>
                <FiClipboard />
                <AlertTitle>{t('Goodwill Reminders')}</AlertTitle>
                <AlertDescription>
                    You need to provide the{' '}
                    <Link href='https://huggingface.co/settings/tokens' target='_blank' className='underline'>
                        Hugging Face Access Token
                    </Link>{' '}
                    to use this service.
                </AlertDescription>
            </Alert>
            <div className='space-y-1'>
                <Label className='px-1 font-medium'>Model</Label>
                <Select value={huggingFaceModel} onValueChange={(value) => setHuggingFaceModel(value)}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {huggingFaceModelConfig.map((model, index) => {
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
                <Label className='px-1 font-medium'>Access Token</Label>
                <Input placeholder='hf_xxxxxx' value={accessToken} onChange={(e) => setAccessToken(e.target.value)} />
            </div>
        </>
    );
};

export default HuggingFaceServiceProvider;
