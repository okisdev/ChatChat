'use client';

import { useState } from 'react';

import Link from 'next/link';

import { useTranslations } from 'next-intl';

import { signIn } from 'next-auth/react';

import { toast } from 'react-hot-toast';

import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const AuthForm = ({ login }: { login: boolean }) => {
    const t = useTranslations('auth');

    const [email, setEmail] = useState<string>('');

    const handleEmailSubmit = async () => {
        if (!email) {
            return toast.error('Email is required');
        }

        if (!email.includes('@')) {
            return toast.error('Invalid email');
        }

        const emailSignIn = await signIn('email', {
            email: email,
            redirect: false,
            callbackUrl: '/profile',
        });

        if (emailSignIn?.error) {
            return toast.error('Failed to send email');
        }

        toast.success('Email sent. Please check your inbox.');
    };

    return (
        <div className='w-72 space-y-10'>
            <div className='flex flex-col items-center'>
                {login ? (
                    <>
                        <p className='text-xl font-bold'>{t('Sign In')}</p>
                        <p className='text-sm'>
                            {t('New User?')}{' '}
                            <Link href={'/register'} className='font-medium text-blue-800 underline dark:text-sky-400'>
                                {t('Sign up')}
                            </Link>
                        </p>
                    </>
                ) : (
                    <>
                        <p className='text-xl font-bold'>{t('Register')}</p>
                        <p className='text-sm'>
                            {t('Already have an account with us?')}{' '}
                            <Link href={'/login'} className='font-medium text-blue-800 underline'>
                                {t('Log In')}
                            </Link>
                        </p>
                    </>
                )}
            </div>
            <div className='flex flex-col space-y-2' onSubmit={handleEmailSubmit}>
                <Input
                    placeholder='john@example.com'
                    type='email'
                    autoCapitalize='none'
                    autoComplete='email'
                    autoCorrect='off'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='dark:bg-stone-600'
                />
                <Button variant='default' onClick={handleEmailSubmit}>
                    {t('Sign In With Email')}
                </Button>
            </div>
            {/* <div className='relative'>
                <div className='absolute inset-0 flex items-center' aria-hidden='true'>
                    <div className='w-full border-t border-gray-300'></div>
                </div>
                <div className='relative flex justify-center uppercase'>
                    <span className='bg-slate-50 px-2 text-xs text-gray-500'>Or Continue With</span>
                </div>
            </div>
            <div className='flex flex-col space-y-3'>
                <Button
                    variant='outline'
                    className='space-x-3'
                    onClick={() =>
                        signIn('github', {
                            callbackUrl: '/profile',
                        })
                    }
                >
                    <FaGithub className='block' />
                    <span className='w-10'>GitHub</span>
                </Button>
                <Button
                    variant='outline'
                    className='space-x-3'
                    onClick={() =>
                        signIn('google', {
                            callbackUrl: '/profile',
                        })
                    }
                >
                    <FcGoogle className='block' />
                    <span className='w-10'>Google</span>
                </Button>
            </div> */}
        </div>
    );
};

export default AuthForm;
