import type { Award, SiteProfile } from '../types/cms.ts';

/** One-line form used for the legacy `piHonors` list: "YEAR — Award, Organization". */
export function awardLine(award: Award): string {
  return `${award.year} — ${award.title}${award.organization ? `, ${award.organization}` : ''}`;
}

/** Parse a legacy one-line honor ("2018 — ASABE Standards Award") into a structured award. */
export function parseHonorLine(line: string): Award {
  const match = line.match(/^\s*([0-9][0-9,\s\-–]*?)\s*[—–-]\s+(.+)$/);
  return match ? { year: match[1].trim(), title: match[2].trim() } : { year: '', title: line.trim() };
}

/** The profile's awards: structured awards when present, otherwise the legacy one-line honors. */
export function profileAwards(profile: Pick<SiteProfile, 'piAwards' | 'piHonors'>): Award[] {
  if (profile.piAwards && profile.piAwards.length > 0) return profile.piAwards;
  return (profile.piHonors || []).filter((line) => line.trim()).map(parseHonorLine);
}

/** Group consecutive awards that share a year, keeping the list's order (newest first). */
export function groupAwardsByYear(awards: Award[]): { year: string; awards: Award[] }[] {
  const groups: { year: string; awards: Award[] }[] = [];
  for (const award of awards) {
    const last = groups[groups.length - 1];
    if (last && last.year === award.year) last.awards.push(award);
    else groups.push({ year: award.year, awards: [award] });
  }
  return groups;
}
