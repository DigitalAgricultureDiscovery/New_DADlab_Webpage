// The welcome animation plays at most once every two hours per browser.
// A small first-party cookie remembers when it last played.

export const INTRO_COOKIE = 'dadlab_intro_seen';
export const INTRO_INTERVAL_SECONDS = 2 * 60 * 60;

/** True unless the cookie string shows the intro already played (cookie still unexpired). */
export function shouldPlayIntro(cookieString: string): boolean {
  return !cookieString.split(';').some((part) => part.trim().startsWith(`${INTRO_COOKIE}=`));
}

/** Cookie that suppresses the intro for the next two hours (the browser drops it after that). */
export function introSeenCookie(secure: boolean): string {
  return `${INTRO_COOKIE}=1; Max-Age=${INTRO_INTERVAL_SECONDS}; Path=/; SameSite=Lax${secure ? '; Secure' : ''}`;
}

/** Whether to play now: not recently played, and the visitor has not asked for reduced motion. */
export function introWanted(): boolean {
  try {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false;
    return shouldPlayIntro(document.cookie);
  } catch {
    return false;
  }
}

export function markIntroSeen(): void {
  try {
    document.cookie = introSeenCookie(window.location.protocol === 'https:');
  } catch {
    // Cookies blocked: the intro may play again on the next visit, which is harmless.
  }
}
