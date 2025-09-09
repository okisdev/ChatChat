'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

interface SecurityProps {
  isPending: boolean;
}

export function SecurityTab({ isPending }: SecurityProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password form
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      const response = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update password');
      }

      toast.success('Password updated successfully');
      passwordForm.reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update password'
      );
    }
  };

  return (
    <div className='space-y-6'>
      <div className='pb-4'>
        <h3 className='mb-1 font-medium text-base leading-tight'>
          Change Password
        </h3>
        <p className='text-muted-foreground text-sm leading-relaxed'>
          Keep your account secure with a strong password
        </p>
      </div>

      <Form {...passwordForm}>
        <form
          className='space-y-6'
          onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
        >
          <FormField
            control={passwordForm.control}
            name='currentPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-medium text-sm leading-none'>
                  Current Password
                </FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input
                      className='pr-10 text-sm transition-all focus:ring-2 focus:ring-primary/20'
                      disabled={isPending}
                      placeholder='Enter your current password'
                      type={showCurrentPassword ? 'text' : 'password'}
                      {...field}
                    />
                    <Button
                      className='absolute top-0 right-0 w-10 rounded-l-none hover:bg-transparent'
                      disabled={isPending}
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      size='sm'
                      type='button'
                      variant='ghost'
                    >
                      {showCurrentPassword ? (
                        <EyeOff className='h-3 w-3 text-muted-foreground' />
                      ) : (
                        <Eye className='h-3 w-3 text-muted-foreground' />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='grid gap-6 sm:grid-cols-2'>
            <FormField
              control={passwordForm.control}
              name='newPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-medium text-sm leading-none'>
                    New Password
                  </FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        className='pr-10 text-sm transition-all focus:ring-2 focus:ring-primary/20'
                        disabled={isPending}
                        placeholder='Enter new password'
                        type={showNewPassword ? 'text' : 'password'}
                        {...field}
                      />
                      <Button
                        className='absolute top-0 right-0 w-10 rounded-l-none hover:bg-transparent'
                        disabled={isPending}
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        size='sm'
                        type='button'
                        variant='ghost'
                      >
                        {showNewPassword ? (
                          <EyeOff className='h-3 w-3 text-muted-foreground' />
                        ) : (
                          <Eye className='h-3 w-3 text-muted-foreground' />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={passwordForm.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-medium text-sm leading-none'>
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        className='pr-10 text-sm transition-all focus:ring-2 focus:ring-primary/20'
                        disabled={isPending}
                        placeholder='Confirm new password'
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...field}
                      />
                      <Button
                        className='absolute top-0 right-0 w-10 rounded-l-none hover:bg-transparent'
                        disabled={isPending}
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        size='sm'
                        type='button'
                        variant='ghost'
                      >
                        {showConfirmPassword ? (
                          <EyeOff className='h-3 w-3 text-muted-foreground' />
                        ) : (
                          <Eye className='h-3 w-3 text-muted-foreground' />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='flex justify-end pt-3'>
            <Button
              className='px-6 text-sm'
              disabled={
                isPending ||
                passwordForm.formState.isSubmitting ||
                !passwordForm.formState.isDirty
              }
              size='sm'
              type='submit'
            >
              <Lock className='mr-2 h-3 w-3' />
              {(() => {
                if (isPending) {
                  return 'Loading...';
                }
                if (passwordForm.formState.isSubmitting) {
                  return 'Updating...';
                }
                return 'Update Password';
              })()}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
