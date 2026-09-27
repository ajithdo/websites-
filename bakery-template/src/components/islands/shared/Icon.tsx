import { icons, type IconName } from '~/lib/icons';

interface Props {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}

/** React twin of components/ui/Icon.astro (same generated registry). */
export function Icon({ name, size = 20, strokeWidth = 1.6, label, className }: Props) {
  const icon = icons[name];
  const stroke = icon.kind === 'stroke';
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={['shrink-0', className].filter(Boolean).join(' ')}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      fill={stroke ? 'none' : 'currentColor'}
      stroke={stroke ? 'currentColor' : undefined}
      strokeWidth={stroke ? strokeWidth : undefined}
      strokeLinecap={stroke ? 'round' : undefined}
      strokeLinejoin={stroke ? 'round' : undefined}
      dangerouslySetInnerHTML={{ __html: icon.body }}
    />
  );
}
