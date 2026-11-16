import type { PublicBootstrapData } from '../types/cms';
import { courses, news, opportunities, profile, projects, publications } from './siteContent';

// Stable sort: items that compare equal keep their order from siteContent.ts.
const sortBy = <T,>(items: T[], compare: (a: T, b: T) => number) =>
  items.map((item, index) => ({ item, index }))
    .sort((a, b) => compare(a.item, b.item) || a.index - b.index)
    .map(({ item }) => item);

const desc = (a: string | number, b: string | number) => (a < b ? 1 : a > b ? -1 : 0);

/**
 * Builds the data the public pages render: hides drafts, orders each list,
 * and picks the items featured on the home page.
 */
export function getSiteData(): PublicBootstrapData {
  const allProjects = sortBy(
    projects.filter((p) => p.publish_status === 'published'),
    (a, b) => Number(a.project_status !== 'ongoing') - Number(b.project_status !== 'ongoing'),
  );

  const allNews = sortBy(
    news.filter((n) => n.status === 'published' || n.status === 'archived'),
    (a, b) => desc(a.published_date, b.published_date) || desc(a.id, b.id),
  );

  const allPublications = sortBy(
    publications.filter((p) => p.status === 'published'),
    (a, b) => desc(a.year, b.year) || desc(a.id, b.id),
  );

  const visibleCourses = sortBy(
    courses.filter((c) => c.status === 'active' || c.status === 'archived'),
    (a, b) =>
      Number(a.status !== 'active') - Number(b.status !== 'active') ||
      desc(a.academic_year, b.academic_year) ||
      a.course_number.localeCompare(b.course_number),
  );

  const visibleOpportunities = sortBy(
    opportunities.filter((o) => o.publish_status === 'published' && o.position_status !== 'Archived'),
    (a, b) => Number(a.position_status !== 'Open') - Number(b.position_status !== 'Open'),
  );

  const featuredProjects = allProjects
    .filter((p) => p.featured_on_home)
    .slice(0, profile.homeLimits?.projects ?? 3);
  const featuredNews = allNews
    .filter((n) => n.status === 'published' && n.featured_on_home)
    .slice(0, profile.homeLimits?.news ?? 3);
  const featuredPublications = allPublications
    .filter((p) => p.featured_on_home)
    .slice(0, profile.homeLimits?.publications ?? 4);

  return {
    profile,
    featuredProjects: featuredProjects.length ? featuredProjects : allProjects.slice(0, 3),
    allProjects,
    featuredNews: featuredNews.length ? featuredNews : allNews.slice(0, 3),
    allNews,
    featuredPublications: featuredPublications.length ? featuredPublications : allPublications.slice(0, 4),
    allPublications,
    courses: visibleCourses,
    opportunities: visibleOpportunities,
  };
}
