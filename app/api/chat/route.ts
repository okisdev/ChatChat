import { convertToModelMessages, streamText, type UIMessage } from 'ai';
import { headers } from 'next/headers';
import {
  convertDbMessagesToUIMessages,
  createConversation,
  createDefaultProject,
  deleteConversationById,
  getConversationById,
  getMessagesByConversationId,
  getUserDefaultProject,
  saveMessages,
  updateConversationTitle,
} from '@/database/action';
import { openai } from '@/lib/ai/provider';
import { generateConversationTitle } from '@/lib/ai/utils';
import { auth } from '@/lib/auth';
import type { Conversation, Message } from '@/types/database';
import { v4 as uuidv4 } from 'uuid';

interface ChatRequest {
  messages: UIMessage[];
  id?: string;
}

async function getOrCreateConversation(
  conversationId: string,
  userId: string,
  messages: UIMessage[]
): Promise<Conversation | null> {
  let conversation = await getConversationById(conversationId);

  // Verify user owns this conversation
  if (conversation && conversation.createdById !== userId) {
    throw new Error('Forbidden');
  }

  // If conversation doesn't exist, create a new one
  if (!conversation) {
    // Get or create default project
    let userProject = await getUserDefaultProject(userId);
    if (!userProject) {
      userProject = await createDefaultProject(userId);
    }

    // Generate conversation ID and title
    const newConversationId = uuidv4();
    const lastUserMessage = messages.filter((m) => m.role === 'user').at(-1);
    const title = lastUserMessage
      ? await generateConversationTitle({ message: lastUserMessage })
      : 'New Conversation';

    // Create conversation
    conversation = await createConversation({
      id: newConversationId,
      title,
      projectId: null,
      createdById: userId,
      visibility: 'private',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  return conversation;
}

export async function POST(req: Request) {
  try {
    // Get authentication session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { messages, id }: ChatRequest = await req.json();

    if (!messages || messages.length === 0) {
      return new Response('Messages are required', { status: 400 });
    }

    const currentUserId = session.user.id;

    if (!id) {
      return new Response('Conversation ID is required', { status: 400 });
    }

    // Get or create conversation
    const conversation = await getOrCreateConversation(
      id,
      currentUserId,
      messages
    );

    if (!conversation) {
      return new Response('Failed to create conversation', { status: 500 });
    }

    // Load existing messages from database
    const existingDbMessages = await getMessagesByConversationId(
      conversation.id
    );
    const existingUIMessages =
      convertDbMessagesToUIMessages(existingDbMessages);

    // Get the last user message (the new one)
    const newUserMessage = messages.at(-1);

    if (!newUserMessage) {
      return new Response('No user message found', { status: 400 });
    }

    const isNewMessage = !existingUIMessages.find(
      (m) => m.id === newUserMessage.id
    );

    // Save the new user message if it's actually new
    if (isNewMessage && newUserMessage.role === 'user') {
      const userMessageData: Message = {
        id: newUserMessage.id || uuidv4(),
        conversationId: conversation.id,
        role: newUserMessage.role,
        parts: newUserMessage.parts,
        attachments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await saveMessages([userMessageData]);
    }

    // Combine existing messages with new messages for AI context
    const allMessages = [...existingUIMessages];

    // Add new user message to context if not already included
    if (isNewMessage) {
      allMessages.push(newUserMessage);
    }

    // Generate AI response
    const result = streamText({
      model: openai('gpt-4o'),
      system:
        'You are a helpful, friendly, and knowledgeable AI assistant. Provide clear, accurate, and engaging responses.',
      messages: convertToModelMessages(allMessages),
      onFinish: async ({ text }) => {
        try {
          // Save AI response to database
          const aiMessage: Message = {
            id: uuidv4(),
            conversationId: conversation.id,
            role: 'assistant',
            parts: [{ type: 'text', text }],
            attachments: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          await saveMessages([aiMessage]);

          // Update conversation title if it's the first exchange
          if (
            existingDbMessages.length === 0 &&
            newUserMessage.role === 'user'
          ) {
            const title = await generateConversationTitle({
              message: newUserMessage,
            });
            await updateConversationTitle(conversation.id, title);
          }
        } catch (saveError) {
          console.error('Error saving AI response:', saveError);
        }
      },
    });

    // Return the response with conversation ID in headers
    const response = result.toUIMessageStreamResponse();
    response.headers.set('X-Conversation-ID', conversation.id);

    return response;
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

// GET endpoint to retrieve conversation
export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return new Response('Conversation ID is required', { status: 400 });
    }

    const conversation = await getConversationById(conversationId);

    if (!conversation || conversation.createdById !== session.user.id) {
      return new Response('Conversation not found', { status: 404 });
    }

    const messages = await getMessagesByConversationId(conversationId);
    const uiMessages = convertDbMessagesToUIMessages(messages);

    return Response.json({
      conversation,
      messages: uiMessages,
    });
  } catch (error) {
    console.error('Error retrieving conversation:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

// DELETE endpoint to delete conversation
export async function DELETE(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return new Response('Conversation ID is required', { status: 400 });
    }

    const conversation = await getConversationById(conversationId);

    if (!conversation) {
      return new Response('Conversation not found', { status: 404 });
    }

    if (conversation.createdById !== session.user.id) {
      return new Response('Forbidden', { status: 403 });
    }

    // Delete conversation (messages will be deleted via cascade)
    const deletedConversation = await deleteConversationById(conversationId);

    return Response.json({
      success: true,
      deletedConversation,
    });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
