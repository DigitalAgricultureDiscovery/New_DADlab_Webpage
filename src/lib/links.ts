/**
 * Returns the URL if it is an absolute http(s) link, otherwise ''.
 * Guards external links built from content data against malformed or unsafe values.
 */
export function safeExternalUrl(url: string | undefined | null): string {
  if (!url) return '';
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.href : '';
  } catch {
    return '';
  }
}
