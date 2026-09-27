/**
 * Demo tools (demo mode only):
 *   ?name=Sri%20Lakshmi%20Bakers  shows that name in place of the brand name (display only)
 *   ?theme=classic|pastel|cocoa   opens the site in that theme
 * Both are carried across internal links for the visit and never saved.
 * The theme switcher panel uses the same helpers to preview a name live.
 */
export function initDemoPreview(root: HTMLElement): void {
  if (root.dataset.demo === undefined) return;
  const params = new URLSearchParams(location.search);
  const name = params.get('name')?.trim().slice(0, 60);
  const theme = params.get('theme');

  if (name) applyBrandPreview(name);
  root.classList.remove('brand-preview');
  carryParams({ ...(name ? { name } : {}), ...(theme ? { theme } : {}) }, { url: false });
}

/** Shows `name` wherever the brand name appears (null or empty restores the real name). */
export function applyBrandPreview(name: string | null): void {
  const root = document.documentElement;
  const brand = root.dataset.brand ?? '';
  const current = root.dataset.brandPreview ?? brand;
  const next = name?.trim().slice(0, 60) || brand;
  if (!current || next === current) return;

  if (next === brand) delete root.dataset.brandPreview;
  else root.dataset.brandPreview = next;
  document.querySelectorAll<HTMLElement>('[data-brand-name]').forEach((el) => {
    el.textContent = next;
  });
  document.title = document.title.split(current).join(next);
  // Prefilled WhatsApp messages greet the previewed name too.
  document.querySelectorAll<HTMLAnchorElement>('a[href^="https://wa.me/"]').forEach((a) => {
    const url = new URL(a.href);
    const text = url.searchParams.get('text');
    if (text?.includes(current)) {
      url.searchParams.delete('text');
      const rest = url.search ? `${url.search}&` : '?';
      a.href = `${url.origin}${url.pathname}${rest}text=${encodeURIComponent(text.split(current).join(next))}`;
    }
  });
}

/**
 * Sets (or with null, removes) preview parameters on internal links, and on
 * this page's address unless `url` is false, so they survive navigation.
 */
export function carryParams(
  update: Record<string, string | null>,
  { url: updateUrl = true }: { url?: boolean } = {},
): void {
  const entries = Object.entries(update);
  if (!entries.length) return;
  const apply = (target: URL) => {
    for (const [key, value] of entries) {
      if (value) target.searchParams.set(key, value);
      else target.searchParams.delete(key);
    }
  };
  document.querySelectorAll<HTMLAnchorElement>('a[href^="/"]').forEach((a) => {
    const target = new URL(a.getAttribute('href') ?? '/', location.origin);
    apply(target);
    a.setAttribute('href', target.pathname + target.search + target.hash);
  });
  if (updateUrl) {
    const here = new URL(location.href);
    apply(here);
    history.replaceState(history.state, '', here);
  }
}
