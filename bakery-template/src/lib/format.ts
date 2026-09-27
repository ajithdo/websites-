/** Small, dependency-free formatters shared by pages and islands. */

/** Fill {placeholders} in a template. Unknown placeholders are left as-is. */
export function fmt(template: string, vars: Record<string, string | number> = {}): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    Object.hasOwn(vars, key) ? String(vars[key]) : match,
  );
}

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

/** ₹1,250 · ₹1,25,000 (Indian digit grouping). */
export function formatINR(amount: number): string {
  return inr.format(Math.round(amount));
}

/** ₹2,050 – ₹2,400 */
export function formatINRRange(low: number, high: number): string {
  return low === high ? formatINR(low) : `${formatINR(low)} – ${formatINR(high)}`;
}

/**
 * Normalise an Indian mobile number to 10 digits, or null if it is not one.
 * Accepts spaces, dashes, brackets and a +91 / 91 / 0 prefix.
 */
export function normalizeIndianMobile(input: string): string | null {
  let digits = input.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

/** 9876543210 → 98765 43210 */
export function formatIndianMobile(tenDigits: string): string {
  return `${tenDigits.slice(0, 5)} ${tenDigits.slice(5)}`;
}

/** 0.5 → "½ kg", 1.5 → "1.5 kg", 2 → "2 kg" */
export function formatKg(kg: number, unit = 'kg'): string {
  if (kg === 0.5) return `½ ${unit}`;
  return `${Number.isInteger(kg) ? kg : kg.toFixed(1)} ${unit}`;
}

/** Join a list the way people write it: "A, B and C". */
export function joinList(items: readonly string[], lang: 'en' | 'te' = 'en'): string {
  return new Intl.ListFormat(lang === 'te' ? 'te' : 'en-IN', {
    style: 'long',
    type: 'conjunction',
  }).format(items);
}
