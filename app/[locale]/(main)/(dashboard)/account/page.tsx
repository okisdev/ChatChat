import { Lock, Settings, User } from 'lucide-react';
import { headers } from 'next/headers';
import { PreferenceTab } from '@/components/app/account/preference';
import { ProfileTab } from '@/components/app/account/profile';
import { SecurityTab } from '@/components/app/account/security';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { auth } from '@/lib/auth';

export default async function AccountPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

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
          <TabsList className='mb-6 grid w-full max-w-lg grid-cols-3'>
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
            <TabsTrigger
              className='flex items-center gap-2 text-sm'
              value='preferences'
            >
              <Settings className='h-4 w-4' />
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent className='space-y-6' value='profile'>
            <ProfileTab isPending={false} session={session} />
          </TabsContent>

          <TabsContent className='space-y-6' value='security'>
            <SecurityTab isPending={false} />
          </TabsContent>

          <TabsContent className='space-y-6' value='preferences'>
            <PreferenceTab session={session} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
