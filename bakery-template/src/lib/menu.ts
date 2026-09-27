/**
 * Server-side menu loader. Flattens the category files into one list and
 * checks the cross-file rules zod cannot see: item ids must be unique, and
 * every id referenced from site.ts must exist.
 */
import { getCollection } from 'astro:content';
import { site } from '~/config/site';

export type Diet = 'veg' | 'egg' | 'nonveg';
export type Badge = 'bestseller' | 'new' | 'seasonal';

export interface MenuItem {
  id: string;
  name: string;
  nameTe?: string | undefined;
  description: string;
  image: string;
  alt: string;
  diet: Diet;
  egglessAvailable: boolean;
  price?: number | undefined;
  variants?: { label: string; price: number }[] | undefined;
  badges: Badge[];
  category: string;
}

export interface MenuCategory {
  slug: string;
  name: string;
  nameTe?: string | undefined;
  note?: string | undefined;
  items: MenuItem[];
}

let cache: Promise<{ categories: MenuCategory[]; byId: Map<string, MenuItem> }> | undefined;

export function getMenu() {
  cache ??= load();
  return cache;
}

async function load() {
  const entries = await getCollection('menu');
  const categories: MenuCategory[] = entries
    .map((e) => e.data)
    .sort((a, b) => a.order - b.order)
    .map((c) => ({
      slug: c.slug,
      name: c.name,
      nameTe: c.nameTe,
      note: c.note,
      items: c.items.map((item) => ({ ...item, category: c.slug })),
    }));

  const byId = new Map<string, MenuItem>();
  for (const category of categories) {
    for (const item of category.items) {
      if (byId.has(item.id)) {
        throw new Error(`Menu item id "${item.id}" is used twice. Ids must be unique.`);
      }
      byId.set(item.id, item);
    }
  }

  const referenced = [...site.home.signature, site.home.heroCard];
  for (const id of referenced) {
    if (!byId.has(id)) {
      throw new Error(`site.ts refers to menu item "${id}", which is not in src/content/menu.`);
    }
  }
  return { categories, byId };
}

/** Lowest price shown on a card ("from ₹550"). */
export function fromPrice(item: Pick<MenuItem, 'price' | 'variants'>): number {
  return item.variants ? Math.min(...item.variants.map((v) => v.price)) : (item.price ?? 0);
}
