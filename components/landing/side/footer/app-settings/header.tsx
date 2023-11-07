'use client';

import { useTranslations } from 'next-intl';

import { toast } from 'react-hot-toast';

import store from '@/hooks/store';
import { useAtom } from 'jotai';

import Tippy from '@tippyjs/react';

import { MdInfoOutline } from 'react-icons/md';

import { Label } from '@/components/ui/label';

import { Switch } from '@/components/ui/switch';

const AppSettingsHeader = () => {
    const t = useTranslations('');

    const [isSendKeyEnter, setIsSendKeyEnter] = useAtom(store.isSendKeyEnterAtom);

    const [enableAutoSpeech, setEnableAutoSpeech] = useAtom(store.autoSpeechAtom);

    const [enableUserMarkdownRender, setEnableUserMarkdownRender] = useAtom(store.enableUserMarkdownRenderAtom);

    const handleSwitchAutoSpeech = () => {
        setEnableAutoSpeech(!enableAutoSpeech);
        toast.success(`${t('Auto Speech')} ${enableAutoSpeech ? t('disabled') : t('enabled')}`);
    };

    const handleSwitchUserMarkdownRender = () => {
        setEnableUserMarkdownRender(!enableUserMarkdownRender);
        toast.success(`${t('Render user message using Markdown')} ${enableUserMarkdownRender ? t('disabled') : t('enabled')}`);
    };

    const handleSwitchSendMessageKey = () => {
        setIsSendKeyEnter(!isSendKeyEnter);
        toast.success(`${t('Send message key changed to')} ${isSendKeyEnter ? 'Enter' : 'Shift + Enter'}`);
    };

    return (
        <div className='space-y-3'>
            <div className='flex items-center space-x-1'>
                <Switch checked={isSendKeyEnter} onCheckedChange={handleSwitchSendMessageKey} />
                <Label className='px-1 font-normal'>{t('Send Message using Enter Key')}</Label>
                <Tippy content={`Current: ${isSendKeyEnter ? 'Enter' : 'Shift + Enter'}`}>
                    <button>
                        <MdInfoOutline className='text-lg' />
                    </button>
                </Tippy>
            </div>
            <div className='flex items-center space-x-1'>
                <Switch checked={enableAutoSpeech} onCheckedChange={handleSwitchAutoSpeech} />
                <Label className='px-1 font-normal'>{t('Auto Speech')}</Label>
                <Tippy content={`${t('Auto read out all replies')}`}>
                    <button>
                        <MdInfoOutline className='text-lg' />
                    </button>
                </Tippy>
            </div>
            <div className='flex items-center space-x-1'>
                <Switch checked={enableUserMarkdownRender} onCheckedChange={handleSwitchUserMarkdownRender} />
                <Label className='px-1 font-normal'>{t('Render user message using Markdown')}</Label>
            </div>
        </div>
    );
};

export default AppSettingsHeader;
