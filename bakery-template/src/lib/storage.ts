/**
 * localStorage / sessionStorage helpers that never throw.
 * Storage can be missing or blocked (private mode, disabled cookies, quota),
 * and the site must keep working without it.
 */
type Area = 'local' | 'session';

function store(area: Area): Storage | null {
  try {
    return area === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

export function readString(key: string, area: Area = 'local'): string | null {
  try {
    return store(area)?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function writeString(key: string, value: string, area: Area = 'local'): void {
  try {
    store(area)?.setItem(key, value);
  } catch {
    /* storage unavailable: keep going without persistence */
  }
}

export function removeKey(key: string, area: Area = 'local'): void {
  try {
    store(area)?.removeItem(key);
  } catch {
    /* ignore */
  }
}

export function readJSON<T>(key: string, area: Area = 'local'): T | null {
  const raw = readString(key, area);
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeJSON(key: string, value: unknown, area: Area = 'local'): void {
  try {
    writeString(key, JSON.stringify(value), area);
  } catch {
    /* unserialisable value: skip */
  }
}

/** Storage keys, in one place so a client site never collides with the demo. */
export const storageKeys = {
  cart: 'bb:cart:v1',
  cartDetails: 'bb:cart-details:v1',
  builder: 'bb:builder:v1',
  lang: 'bb:lang',
  theme: 'bb:theme',
  intro: 'bb:intro-seen',
  announcement: 'bb:announcement-dismissed',
} as const;
