/**
 * Lead-time rules for custom cakes, evaluated in the bakery's timezone.
 * A slot (date + time) is bookable when it is at least `leadHours` from now
 * and falls inside the bakery's opening hours that day.
 */
import type { StyleId } from './pricing';
import { addDays, toMinutes, weekdayOf, zonedParts, zonedToEpoch, type WeekHours } from './time';

export interface LeadConfig {
  leadTimeHours: { standard: number; extended: number };
  extendedLeadStyles: readonly StyleId[];
  slots: readonly string[];
}

export interface Slot {
  date: string;
  time: string;
}

export function leadHoursFor(style: StyleId | null, cfg: LeadConfig): number {
  return style && cfg.extendedLeadStyles.includes(style)
    ? cfg.leadTimeHours.extended
    : cfg.leadTimeHours.standard;
}

/** Is `time` inside the opening hours on `date`? */
export function withinHours(hours: WeekHours, date: string, time: string): boolean {
  const t = toMinutes(time);
  return hours[weekdayOf(date)].some(([start, end]) => {
    const s = toMinutes(start);
    const e = toMinutes(end);
    return e <= s ? t >= s || t < e : t >= s && t < e;
  });
}

export function isSlotAllowed(
  slot: Slot,
  now: Date,
  leadHours: number,
  hours: WeekHours,
  timeZone: string,
): boolean {
  if (!withinHours(hours, slot.date, slot.time)) return false;
  return zonedToEpoch(slot.date, slot.time, timeZone) >= now.getTime() + leadHours * 3_600_000;
}

/** Today's date (YYYY-MM-DD) in the bakery's timezone. */
export function todayKey(now: Date, timeZone: string): string {
  return zonedParts(now, timeZone).dateKey;
}

/** First bookable slot, searching up to `maxDays` ahead. */
export function earliestSlot(
  now: Date,
  leadHours: number,
  cfg: LeadConfig,
  hours: WeekHours,
  timeZone: string,
  maxDays = 60,
): Slot | null {
  const start = todayKey(now, timeZone);
  for (let i = 0; i <= maxDays; i++) {
    const date = addDays(start, i);
    for (const time of cfg.slots) {
      const slot = { date, time };
      if (isSlotAllowed(slot, now, leadHours, hours, timeZone)) return slot;
    }
  }
  return null;
}

export interface DayOption {
  date: string;
  available: boolean;
}

/** The next `count` days from today, each marked bookable or not. */
export function dayOptions(
  now: Date,
  count: number,
  leadHours: number,
  cfg: LeadConfig,
  hours: WeekHours,
  timeZone: string,
): DayOption[] {
  const start = todayKey(now, timeZone);
  return Array.from({ length: count }, (_, i) => {
    const date = addDays(start, i);
    const available = cfg.slots.some((time) =>
      isSlotAllowed({ date, time }, now, leadHours, hours, timeZone),
    );
    return { date, available };
  });
}

export interface TimeOption {
  time: string;
  available: boolean;
}

export function timeOptions(
  date: string,
  now: Date,
  leadHours: number,
  cfg: LeadConfig,
  hours: WeekHours,
  timeZone: string,
): TimeOption[] {
  return cfg.slots
    .filter((time) => withinHours(hours, date, time))
    .map((time) => ({
      time,
      available: isSlotAllowed({ date, time }, now, leadHours, hours, timeZone),
    }));
}
