import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { en } from '~/i18n/en';
import { te } from '~/i18n/te';

type Tree = Record<string, unknown>;

function shape(value: unknown, path = ''): string[] {
  if (typeof value === 'string') return [`${path}:string`];
  if (Array.isArray(value))
    return [
      `${path}:array(${value.length})`,
      ...value.flatMap((v, i) => shape(v, `${path}[${i}]`)),
    ];
  return Object.entries(value as Tree).flatMap(([k, v]) => shape(v, path ? `${path}.${k}` : k));
}

function strings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  return Object.values(value as Tree).flatMap(strings);
}

describe('Telugu dictionary', () => {
  it('has exactly the same keys and list lengths as English', () => {
    expect(shape(te)).toEqual(shape(en));
  });

  it('has no empty strings', () => {
    expect(strings(te).filter((s) => !s.trim())).toEqual([]);
  });

  it('keeps every {placeholder} the English copy uses', () => {
    const en_ = shape(en).length;
    expect(en_).toBeGreaterThan(0);
    const placeholders = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join(',');
    const pairs = strings(en).map((s, i) => [placeholders(s), placeholders(strings(te)[i] ?? '')]);
    expect(pairs.filter(([a, b]) => a !== b)).toEqual([]);
  });

  it('is flagged as machine-drafted for native review', () => {
    const source = readFileSync('src/i18n/te.ts', 'utf8');
    expect(source.slice(0, 200)).toContain(
      'Machine-drafted, needs review by a native Telugu speaker before going live.',
    );
  });
});
