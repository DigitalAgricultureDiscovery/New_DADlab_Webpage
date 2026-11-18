import type { CourseItem, NewsItem, SiteContent } from '../types/content.ts';
import { SITE_PROFILE } from './profile.ts';
import { PROJECTS } from './research/projects.ts';
import { PUBLICATIONS } from './publications/publications.ts';
import { NEWS } from './news/news.ts';
import { COURSES } from './teaching/courses.ts';
import { OPPORTUNITIES } from './opportunities.ts';
import { recentPublications, sortPublications } from '../lib/publications.ts';

/**
 * Assembles the public site's content from the files in src/data/: drops
 * drafts, puts each list in display order, and picks the home page items.
 * The site is static (GitHub Pages), so this is the only content source.
 */
export function buildSiteContent(): SiteContent {
  const profile = SITE_PROFILE;
  const limits = profile.homeLimits;

  // Ongoing projects first, then in file order.
  const allProjects = PROJECTS.filter((p) => p.publish_status === 'published').sort(
    (a, b) => Number(a.project_status !== 'ongoing') - Number(b.project_status !== 'ongoing') || a.id - b.id,
  );

  // Ids follow file order; newest first by date, then by id.
  const allNews: NewsItem[] = NEWS.map((n, i) => ({ ...n, id: i + 1, attachments: [] }))
    .filter((n) => n.status === 'published' || n.status === 'archived')
    .sort((a, b) => b.published_date.localeCompare(a.published_date) || b.id - a.id);

  const allPublications = sortPublications(PUBLICATIONS.filter((p) => p.status === 'published'));

  // Current courses first, then newest academic year, then course number.
  const courses: CourseItem[] = COURSES.map((c, i) => ({ ...c, id: i + 1 }))
    .filter((c) => c.status === 'active' || c.status === 'archived')
    .sort(
      (a, b) =>
        Number(a.status !== 'active') - Number(b.status !== 'active') ||
        b.academic_year.localeCompare(a.academic_year) ||
        a.course_number.localeCompare(b.course_number),
    );

  // Open positions first; archived and draft positions are hidden.
  const opportunities = OPPORTUNITIES.filter((o) => o.publish_status === 'published' && o.position_status !== 'Archived').sort(
    (a, b) => Number(a.position_status !== 'Open') - Number(b.position_status !== 'Open'),
  );

  const featuredProjects = allProjects.filter((p) => p.featured_on_home).slice(0, limits?.projects ?? 3);
  const featuredNews = allNews.filter((n) => n.status === 'published' && n.featured_on_home).slice(0, limits?.news ?? 3);

  return {
    profile,
    featuredProjects: featuredProjects.length ? featuredProjects : allProjects.slice(0, 3),
    allProjects,
    featuredNews: featuredNews.length ? featuredNews : allNews.slice(0, 3),
    allNews,
    featuredPublications: recentPublications(allPublications, limits?.publications ?? 4),
    allPublications,
    courses,
    opportunities,
  };
}

export const SITE_CONTENT: SiteContent = buildSiteContent();
