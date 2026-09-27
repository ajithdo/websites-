import { describe, expect, it } from 'vitest';
import { themes } from '~/config/themes';
import { contrastRatio } from '~/lib/contrast';

const AA = 4.5;
const UI = 3;

describe.each(Object.values(themes))('$name theme meets WCAG AA', (theme) => {
  const c = theme.colors;
  const grounds = { bg: c.bg, bgAlt: c.bgAlt, surface: c.surface };

  for (const [groundName, ground] of Object.entries(grounds)) {
    it.each([
      ['ink', c.ink],
      ['inkMuted', c.inkMuted],
      ['accentInk', c.accentInk],
      ['danger', c.danger],
      ['success', c.success],
    ])(`%s text on ${groundName}`, (_name, fg) => {
      expect(contrastRatio(fg, ground)).toBeGreaterThanOrEqual(AA);
    });
    it(`input borders and focus ring on ${groundName}`, () => {
      expect(contrastRatio(c.lineStrong, ground)).toBeGreaterThanOrEqual(UI);
      expect(contrastRatio(c.focus, ground)).toBeGreaterThanOrEqual(UI);
    });
  }

  it.each([
    ['onAccent on accent (buttons)', c.onAccent, c.accent],
    ['onSecondary on secondary', c.onSecondary, c.secondary],
    ['onSecondaryMuted on secondary', c.onSecondaryMuted, c.secondary],
    ['onTertiary on tertiary', c.onTertiary, c.tertiary],
    ['onInverse on inverse', c.onInverse, c.inverse],
    ['onInverseMuted on inverse', c.onInverseMuted, c.inverse],
    ['accentOnInverse on inverse', c.accentOnInverse, c.inverse],
  ])('%s', (_name, fg, bg) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(AA);
  });

  it('focus ring on the inverse band', () => {
    expect(contrastRatio(c.focusOnInverse, c.inverse)).toBeGreaterThanOrEqual(UI);
  });
});
