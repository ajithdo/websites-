/**
 * Titles mark one italic accent word with asterisks: "Say *hello*".
 * Returns the parts around the first marked span (no markup when unmarked).
 */
export interface AccentParts {
  before: string;
  accent: string;
  after: string;
}

export function splitAccent(text: string): AccentParts {
  const match = /\*([^*]+)\*/.exec(text);
  if (!match) return { before: text, accent: '', after: '' };
  return {
    before: text.slice(0, match.index),
    accent: match[1]!,
    after: text.slice(match.index + match[0].length),
  };
}

/** The title without accent markers, for meta tags and aria labels. */
export function plainAccent(text: string): string {
  return text.replace(/\*([^*]+)\*/g, '$1');
}
