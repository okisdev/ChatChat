import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import {
  createDefaultProject,
  getUserConversations,
  getUserDefaultProject,
} from '@/database/action';
import { project } from '@/database/schema';
import { auth } from '@/lib/auth';
import { db } from '@/lib/database';

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const userId = session.user.id;

    // Get user projects
    const userProjects = await db
      .select()
      .from(project)
      .where(eq(project.ownerId, userId));

    // Ensure user has at least a default project
    if (userProjects.length === 0) {
      await createDefaultProject(userId);
      const defaultProject = await getUserDefaultProject(userId);
      if (defaultProject) {
        userProjects.push(defaultProject);
      }
    }

    // Get conversations for each project
    const projectsWithConversations = await Promise.all(
      userProjects.map(async (proj) => {
        const conversations = await getUserConversations(userId, proj.id);
        return {
          ...proj,
          conversations: conversations.map((conv) => ({
            id: conv.id,
            title: conv.title || 'Untitled Conversation',
            url: `/chat/${conv.id}`,
            createdAt: conv.createdAt,
            updatedAt: conv.updatedAt,
          })),
        };
      })
    );

    // Get all conversations (not grouped by project)
    const allConversations = await getUserConversations(userId);
    const formattedConversations = allConversations.map((conv) => ({
      id: conv.id,
      title: conv.title || 'Untitled Conversation',
      url: `/chat/${conv.id}`,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt,
    }));

    return Response.json({
      projects: projectsWithConversations.map((proj) => ({
        id: proj.id,
        title: proj.name,
        url: `/project/${proj.id}`,
        description: proj.description,
        conversations: proj.conversations,
      })),
      conversations: formattedConversations,
    });
  } catch (error) {
    console.error('Error fetching sidebar data:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
