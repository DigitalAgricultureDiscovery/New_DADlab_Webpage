export function sanitizeHtmlClient(input: string): string {
  if (!input) return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^>]*>/gi, '')
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, '')
    .replace(/javascript:/gi, '#blocked:');
}

export function formatAcademicDate(isoDate: string): string {
  if (!isoDate) return '';
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  const year = Number(parts[0]);
  const month = Number(parts[1]) - 1;
  const day = Number(parts[2]);
  const d = new Date(Date.UTC(year, month, day));
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatMonthYear(isoDate: string): { year: string; monthLabel: string; monthKey: string } {
  const parts = isoDate.split('-');
  if (parts.length < 2) {
    return { year: 'Undated', monthLabel: 'General', monthKey: '0000-00' };
  }
  const year = parts[0];
  const monthIdx = Number(parts[1]) - 1;
  const d = new Date(Date.UTC(Number(year), monthIdx, 1));
  const monthLabel = Number.isNaN(d.getTime())
    ? parts[1]
    : d.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'long' });
  return { year, monthLabel, monthKey: `${year}-${parts[1]}` };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
