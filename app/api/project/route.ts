import { headers } from 'next/headers';
import { getProjectById, getUserConversations } from '@/database/action';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('id');

    if (!projectId) {
      return new Response('Project ID is required', { status: 400 });
    }

    const project = await getProjectById(projectId);

    if (!project) {
      return new Response('Project not found', { status: 404 });
    }

    // Check if user owns this project
    if (project.ownerId !== session.user.id) {
      return new Response('Forbidden', { status: 403 });
    }

    // Get conversations for this project
    const conversations = await getUserConversations(
      session.user.id,
      project.id
    );

    const projectData = {
      id: project.id,
      name: project.name,
      description: project.description,
      visibility: project.visibility,
      ownerId: project.ownerId,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
      conversations: conversations.map((conv) => ({
        id: conv.id,
        title: conv.title,
        createdAt: conv.createdAt.toISOString(),
        updatedAt: conv.updatedAt.toISOString(),
      })),
    };

    return Response.json(projectData);
  } catch (error) {
    console.error('Error fetching project:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
