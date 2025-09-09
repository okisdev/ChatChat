'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, Mail, Save, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { authClient } from '@/lib/auth.client';
import { getGravatarUrl, getInitials } from '@/utils/avatar';

// Form schemas
const profileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email format'),
});

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

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function AccountPage() {
  const { data: session, isPending } = authClient.useSession();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile form
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name || '',
      email: session?.user?.email || '',
    },
  });

  // Password form
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Update form values when session loads
  useEffect(() => {
    if (session?.user) {
      profileForm.reset({
        name: session.user.name || '',
        email: session.user.email || '',
      });
    }
  }, [session?.user, profileForm]);

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update profile');
      }

      toast.success('Profile updated successfully');

      // Refresh session to get updated user data
      window.location.reload();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update profile'
      );
    }
  };

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

  // Show access denied only if we're certain there's no session (not loading)
  if (!(isPending || session?.user)) {
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <div className='text-center'>
          <h2 className='mb-2 font-semibold text-2xl'>Access Denied</h2>
          <p className='text-muted-foreground'>
            Please sign in to access your account settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex-1 p-8'>
      <div className='mx-auto max-w-4xl'>
        <div className='mb-6 space-y-1'>
          <h1 className='font-medium text-2xl leading-tight tracking-tight'>
            Account
          </h1>
          <p className='text-muted-foreground text-sm leading-relaxed'>
            Manage your profile and security settings
          </p>
        </div>

        <Tabs className='w-full' defaultValue='profile'>
          <TabsList className='mb-6 grid w-full max-w-md grid-cols-2'>
            <TabsTrigger
              className='flex items-center gap-2 text-sm'
              value='profile'
            >
              <User className='h-4 w-4' />
              Profile
            </TabsTrigger>
            <TabsTrigger
              className='flex items-center gap-2 text-sm'
              value='security'
            >
              <Lock className='h-4 w-4' />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent className='space-y-6' value='profile'>
            {/* Avatar Section */}
            <div className='flex items-start gap-4 pb-4'>
              <Avatar className='h-16 w-16 ring-2 ring-border ring-offset-2'>
                <AvatarImage
                  alt={session?.user?.name ?? 'User'}
                  src={
                    session?.user?.image ??
                    getGravatarUrl(session?.user?.email ?? '')
                  }
                />
                <AvatarFallback className='font-medium text-lg'>
                  {session?.user?.name ? getInitials(session.user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className='space-y-1'>
                <h2 className='font-semibold text-lg leading-tight'>
                  {session?.user?.name ?? 'Loading...'}
                </h2>
                <p className='text-muted-foreground text-sm leading-relaxed'>
                  {session?.user?.email ?? 'Loading...'}
                </p>
                <p className='text-muted-foreground text-xs leading-relaxed'>
                  Avatar generated using Gravatar
                </p>
              </div>
            </div>

            <Separator />

            {/* Profile Form */}
            <div className='space-y-6'>
              <div>
                <h3 className='mb-1 font-medium leading-tight'>
                  Personal Information
                </h3>
                <p className='text-muted-foreground text-sm leading-relaxed'>
                  Update your name and email address
                </p>
              </div>

              <Form {...profileForm}>
                <form
                  className='space-y-6'
                  onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                >
                  <div className='grid gap-6 sm:grid-cols-2'>
                    <FormField
                      control={profileForm.control}
                      name='name'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='font-medium text-sm leading-none'>
                            Full Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              className='text-sm transition-all focus:ring-2 focus:ring-primary/20'
                              disabled={isPending}
                              placeholder='Your full name'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='font-medium text-sm leading-none'>
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <div className='relative'>
                              <Mail className='-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground' />
                              <Input
                                className='pl-10 text-sm transition-all focus:ring-2 focus:ring-primary/20'
                                disabled={isPending}
                                placeholder='your@email.com'
                                {...field}
                              />
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
                        profileForm.formState.isSubmitting ||
                        !profileForm.formState.isDirty
                      }
                      size='sm'
                      type='submit'
                    >
                      <Save className='mr-2 h-3 w-3' />
                      {(() => {
                        if (isPending) {
                          return 'Loading...';
                        }
                        if (profileForm.formState.isSubmitting) {
                          return 'Saving...';
                        }
                        return 'Save Changes';
                      })()}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </TabsContent>

          <TabsContent className='space-y-6' value='security'>
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
                              onClick={() =>
                                setShowNewPassword(!showNewPassword)
                              }
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
