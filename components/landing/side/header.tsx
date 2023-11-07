'use client';

import { useTranslations } from 'next-intl';

import { siteConfig } from '@/config/site.config';

const SideHeader = () => {
    const t = useTranslations('');

    return (
        <div className='flex items-center justify-between border-b px-1'>
            <div className='p-1'>
                <p className='gradient-flow bg-gradient-to-r bg-clip-text text-lg font-semibold leading-none text-transparent md:text-xl'>{siteConfig.title}</p>
                <p className='text-xs font-medium'>{t(siteConfig.description)}</p>
            </div>
        </div>
    );
};

export default SideHeader;
