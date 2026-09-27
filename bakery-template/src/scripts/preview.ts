/**
 * Demo tools (demo mode only):
 *   ?name=Sri%20Lakshmi%20Bakers  shows that name in place of the brand name (display only)
 *   ?theme=classic|pastel|cocoa   opens the site in that theme
 * Both are carried across internal links for the visit and never saved.
 */
export function initDemoPreview(root: HTMLElement): void {
  if (root.dataset.demo === undefined) return;
  const params = new URLSearchParams(location.search);
  const name = params.get('name')?.trim().slice(0, 60);
  const theme = params.get('theme');
  const brand = root.dataset.brand ?? '';

  if (name) {
    root.dataset.brandPreview = name;
    document.querySelectorAll<HTMLElement>('[data-brand-name]').forEach((el) => {
      el.textContent = name;
    });
    if (brand) document.title = document.title.split(brand).join(name);
    // Prefilled WhatsApp messages greet the previewed name too.
    document.querySelectorAll<HTMLAnchorElement>('a[href^="https://wa.me/"]').forEach((a) => {
      const url = new URL(a.href);
      const text = url.searchParams.get('text');
      if (text && brand && text.includes(brand)) {
        url.searchParams.set('text', text.split(brand).join(name));
        a.href = url.toString();
      }
    });
  }
  root.classList.remove('brand-preview');

  const carry = new URLSearchParams();
  if (name) carry.set('name', name);
  if (theme) carry.set('theme', theme);
  if (![...carry.keys()].length) return;
  document.querySelectorAll<HTMLAnchorElement>('a[href^="/"]').forEach((a) => {
    const url = new URL(a.href, location.origin);
    carry.forEach((v, k) => url.searchParams.set(k, v));
    a.href = url.pathname + url.search + url.hash;
  });
}
