import type { SiteProfile } from '../src/types/cms.ts';
import { SITE_PROFILE } from '../src/data/profile.ts';
import { PROJECTS } from '../src/data/research/projects.ts';
import { PUBLICATIONS } from '../src/data/publications/publications.ts';
import { NEWS } from '../src/data/news/news.ts';
import { COURSES } from '../src/data/teaching/courses.ts';

// Seed content for a fresh CMS database and for the GitHub Pages export.
// The content itself lives in src/data/ (see docs/content-audit.md for
// sources); this module only converts it into database row shape.
export const initialProfile: SiteProfile = SITE_PROFILE;

const flag = (value: boolean) => (value ? 1 : 0);

export const initialRecords = {
  publications: PUBLICATIONS.map((p) => ({ ...p, featured_on_home: flag(p.featured_on_home) })),
  projects: PROJECTS.map(({ related_publication_ids, topics, ...p }) => ({
    ...p,
    related_publication_ids_json: JSON.stringify(related_publication_ids),
    topics_json: JSON.stringify(topics),
    featured_on_home: flag(p.featured_on_home),
  })),
  courses: COURSES.map(({ topics, objectives, materials, ...c }) => ({
    ...c,
    topics_json: JSON.stringify(topics),
    objectives_json: JSON.stringify(objectives),
    materials_json: JSON.stringify(materials),
    featured_on_home: flag(c.featured_on_home),
  })),
  news: NEWS.map((n) => ({ ...n, featured_on_home: flag(n.featured_on_home) })),
};
