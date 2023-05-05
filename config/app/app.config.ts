import { TbContrast, TbMoonFilled, TbSunFilled } from 'react-icons/tb';

interface ThemeProps {
    name: string;
    value: string;
    icon: React.ElementType;
}

interface LanguageProps {
    value: string;
    name: string;
}

export const themeList: ThemeProps[] = [
    {
        name: 'Light',
        value: 'light',
        icon: TbSunFilled,
    },
    {
        name: 'Dark',
        value: 'dark',
        icon: TbMoonFilled,
    },
    {
        name: 'System',
        value: 'system',
        icon: TbContrast,
    },
];

export const languageList: LanguageProps[] = [
    {
        value: 'zh-CN',
        name: '简体中文',
    },
    {
        value: 'zh-HK',
        name: '繁体中文',
    },
    {
        value: 'en',
        name: 'English',
    },
];
