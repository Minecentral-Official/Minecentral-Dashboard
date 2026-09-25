'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { catalogService } from '@/features/catalog/queries/catalog-access';
import requirePermission from '@/lib/auth/helpers/require-permission';

export type CatalogActionState = { message?: string; error?: string };
export async function catalogAction(
  _: CatalogActionState,
  data: FormData,
): Promise<CatalogActionState> {
  const { user } = await requirePermission('catalog:curate');
  const text = (key: string) => String(data.get(key) ?? '').trim();
  try {
    switch (text('operation')) {
      case 'sync':
        await catalogService.queue(user.id, {
          provider: text('provider'),
          locator: text('locator'),
        });
        break;
      case 'manual':
        await catalogService.manual(user.id, {
          name: text('name'),
          description: text('description'),
          authors: text('authors')
            .split(',')
            .map((v) => v.trim())
            .filter(Boolean),
          categories: text('categories')
            .split(',')
            .map((v) => v.trim())
            .filter(Boolean),
          platforms: [],
          links: [],
          icon: null,
          url: text('url'),
          reason: text('reason'),
        });
        break;
      case 'merge':
        await catalogService.merge(user.id, {
          from: text('from'),
          into: text('into'),
          reason: text('reason'),
        });
        break;
      case 'curate':
        await catalogService.curate(
          user.id,
          z.string().uuid().parse(text('projectId')),
          { name: text('name'), description: text('description') },
          text('reason'),
        );
        break;
      default:
        return { error: 'Choose a catalog action.' };
    }
  } catch (error) {
    return {
      error:
        error instanceof z.ZodError ?
          'Check the IDs, HTTPS links and required fields. Reasons need at least 10 characters.'
        : (
          error instanceof Error &&
          [
            'Forbidden',
            'Both projects must be published and unmerged.',
            'Project unavailable',
            'Explain the curation decision (10–2000 characters).',
          ].includes(error.message)
        ) ?
          error.message
        : 'Could not save this change. Check the input and try again.',
    };
  }
  revalidatePath('/discover/plugins', 'layout');
  revalidatePath('/admin/catalog');
  revalidatePath('/admin/sources');
  return {
    message:
      text('operation') === 'sync' ?
        'Sync queued. The catalog worker will process it.'
      : 'Catalog change saved.',
  };
}
