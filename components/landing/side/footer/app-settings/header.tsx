'use client';

import { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import { toast } from 'react-hot-toast';

import store from '@/hooks/store';
import { useAtom } from 'jotai';

import Tippy from '@tippyjs/react';

import { MdInfoOutline } from 'react-icons/md';
import { BiBrush, BiExport, BiImport } from 'react-icons/bi';

import { Label } from '@/components/ui/label';

import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import GlobalButton from '@/components/global/button';

const AppSettingsHeader = () => {
    const t = useTranslations('');

    const [isSendKeyEnter, setIsSendKeyEnter] = useAtom(store.isSendKeyEnterAtom);

    const [enableAutoSpeech, setEnableAutoSpeech] = useAtom(store.autoSpeechAtom);

    const [enableUserMarkdownRender, setEnableUserMarkdownRender] = useAtom(store.enableUserMarkdownRenderAtom);

    const [enableAutoScroll, setEnableAutoScroll] = useAtom(store.isAutoScrollAtom);

    const [histories, setHistories] = useState<HistoryProps[]>([]);

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

    const handleSwitchAutoScroll = () => {
        setEnableAutoScroll(!enableAutoScroll);
        toast.success(`${t('AutoScroll')} ${enableAutoScroll ? t('disabled') : t('enabled')}`);
    };

    useEffect(() => {
        const updateHistories = () => {
            const conversationKeys = Object.keys(localStorage).filter((key) => key.startsWith('histories-'));

            const conversationValues = conversationKeys.map((key) => {
                const chatValue = localStorage.getItem(key);
                return JSON.parse(chatValue || '{}');
            });

            setHistories(conversationValues);
        };

        updateHistories();

        window.addEventListener('localStorageUpdated', updateHistories);

        return () => {
            window.removeEventListener('localStorageUpdated', updateHistories);
        };
    }, []);

    const handleExportHistory = () => {
        const data = histories.map((item) => {
            return item;
        });

        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const download = document.createElement('a');

        download.href = url;
        download.download = `chatchat-history-${new Date().getTime()}.json`;
        download.click();
    };

    const handleImportHistory = () => {
        const input = document.createElement('input');

        input.type = 'file';
        input.accept = 'application/json';
        input.click();

        input.onchange = () => {
            const file = input.files?.[0];

            if (file) {
                const reader = new FileReader();

                reader.readAsText(file, 'UTF-8');

                reader.onload = (e) => {
                    const result = e.target?.result;

                    if (result) {
                        const data = JSON.parse(result as string);

                        if (data) {
                            data.forEach((item: HistoryProps) => {
                                localStorage.setItem(`histories-${item.type}-${item.id}`, JSON.stringify(item));
                            });

                            toast.success(t('Imported history successfully!'));
                        }
                    }
                };
            }

            const updateEvent = new CustomEvent('localStorageUpdated');
            window.dispatchEvent(updateEvent);
        };
    };

    const handleClearHistory = () => {
        const chatKeys = Object.keys(localStorage).filter((key) => key.startsWith('histories-'));

        chatKeys.forEach((key) => {
            localStorage.removeItem(key);
        });

        setHistories([]);

        toast.success(t('Cleared history successfully!'));

        const updateEvent = new CustomEvent('localStorageUpdated');
        window.dispatchEvent(updateEvent);
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
            <div className='flex items-center space-x-1'>
                <Switch checked={enableAutoScroll} onCheckedChange={handleSwitchAutoScroll} />
                <Label className='px-1 font-normal'>{t('AutoScroll to end of message')}</Label>
            </div>
            <Separator />
            <div className='flex flex-row items-center space-x-3'>
                <p>{t('History Record')}</p>
                <div className='flex space-x-3'>
                    <GlobalButton icon={<BiExport />} text={t('Export')} onClick={handleExportHistory} />
                    <GlobalButton icon={<BiImport />} text={t('Import')} onClick={handleImportHistory} />
                    <GlobalButton icon={<BiBrush />} text={t('Clear')} onClick={handleClearHistory} />
                </div>
            </div>
        </div>
    );
};

export default AppSettingsHeader;
