/** "Dr. Benjamin (Ben) Hancock" -> "BH": first and last name initials, ignoring titles and nicknames. */
export function personInitials(name: string): string {
  const words = name
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\b(Dr|Prof|Mr|Ms|Mrs)\.?\s/gi, ' ')
    .split(/\s+/)
    .filter((w) => /[A-Za-z]/.test(w));
  if (words.length === 0) return '?';
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : '';
  return (first + last).toUpperCase();
}

/** True for a public LinkedIn profile URL ("https://www.linkedin.com/in/<slug>"). */
export function isLinkedInProfileUrl(url: string): boolean {
  return /^https:\/\/www\.linkedin\.com\/in\/[A-Za-z0-9\-_%]+\/?$/.test(url);
}
