/** Opening-hours display helpers (server and client). */
import { formatClock, weekOrder, type DayKey, type WeekHours } from './time';

export type HoursRow = { days: DayKey[]; text: string | null };

/** "9 AM – 10 PM", or null when closed. Split shifts are joined with ", ". */
export function rangesText(
  ranges: readonly (readonly [string, string])[],
  lang: 'en' | 'te',
): string | null {
  if (!ranges.length) return null;
  return ranges.map(([s, e]) => `${formatClock(s, lang)} – ${formatClock(e, lang)}`).join(', ');
}

/** Consecutive days with identical hours, grouped: Mon–Sun · 9 AM – 10 PM. */
export function groupedHours(hours: WeekHours, lang: 'en' | 'te'): HoursRow[] {
  const rows: HoursRow[] = [];
  for (const day of weekOrder) {
    const text = rangesText(hours[day], lang);
    const last = rows.at(-1);
    if (last && last.text === text) last.days.push(day);
    else rows.push({ days: [day], text });
  }
  return rows;
}

/** "Mon–Sun" / "Mon" / "Sat–Sun" using the given short day names. */
export function dayRangeLabel(days: DayKey[], short: Record<DayKey, string>): string {
  const first = days[0]!;
  const last = days.at(-1)!;
  return first === last ? short[first] : `${short[first]}–${short[last]}`;
}
