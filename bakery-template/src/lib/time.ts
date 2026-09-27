/**
 * Time helpers that always work in the bakery's timezone (Asia/Kolkata by
 * default), whatever timezone the visitor's device is set to.
 */

export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
export type Range = readonly [string, string];
export type WeekHours = Readonly<Record<DayKey, readonly Range[]>>;

/** Monday-first order for tables. */
export const weekOrder: readonly DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
/** JavaScript getDay() order (Sunday = 0). */
const jsDayOrder: readonly DayKey[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export interface ZonedParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  weekday: DayKey;
  /** YYYY-MM-DD in the zone. */
  dateKey: string;
  /** Minutes since midnight in the zone. */
  minutes: number;
}

const formatters = new Map<string, Intl.DateTimeFormat>();
function formatter(timeZone: string): Intl.DateTimeFormat {
  let f = formatters.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'short',
      hourCycle: 'h23',
    });
    formatters.set(timeZone, f);
  }
  return f;
}

/** Wall-clock parts of `date` in `timeZone`. */
export function zonedParts(date: Date, timeZone: string): ZonedParts {
  const parts: Record<string, string> = {};
  for (const p of formatter(timeZone).formatToParts(date)) parts[p.type] = p.value;
  const year = Number(parts.year);
  const month = Number(parts.month);
  const day = Number(parts.day);
  const hour = Number(parts.hour) % 24;
  const minute = Number(parts.minute);
  const weekday = (parts.weekday ?? 'Mon').slice(0, 3).toLowerCase() as DayKey;
  const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return { year, month, day, hour, minute, weekday, dateKey, minutes: hour * 60 + minute };
}

/** "09:30" → 570 */
export function toMinutes(hhmm: string): number {
  const [h = 0, m = 0] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

/** "2026-10-03" + n days (calendar arithmetic, timezone-free). */
export function addDays(dateKey: string, n: number): string {
  const [y = 1970, m = 1, d = 1] = dateKey.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

export function weekdayOf(dateKey: string): DayKey {
  const [y = 1970, m = 1, d = 1] = dateKey.split('-').map(Number);
  return jsDayOrder[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]!;
}

/** Epoch milliseconds for a wall-clock date and time in `timeZone`. */
export function zonedToEpoch(dateKey: string, hhmm: string, timeZone: string): number {
  const [y = 1970, mo = 1, d = 1] = dateKey.split('-').map(Number);
  const [h = 0, mi = 0] = hhmm.split(':').map(Number);
  const guess = Date.UTC(y, mo - 1, d, h, mi);
  const offsetAt = (epoch: number) => {
    const p = zonedParts(new Date(epoch), timeZone);
    return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute) - epoch;
  };
  const first = guess - offsetAt(guess);
  const second = guess - offsetAt(first);
  return second;
}

export type OpenStatus =
  | { open: true; closesAt: string }
  | { open: false; opensAt: string; opensOn: 'today' | 'tomorrow' | DayKey }
  | { open: false; opensAt: null; opensOn: null };

/**
 * Is the bakery open at `now`? Handles closed days, split shifts and ranges
 * that run past midnight (e.g. ["18:00", "01:00"]).
 */
export function openStatus(hours: WeekHours, now: Date, timeZone: string): OpenStatus {
  const { weekday: today, minutes: nowMin } = zonedParts(now, timeZone);
  const todayIdx = weekOrder.indexOf(today);
  const yesterday = weekOrder[(todayIdx + 6) % 7]!;

  for (const [start, end] of hours[yesterday]) {
    const s = toMinutes(start);
    const e = toMinutes(end);
    if (e < s && nowMin < e) return { open: true, closesAt: end };
  }
  for (const [start, end] of hours[today]) {
    const s = toMinutes(start);
    const e = toMinutes(end);
    const endMin = e <= s ? e + 1440 : e;
    if (nowMin >= s && nowMin < endMin) return { open: true, closesAt: end };
  }

  const laterToday = hours[today]
    .map(([start]) => start)
    .filter((start) => toMinutes(start) > nowMin)
    .sort((a, b) => toMinutes(a) - toMinutes(b));
  if (laterToday[0]) return { open: false, opensAt: laterToday[0], opensOn: 'today' };

  for (let i = 1; i <= 7; i++) {
    const day = weekOrder[(todayIdx + i) % 7]!;
    const first = [...hours[day]].sort((a, b) => toMinutes(a[0]) - toMinutes(b[0]))[0];
    if (first) return { open: false, opensAt: first[0], opensOn: i === 1 ? 'tomorrow' : day };
  }
  return { open: false, opensAt: null, opensOn: null };
}

/**
 * "22:00" → "10 PM" (en) or "రాత్రి 10" (te). Minutes only when non-zero.
 */
export function formatClock(hhmm: string, lang: 'en' | 'te' = 'en'): string {
  const [h = 0, m = 0] = hhmm.split(':').map(Number);
  const hh = h % 24;
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  const mm = m ? `:${String(m).padStart(2, '0')}` : '';
  if (lang === 'te') {
    const period =
      hh < 4
        ? 'రాత్రి'
        : hh < 12
          ? 'ఉదయం'
          : hh < 16
            ? 'మధ్యాహ్నం'
            : hh < 19
              ? 'సాయంత్రం'
              : 'రాత్రి';
    return `${period} ${h12}${mm}`;
  }
  return `${h12}${mm} ${hh < 12 ? 'AM' : 'PM'}`;
}

/** "Sat, 3 Oct 2026" for a YYYY-MM-DD key. */
export function formatDateKey(
  dateKey: string,
  lang: 'en' | 'te' = 'en',
  options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  },
): string {
  const [y = 1970, m = 1, d = 1] = dateKey.split('-').map(Number);
  return new Intl.DateTimeFormat(lang === 'te' ? 'te-IN' : 'en-IN', {
    ...options,
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(y, m - 1, d)));
}
