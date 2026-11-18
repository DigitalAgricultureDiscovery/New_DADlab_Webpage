export type ProfileLinkKind = 'linkedin' | 'scholar' | 'github' | 'orcid';

export const PROFILE_LINK_LABELS: Record<ProfileLinkKind, string> = {
  linkedin: 'LinkedIn',
  scholar: 'Google Scholar',
  github: 'GitHub',
  orcid: 'ORCID',
};

/** Recognizes LinkedIn, Google Scholar, GitHub and ORCID URLs; other URLs return undefined. */
export function profileLinkKind(url: string): ProfileLinkKind | undefined {
  let host: string;
  try {
    host = new URL(url).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return undefined;
  }
  if (host === 'linkedin.com' || host.endsWith('.linkedin.com')) return 'linkedin';
  if (host.startsWith('scholar.google.')) return 'scholar';
  if (host === 'github.com') return 'github';
  if (host === 'orcid.org') return 'orcid';
  return undefined;
}

/** `tel:` URL for a displayed phone number; US 10-digit numbers get +1. */
export function phoneHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '');
  if (/^\d{10}$/.test(digits)) return `tel:+1${digits}`;
  return `tel:${digits}`;
}
