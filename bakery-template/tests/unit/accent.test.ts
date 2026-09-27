import { describe, expect, it } from 'vitest';
import { plainAccent, splitAccent } from '~/lib/accent';

describe('splitAccent', () => {
  it('splits around the marked word, keeping spaces', () => {
    expect(splitAccent('Cakes we have *loved* making')).toEqual({
      before: 'Cakes we have ',
      accent: 'loved',
      after: ' making',
    });
  });
  it('handles a leading or trailing accent', () => {
    expect(splitAccent('*నమస్తే* చెప్పండి')).toEqual({
      before: '',
      accent: 'నమస్తే',
      after: ' చెప్పండి',
    });
    expect(splitAccent('This page *crumbled*.')).toEqual({
      before: 'This page ',
      accent: 'crumbled',
      after: '.',
    });
  });
  it('leaves unmarked text alone', () => {
    expect(splitAccent('Say hello')).toEqual({ before: 'Say hello', accent: '', after: '' });
  });
  it('strips markers for plain text', () => {
    expect(plainAccent('Design your *cake*')).toBe('Design your cake');
  });
});
