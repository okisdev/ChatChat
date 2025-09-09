import { openai } from '@ai-sdk/openai';
import { generateText, type UIMessage } from 'ai';

export async function generateConversationTitle({
  message,
}: {
  message: UIMessage;
}) {
  const { text: title } = await generateText({
    model: openai('gpt-4o'),
    system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`,
    prompt: JSON.stringify(message),
  });

  return title;
}
