import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export const AdvancedSettings = () => {
    return (
        <div className='w-full space-y-3'>
            <div className='space-y-2 rounded-xl bg-neutral-100/70 pt-3'>
                <p className='px-4 text-sm'>Preference</p>
                <div className='space-y-3 rounded-xl bg-neutral-200/30 p-3'>
                    <div className='flex items-center space-x-2'>
                        <Switch id='unified-endpoint' />
                        <Label htmlFor='enter-send'>Use Unified Endpoint</Label>
                    </div>
                </div>
            </div>
        </div>
    );
};
