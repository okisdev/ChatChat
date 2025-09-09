'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth.client';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });

      if (result.error) {
        setError(result.error.message || 'An error occurred during login');
      } else {
        // Redirect to home page or dashboard on successful login
        router.push('/');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex h-full items-center justify-center p-8'>
      <div className='w-full max-w-md space-y-6'>
        <div className='space-y-2 text-center'>
          <h1 className='font-medium text-2xl tracking-tight'>
            Sign in to ChatChat
          </h1>
        </div>

        <div className='space-y-4'>
          {error && (
            <Alert className='text-sm' variant='destructive'>
              {error}
            </Alert>
          )}

          <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
            <div className='space-y-2'>
              <Label className='font-medium text-sm' htmlFor='email'>
                Email
              </Label>
              <div className='relative'>
                <Mail className='-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground' />
                <Input
                  className='pl-10'
                  id='email'
                  placeholder='Enter your email'
                  type='email'
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className='text-destructive text-sm'>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label className='font-medium text-sm' htmlFor='password'>
                Password
              </Label>
              <div className='relative'>
                <Lock className='-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground' />
                <Input
                  className='pl-10'
                  id='password'
                  placeholder='Enter your password'
                  type='password'
                  {...register('password')}
                />
              </div>
              {errors.password && (
                <p className='text-destructive text-sm'>
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className='flex items-center space-x-2'>
              <Checkbox
                className='h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-ring'
                id='rememberMe'
                {...register('rememberMe')}
              />
              <Label
                className='text-muted-foreground text-sm'
                htmlFor='rememberMe'
              >
                Remember me
              </Label>
            </div>

            <Button
              className='w-full'
              disabled={isLoading || !isValid}
              type='submit'
            >
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>
        </div>
        <div className='text-center'>
          <p className='text-muted-foreground text-sm'>
            Don't have an account?{' '}
            <Link
              className='font-medium text-primary transition-colors hover:text-primary/80'
              href='/register'
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
