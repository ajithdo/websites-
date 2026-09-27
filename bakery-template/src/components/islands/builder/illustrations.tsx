/**
 * Line illustrations for the builder: one per design style and shape.
 * Drawn in currentColor with an accent detail so they follow every theme.
 */
import type { Shape, StyleId } from '~/lib/pricing';

const common = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/** A cake drum: top ellipse, sides and the front of the base. */
function Drum({
  cx,
  top,
  rx,
  ry,
  height,
}: {
  cx: number;
  top: number;
  rx: number;
  ry: number;
  height: number;
}) {
  const bottom = top + height;
  return (
    <g>
      <ellipse cx={cx} cy={top} rx={rx} ry={ry} />
      <path d={`M${cx - rx} ${top} V${bottom} A${rx} ${ry} 0 0 0 ${cx + rx} ${bottom} V${top}`} />
    </g>
  );
}

function Board() {
  return <ellipse cx="60" cy="78" rx="50" ry="8" strokeOpacity="0.45" />;
}

export function StyleArt({ style }: { style: StyleId }) {
  return (
    <svg viewBox="0 0 120 90" width="120" height="90" aria-hidden="true" {...common}>
      <Board />
      {style === 'two-tier' ? (
        <>
          <Drum cx={60} top={46} rx={40} ry={9} height={24} />
          <Drum cx={60} top={24} rx={24} ry={6} height={20} />
          <path d="M52 16c2-6 6-6 8 0 2-6 6-6 8 0" stroke="var(--bb-accent)" />
        </>
      ) : (
        <Drum cx={60} top={36} rx={40} ry={10} height={32} />
      )}
      {style === 'simple' && (
        <path
          d="M24 40q4 5 8 0q4 5 8 0q4 5 8 0q4 5 8 0q4 5 8 0q4 5 8 0q4 5 8 0q4 5 8 0q4 5 8 0"
          stroke="var(--bb-accent)"
        />
      )}
      {style === 'semi-custom' && (
        <>
          <path
            d="M20 38c3 0 3 9 6 9s3-7 6-7 3 11 6 11 3-8 6-8 3 6 6 6 3-9 6-9 3 12 6 12 3-8 6-8 3 5 6 5 3-7 6-7 3 6 6 6"
            stroke="var(--bb-accent)"
          />
          <path d="M60 30V12" />
          <path d="M60 12l8 3-8 3" stroke="var(--bb-accent)" />
        </>
      )}
      {style === 'designer' && (
        <>
          <path d="M26 48l10 10 10-10 10 10 10-10 10 10 10-10 10 10" strokeOpacity="0.7" />
          <path d="M26 58l10-10 10 10 10-10 10 10 10-10 10 10 10-10" strokeOpacity="0.7" />
          <path
            d="M60 30c-10-10-18-6-14 0 4 4 14 0 14 0zM60 30c10-10 18-6 14 0-4 4-14 0-14 0z"
            stroke="var(--bb-accent)"
          />
          <circle cx="60" cy="30" r="2.5" fill="var(--bb-accent)" stroke="none" />
        </>
      )}
      {style === 'photo' && (
        <>
          <path d="M38 33l22-8 22 8-22 8z" stroke="var(--bb-accent)" />
          <path d="M46 34l8-4 5 3 5-2 8 3" strokeOpacity="0.8" />
        </>
      )}
    </svg>
  );
}

export function ShapeArt({ shape }: { shape: Shape }) {
  return (
    <svg viewBox="0 0 48 48" width="44" height="44" aria-hidden="true" {...common}>
      {shape === 'round' && <circle cx="24" cy="24" r="16" />}
      {shape === 'square' && <rect x="9" y="9" width="30" height="30" rx="3" />}
      {shape === 'heart' && (
        <path d="M24 39s-15-9-15-20a8 8 0 0 1 15-4 8 8 0 0 1 15 4c0 11-15 20-15 20z" />
      )}
    </svg>
  );
}

/** Top view of the cake, sized by weight (area ∝ kg). */
export function SizeArt({ kg, max }: { kg: number; max: number }) {
  const r = 6 + 16 * Math.sqrt(kg / max);
  return (
    <svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true" {...common}>
      <circle cx="24" cy="24" r="22" strokeOpacity="0.25" strokeDasharray="2 3" />
      <circle cx="24" cy="24" r={r} fill="color-mix(in srgb, var(--bb-accent) 18%, transparent)" />
    </svg>
  );
}
