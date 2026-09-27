/** Live open/closed line and "today" highlight, always in the bakery's timezone. */
import { fmt } from '~/lib/format';
import { formatClock, openStatus, zonedParts, type DayKey, type WeekHours } from '~/lib/time';

interface StatusConfig {
  hours: WeekHours;
  tz: string;
  lang: 'en' | 'te';
  t: Record<string, string> & { days: Record<DayKey, string> };
}

function render(el: HTMLElement, cfg: StatusConfig, now: Date): void {
  const s = openStatus(cfg.hours, now, cfg.tz);
  const text = el.querySelector('.open-status-text');
  if (!text) return;
  const time = (hhmm: string) => formatClock(hhmm, cfg.lang);
  if (s.open) {
    el.dataset.state = 'open';
    text.textContent = `${cfg.t.open} · ${fmt(cfg.t.closesAt ?? '', { time: time(s.closesAt) })}`;
  } else if (s.opensAt) {
    el.dataset.state = 'closed';
    const when =
      s.opensOn === 'today'
        ? fmt(cfg.t.opensAt ?? '', { time: time(s.opensAt) })
        : fmt(cfg.t.opensDayAt ?? '', {
            day: s.opensOn === 'tomorrow' ? (cfg.t.tomorrow ?? '') : cfg.t.days[s.opensOn],
            time: time(s.opensAt),
          });
    text.textContent = `${cfg.t.closed} · ${when}`;
  } else {
    el.dataset.state = 'closed';
    text.textContent = cfg.t.closed ?? '';
  }
}

export function initOpenStatus(): void {
  const els = document.querySelectorAll<HTMLElement>('[data-open-status]');
  const tables = document.querySelectorAll<HTMLElement>('[data-hours-table]');
  if (!els.length && !tables.length) return;
  const configs = new Map<HTMLElement, StatusConfig>();
  els.forEach((el) => {
    try {
      configs.set(el, JSON.parse(el.dataset.openStatus ?? '') as StatusConfig);
    } catch {
      /* leave the static hours text in place */
    }
  });
  const tz = configs.values().next().value?.tz ?? 'Asia/Kolkata';

  const tick = () => {
    const now = new Date();
    configs.forEach((cfg, el) => render(el, cfg, now));
    const today = zonedParts(now, tz).weekday;
    tables.forEach((table) =>
      table.querySelectorAll<HTMLElement>('tr[data-day]').forEach((row) => {
        const isToday = row.dataset.day === today;
        row.toggleAttribute('data-today', isToday);
        row.querySelector<HTMLElement>('.today-tag')?.toggleAttribute('hidden', !isToday);
      }),
    );
  };
  tick();
  window.setInterval(tick, 60_000);
}
