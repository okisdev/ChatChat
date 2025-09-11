'use client';

import {
  ChevronRight,
  FolderOpen,
  Loader2,
  MessageSquare,
  Plus,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { authClient } from '@/lib/auth.client';

interface ConversationItem {
  id: string;
  title: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectItem {
  id: string;
  title: string;
  url: string;
  description: string | null;
  conversations: ConversationItem[];
}

interface SidebarData {
  projects: ProjectItem[];
  conversations: ConversationItem[];
}

export function SidebarNav() {
  const { data: session } = authClient.useSession();
  const [sidebarData, setSidebarData] = useState<SidebarData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSidebarData() {
      if (!session?.user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/sidebar');
        if (!response.ok) {
          throw new Error('Failed to fetch sidebar data');
        }

        const data: SidebarData = await response.json();
        setSidebarData(data);
      } catch (err) {
        console.error('Error fetching sidebar data:', err);
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchSidebarData();
  }, [session?.user]);

  if (!session?.user) {
    return (
      <>
        <SidebarGroup>
          <SidebarMenuButton asChild>
            <Link
              className='border transition-all hover:border-border hover:bg-muted/50'
              href='/'
            >
              <Plus />
              <span>Start Chatting</span>
            </Link>
          </SidebarMenuButton>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarMenuButton asChild>
            <Link
              className='border transition-all hover:border-border hover:bg-muted/50'
              href='/login'
            >
              <span>Sign In to Save Chats</span>
            </Link>
          </SidebarMenuButton>
        </SidebarGroup>
      </>
    );
  }

  return (
    <>
      <SidebarGroup>
        <SidebarMenuButton asChild>
          <Link
            className='border transition-all hover:border-border hover:bg-muted/50'
            href='/'
          >
            <Plus />
            <span>New Chat</span>
          </Link>
        </SidebarMenuButton>
      </SidebarGroup>

      {isLoading && (
        <SidebarGroup>
          <div className='flex items-center justify-center p-4'>
            <Loader2 className='h-4 w-4 animate-spin' />
          </div>
        </SidebarGroup>
      )}
      {error && !isLoading && (
        <SidebarGroup>
          <div className='p-4 text-muted-foreground text-sm'>{error}</div>
        </SidebarGroup>
      )}
      {sidebarData && !isLoading && !error && (
        <>
          {sidebarData.projects.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel>Projects</SidebarGroupLabel>
              <SidebarMenu>
                {sidebarData.projects.map((project) => (
                  <Collapsible asChild defaultOpen key={project.id}>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip={project.title}>
                        <Link href={project.url}>
                          <FolderOpen className='h-4 w-4' />
                          <span>{project.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      {project.conversations?.length ? (
                        <>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuAction className='data-[state=open]:rotate-90'>
                              <ChevronRight />
                              <span className='sr-only'>Toggle</span>
                            </SidebarMenuAction>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {project.conversations.map((conversation) => (
                                <SidebarMenuSubItem key={conversation.id}>
                                  <SidebarMenuSubButton asChild>
                                    <Link href={conversation.url}>
                                      <span className='truncate'>
                                        {conversation.title}
                                      </span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </>
                      ) : null}
                    </SidebarMenuItem>
                  </Collapsible>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          )}

          {sidebarData.conversations.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel>Recent Conversations</SidebarGroupLabel>
              <SidebarMenu>
                {sidebarData.conversations.slice(0, 10).map((conversation) => (
                  <SidebarMenuItem key={conversation.id}>
                    <SidebarMenuButton asChild tooltip={conversation.title}>
                      <Link href={conversation.url}>
                        <MessageSquare className='h-4 w-4' />
                        <span className='truncate'>{conversation.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          )}

          {sidebarData.projects.length === 0 &&
            sidebarData.conversations.length === 0 && (
              <SidebarGroup>
                <div className='p-4 text-muted-foreground text-sm'>
                  No conversations yet. Start by creating a new chat!
                </div>
              </SidebarGroup>
            )}
        </>
      )}
    </>
  );
}
