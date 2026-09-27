import { describe, expect, it } from 'vitest';
import { site } from '~/config/site';
import { formatClock, openStatus, zonedParts, zonedToEpoch, type WeekHours } from '~/lib/time';

const IST = 'Asia/Kolkata';
/** A moment given as IST wall-clock time, independent of the machine's timezone. */
const ist = (date: string, time: string) => new Date(zonedToEpoch(date, time, IST));

describe('zoned time', () => {
  it('converts IST wall-clock time to the right instant', () => {
    expect(ist('2026-10-01', '10:00').toISOString()).toBe('2026-10-01T04:30:00.000Z');
    expect(zonedParts(new Date('2026-10-01T18:45:00Z'), IST)).toMatchObject({
      dateKey: '2026-10-02',
      hour: 0,
      minute: 15,
      weekday: 'fri',
    });
  });
});

describe('openStatus (demo hours 9 AM – 10 PM daily, IST)', () => {
  const hours = site.hours;
  it('is open mid-day and says when it closes', () => {
    expect(openStatus(hours, ist('2026-10-01', '13:00'), IST)).toEqual({
      open: true,
      closesAt: '22:00',
    });
  });
  it('closes exactly at 10 PM', () => {
    expect(openStatus(hours, ist('2026-10-01', '21:59'), IST).open).toBe(true);
    expect(openStatus(hours, ist('2026-10-01', '22:00'), IST)).toEqual({
      open: false,
      opensAt: '09:00',
      opensOn: 'tomorrow',
    });
  });
  it('before opening, opens later today', () => {
    expect(openStatus(hours, ist('2026-10-01', '07:30'), IST)).toEqual({
      open: false,
      opensAt: '09:00',
      opensOn: 'today',
    });
  });
});

describe('openStatus (closed days, split shifts, past midnight)', () => {
  const hours: WeekHours = {
    mon: [],
    tue: [
      ['09:00', '13:00'],
      ['16:00', '21:00'],
    ],
    wed: [['09:00', '21:00']],
    thu: [['09:00', '21:00']],
    fri: [['18:00', '01:00']],
    sat: [['10:00', '20:00']],
    sun: [],
  };
  it('skips closed days and names the day it reopens', () => {
    // Sunday 2026-10-04, noon
    expect(openStatus(hours, ist('2026-10-04', '12:00'), IST)).toEqual({
      open: false,
      opensAt: '09:00',
      opensOn: 'tue',
    });
  });
  it('handles a lunch break', () => {
    expect(openStatus(hours, ist('2026-10-06', '14:00'), IST)).toEqual({
      open: false,
      opensAt: '16:00',
      opensOn: 'today',
    });
  });
  it('stays open past midnight', () => {
    expect(openStatus(hours, ist('2026-10-03', '00:30'), IST)).toEqual({
      open: true,
      closesAt: '01:00',
    });
  });
});

describe('formatClock', () => {
  it('formats English times compactly', () => {
    expect(formatClock('22:00')).toBe('10 PM');
    expect(formatClock('09:30')).toBe('9:30 AM');
    expect(formatClock('12:00')).toBe('12 PM');
    expect(formatClock('00:00')).toBe('12 AM');
  });
  it('uses natural Telugu periods of the day', () => {
    expect(formatClock('22:00', 'te')).toBe('రాత్రి 10');
    expect(formatClock('09:00', 'te')).toBe('ఉదయం 9');
    expect(formatClock('14:30', 'te')).toBe('మధ్యాహ్నం 2:30');
  });
});
