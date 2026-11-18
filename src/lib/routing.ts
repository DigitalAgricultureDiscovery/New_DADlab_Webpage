import { isStaticSite } from './api';

// Hash routes keep deep links and refreshes within GitHub Pages' index.html.
// The returned path includes any query string, e.g. "/research?topic=education".
export function readPath(): string {
  return isStaticSite
    ? (window.location.hash.slice(1) || '/')
    : `${window.location.pathname || '/'}${window.location.search}`;
}

/** Splits "/research?topic=x" into its route ("/research") and query parameters. */
export function splitPath(path: string): { route: string; query: URLSearchParams } {
  const index = path.indexOf('?');
  if (index === -1) return { route: path || '/', query: new URLSearchParams() };
  return { route: path.slice(0, index) || '/', query: new URLSearchParams(path.slice(index + 1)) };
}

/** Replaces the current URL without navigating (keeps a bookmarkable URL in sync with page state). */
export function replacePath(path: string): void {
  if (path !== readPath()) window.history.replaceState(window.history.state, '', routeHref(path));
}

export function routeHref(path: string): string {
  return isStaticSite ? `${import.meta.env.BASE_URL}#${path}` : path;
}
