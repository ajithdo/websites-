import type { AstroIntegration } from 'astro';
import { fileURLToPath } from 'node:url';

/** Registers the custom `client:interaction` directive (see ./interaction.ts). */
export default function interactionDirective(): AstroIntegration {
  return {
    name: 'client:interaction',
    hooks: {
      'astro:config:setup': ({ addClientDirective }) => {
        addClientDirective({
          name: 'interaction',
          entrypoint: fileURLToPath(new URL('./interaction.ts', import.meta.url)),
        });
      },
    },
  };
}
