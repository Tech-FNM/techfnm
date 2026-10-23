// Ask the server to drop its cached HTML for these URLs after an admin save,
// so crawlers immediately get the new title / H1 / content. Fire-and-forget.
export function revalidatePaths(paths: Array<string | null | undefined>) {
  const list = paths.filter(Boolean) as string[];
  if (!list.length || typeof fetch === 'undefined') return;
  fetch('/api/revalidate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paths: list }),
  }).catch(() => {});
}

const PAGE_PATHS: Record<string, string> = {
  'page-home': '/',
  'page-about': '/about',
  'page-services': '/services',
  'page-portfolio': '/portfolio',
  'page-blog': '/blog',
  'page-contact': '/contact',
  'page-faq': '/faq',
  'page-request-service': '/request-service',
};
export const pagePath = (id: string) => PAGE_PATHS[id] || PAGE_PATHS[`page-${id}`] || null;

export const slugifyText = (s = '') =>
  String(s || '').toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const projectSlug = (p: any) =>
  String(p?.slug || '').replace(/^\/?(portfolio\/)?/, '').replace(/\/$/, '') || `${slugifyText(p?.title)}-${p?.id}`;
