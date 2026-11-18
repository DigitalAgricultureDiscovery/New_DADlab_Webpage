import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SITE_CONTENT } from '../src/data/content.ts';
import { PROJECTS } from '../src/data/research/projects.ts';
import { PUBLICATIONS } from '../src/data/publications/publications.ts';
import { NEWS } from '../src/data/news/news.ts';
import { COURSES } from '../src/data/teaching/courses.ts';
import { sortPublications } from '../src/lib/publications.ts';

const c = SITE_CONTENT;

test('only published content is shown', () => {
  assert.equal(c.allProjects.length, PROJECTS.filter((p) => p.publish_status === 'published').length);
  assert.equal(c.allPublications.length, PUBLICATIONS.filter((p) => p.status === 'published').length);
  assert.equal(c.allNews.length, NEWS.filter((n) => n.status !== 'draft').length);
  assert.ok(c.courses.every((course) => course.status !== 'draft'));
  assert.ok(COURSES.some((course) => course.status === 'draft'), 'fixture: a draft course exists and is hidden');
});

test('lists are in display order', () => {
  const ongoing = c.allProjects.map((p) => p.project_status === 'ongoing');
  assert.deepEqual(ongoing, [...ongoing].sort((a, b) => Number(b) - Number(a)), 'ongoing projects first');
  for (let i = 1; i < c.allNews.length; i++) {
    assert.ok(c.allNews[i - 1].published_date >= c.allNews[i].published_date, 'news newest first');
  }
  assert.deepEqual(c.allPublications.map((p) => p.id), sortPublications(PUBLICATIONS).map((p) => p.id));
  const active = c.courses.map((course) => course.status === 'active');
  assert.deepEqual(active, [...active].sort((a, b) => Number(b) - Number(a)), 'current courses first');
});

test('news and course ids are unique', () => {
  assert.equal(new Set(c.allNews.map((n) => n.id)).size, c.allNews.length);
  assert.equal(new Set(c.allNews.map((n) => n.slug)).size, c.allNews.length);
  assert.equal(new Set(c.courses.map((course) => course.id)).size, c.courses.length);
});

test('home page selections respect the profile limits', () => {
  const limits = c.profile.homeLimits;
  assert.ok(c.featuredProjects.length > 0 && c.featuredProjects.length <= limits.projects);
  assert.ok(c.featuredNews.length > 0 && c.featuredNews.length <= limits.news);
  assert.deepEqual(c.featuredPublications, c.allPublications.slice(0, limits.publications));
});
