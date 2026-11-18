// The site is served as static files (GitHub Pages), so routes live in the URL
// hash (e.g. `#/research?topic=education`): deep links and refreshes always
// load index.html.

/** The current route, including any query string, e.g. "/research?topic=education". */
export function readPath(): string {
  return window.location.hash.slice(1) || '/';
}

export function routeHref(path: string): string {
  return `${import.meta.env.BASE_URL}#${path}`;
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
