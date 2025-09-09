'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const preferencesSchema = z.object({
  sendMessageKey: z.enum(['enter', 'shift-enter']),
  theme: z.enum(['light', 'dark', 'system']),
  language: z.enum(['en', 'es', 'fr', 'de']),
});

type PreferencesFormData = z.infer<typeof preferencesSchema>;

interface PreferenceProps {
  session: {
    user?: {
      id: string;
    };
  } | null;
}

export function PreferenceTab({ session }: PreferenceProps) {
  const [preferences, setPreferences] = useState<Record<string, string>>({});

  // Preferences form
  const preferencesForm = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      sendMessageKey: 'enter',
      theme: 'system',
      language: 'en',
    },
  });

  // Load user preferences
  useEffect(() => {
    const loadPreferences = async () => {
      if (session?.user) {
        try {
          const response = await fetch('/api/user/preferences');
          if (response.ok) {
            const data = await response.json();
            setPreferences(data.preferences);

            // Update preferences form with loaded data
            preferencesForm.reset({
              sendMessageKey:
                (data.preferences.sendMessageKey as 'enter' | 'shift-enter') ||
                'enter',
              theme:
                (data.preferences.theme as 'light' | 'dark' | 'system') ||
                'system',
              language:
                (data.preferences.language as 'en' | 'es' | 'fr' | 'de') ||
                'en',
            });
          }
        } catch (error) {
          console.error('Failed to load preferences:', error);
        }
      }
    };

    loadPreferences();
  }, [session?.user, preferencesForm]);

  const updatePreference = async (key: string, value: string) => {
    try {
      const response = await fetch('/api/user/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences: {
            [key]: value,
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update preference');
      }

      toast.success('Preference updated');

      // Update local preferences state
      setPreferences({
        ...preferences,
        [key]: value,
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update preference'
      );
    }
  };

  return (
    <div className='space-y-6'>
      <div className='pb-4'>
        <h3 className='mb-1 font-medium text-base leading-tight'>
          Application Preferences
        </h3>
        <p className='text-muted-foreground text-sm leading-relaxed'>
          Customize your ChatChat experience. Changes are saved automatically.
        </p>
      </div>

      <div className='grid gap-6 sm:grid-cols-2'>
        <div className='space-y-2'>
          <Label className='font-medium text-sm leading-none'>
            Send Message Key
          </Label>
          <Select
            defaultValue={preferences.sendMessageKey || 'enter'}
            onValueChange={(value) => {
              preferencesForm.setValue(
                'sendMessageKey',
                value as 'enter' | 'shift-enter'
              );
              updatePreference('sendMessageKey', value);
            }}
          >
            <SelectTrigger className='text-sm'>
              <SelectValue placeholder='Select send key' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='enter'>
                <div className='flex items-center gap-2'>
                  <span>Enter</span>
                  <span className='text-muted-foreground text-xs'>
                    (Shift+Enter for new line)
                  </span>
                </div>
              </SelectItem>
              <SelectItem value='shift-enter'>
                <div className='flex items-center gap-2'>
                  <span>Shift+Enter</span>
                  <span className='text-muted-foreground text-xs'>
                    (Enter for new line)
                  </span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <Label className='font-medium text-sm leading-none'>Theme</Label>
          <Select
            defaultValue={preferences.theme || 'system'}
            onValueChange={(value) => {
              preferencesForm.setValue(
                'theme',
                value as 'light' | 'dark' | 'system'
              );
              updatePreference('theme', value);
            }}
          >
            <SelectTrigger className='text-sm'>
              <SelectValue placeholder='Select theme' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='light'>Light</SelectItem>
              <SelectItem value='dark'>Dark</SelectItem>
              <SelectItem value='system'>System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <Label className='font-medium text-sm leading-none'>Language</Label>
          <Select
            defaultValue={preferences.language || 'en'}
            onValueChange={(value) => {
              preferencesForm.setValue(
                'language',
                value as 'en' | 'es' | 'fr' | 'de'
              );
              updatePreference('language', value);
            }}
          >
            <SelectTrigger className='text-sm'>
              <SelectValue placeholder='Select language' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='en'>English</SelectItem>
              <SelectItem value='es'>Español</SelectItem>
              <SelectItem value='fr'>Français</SelectItem>
              <SelectItem value='de'>Deutsch</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
