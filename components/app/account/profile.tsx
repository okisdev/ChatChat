'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Save } from 'lucide-react';
import { useEffect } from 'react';
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
import { getGravatarUrl, getInitials } from '@/utils/avatar';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email format'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileProps {
  session: {
    user?: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  } | null;
  isPending: boolean;
}

export function ProfileTab({ session, isPending }: ProfileProps) {
  // Profile form
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name || '',
      email: session?.user?.email || '',
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

  return (
    <div className='space-y-6'>
      {/* Avatar Section */}
      <div className='flex items-start gap-4 pb-4'>
        <Avatar className='h-16 w-16 ring-2 ring-border ring-offset-2'>
          <AvatarImage
            alt={session?.user?.name ?? 'User'}
            src={
              session?.user?.image ?? getGravatarUrl(session?.user?.email ?? '')
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
    </div>
  );
}
