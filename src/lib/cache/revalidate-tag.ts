import { serverEnv } from '@/lib/env/server.env';

/**
 * Utility function to revalidate a tag from server components or server actions
 */
export async function revalidateTagInternal(tag: string) {
  try {
    // This can only be called from server components or server actions
    const response = await fetch(`${serverEnv.FRONTEND_URL}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-secret': serverEnv.REVALIDATION_SECRET || '',
      },
      body: JSON.stringify({ tag }),
    });

    if (!response.ok) {
      throw new Error(`Failed to revalidate tag: ${tag}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error revalidating tag:', error);
    throw error;
  }
}
