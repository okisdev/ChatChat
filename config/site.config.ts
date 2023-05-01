import { GrGithub, GrValidate, GrNodes, GrMail } from 'react-icons/gr';

interface siteConfig {
    title: string;
    description: string;
}

export const siteConfig: siteConfig = {
    title: 'Chat Chat',
    description: 'Unlock next-level conversations with AI',
};

export const sidebarMoreMenu = [
    {
        title: 'GitHub',
        value: 'github',
        url: 'https://github.com/okisdev/ChatChat',
        icon: GrGithub,
    },
    {
        title: 'Privacy',
        value: 'privacy',
        url: 'https://www.harrly.com/privacy-policy',
        icon: GrValidate,
    },
    {
        title: 'Cookies',
        value: 'cookies',
        url: 'https://www.harrly.com/cookies',
        icon: GrNodes,
    },
    {
        title: 'Contact',
        value: 'contact',
        url: 'mailto:hi@okis.dev',
        icon: GrMail,
    },
];
