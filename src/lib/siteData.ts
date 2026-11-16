import type { PublicBootstrapData } from '../types/cms.ts';
import { SITE_PROFILE } from '../data/profile.ts';
import { PUBLICATIONS } from '../data/publications/publications.ts';
import { PROJECTS } from '../data/research/projects.ts';
import { COURSES } from '../data/teaching/courses.ts';
import { NEWS } from '../data/news/news.ts';
import { OPPORTUNITIES } from '../data/opportunities/opportunities.ts';

// Stable sort: items that compare equal keep their order from the data files.
const sortBy = <T,>(items: T[], compare: (a: T, b: T) => number) =>
  items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => compare(a.item, b.item) || a.index - b.index)
    .map(({ item }) => item);

const asc = (a: string | number, b: string | number) => (a < b ? -1 : a > b ? 1 : 0);
const desc = (a: string | number, b: string | number) => asc(b, a);
const notOngoingLast = (status: string) => Number(status !== 'ongoing');

/**
 * Builds what the public pages render from the content in src/data/: hides
 * drafts, orders each list, and picks the items featured on the home page.
 * The site is static, so this runs in the browser on bundled data.
 */
export function getSiteData(): PublicBootstrapData {
  const profile = SITE_PROFILE;

  // Courses and news have no ids in src/data; number them in file order.
  const courses = COURSES.map((c, i) => ({ ...c, id: i + 1 }));
  const news = NEWS.map((n, i) => ({ ...n, id: i + 1, attachments: [] }));

  const allProjects = sortBy(
    PROJECTS.filter((p) => p.publish_status === 'published'),
    (a, b) => notOngoingLast(a.project_status) - notOngoingLast(b.project_status) || asc(a.id, b.id),
  );

  const allNews = sortBy(
    news.filter((n) => n.status === 'published' || n.status === 'archived'),
    (a, b) => desc(a.published_date, b.published_date) || desc(a.id, b.id),
  );

  const allPublications = sortBy(
    PUBLICATIONS.filter((p) => p.status === 'published'),
    (a, b) => desc(a.year, b.year) || desc(a.id, b.id),
  );

  const visibleCourses = sortBy(
    courses.filter((c) => c.status === 'active' || c.status === 'archived'),
    (a, b) =>
      Number(a.status !== 'active') - Number(b.status !== 'active') ||
      desc(a.academic_year, b.academic_year) ||
      asc(a.course_number, b.course_number),
  );

  const opportunities = sortBy(
    OPPORTUNITIES.filter((o) => o.publish_status === 'published' && o.position_status !== 'Archived'),
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
    opportunities,
  };
}
