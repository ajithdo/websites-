/** Dismiss the seasonal announcement for this session; hide it after its end date (IST). */
import { storageKeys, writeString } from '~/lib/storage';
import { zonedParts } from '~/lib/time';

export function initAnnouncement(): void {
  const bar = document.querySelector<HTMLElement>('[data-announcement]');
  if (!bar) return;
  const until = bar.dataset.until;
  if (until && zonedParts(new Date(), 'Asia/Kolkata').dateKey > until) bar.hidden = true;
  bar.querySelector('[data-announcement-dismiss]')?.addEventListener('click', () => {
    writeString(storageKeys.announcement, '1', 'session');
    document.documentElement.classList.add('ann-off');
  });
}
