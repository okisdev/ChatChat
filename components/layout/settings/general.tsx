import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

import { GeneralPreferences } from '@/types/settings';

export const GeneralSettings = ({ generalPreferences, setGeneralPreferences }: { generalPreferences: GeneralPreferences; setGeneralPreferences: (value: GeneralPreferences) => void }) => {
    return (
        <div className='w-full space-y-3'>
            <div className='space-y-2 rounded-xl bg-neutral-100/70 pt-3'>
                <p className='px-4 text-sm'>Preference</p>
                <div className='space-y-3 rounded-xl bg-neutral-200/30 p-3'>
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
                        <Label htmlFor='enter-send'>Send Message with Enter</Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <Switch
                            id='auto-read'
                            checked={generalPreferences.autoRead}
                            onCheckedChange={(checked) => {
                                setGeneralPreferences({
                                    ...generalPreferences,
                                    autoRead: checked,
                                });
                            }}
                        />
                        <Label htmlFor='auto-read'>Auto Read</Label>
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
                        <Label htmlFor='use-markdown'>Render Message with Markdown</Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <Switch
                            id='auto-scroll'
                            checked={generalPreferences.autoScroll}
                            onCheckedChange={(checked) => {
                                setGeneralPreferences({
                                    ...generalPreferences,
                                    autoScroll: checked,
                                });
                            }}
                        />
                        <Label htmlFor='auto-scroll'>Auto Scroll to End of Conversations</Label>
                    </div>
                </div>
            </div>
        </div>
    );
};
