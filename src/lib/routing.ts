import { isStaticSite } from './api';

// Hash routes keep deep links and refreshes within GitHub Pages' index.html.
export function readPath(): string {
  return isStaticSite ? (window.location.hash.slice(1) || '/') : (window.location.pathname || '/');
}

export function routeHref(path: string): string {
  return isStaticSite ? `${import.meta.env.BASE_URL}#${path}` : path;
}
