import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TEAM_MEMBERS } from '../src/data/people/team.ts';
import { SITE_PROFILE } from '../src/data/profile.ts';
import { isLinkedInProfileUrl, personInitials } from '../src/lib/people.ts';

test('roster has unique ids and valid groups', () => {
  assert.equal(TEAM_MEMBERS.length, 37);
  assert.equal(new Set(TEAM_MEMBERS.map((m) => m.id)).size, TEAM_MEMBERS.length);
  const count = (category: string) => TEAM_MEMBERS.filter((m) => m.category === category).length;
  assert.equal(count('Faculty'), 1);
  assert.equal(count('PhD Student'), 2);
  assert.equal(count('MS Student'), 0);
  assert.equal(count('Visiting Researcher'), 7);
  assert.equal(count('Undergraduate'), 15);
  assert.equal(count('Former Staff'), 1);
  assert.equal(count('Alumni'), 11);
  assert.equal(SITE_PROFILE.teamMembers, TEAM_MEMBERS);
});

test('LinkedIn links are well-formed public profile URLs', () => {
  const withLinkedIn = TEAM_MEMBERS.filter((m) => m.linkedin);
  assert.equal(withLinkedIn.length, 36);
  for (const member of withLinkedIn) assert.ok(isLinkedInProfileUrl(member.linkedin!), `${member.name}: ${member.linkedin}`);
  assert.equal(new Set(withLinkedIn.map((m) => m.linkedin)).size, withLinkedIn.length, 'duplicate LinkedIn URL');
  assert.deepEqual(TEAM_MEMBERS.filter((m) => !m.linkedin).map((m) => m.name), ['Jeff Fiechter']);
  assert.ok(isLinkedInProfileUrl(SITE_PROFILE.linkedinUrl!));
  assert.ok(!isLinkedInProfileUrl('https://linkedin.com/in/someone'));
  assert.ok(!isLinkedInProfileUrl('https://www.linkedin.com/company/purdue'));
});

test('no workbook verification notes leak into published text', () => {
  for (const member of TEAM_MEMBERS) {
    const text = `${member.role} ${member.focus}`;
    assert.ok(!/confirm|verify|to check|TBD|\?/i.test(text), `${member.name}: ${text}`);
  }
});

test('initials avatars use first and last name initials', () => {
  assert.equal(personInitials('Dr. Benjamin (Ben) Hancock'), 'BH');
  assert.equal(personInitials('Dr. Dharmendra Saraswat'), 'DS');
  assert.equal(personInitials('Gyu Ri Ha'), 'GH');
  assert.equal(personInitials('Udaiveer Singh'), 'US');
  assert.equal(personInitials('Divyanth L.G.'), 'DL');
  assert.equal(personInitials('Sangeetharani M.'), 'SM');
  assert.equal(personInitials('Madonna'), 'M');
  assert.equal(personInitials(''), '?');
});
