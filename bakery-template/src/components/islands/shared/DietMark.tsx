const colors = { veg: '#1B7D35', egg: '#B26A00', nonveg: '#7A3B12' } as const;

interface Props {
  diet: 'veg' | 'egg' | 'nonveg';
  label: string;
  size?: number;
  showLabel?: boolean;
}

/** React twin of components/ui/DietMark.astro. */
export function DietMark({ diet, label, size = 16, showLabel = false }: Props) {
  const color = colors[diet];
  return (
    <span className="inline-flex items-center gap-2">
      <svg
        viewBox="0 0 16 16"
        width={size}
        height={size}
        role={showLabel ? undefined : 'img'}
        aria-label={showLabel ? undefined : label}
        aria-hidden={showLabel ? true : undefined}
        className="shrink-0"
      >
        <rect
          x="0.75"
          y="0.75"
          width="14.5"
          height="14.5"
          rx="2"
          fill="#FFFFFF"
          stroke={color}
          strokeWidth="1.5"
        />
        {diet === 'nonveg' ? (
          <path d="M8 3.6 12.3 11.4H3.7Z" fill={color} />
        ) : (
          <circle cx="8" cy="8" r="3.6" fill={color} />
        )}
      </svg>
      {showLabel && <span>{label}</span>}
    </span>
  );
}
