/** Contact links built from site.ts. */
import { site } from '~/config/site';
import { waLink } from './whatsapp';

export const telHref = `tel:${site.contact.phone}`;
export const mailHref = `mailto:${site.contact.email}`;

export function whatsappHref(text?: string): string {
  return waLink(site.contact.whatsapp, text);
}

export const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  site.contact.mapQuery,
)}`;

export const mapEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(
  site.contact.mapQuery,
)}&output=embed`;

export function studioHref(message: string): string {
  return waLink(site.studio.whatsapp, message);
}
