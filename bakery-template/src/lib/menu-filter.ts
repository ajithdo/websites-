/** Menu filtering (shared by the menu island and its tests). */
export type Diet = 'veg' | 'egg' | 'nonveg';
export type Badge = 'bestseller' | 'new' | 'seasonal';

export interface FilterableItem {
  name: string;
  nameTe?: string | undefined;
  description: string;
  diet: Diet;
  egglessAvailable: boolean;
  badges: readonly Badge[];
}

export interface MenuFilter {
  query: string;
  /** Any of these diets (empty = all). */
  diets: readonly Diet[];
  /** Can be eaten without egg: veg items, or items offered eggless. */
  eggless: boolean;
  bestseller: boolean;
  fresh: boolean;
}

export const emptyFilter: MenuFilter = {
  query: '',
  diets: [],
  eggless: false,
  bestseller: false,
  fresh: false,
};

const normalize = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();

export function matchesFilter(item: FilterableItem, f: MenuFilter): boolean {
  if (f.diets.length && !f.diets.includes(item.diet)) return false;
  if (f.eggless && !(item.diet === 'veg' || item.egglessAvailable)) return false;
  if (f.bestseller && !item.badges.includes('bestseller')) return false;
  if (f.fresh && !item.badges.includes('new')) return false;
  const q = normalize(f.query);
  if (!q) return true;
  const haystack = normalize([item.name, item.nameTe ?? '', item.description].join(' '));
  return q.split(' ').every((word) => haystack.includes(word));
}

export function isFiltering(f: MenuFilter): boolean {
  return Boolean(f.query.trim() || f.diets.length || f.eggless || f.bestseller || f.fresh);
}
