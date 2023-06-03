// Self Config your site for here

import { CgInfo } from 'react-icons/cg';
import { GrGithub } from 'react-icons/gr';

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
        title: 'Harry Yep',
        value: 'harry-yep',
        url: 'https://harryyep.com',
        icon: CgInfo,
    },
];
