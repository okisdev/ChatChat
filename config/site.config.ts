// Self Config your site for here

import { GrGithub, GrValidate, GrNodes, GrMail, GrCompass } from 'react-icons/gr';

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
        title: 'Harry Yep',
        value: 'harry-yep',
        url: 'https://harryyep.com',
        icon: GrCompass,
    },
];
