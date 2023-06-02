import Link from 'next/link';

import { useTranslations } from 'next-intl';

import { FiClipboard } from 'react-icons/fi';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

import { claudeModelConfig } from '@/config/provider/claude.config';

const ClaudeServiceProvider = ({
    claudeAPIKey,
    claudeAPIModel,
    claudeAPITemperature,
    setClaudeAPIKey,
    setClaudeAPIModel,
    setClaudeAPITemperature,
}: {
    claudeAPIKey: string;
    claudeAPIModel: string;
    claudeAPITemperature: number;
    setClaudeAPIKey: (claudeAPIKey: string) => void;
    setClaudeAPIModel: (claudeAPIModel: OpenAIModel) => void;
    setClaudeAPITemperature: (claudeAPITemperature: number) => void;
}) => {
    const t = useTranslations('landing');

    return (
        <>
            <Alert>
                <FiClipboard />
                <AlertTitle>{t('Goodwill Reminders')}</AlertTitle>
                <AlertDescription>
                    You need to provide the{' '}
                    <Link href='https://console.anthropic.com/account/keys' target='_blank' className='underline'>
                        Claude API Key
                    </Link>{' '}
                    to use this service. Sign up for waitlist{' '}
                    <Link href='https://www.anthropic.com/product' target='_blank' className='underline'>
                        here
                    </Link>
                    .
                </AlertDescription>
            </Alert>
            <div className='h-full space-y-3'>
                <div className='space-y-1'>
                    <Label className='font-normal'>API Model</Label>
                    <Select value={claudeAPIModel} onValueChange={(value) => setClaudeAPIModel(value as OpenAIModel)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {claudeModelConfig.map((model, index) => {
                                return (
                                    <SelectItem key={index} value={model.model} className='text-sm'>
                                        {model.model}
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className='space-y-1'>
                <Label className='font-normal'>API Key</Label>
                <Input placeholder='EXAMPLE' value={claudeAPIKey} onChange={(e) => setClaudeAPIKey(e.target.value)} />
            </div>
            <div className='space-y-3'>
                <Label className='font-normal'>Temperature: {claudeAPITemperature}</Label>
                <div className='flex flex-col space-y-1'>
                    <Slider max={1} step={0.1} value={[claudeAPITemperature]} onValueChange={([e]) => setClaudeAPITemperature(e)} />
                    <div className='flex justify-between text-xs text-gray-500'>
                        <p>{t('Stable')}</p>
                        <p>{t('Standard')}</p>
                        <p>{t('Creative')}</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ClaudeServiceProvider;
