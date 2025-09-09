'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Lock, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth.client';
import { cn } from '@/lib/utils';

// Regex patterns for password strength validation
const UPPERCASE_REGEX = /[A-Z]/;
const LOWERCASE_REGEX = /[a-z]/;
const DIGIT_REGEX = /\d/;

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters long'),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        setError(
          result.error.message || 'An error occurred during registration'
        );
      } else {
        // Better-auth auto signs in by default after registration
        setSuccess('Account created successfully! Redirecting...');
        // Redirect immediately after successful registration and auto sign-in
        router.push('/');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const password = watch('password');

  return (
    <div className='flex h-full items-center justify-center p-8'>
      <div className='w-full max-w-md space-y-6'>
        <div className='space-y-2 text-center'>
          <h1 className='font-medium text-2xl tracking-tight'>
            Create account with ChatChat
          </h1>
        </div>

        <div className='space-y-4'>
          {error && (
            <Alert className='text-sm' variant='destructive'>
              {error}
            </Alert>
          )}

          {success && (
            <Alert className='border-chart-2 bg-chart-2/10 text-chart-2 text-sm'>
              {success}
            </Alert>
          )}

          <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
            <div className='space-y-2'>
              <Label className='font-medium text-sm' htmlFor='name'>
                Full Name
              </Label>
              <div className='relative'>
                <User className='-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground' />
                <Input
                  className='pl-10'
                  id='name'
                  placeholder='Enter your full name'
                  type='text'
                  {...register('name')}
                />
              </div>
              {errors.name && (
                <p className='text-destructive text-sm'>
                  {errors.name.message}
                </p>
              )}
            </div>

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
                  placeholder='Create a strong password'
                  type='password'
                  {...register('password')}
                />
              </div>
              {errors.password && (
                <p className='text-destructive text-sm'>
                  {errors.password.message}
                </p>
              )}
              {password && password.length > 0 && !errors.password && (
                <div className='space-y-1'>
                  <div className='flex items-center text-xs'>
                    <div className='flex space-x-1'>
                      <div
                        className={cn(
                          'h-1 w-4 rounded',
                          password.length >= 8 ? 'bg-chart-2' : 'bg-muted'
                        )}
                      />
                      <div
                        className={cn(
                          'h-1 w-4 rounded',
                          UPPERCASE_REGEX.test(password)
                            ? 'bg-chart-2'
                            : 'bg-muted'
                        )}
                      />
                      <div
                        className={cn(
                          'h-1 w-4 rounded',
                          LOWERCASE_REGEX.test(password)
                            ? 'bg-chart-2'
                            : 'bg-muted'
                        )}
                      />
                      <div
                        className={cn(
                          'h-1 w-4 rounded',
                          DIGIT_REGEX.test(password) ? 'bg-chart-2' : 'bg-muted'
                        )}
                      />
                    </div>
                    <span className='ml-2 text-muted-foreground'>
                      Password strength
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className='space-y-2'>
              <Label className='font-medium text-sm' htmlFor='confirmPassword'>
                Confirm Password
              </Label>
              <div className='relative'>
                <Lock className='-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground' />
                <Input
                  className='pl-10'
                  id='confirmPassword'
                  placeholder='Confirm your password'
                  type='password'
                  {...register('confirmPassword')}
                />
              </div>
              {errors.confirmPassword && (
                <p className='text-destructive text-sm'>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              className='w-full'
              disabled={isLoading || !isValid}
              type='submit'
            >
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </form>
        </div>
        <div className='text-center'>
          <p className='text-muted-foreground text-sm'>
            Already have an account?{' '}
            <Link
              className='font-medium text-primary transition-colors hover:text-primary/80'
              href='/login'
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
