import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';

const updatePasswordSchema = z
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

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updatePasswordSchema.parse(body);

    // Use better-auth's changePassword method
    try {
      await auth.api.changePassword({
        body: {
          newPassword: validatedData.newPassword,
          currentPassword: validatedData.currentPassword,
        },
        headers: request.headers,
      });

      return NextResponse.json({
        message: 'Password updated successfully',
      });
    } catch (authError) {
      console.error('Password change error:', authError);

      // Check if it's an invalid current password error
      if (
        authError instanceof Error &&
        authError.message.includes('Invalid password')
      ) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        );
      }

      throw authError;
    }
  } catch (error) {
    console.error('Password update error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
