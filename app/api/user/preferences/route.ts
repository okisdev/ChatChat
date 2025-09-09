import { and, eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { userPreference } from '@/database/schema';
import { auth } from '@/lib/auth';
import { db } from '@/lib/database';

// Schema for updating preferences
const updatePreferencesSchema = z.object({
  preferences: z.record(z.string(), z.string()), // key-value pairs
});

// Get user preferences
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all user preferences
    const preferences = await db
      .select()
      .from(userPreference)
      .where(eq(userPreference.userId, session.user.id));

    // Convert to key-value object
    const preferencesObj = preferences.reduce(
      (acc, pref) => {
        acc[pref.key] = pref.value;
        return acc;
      },
      {} as Record<string, string>
    );

    return NextResponse.json({ preferences: preferencesObj });
  } catch (error) {
    console.error('Get preferences error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update user preferences
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updatePreferencesSchema.parse(body);

    // Update or insert preferences
    for (const [key, value] of Object.entries(validatedData.preferences)) {
      // Check if preference already exists
      const existingPref = await db
        .select()
        .from(userPreference)
        .where(
          and(
            eq(userPreference.userId, session.user.id),
            eq(userPreference.key, key)
          )
        )
        .limit(1);

      if (existingPref.length > 0) {
        // Update existing preference
        await db
          .update(userPreference)
          .set({
            value,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(userPreference.userId, session.user.id),
              eq(userPreference.key, key)
            )
          );
      } else {
        // Insert new preference
        await db.insert(userPreference).values({
          id: nanoid(),
          userId: session.user.id,
          key,
          value,
        });
      }
    }

    return NextResponse.json({
      message: 'Preferences updated successfully',
    });
  } catch (error) {
    console.error('Update preferences error:', error);

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
