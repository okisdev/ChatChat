import { useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { MdDelete } from 'react-icons/md';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Input } from '@/components/ui/custom/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/custom/select';
import { Provider, Providers } from '@/config/provider';
import { ProviderSetting, SingleCustomSettings } from '@/types/settings';

export const CustomProvider = ({ custom, setCustom }: { custom: ProviderSetting['Custom'] | null; setCustom: (value: ProviderSetting['Custom'] | null) => void }) => {
    const t = useTranslations();

    const [newCustom, setNewCustom] = useState<SingleCustomSettings | null>(null);

    const onAddCustom = () => {
        if (!newCustom) {
            return;
        }

        setCustom(custom && typeof custom[Symbol.iterator] === 'function' ? [...custom, newCustom] : [newCustom]);
    };

    const onDeleteCustom = (index: number) => {
        setCustom(custom?.filter((_, i) => i !== index));
    };

    return (
        <div className='space-y-2'>
            <div className='space-y-0.5'>
                <div className='flex w-full justify-end'>
                    <button className='rounded-md border p-2 transition duration-300 ease-in-out hover:bg-neutral-300/30 focus:outline-none' onClick={onAddCustom}>
                        <IoMdAdd />
                    </button>
                </div>
            </div>
            <div className='space-y-0.5'>
                <p className='px-1 text-sm'>{t('based_provider')}</p>
                <Select
                    defaultValue={Provider.OpenAI}
                    value={newCustom?.basedProvider}
                    onValueChange={(value) => {
                        setNewCustom({ ...newCustom, basedProvider: value as Provider });
                    }}
                >
                    <SelectTrigger className='w-full'>
                        <SelectValue
                            placeholder={
                                <div className='flex flex-row space-x-2'>
                                    <Image src={`/img/${newCustom?.basedProvider}.png`} alt={newCustom?.basedProvider ?? ''} width={20} height={20} />
                                    <p className='text-sm'>{newCustom?.basedProvider}</p>
                                </div>
                            }
                        />
                    </SelectTrigger>
                    <SelectContent>
                        {Providers.filter((provider) => provider.name !== 'Custom')
                            .filter((provider) => provider.name !== 'Amazon' && provider.name !== 'Azure')
                            .toSorted((a, b) => a.name.localeCompare(b.name))
                            .map((provider) => (
                                <SelectItem key={provider.id} value={provider.name}>
                                    <div className='flex flex-row space-x-2'>
                                        <Image src={`/img/${provider.name}.png`} alt={provider.name} width={20} height={20} />
                                        <p className='text-sm'>{provider.name}</p>
                                    </div>
                                </SelectItem>
                            ))}
                    </SelectContent>
                </Select>
            </div>
            <div className='space-y-0.5'>
                <p className='px-1 text-sm'>{t('custom_api_key')}</p>
                <Input
                    type='text'
                    placeholder='sk-or-xxx'
                    value={newCustom?.apiKey}
                    onChange={(e) => {
                        setNewCustom({
                            ...newCustom,
                            apiKey: e.target.value,
                        });
                    }}
                />
            </div>
            <div className='space-y-0.5'>
                <p className='px-1 text-sm'>{t('custom_api_endpoint')}</p>
                <Input
                    type='text'
                    placeholder='https://openrouter.ai/api/v1'
                    value={newCustom?.endpoint}
                    onChange={(e) => {
                        setNewCustom({
                            ...newCustom,
                            endpoint: e.target.value,
                        });
                    }}
                />
            </div>
            <div className='space-y-0.5'>
                <p className='px-1 text-sm'>{t('custom_model')}</p>
                <Input
                    type='text'
                    placeholder='openai/gpt-3.5-turbo'
                    value={newCustom?.model}
                    onChange={(e) => {
                        setNewCustom({
                            ...newCustom,
                            model: e.target.value,
                        });
                    }}
                />
            </div>
            {custom && custom.length > 0 && (
                <div className='w-full space-y-3 overflow-auto'>
                    <div className='border-b' />
                    <div className='space-y-0.5 overflow-scroll'>
                        <p className='px-1 text-sm'>{t('saved_custom_model')}</p>
                    </div>
                    <div className='space-y-1'>
                        {custom?.map((c, index) => (
                            <div key={index} className='flex items-center justify-between rounded-md border p-2'>
                                <div className='flex items-center space-x-3'>
                                    <p className='text-sm'>{c.model}</p>
                                    <div className='flex items-center space-x-1 rounded-md bg-neutral-600/30 px-2 py-1'>
                                        <Image src={`/img/${c.basedProvider}.png`} alt={c.basedProvider!} width={16} height={16} />
                                        <p className='text-sm'>{c.basedProvider}</p>
                                    </div>
                                </div>
                                <button
                                    className='rounded-md border p-1 transition duration-300 ease-in-out hover:bg-red-300/30 focus:outline-none'
                                    onClick={() => {
                                        onDeleteCustom(index);
                                    }}
                                >
                                    <MdDelete className='text-red-500' />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
