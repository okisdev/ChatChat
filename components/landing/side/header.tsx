import Image from 'next/image';

import { useTranslations } from 'next-intl';

import { siteConfig } from '@/config/site.config';

const SideHeader = () => {
    const t = useTranslations('');

    return (
        <div className='flex items-center justify-start space-x-1 border-b px-2 py-1'>
            <Image src='/OpenAI.svg' alt='logo' width={36} height={36} className='fill-black dark:fill-white' />
            <div className='p-1'>
                <p className='gradient-flow bg-gradient-to-r bg-clip-text text-lg font-semibold leading-none text-transparent md:text-xl'>{siteConfig.title}</p>
                <p className='text-xs font-normal'>{t(siteConfig.description)}</p>
            </div>
        </div>
    );
};

export default SideHeader;
