import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PUBLICATIONS } from '../src/data/publications/publications.ts';

const isHttps = (url: string) => {
  try {
    return new URL(url).protocol === 'https:';
  } catch {
    return false;
  }
};

test('publication ids are unique', () => {
  const ids = PUBLICATIONS.map((p) => p.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('every publication link is empty or an absolute https URL', () => {
  for (const p of PUBLICATIONS) {
    for (const field of ['publication_url', 'doi_url', 'publisher_url'] as const) {
      const url = p[field];
      assert.ok(url === '' || isHttps(url), `#${p.id} ${field} is not an https URL: ${url}`);
    }
  }
});

test('DOI links use https://doi.org/ and the card opens the same DOI', () => {
  for (const p of PUBLICATIONS) {
    if (p.doi_url) {
      assert.match(p.doi_url, /^https:\/\/doi\.org\/10\.\d{4,9}\/\S+$/, `#${p.id} doi_url`);
      assert.equal(p.publication_url, p.doi_url, `#${p.id} card link should be its DOI`);
    }
  }
});
