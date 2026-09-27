declare module 'astro' {
  interface AstroClientDirectives {
    /** Hydrate on first hover, press, touch, focus or key press. */
    'client:interaction'?: boolean;
  }
}

export {};
