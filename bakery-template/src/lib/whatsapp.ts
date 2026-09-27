/**
 * WhatsApp deep links and the order messages the site writes for customers.
 *
 * Messages are always in English because the bakery team reads them, and they
 * use WhatsApp formatting: *bold* labels, _italic_ notes, "•" bullets and
 * blank lines between groups so they scan well on a phone.
 */
import { formatINR, formatINRRange } from './format';

/** https://wa.me/<digits>?text=<encoded> */
export function waLink(number: string, text?: string): string {
  const digits = number.replace(/\D/g, '');
  return text
    ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
    : `https://wa.me/${digits}`;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  fulfilment: 'pickup' | 'delivery';
  area?: string;
  /** Display date, e.g. "Sat, 3 Oct 2026". */
  date?: string;
  notes?: string;
}

function fulfilmentLine(c: CustomerDetails): string {
  return c.fulfilment === 'delivery'
    ? `*Pickup or delivery:* Delivery${c.area ? ` to ${c.area.trim()}` : ''}`
    : '*Pickup or delivery:* Pickup from the counter';
}

export interface CartMessageLine {
  name: string;
  variant?: string | null;
  qty: number;
  /** Line total in rupees. */
  total: number;
  eggless?: boolean;
}

export function cartMessage(input: {
  brand: string;
  lines: readonly CartMessageLine[];
  total: number;
  customer: CustomerDetails;
}): string {
  const { brand, lines, total, customer } = input;
  const out: string[] = [`Hi ${brand}! I'd like to place an order:`, ''];
  for (const line of lines) {
    const detail = [line.variant, line.eggless ? 'eggless' : null].filter(Boolean).join(', ');
    out.push(
      `• ${line.name}${detail ? ` (${detail})` : ''} × ${line.qty} — ${formatINR(line.total)}`,
    );
  }
  out.push('', `*Estimated total:* ${formatINR(total)}`, '');
  out.push(
    `*Name:* ${customer.name.trim()}`,
    `*Phone:* ${customer.phone}`,
    fulfilmentLine(customer),
  );
  if (customer.date) out.push(`*Date needed:* ${customer.date}`);
  if (customer.notes?.trim()) out.push(`*Notes:* ${customer.notes.trim()}`);
  out.push('', '_Website prices are indicative. Please confirm the final amount._');
  return out.join('\n');
}

export interface CakeMessageInput {
  brand: string;
  occasion: string;
  flavour: string;
  tier: string;
  size: string;
  servings: number;
  design: string;
  shape: string;
  eggless: boolean;
  message?: string;
  /** Display date and time, e.g. "Sat, 3 Oct 2026 · 6 PM". */
  when: string;
  customer: CustomerDetails;
  estimate: { low: number; high: number } | null;
}

export function cakeMessage(input: CakeMessageInput): string {
  const out: string[] = [`Hi ${input.brand}! 🎂 I'd like to order a custom cake.`, ''];
  out.push(
    `*Occasion:* ${input.occasion}`,
    `*Flavour:* ${input.flavour} (${input.tier})`,
    `*Size:* ${input.size} · serves ~${input.servings}`,
    `*Design:* ${input.design}`,
    `*Shape:* ${input.shape}`,
    `*Eggless:* ${input.eggless ? 'Yes' : 'No'}`,
  );
  if (input.message?.trim()) out.push(`*Message on cake:* "${input.message.trim()}"`);
  out.push('', `*When:* ${input.when}`, fulfilmentLine(input.customer), '');
  out.push(`*Name:* ${input.customer.name.trim()}`, `*Phone:* ${input.customer.phone}`);
  if (input.estimate) {
    out.push(
      '',
      `*Estimate:* ${formatINRRange(input.estimate.low, input.estimate.high)}`,
      '_I understand the final price is confirmed after you see the design._',
    );
  }
  out.push('', "I'll share a reference photo here.");
  return out.join('\n');
}

export function enquiryMessage(input: {
  brand: string;
  type: string;
  name: string;
  phone: string;
  message: string;
}): string {
  return [
    `Hi ${input.brand}! I have a ${input.type.toLowerCase()} enquiry.`,
    '',
    `*Name:* ${input.name.trim()}`,
    `*Phone:* ${input.phone}`,
    '',
    input.message.trim(),
  ].join('\n');
}

/** Short prefilled openers for the general WhatsApp buttons. */
export const openers = {
  order: (brand: string) => `Hi ${brand}! I'd like to place an order.`,
  celebration: (brand: string) =>
    `Hi ${brand}! I'd like to plan a cake for an upcoming celebration.`,
  corporate: (brand: string) => `Hi ${brand}! I'd like to discuss a corporate / bulk order.`,
};
