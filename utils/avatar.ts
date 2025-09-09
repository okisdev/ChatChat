import { createHash } from 'node:crypto';

// Regex for splitting whitespace - defined at module level for performance
const WHITESPACE_REGEX = /\s+/;

interface AvatarOptions {
  size?: number;
  defaultImage?:
    | 'mp'
    | 'identicon'
    | 'monsterid'
    | 'wavatar'
    | 'retro'
    | 'robohash'
    | 'blank';
  rating?: 'g' | 'pg' | 'r' | 'x';
}

/**
 * Generate a Gravatar URL from an email address
 * @param email - The email address to generate avatar for
 * @param options - Optional settings for the Gravatar
 * @returns Gravatar URL
 */
export function getGravatarUrl(
  email: string | null | undefined,
  options: AvatarOptions = {}
): string {
  const { size = 80, defaultImage = 'mp', rating = 'g' } = options;

  if (!email) {
    return `https://www.gravatar.com/avatar/00000000000000000000000000000000?s=${size}&d=${defaultImage}&r=${rating}`;
  }

  // Normalize email: lowercase and trim whitespace
  const normalizedEmail = email.toLowerCase().trim();

  // Generate MD5 hash
  const hash = createHash('md5').update(normalizedEmail).digest('hex');

  // Construct Gravatar URL
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${defaultImage}&r=${rating}`;
}

/**
 * Generate initials from a name for fallback avatar
 * @param name - The full name
 * @returns Two-character initials
 */
export function getInitials(name: string | null | undefined): string {
  if (!name) {
    return 'U';
  }

  const words = name.trim().split(WHITESPACE_REGEX);

  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }

  return (words[0][0] + words.at(-1)?.[0]).toUpperCase();
}
