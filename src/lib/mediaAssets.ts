// Approved photographs will be added through the CMS after migration and review.
export const PRESET_LAB_IMAGES: { label: string; path: string }[] = [];
export function resolveMediaUrl(url: string | undefined | null): string { return url || ''; }
