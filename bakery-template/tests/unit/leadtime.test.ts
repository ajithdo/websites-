import { describe, expect, it } from 'vitest';
import { site } from '~/config/site';
import {
  dayOptions,
  earliestSlot,
  isSlotAllowed,
  leadHoursFor,
  type LeadConfig,
} from '~/lib/leadtime';
import { zonedToEpoch, type WeekHours } from '~/lib/time';

const IST = 'Asia/Kolkata';
const cfg = site.cakeBuilder as LeadConfig;
const hours = site.hours;
const ist = (date: string, time: string) => new Date(zonedToEpoch(date, time, IST));

describe('lead times (48 h standard, 72 h designer / two-tier)', () => {
  it('picks the lead time by design style', () => {
    expect(leadHoursFor('simple', cfg)).toBe(48);
    expect(leadHoursFor('photo', cfg)).toBe(48);
    expect(leadHoursFor('designer', cfg)).toBe(72);
    expect(leadHoursFor('two-tier', cfg)).toBe(72);
  });

  it('allows a slot exactly 48 hours away, not a minute less', () => {
    const now = ist('2026-10-01', '10:00');
    expect(isSlotAllowed({ date: '2026-10-03', time: '10:00' }, now, 48, hours, IST)).toBe(true);
    expect(isSlotAllowed({ date: '2026-10-02', time: '21:00' }, now, 48, hours, IST)).toBe(false);
    expect(earliestSlot(now, 48, cfg, hours, IST)).toEqual({ date: '2026-10-03', time: '10:00' });
    expect(earliestSlot(now, 72, cfg, hours, IST)).toEqual({ date: '2026-10-04', time: '10:00' });
  });

  it('rolls over to the next morning when the lead ends after the last slot', () => {
    const now = ist('2026-10-01', '21:30');
    expect(earliestSlot(now, 48, cfg, hours, IST)).toEqual({ date: '2026-10-04', time: '10:00' });
  });

  it('never offers a past date', () => {
    const now = ist('2026-10-01', '10:00');
    expect(isSlotAllowed({ date: '2026-09-30', time: '12:00' }, now, 0, hours, IST)).toBe(false);
  });

  it('skips days the bakery is closed', () => {
    const closedSunday: WeekHours = { ...hours, sun: [] };
    const now = ist('2026-10-02', '10:00'); // Friday → +48 h = Sunday
    expect(earliestSlot(now, 48, cfg, closedSunday, IST)).toEqual({
      date: '2026-10-05',
      time: '10:00',
    });
  });

  it('marks the first two days unavailable for a standard cake', () => {
    const now = ist('2026-10-01', '10:00');
    const days = dayOptions(now, 5, 48, cfg, hours, IST);
    expect(days.map((d) => d.available)).toEqual([false, false, true, true, true]);
    expect(days[0]!.date).toBe('2026-10-01');
  });
});
