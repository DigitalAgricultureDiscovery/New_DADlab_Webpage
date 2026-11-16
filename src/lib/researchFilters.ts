import type { ProjectStatus, ResearchArea, ResearchProjectItem } from '../types/cms.ts';

/** Filter values: `'all'` or a concrete status / research area id. */
export type StatusFilter = 'all' | ProjectStatus;
export type TopicFilter = 'all' | string;

export interface ResearchFilters {
  status: StatusFilter;
  topic: TopicFilter;
}

export const DEFAULT_FILTERS: ResearchFilters = { status: 'all', topic: 'all' };

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  ongoing: 'Ongoing',
  completed: 'Completed',
  archived: 'Historical',
};

type ProjectLike = Pick<ResearchProjectItem, 'project_status' | 'research_area'> & {
  topics?: string[] | null;
};

/**
 * The research area ids a project belongs to: its explicit `topics`, plus its
 * primary `research_area` (matched by title). The fallback keeps projects that
 * were saved before topics existed filterable by their primary area.
 */
export function projectTopicIds(project: ProjectLike, areas: ResearchArea[] = []): string[] {
  const ids = new Set((project.topics || []).filter(Boolean));
  const primary = areas.find((area) => area.title === project.research_area);
  if (primary) ids.add(primary.id);
  return Array.from(ids);
}

export function matchesFilters(project: ProjectLike, filters: ResearchFilters, areas: ResearchArea[] = []): boolean {
  if (filters.status !== 'all' && project.project_status !== filters.status) return false;
  if (filters.topic !== 'all' && !projectTopicIds(project, areas).includes(filters.topic)) return false;
  return true;
}

/** Status and topic filters combine with AND. Order is preserved. */
export function filterProjects<T extends ProjectLike>(projects: T[], filters: ResearchFilters, areas: ResearchArea[] = []): T[] {
  return projects.filter((project) => matchesFilters(project, filters, areas));
}

export interface FilterOption {
  value: string;
  label: string;
  /** Number of projects matching this option combined with the other active filter. */
  count: number;
}

/**
 * Status options: All, Ongoing, Completed, plus Historical only when some
 * project uses that status. Counts respect the active topic filter.
 */
export function statusOptions(projects: ProjectLike[], filters: ResearchFilters, areas: ResearchArea[] = []): FilterOption[] {
  const statuses: ProjectStatus[] = ['ongoing', 'completed'];
  if (projects.some((p) => p.project_status === 'archived')) statuses.push('archived');
  const count = (status: StatusFilter) => filterProjects(projects, { ...filters, status }, areas).length;
  return [
    { value: 'all', label: 'All Projects', count: count('all') },
    ...statuses.map((status) => ({ value: status, label: STATUS_LABELS[status], count: count(status) })),
  ];
}

/**
 * Topic options: every research area, in profile order, plus any topic id a
 * project uses that is not (or no longer) a research area. Counts respect the
 * active status filter.
 */
export function topicOptions(projects: ProjectLike[], filters: ResearchFilters, areas: ResearchArea[] = []): FilterOption[] {
  const known = new Set(areas.map((a) => a.id));
  const extra = Array.from(new Set(projects.flatMap((p) => projectTopicIds(p, areas)))).filter((id) => !known.has(id));
  const count = (topic: TopicFilter) => filterProjects(projects, { ...filters, topic }, areas).length;
  return [
    { value: 'all', label: 'All Topics', count: count('all') },
    ...areas.map((area) => ({ value: area.id, label: area.shortLabel || area.title, count: count(area.id) })),
    ...extra.map((id) => ({ value: id, label: id, count: count(id) })),
  ];
}

export function topicLabel(id: string, areas: ResearchArea[] = []): string {
  const area = areas.find((a) => a.id === id);
  return area ? area.shortLabel || area.title : id;
}
