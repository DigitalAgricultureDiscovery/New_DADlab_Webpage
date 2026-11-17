import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PUBLICATIONS } from '../src/data/publications/publications.ts';
import { RESEARCH_AREAS } from '../src/data/research/areas.ts';

const TYPES = new Set(['Journal Article', 'Conference Paper', 'Workshop', 'Book Chapter', 'Preprint', 'Technical Report']);

test('publication list matches the Google Scholar-verified workbook', () => {
  assert.equal(PUBLICATIONS.length, 80);
  assert.deepEqual(PUBLICATIONS.map((p) => p.id), Array.from({ length: 80 }, (_, i) => i + 1), 'ids 1-80, existing ids kept');
  assert.equal(PUBLICATIONS.filter((p) => p.featured_on_home).length, 4);
  const titles = PUBLICATIONS.map((p) => p.title.toLowerCase());
  assert.equal(new Set(titles).size, titles.length, 'duplicate title');
  const dois = PUBLICATIONS.map((p) => p.doi_url).filter(Boolean);
  assert.equal(new Set(dois).size, dois.length, 'duplicate DOI');
});

test('publications are well-formed', () => {
  const topics = new Set(RESEARCH_AREAS.map((a) => a.title));
  for (const p of PUBLICATIONS) {
    assert.ok(p.year >= 2000 && p.year <= 2026, `${p.title}: ${p.year}`);
    assert.ok(TYPES.has(p.pub_type), `${p.title}: ${p.pub_type}`);
    assert.ok(topics.has(p.topic), `${p.title}: ${p.topic}`);
    assert.ok(/Saraswat, D\./.test(p.authors), `${p.title}: PI missing from authors`);
    assert.equal(p.title, p.title.trim());
    if (p.doi_url) assert.match(p.doi_url, /^https:\/\/doi\.org\/10\.\d{4,9}\/\S+$/, p.title);
    for (const url of [p.publisher_url, p.pdf_url]) if (url) assert.match(url, /^https:\/\//, p.title);
  }
});

test('corrections from the verified workbook are applied', () => {
  const byId = new Map(PUBLICATIONS.map((p) => [p.id, p]));
  assert.equal(byId.get(2)!.authors, 'Ahmad, A., El Gamal, A., and Saraswat, D.');
  assert.ok(byId.get(2)!.title.startsWith('Toward Generalization'));
  assert.equal(byId.get(24)!.year, 2012);
  assert.equal(byId.get(25)!.authors, 'Pai, N., Saraswat, D., and Daniels, M.');
  assert.ok(byId.get(5)!.authors.includes('Mishra, S. K.'));
});

test('weed-control review is listed once, dated 2026 as confirmed by the PI', () => {
  const matches = PUBLICATIONS.filter((p) => p.title.startsWith('Comprehensive Review of Artificial Intelligence and Edge Computing'));
  assert.equal(matches.length, 1);
  assert.equal(matches[0].year, 2026);
  assert.equal(matches[0].publisher_url, 'https://ojs.bonviewpress.com/index.php/AIA/article/view/8867');
});
