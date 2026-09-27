import { describe, expect, it } from 'vitest';
import { iconSvg, pngsToIco } from '~/lib/brand-icon';

describe('iconSvg', () => {
  it('draws the mark in the given colours', () => {
    const svg = iconSvg(
      32,
      { bg: '#111111', ink: '#EEEEEE', accent: '#C9A15B' },
      { rounded: true },
    );
    expect(svg).toContain('width="32"');
    expect(svg).toContain('rx="14"');
    expect(svg).toContain('fill="#111111"');
    expect(svg.match(/stroke="#C9A15B"/g)).toHaveLength(1);
  });
});

describe('pngsToIco', () => {
  it('writes a valid icon directory pointing at each image', () => {
    const a = new Uint8Array([1, 2, 3]);
    const b = new Uint8Array([4, 5]);
    const ico = pngsToIco([
      { size: 16, png: a },
      { size: 256, png: b },
    ]);
    const view = new DataView(ico.buffer);
    expect(view.getUint16(2, true)).toBe(1);
    expect(view.getUint16(4, true)).toBe(2);
    expect(view.getUint8(6)).toBe(16);
    expect(view.getUint8(6 + 16)).toBe(0); // 256 px is stored as 0
    const first = view.getUint32(6 + 12, true);
    const second = view.getUint32(6 + 16 + 12, true);
    expect(first).toBe(6 + 32);
    expect([...ico.slice(first, first + 3)]).toEqual([1, 2, 3]);
    expect([...ico.slice(second, second + 2)]).toEqual([4, 5]);
    expect(ico.length).toBe(6 + 32 + 5);
  });
});
