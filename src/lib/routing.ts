// The site is served as static files (GitHub Pages), which only knows index.html.
// Hash routes (e.g. #/research) keep deep links and refreshes working there.
export function readPath(): string {
  return window.location.hash.slice(1) || '/';
}

export function routeHref(path: string): string {
  return `${import.meta.env.BASE_URL}#${path}`;
}
