import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { PROJECTS } from '../src/data/research/projects.ts';
import { RESEARCH_AREAS } from '../src/data/research/areas.ts';
import { PUBLICATIONS } from '../src/data/publications/publications.ts';
import { NEWS } from '../src/data/news/news.ts';
import { SITE_PROFILE } from '../src/data/profile.ts';
import {
  DEFAULT_FILTERS,
  filterProjects,
  projectTopicIds,
  statusOptions,
  topicOptions,
  type ResearchFilters,
} from '../src/lib/researchFilters.ts';

const areas = RESEARCH_AREAS;
const slugs = (filters: ResearchFilters) => filterProjects(PROJECTS, filters, areas).map((p) => p.slug);
const STATUSES = ['all', 'ongoing', 'completed'] as const;
const TOPICS = ['all', ...areas.map((a) => a.id)];

test('All Projects shows every project', () => {
  assert.equal(filterProjects(PROJECTS, DEFAULT_FILTERS, areas).length, PROJECTS.length);
});

test('status filter returns exactly the projects with that status', () => {
  const ongoing = slugs({ status: 'ongoing', topic: 'all' });
  const completed = slugs({ status: 'completed', topic: 'all' });
  assert.deepEqual(ongoing.sort(), [
    'affordable-seed-drill-india',
    'ai-chatbots-llms-agriculture',
    'spear-next-earth-representation-learning',
  ]);
  assert.ok(completed.length > 0);
  assert.equal(ongoing.length + completed.length, PROJECTS.length);
  assert.ok(completed.every((s) => PROJECTS.find((p) => p.slug === s)!.project_status === 'completed'));
  assert.ok(!completed.some((s) => ongoing.includes(s)));
});

test('topic filter returns only, and all, projects tagged with that topic', () => {
  for (const area of areas) {
    const result = filterProjects(PROJECTS, { status: 'all', topic: area.id }, areas);
    assert.ok(result.length > 0, `${area.title} should have projects`);
    assert.ok(result.every((p) => projectTopicIds(p, areas).includes(area.id)));
    const expected = PROJECTS.filter((p) => p.topics.includes(area.id));
    assert.equal(result.length, expected.length, area.title);
  }
});

test('projects with several topics appear under each of them', () => {
  const multi = PROJECTS.filter((p) => p.topics.length > 1);
  assert.ok(multi.length > 0);
  for (const project of multi) {
    for (const topic of project.topics) {
      assert.ok(slugs({ status: 'all', topic }).includes(project.slug), `${project.slug} under ${topic}`);
    }
  }
});

test('every status and topic combination is the intersection of both filters', () => {
  for (const status of STATUSES) {
    for (const topic of TOPICS) {
      const expected = PROJECTS.filter(
        (p) => (status === 'all' || p.project_status === status) && (topic === 'all' || p.topics.includes(topic))
      ).map((p) => p.slug);
      assert.deepEqual(slugs({ status, topic }), expected, `${status} + ${topic}`);
    }
  }
});

test('Ongoing + Artificial Intelligence returns only ongoing AI projects', () => {
  assert.deepEqual(slugs({ status: 'ongoing', topic: 'area-1' }).sort(), [
    'ai-chatbots-llms-agriculture',
    'spear-next-earth-representation-learning',
  ]);
});

test('combinations with no matching projects return an empty list', () => {
  assert.deepEqual(slugs({ status: 'ongoing', topic: 'area-4' }), []);
  assert.deepEqual(slugs({ status: 'completed', topic: 'missing-topic' }), []);
});

test('filter option counts reflect the other active filter', () => {
  const byValue = (options: { value: string; count: number }[]) => Object.fromEntries(options.map((o) => [o.value, o.count]));
  const statusCounts = byValue(statusOptions(PROJECTS, { status: 'all', topic: 'area-1' }, areas));
  assert.equal(statusCounts.all, slugs({ status: 'all', topic: 'area-1' }).length);
  assert.equal(statusCounts.ongoing, 2);
  assert.ok(!('archived' in statusCounts), 'Historical option is hidden when unused');
  const topicCounts = byValue(topicOptions(PROJECTS, { status: 'ongoing', topic: 'all' }, areas));
  assert.equal(topicCounts.all, 3);
  assert.equal(topicCounts['area-4'], 0);
  assert.equal(topicCounts['area-6'], 1);
});

test('projects saved before topics existed fall back to their primary research area', () => {
  const legacy = { project_status: 'completed' as const, research_area: areas[3].title, topics: [] };
  assert.deepEqual(projectTopicIds(legacy, areas), [areas[3].id]);
  assert.equal(filterProjects([legacy], { status: 'completed', topic: areas[3].id }, areas).length, 1);
});

test('project, publication, news, and people data are internally consistent', () => {
  const areaIds = new Set(areas.map((a) => a.id));
  const areaTitles = new Set(areas.map((a) => a.title));
  const pubIds = new Set(PUBLICATIONS.map((p) => p.id));
  const publicFile = (url: string) => path.join('public', url.replace(/^\//, ''));
  assert.equal(new Set(PROJECTS.map((p) => p.slug)).size, PROJECTS.length, 'unique slugs');
  assert.equal(new Set(PROJECTS.map((p) => p.id)).size, PROJECTS.length, 'unique ids');
  for (const project of PROJECTS) {
    assert.ok(['ongoing', 'completed'].includes(project.project_status), project.slug);
    assert.ok(project.topics.length > 0 && project.topics.every((t) => areaIds.has(t)), `${project.slug} topics`);
    assert.equal(project.research_area, areas.find((a) => a.id === project.topics[0])!.title, `${project.slug} primary area`);
    assert.ok(project.related_publication_ids.every((id) => pubIds.has(id)), `${project.slug} publications`);
    if (project.image_url) assert.ok(fs.existsSync(publicFile(project.image_url)), project.image_url);
  }
  assert.equal(pubIds.size, PUBLICATIONS.length, 'unique publication ids');
  for (const pub of PUBLICATIONS) assert.ok(areaTitles.has(pub.topic), `${pub.title} topic`);
  assert.equal(new Set(NEWS.map((n) => n.slug)).size, NEWS.length, 'unique news slugs');
  for (const item of NEWS) {
    assert.match(item.published_date, /^\d{4}(-\d{2}-\d{2})?$/, item.slug);
    if (item.image_url) assert.ok(fs.existsSync(publicFile(item.image_url)), item.image_url);
  }
  for (const url of [SITE_PROFILE.piPortraitUrl, SITE_PROFILE.heroImageUrl, SITE_PROFILE.logoUrl!]) {
    assert.ok(fs.existsSync(publicFile(url)), url);
  }
  for (const member of SITE_PROFILE.teamMembers) {
    if (member.photoUrl) assert.ok(fs.existsSync(publicFile(member.photoUrl)), member.photoUrl);
  }
});
