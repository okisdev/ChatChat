import type { UIDataTypes, UIMessage, UIMessagePart, UITools } from 'ai';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '@/lib/database';
import type { Conversation, Message, Project } from '@/types/database';
import { conversation, message, project } from './schema';

// Conversation operations
export async function createConversation(
  data: Conversation
): Promise<Conversation | null> {
  const [newConversation] = await db
    .insert(conversation)
    .values({
      id: data.id,
      title: data.title,
      projectId: data.projectId || null,
      createdById: data.createdById,
      visibility: data.visibility || 'private',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return newConversation;
}

export async function getConversationById(
  id: string
): Promise<Conversation | null> {
  const [conversationData] = await db
    .select()
    .from(conversation)
    .where(eq(conversation.id, id));

  return conversationData;
}

export async function updateConversationTitle(
  id: string,
  title: string
): Promise<Conversation | null> {
  const [updatedConversation] = await db
    .update(conversation)
    .set({
      title,
      updatedAt: new Date(),
    })
    .where(eq(conversation.id, id))
    .returning();

  return updatedConversation;
}

export async function deleteConversationById(
  id: string
): Promise<Conversation | null> {
  const [deletedConversation] = await db
    .delete(conversation)
    .where(eq(conversation.id, id))
    .returning();

  return deletedConversation;
}

export async function getUserConversations(
  userId: string,
  projectId?: string
): Promise<Conversation[]> {
  const conditions = [eq(conversation.createdById, userId)];
  if (projectId) {
    conditions.push(eq(conversation.projectId, projectId));
  }

  const conversations = await db
    .select()
    .from(conversation)
    .where(and(...conditions))
    .orderBy(desc(conversation.updatedAt));

  return conversations;
}

// Message operations
export async function saveMessages(messages: Message[]) {
  if (messages.length === 0) {
    return [];
  }

  const result = await db
    .insert(message)
    .values(
      messages.map((msg) => ({
        id: msg.id,
        conversationId: msg.conversationId,
        role: msg.role,
        parts: msg.parts,
        attachments: msg.attachments || [],
        createdAt: msg.createdAt || new Date(),
        updatedAt: new Date(),
      }))
    )
    .returning();

  return result;
}

export async function getMessagesByConversationId(
  conversationId: string
): Promise<Message[]> {
  const messages = await db
    .select()
    .from(message)
    .where(eq(message.conversationId, conversationId))
    .orderBy(message.createdAt);

  return messages;
}

export async function deleteMessage(id: string): Promise<Message | null> {
  const [deletedMessage] = await db
    .delete(message)
    .where(eq(message.id, id))
    .returning();

  return deletedMessage;
}

// Project operations (helper functions)
export async function createDefaultProject(
  userId: string,
  name = 'Default'
): Promise<Project | null> {
  const [newProject] = await db
    .insert(project)
    .values({
      id: `project_${userId}_${Date.now()}`,
      name,
      description: 'Default project for conversations',
      visibility: 'private',
      ownerId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return newProject;
}

export async function getUserDefaultProject(
  userId: string
): Promise<Project | null> {
  const [userProject] = await db
    .select()
    .from(project)
    .where(eq(project.ownerId, userId))
    .orderBy(project.createdAt)
    .limit(1);

  return userProject;
}

// Helper function to convert database messages to UI messages
export function convertDbMessagesToUIMessages(
  dbMessages: Message[]
): UIMessage[] {
  return dbMessages.map((msg) => ({
    id: msg.id,
    role: msg.role as 'user' | 'assistant' | 'system',
    parts: msg.parts as UIMessagePart<UIDataTypes, UITools>[],
    attachments: msg.attachments || [],
    createdAt: msg.createdAt,
  }));
}

