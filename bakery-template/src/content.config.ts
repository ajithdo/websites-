/**
 * Content collections: menu, gallery and testimonials.
 *
 * Every entry is validated when the site builds. A typo (unknown diet, missing
 * price, an image path that does not exist) stops the build with the file
 * name and field, instead of shipping a broken page.
 *
 * Image paths are relative to src/assets/images, e.g. "menu/fudge-brownie.jpg".
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { occasionIds } from './config/schema';

const imagesDir = join(process.cwd(), 'src/assets/images');

const image = z
  .string()
  .regex(/^[\w\-/]+\.(jpe?g|png|webp|avif)$/i, 'Use a path like "menu/fudge-brownie.jpg"')
  .refine((p) => existsSync(join(imagesDir, p)), {
    message: 'Image not found in src/assets/images',
  });

const menuItem = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers and dashes'),
    name: z.string().min(1),
    nameTe: z.string().optional(),
    description: z.string().min(1).max(140),
    image,
    /** Describe what the photo actually shows. */
    alt: z.string().min(8),
    diet: z.enum(['veg', 'egg', 'nonveg']),
    egglessAvailable: z.boolean().default(false),
    /** Either one price… */
    price: z.number().positive().optional(),
    /** …or size variants, e.g. [{ "label": "½ kg", "price": 550 }]. */
    variants: z
      .array(z.object({ label: z.string().min(1), price: z.number().positive() }))
      .min(1)
      .optional(),
    badges: z.array(z.enum(['bestseller', 'new', 'seasonal'])).default([]),
  })
  .refine((item) => (item.price === undefined) !== (item.variants === undefined), {
    message: 'Give either "price" or "variants", not both',
  });

const menu = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/menu' }),
  schema: z.object({
    /** Anchor used for the category tab, e.g. "signature-cakes". */
    slug: z.string().regex(/^[a-z0-9-]+$/),
    name: z.string().min(1),
    nameTe: z.string().optional(),
    order: z.number(),
    note: z.string().optional(),
    items: z.array(menuItem).min(1),
  }),
});

const gallery = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/gallery' }),
  schema: z.object({
    occasion: z.enum(occasionIds),
    order: z.number(),
    items: z
      .array(
        z.object({
          image,
          /** Describe what the photo actually shows. */
          alt: z.string().min(8),
          caption: z.string().min(1),
          captionTe: z.string().optional(),
        }),
      )
      .min(1),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/testimonials' }),
  schema: z.object({
    name: z.string().min(1),
    occasion: z.enum(occasionIds),
    rating: z.number().int().min(1).max(5),
    quote: z.string().min(20).max(260),
    quoteTe: z.string().optional(),
    order: z.number(),
  }),
});

export const collections = { menu, gallery, testimonials };
