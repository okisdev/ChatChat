interface customConfig {
    InputArea: {
        banner: string;
    };
    Auth: {
        footer: string;
    };
    Dashboard: {
        side: string;
        footer: string;
    };
}

export const customConfig: customConfig = {
    InputArea: {
        banner: 'Copyright © Chat Chat. Open-Source. AGPL-3.0 License.',
    },
    Auth: {
        footer: '© Chat Chat. Open-Source. AGPL-3.0 License.',
    },
    Dashboard: {
        side: '© Chat Chat',
        footer: '© Chat Chat. Open-Source. AGPL-3.0 License.',
    },
};
