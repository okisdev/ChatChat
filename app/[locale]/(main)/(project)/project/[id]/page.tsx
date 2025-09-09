'use client';

import { FolderOpen, Loader2, MessageSquare, Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { authClient } from '@/lib/auth.client';

interface ConversationItem {
  id: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ProjectData {
  id: string;
  name: string;
  description: string | null;
  visibility: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  conversations: ConversationItem[];
}

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);

  const { data: session } = authClient.useSession();

  // Load project data
  useEffect(() => {
    async function handleResponse(response: Response) {
      if (response.status === 404) {
        setError('Project not found');
        return null;
      }

      if (response.status === 403) {
        setError('You do not have permission to view this project');
        return null;
      }

      if (!response.ok) {
        throw new Error('Failed to load project');
      }

      return response.json();
    }

    async function loadProject() {
      if (!(projectId && session?.user)) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/project?id=${projectId}`);
        const data = await handleResponse(response);

        if (data) {
          setProjectData(data);
        }
      } catch (err) {
        console.error('Error loading project:', err);
        setError('Failed to load project');
      } finally {
        setIsLoading(false);
      }
    }

    loadProject();
  }, [projectId, session?.user]);

  const handleCreateNewConversation = async () => {
    if (!(session?.user && projectData)) {
      return;
    }

    try {
      setIsCreatingConversation(true);

      const conversationId = crypto.randomUUID();
      router.push(`/chat/${conversationId}?projectId=${projectData.id}`);
    } catch (err) {
      console.error('Error creating conversation:', err);
    } finally {
      setIsCreatingConversation(false);
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }
    if (diffInHours < 24 * 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Show loading state while checking auth and loading project
  if (!session?.user || isLoading) {
    return (
      <div className='flex h-full items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='mx-auto h-8 w-8 animate-spin text-muted-foreground' />
          <p className='mt-2 text-muted-foreground text-sm'>
            {session?.user
              ? 'Loading project...'
              : 'Checking authentication...'}
          </p>
        </div>
      </div>
    );
  }

  // Handle project not found or error
  if (error) {
    return (
      <div className='flex h-full items-center justify-center'>
        <div className='text-center'>
          <FolderOpen className='mx-auto h-12 w-12 text-muted-foreground' />
          <h2 className='mb-2 font-semibold text-2xl'>{error}</h2>
          <p className='text-muted-foreground text-sm'>
            {error === 'Project not found'
              ? 'The project you are looking for does not exist.'
              : 'You do not have permission to view this project.'}
          </p>
        </div>
      </div>
    );
  }

  if (!projectData) {
    return null;
  }

  return (
    <div className='flex h-full min-h-0 flex-1 flex-col'>
      {/* Project Header */}
      <div className='shrink-0 border-b p-4'>
        <div className='flex items-start justify-between'>
          <div className='space-y-1'>
            <div className='flex items-center gap-2'>
              <FolderOpen className='h-5 w-5 text-muted-foreground' />
              <h1 className='font-medium text-foreground text-lg'>
                {projectData.name}
              </h1>
            </div>
            {projectData.description && (
              <p className='text-muted-foreground text-sm'>
                {projectData.description}
              </p>
            )}
            <p className='text-muted-foreground text-xs'>
              {projectData.conversations.length} conversation
              {projectData.conversations.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button
            disabled={isCreatingConversation}
            onClick={handleCreateNewConversation}
            size='sm'
          >
            {isCreatingConversation ? (
              <Loader2 className='mr-1 h-3 w-3 animate-spin' />
            ) : (
              <Plus className='mr-1 h-3 w-3' />
            )}
            New Chat
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <ScrollArea className='h-full flex-1 items-center justify-center p-2'>
        {projectData.conversations.length === 0 ? (
          /* Empty State */
          <div className='flex h-full items-center justify-center'>
            <div className='text-center'>
              <p className='text-muted-foreground text-sm'>
                No conversations in this project
              </p>
            </div>
          </div>
        ) : (
          /* Conversations List */
          <div className='space-y-2 py-4'>
            {projectData.conversations
              .sort(
                (a, b) =>
                  new Date(b.updatedAt).getTime() -
                  new Date(a.updatedAt).getTime()
              )
              .map((conversation) => (
                <button
                  className='group w-full cursor-pointer rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted/50'
                  key={conversation.id}
                  onClick={() => router.push(`/chat/${conversation.id}`)}
                  type='button'
                >
                  <div className='flex items-start justify-between gap-2'>
                    <div className='min-w-0 flex-1'>
                      <h3 className='truncate font-medium text-sm group-hover:text-primary'>
                        {conversation.title || 'Untitled Conversation'}
                      </h3>
                      <p className='text-muted-foreground text-xs'>
                        {formatRelativeTime(conversation.updatedAt)}
                      </p>
                    </div>
                    <MessageSquare className='h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100' />
                  </div>
                </button>
              ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
