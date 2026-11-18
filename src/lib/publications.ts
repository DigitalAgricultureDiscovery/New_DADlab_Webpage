import type { PublicationItem } from '../types/cms.ts';

type PublicationLike = Pick<PublicationItem, 'id' | 'year'>;

/**
 * Newest first: by publication year, then by id (higher ids were added later).
 * Shared by the Publications page and the home page's recent publications so
 * the two always agree. Returns a new array.
 */
export function sortPublications<T extends PublicationLike>(publications: T[]): T[] {
  return [...publications].sort((a, b) => b.year - a.year || b.id - a.id);
}

/** The `limit` most recent publications, in the Publications page's order. */
export function recentPublications<T extends PublicationLike>(publications: T[], limit: number): T[] {
  return sortPublications(publications).slice(0, Math.max(0, limit));
}
