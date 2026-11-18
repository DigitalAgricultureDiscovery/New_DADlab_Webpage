import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PUBLICATIONS } from '../src/data/publications/publications.ts';
import { PROJECTS } from '../src/data/research/projects.ts';
import { RESEARCH_AREAS } from '../src/data/research/areas.ts';
import { SITE_PROFILE } from '../src/data/profile.ts';
import { recentPublications, sortPublications } from '../src/lib/publications.ts';
import {
  DEFAULT_FILTERS,
  filterProjects,
  researchTopicPath,
  topicFromParam,
  topicSlug,
} from '../src/lib/researchFilters.ts';
import { phoneHref, profileLinkKind } from '../src/lib/profileLinks.ts';

const areas = RESEARCH_AREAS;

test('publications sort newest first by year, then by id', () => {
  const sorted = sortPublications(PUBLICATIONS);
  assert.equal(sorted.length, PUBLICATIONS.length);
  for (let i = 1; i < sorted.length; i++) {
    const [a, b] = [sorted[i - 1], sorted[i]];
    assert.ok(a.year > b.year || (a.year === b.year && a.id > b.id), `${a.id} before ${b.id}`);
  }
  // The input is not reordered in place.
  assert.equal(PUBLICATIONS[0].id, 1);
});

test('home publications are the top entries of the Publications page order', () => {
  const limit = SITE_PROFILE.homeLimits.publications;
  const home = recentPublications(PUBLICATIONS, limit);
  assert.equal(home.length, limit);
  assert.deepEqual(home.map((p) => p.id), sortPublications(PUBLICATIONS).slice(0, limit).map((p) => p.id));
  const newestYear = Math.max(...PUBLICATIONS.map((p) => p.year));
  assert.equal(home[0].year, newestYear);
});

test('every research area has a readable, unique topic link', () => {
  const paths = areas.map((area) => researchTopicPath(area.id, areas));
  assert.equal(new Set(paths).size, areas.length);
  for (const area of areas) {
    const slug = topicSlug(area.id, areas);
    assert.match(slug, /^[a-z0-9]+(-[a-z0-9]+)*$/);
    assert.equal(researchTopicPath(area.id, areas), `/research?topic=${slug}`);
    // The link resolves back to the same topic filter.
    assert.equal(topicFromParam(slug, PROJECTS, areas), area.id);
  }
  assert.equal(topicSlug('area-2', areas), 'remote-sensing-uas');
  assert.equal(researchTopicPath('all', areas), '/research');
});

test('topic links also accept area ids and full-title slugs', () => {
  assert.equal(topicFromParam('area-4', PROJECTS, areas), 'area-4');
  assert.equal(topicFromParam('environmental-and-watershed-modeling', PROJECTS, areas), 'area-4');
  assert.equal(topicFromParam('Watershed Modeling', PROJECTS, areas), 'area-4');
});

test('unknown or empty topics fall back to all research', () => {
  for (const value of ['nonsense', '', '   ', null, undefined]) {
    assert.equal(topicFromParam(value, PROJECTS, areas), undefined);
  }
  assert.equal(filterProjects(PROJECTS, DEFAULT_FILTERS, areas).length, PROJECTS.length);
});

test('profile URLs are recognized by service', () => {
  assert.equal(profileLinkKind(SITE_PROFILE.linkedinUrl!), 'linkedin');
  assert.equal(profileLinkKind(SITE_PROFILE.googleScholarUrl), 'scholar');
  assert.equal(profileLinkKind(SITE_PROFILE.githubUrl), 'github');
  assert.equal(profileLinkKind(SITE_PROFILE.orcidUrl), 'orcid');
  assert.equal(profileLinkKind('https://www.purdue.edu/'), undefined);
  assert.equal(profileLinkKind('not a url'), undefined);
});

test('office phone is listed and dialable', () => {
  assert.equal(SITE_PROFILE.piPhone, '765-494-5013');
  assert.equal(phoneHref(SITE_PROFILE.piPhone), 'tel:+17654945013');
});
