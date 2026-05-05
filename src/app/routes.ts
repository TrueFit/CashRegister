export type Page = 'calculator' | 'history' | 'settings' | 'denominations' | 'about';

export const appRoutes: Record<Page, string> = {
  calculator: '/',
  history: '/history',
  settings: '/settings',
  denominations: '/denominations',
  about: '/about',
};

const routePages = new Map<string, Page>(
  Object.entries(appRoutes).map(([page, path]) => [path, page as Page]),
);

export function getPageFromPath(pathname: string): Page {
  return routePages.get(pathname) ?? 'calculator';
}

export function isAppRoute(pathname: string): boolean {
  return routePages.has(pathname);
}
