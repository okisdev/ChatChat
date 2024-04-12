import { GrCircleInformation } from 'react-icons/gr';
import { MdOutlineInfo } from 'react-icons/md';
import Tippy from '@tippyjs/react';
import { useAtom } from 'jotai';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Switch } from '@/components/ui/custom/switch';
import { Textarea } from '@/components/ui/custom/textarea';
import { Label } from '@/components/ui/label';
import store from '@/hooks/store';
import { AdvancedSettings, Preference } from '@/types/settings';

export const GeneralSettings = ({
    generalPreferences,
    setGeneralPreferences,
    advancedSettings,
    setAdvancedSettings,
}: {
    generalPreferences: Preference;
    setGeneralPreferences: (value: Preference) => void;
    advancedSettings: AdvancedSettings;
    setAdvancedSettings: (value: AdvancedSettings) => void;
}) => {
    const t = useTranslations();

    const [conversations, setConversations] = useAtom(store.conversationsAtom);
    const [conversationSettings, setConversationSettings] = useAtom(store.conversationSettingsAtom);

    const onExportConversations = () => {
        const data = JSON.stringify(conversations);
        const blob = new Blob([data], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'chatchat-conversations.json';
        a.click();
    };

    const onDeleteConversations = () => {
        setConversations([]);

        toast.success(t('all_conversations_deleted'));
    };

    return (
        <div className='space-y-5'>
            <div className='w-full space-y-3'>
                <div className='space-y-2 rounded-xl bg-neutral-100/70 pt-3 dark:bg-neutral-600'>
                    <p className='px-4 text-sm'>{t('preferences')}</p>
                    <div className='space-y-3 rounded-xl bg-neutral-200/30 p-3 dark:bg-neutral-700/50'>
                        <div className='flex items-center space-x-2'>
                            <Switch
                                id='enter-send'
                                checked={generalPreferences.enterSend}
                                onCheckedChange={(checked) => {
                                    setGeneralPreferences({
                                        ...generalPreferences,
                                        enterSend: checked,
                                    });
                                }}
                            />
                            <Label htmlFor='enter-send'>{t('send_message_with_enter')}</Label>
                        </div>
                        <div className='flex items-center space-x-2'>
                            <Switch
                                id='use-markdown'
                                checked={generalPreferences.useMarkdown}
                                onCheckedChange={(checked) => {
                                    setGeneralPreferences({
                                        ...generalPreferences,
                                        useMarkdown: checked,
                                    });
                                }}
                            />
                            <Label htmlFor='use-markdown'>{t('render_message_with_markdown')}</Label>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full space-y-3'>
                <div className='space-y-2 rounded-xl bg-neutral-100/70 pt-3 dark:bg-neutral-600'>
                    <p className='px-4 text-sm'>{t('conversation')}</p>
                    <div className='space-y-3 rounded-xl bg-neutral-200/30 p-3 dark:bg-neutral-700/50'>
                        <div className='flex items-center justify-between space-x-2'>
                            <Label htmlFor='conversation-records'>{t('conversation_records')}</Label>
                            <div className='space-x-3'>
                                <button onClick={onExportConversations} className='rounded-md bg-neutral-400/30 px-1 py-0.5 text-xs text-neutral-900/90'>
                                    {t('export')}
                                </button>
                                <button onClick={onDeleteConversations} className='rounded-md bg-red-500/80 px-1 py-0.5 text-xs text-white'>
                                    {t('delete')}
                                </button>
                            </div>
                        </div>
                        <div className='flex items-center justify-between space-x-2'>
                            <div className='flex items-center space-x-1'>
                                <Label htmlFor='system-prompt'>{t('system_prompt')}</Label>
                                <Tippy content={t('system_prompt_may_not_works_for_some_models')}>
                                    <button>
                                        <GrCircleInformation />
                                    </button>
                                </Tippy>
                            </div>
                            <div className='space-x-3'>
                                <Textarea
                                    maxLength={300}
                                    value={conversationSettings.systemPrompt ?? ''}
                                    onChange={(e) => setConversationSettings({ ...conversationSettings, systemPrompt: e.target.value })}
                                    className='h-6 max-h-36'
                                />
                            </div>
                        </div>
                        {/* <div className='flex items-center justify-between space-x-2'>
                            <Label htmlFor='number-of-context'>{t('number_of_context')}</Label>
                            <Select
                                value={conversationSettings.numOfContext.toString()}
                                onValueChange={(value) => {
                                    setConversationSettings({
                                        ...conversationSettings,
                                        numOfContext: parseInt(value),
                                    });
                                }}
                            >
                                <SelectTrigger className='h-6 w-28'>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='0'>{t('no_limit')}</SelectItem>
                                    <SelectItem value='1'>1</SelectItem>
                                    <SelectItem value='3'>3</SelectItem>
                                    <SelectItem value='5'>5</SelectItem>
                                    <SelectItem value='7'>7</SelectItem>
                                    <SelectItem value='9'>9</SelectItem>
                                </SelectContent>
                            </Select>
                        </div> */}
                    </div>
                </div>
            </div>
            <div className='w-full space-y-3'>
                <div className='space-y-2 rounded-xl bg-neutral-100/70 pt-3 dark:bg-neutral-600'>
                    <p className='px-4 text-sm'>{t('advanced')}</p>
                    <div className='space-y-3 rounded-xl bg-neutral-200/30 p-3 dark:bg-neutral-700/50'>
                        <div className='flex items-center space-x-2'>
                            <Switch
                                id='unified-endpoint'
                                checked={advancedSettings.unifiedEndpoint}
                                onCheckedChange={(checked) => {
                                    setAdvancedSettings({
                                        ...advancedSettings,
                                        unifiedEndpoint: checked,
                                    });
                                }}
                            />
                            <Label htmlFor='unified-endpoint'>{t('use_unified_endpoint')}</Label>
                        </div>
                        <div className='flex items-center space-x-2'>
                            <Switch
                                id='stream-messages'
                                checked={advancedSettings.streamMessages}
                                onCheckedChange={(checked) => {
                                    setAdvancedSettings({
                                        ...advancedSettings,
                                        streamMessages: checked,
                                    });
                                }}
                            />
                            <Label htmlFor='stream-messages'>
                                {t('stream_messages')}{' '}
                                <Link href='https://developer.mozilla.org/docs/Web/API/Server-sent_events/Using_server-sent_events' target='_blank' className='underline'>
                                    (SSE)
                                </Link>
                            </Label>
                            <Tippy content={t('may_not_works_for_some_models')}>
                                <button>
                                    <MdOutlineInfo />
                                </button>
                            </Tippy>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
