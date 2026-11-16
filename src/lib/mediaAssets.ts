// Images live in public/images/ (migrated from the former DAD Lab website).

/**
 * Resolve an image URL from src/data for the browser. Root-relative paths for files
 * in public/ (for example `/images/...`) are prefixed with the deployment base
 * path so they also work when the site is served from a sub-path such as
 * GitHub Pages (`/New_DADlab_Webpage/`). Absolute URLs are returned unchanged.
 */
export function resolveMediaUrl(url: string | undefined | null): string {
  if (!url) return '';
  const base = import.meta.env.BASE_URL || '/';
  if (url.startsWith('/') && !url.startsWith('//') && base !== '/' && !url.startsWith(base)) {
    return `${base.replace(/\/$/, '')}${url}`;
  }
  return url;
}
