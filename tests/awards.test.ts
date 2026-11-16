import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AWARDS } from '../src/data/awards/awards.ts';
import { SITE_PROFILE } from '../src/data/profile.ts';
import { awardLine, groupAwardsByYear, parseHonorLine, profileAwards } from '../src/lib/awards.ts';

const firstYear = (year: string) => Number(year.match(/\d{4}/)?.[0]);

test('awards list is complete, well-formed, and newest first', () => {
  assert.equal(AWARDS.length, 37);
  for (const award of AWARDS) {
    assert.match(award.year, /^\d{4}(-\d{2})?$/, award.title);
    assert.ok(award.title.trim().length > 0);
    assert.ok(!/\b(my|me|I)\b/.test(`${award.title} ${award.details || ''}`), `first person in: ${award.title}`);
  }
  for (let i = 1; i < AWARDS.length; i++) {
    assert.ok(firstYear(AWARDS[i].year) <= firstYear(AWARDS[i - 1].year), `order at ${AWARDS[i].title}`);
  }
  assert.equal(AWARDS[0].year, '2026');
  assert.equal(AWARDS[AWARDS.length - 1].title, 'Third rank in a class of 42 students');
});

test('site profile publishes the structured awards and a matching one-line list', () => {
  assert.equal(SITE_PROFILE.piAwards, AWARDS);
  assert.deepEqual(SITE_PROFILE.piHonors, AWARDS.map(awardLine));
  assert.equal(awardLine(AWARDS[0]), '2026 — Excellence in International Engagement, Asian Association for Agricultural Engineering (AAAE)');
});

test('awards group by year in display order', () => {
  const groups = groupAwardsByYear(AWARDS);
  assert.equal(groups.length, 19);
  assert.deepEqual(groups.slice(0, 3).map((g) => [g.year, g.awards.length]), [['2026', 1], ['2025', 4], ['2023', 2]]);
  assert.equal(groups.reduce((n, g) => n + g.awards.length, 0), AWARDS.length);
});

test('profiles with only one-line honors still show awards', () => {
  const legacy = { piHonors: ['2017, 2015, 2013 — ASABE Educational Aids Blue Ribbon Award', 'Unparsed honor'], piAwards: [] };
  assert.deepEqual(profileAwards(legacy), [
    { year: '2017, 2015, 2013', title: 'ASABE Educational Aids Blue Ribbon Award' },
    { year: '', title: 'Unparsed honor' },
  ]);
  assert.deepEqual(parseHonorLine('1990-91 — IARI Senior Fellowship'), { year: '1990-91', title: 'IARI Senior Fellowship' });
  assert.equal(profileAwards({ piHonors: ['x'], piAwards: AWARDS }), AWARDS);
});
