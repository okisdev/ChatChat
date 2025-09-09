import { eq } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { user } from '@/database/schema';
import { auth } from '@/lib/auth';
import { db } from '@/lib/database';

const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email format'),
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
    const validatedData = updateProfileSchema.parse(body);

    // Check if email is already taken by another user
    if (validatedData.email !== session.user.email) {
      const existingUser = await db
        .select()
        .from(user)
        .where(eq(user.email, validatedData.email))
        .limit(1);

      if (existingUser.length > 0 && existingUser[0].id !== session.user.id) {
        return NextResponse.json(
          { error: 'Email is already taken' },
          { status: 409 }
        );
      }
    }

    // Update the user profile
    const updatedUser = await db
      .update(user)
      .set({
        name: validatedData.name,
        email: validatedData.email,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id))
      .returning();

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser[0].id,
        name: updatedUser[0].name,
        email: updatedUser[0].email,
        image: updatedUser[0].image,
      },
    });
  } catch (error) {
    console.error('Profile update error:', error);

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
