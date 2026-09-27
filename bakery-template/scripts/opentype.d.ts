/** Minimal types for the parts of opentype.js used by make-brand.ts. */
declare module 'opentype.js' {
  export interface Path {
    toPathData(decimalPlaces?: number): string;
  }
  export interface Glyph {
    advanceWidth?: number;
    getPath(x: number, y: number, fontSize: number): Path;
  }
  export interface Font {
    unitsPerEm: number;
    charToGlyph(char: string): Glyph;
  }
  export function parse(buffer: ArrayBuffer | SharedArrayBuffer): Font;
  const opentype: { parse: typeof parse };
  export default opentype;
}
