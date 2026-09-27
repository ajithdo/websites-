import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { siteSchema } from '~/config/schema';
import { site } from '~/config/site';
import { formatINR, normalizeIndianMobile } from '~/lib/format';

const menuDir = 'src/content/menu';
const menuIds = readdirSync(menuDir).flatMap((f) =>
  (JSON.parse(readFileSync(join(menuDir, f), 'utf8')) as { items: { id: string }[] }).items.map(
    (i) => i.id,
  ),
);

describe('site config', () => {
  it('passes the schema', () => {
    expect(siteSchema.safeParse(site).success).toBe(true);
  });

  it('only points at images that exist', () => {
    const paths = [
      site.hero.image,
      site.hero.mobileImage,
      ...site.home.storyImages.map((p) => p.src),
      site.home.builderTeaserImage.src,
      ...site.occasions.map((o) => o.image?.src),
      ...site.cakeBuilder.flavours.map((f) => f.image),
      site.about.hero.src,
      ...site.about.strip.map((p) => p.src),
      site.about.hands.src,
      site.contactPage.corporateImage.src,
      site.notFoundImage.src,
    ].filter((p): p is string => Boolean(p));
    expect(paths.filter((p) => !existsSync(join('src/assets/images', p)))).toEqual([]);
  });

  it('refers only to menu items that exist', () => {
    expect(
      [...site.home.signature, site.home.heroCard].filter((id) => !menuIds.includes(id)),
    ).toEqual([]);
  });

  it('has the full 35-item demo menu with unique ids', () => {
    expect(menuIds).toHaveLength(35);
    expect(new Set(menuIds).size).toBe(35);
  });

  it('sends demo enquiries to the studio and keeps the other details fake', () => {
    if (!site.features.demoMode) return;
    expect(site.contact.whatsapp).toBe(site.studio.whatsapp);
    expect(site.contact.email.endsWith('.example')).toBe(true);
    expect(site.fssai).toBe('');
  });
});

describe('formatting helpers', () => {
  it('normalises Indian mobile numbers', () => {
    expect(normalizeIndianMobile('98765 43210')).toBe('9876543210');
    expect(normalizeIndianMobile('+91 98765-43210')).toBe('9876543210');
    expect(normalizeIndianMobile('09876543210')).toBe('9876543210');
    expect(normalizeIndianMobile('5876543210')).toBeNull();
    expect(normalizeIndianMobile('98765')).toBeNull();
  });
  it('uses Indian digit grouping for rupees', () => {
    expect(formatINR(125000)).toBe('₹1,25,000');
    expect(formatINR(950)).toBe('₹950');
  });
});
