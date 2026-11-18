import { test } from 'node:test';
import assert from 'node:assert/strict';
import { INTRO_COOKIE, INTRO_INTERVAL_SECONDS, introSeenCookie, shouldPlayIntro } from '../src/lib/intro.ts';

test('intro plays when the cookie is absent', () => {
  assert.equal(shouldPlayIntro(''), true);
  assert.equal(shouldPlayIntro('theme=dark; other=1'), true);
  assert.equal(shouldPlayIntro(`not_${INTRO_COOKIE}=1`), true);
});

test('intro is skipped while the cookie is set', () => {
  assert.equal(shouldPlayIntro(`${INTRO_COOKIE}=1`), false);
  assert.equal(shouldPlayIntro(`a=1; ${INTRO_COOKIE}=1; b=2`), false);
});

test('cookie lasts two hours and is first-party only', () => {
  assert.equal(INTRO_INTERVAL_SECONDS, 7200);
  const cookie = introSeenCookie(true);
  assert.match(cookie, new RegExp(`^${INTRO_COOKIE}=1;`));
  assert.match(cookie, /Max-Age=7200/);
  assert.match(cookie, /Path=\//);
  assert.match(cookie, /SameSite=Lax/);
  assert.match(cookie, /Secure/);
  assert.doesNotMatch(introSeenCookie(false), /Secure/);
});
