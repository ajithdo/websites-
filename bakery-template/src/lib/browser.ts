/**
 * Opens WhatsApp (or another app link) in a new tab and keeps this page.
 * `window.open` with a "noopener" feature always returns null, which would
 * look like a blocked pop-up; so open normally, then cut the opener link.
 * Falls back to this tab only when the pop-up really was blocked.
 */
export function openExternal(url: string): void {
  const win = window.open(url, '_blank');
  if (win) win.opener = null;
  else window.location.assign(url);
}
