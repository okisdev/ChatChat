interface serviceProviderProps {
    name: string;
    value: ServiceProviderProps;
    status: number;
}

export const serviceProviderList: serviceProviderProps[] = [
    {
        name: 'Azure',
        value: 'Azure',
        status: 1,
    },
    {
        name: 'Claude',
        value: 'Claude',
        status: 2,
    },
    {
        name: 'Cohere',
        value: 'Cohere',
        status: 1,
    },
    {
        name: 'Hugging Face',
        value: 'Hugging Face',
        status: 1,
    },
    {
        name: 'OpenAI',
        value: 'OpenAI',
        status: 1,
    },
    {
        name: 'Team',
        value: 'Team',
        status: 1,
    },
    {
        name: 'Custom',
        value: 'Custom',
        status: 0,
    },
    {
        name: 'Extension',
        value: 'Extension',
        status: 0,
    },
];
