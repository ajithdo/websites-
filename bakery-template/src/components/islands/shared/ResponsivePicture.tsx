import { useState } from 'react';
import type { ResponsiveImage } from '~/lib/images';

interface Props {
  image: ResponsiveImage;
  alt: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
  /** The page's main image: fetch it first. */
  priority?: boolean;
}

/** <picture> from data pre-computed on the server (islands cannot call astro:assets). */
export function ResponsivePicture({
  image,
  alt,
  className,
  imgClassName,
  eager = false,
  priority = false,
}: Props) {
  const [loaded, setLoaded] = useState(false);
  return (
    <picture
      className={['bb-picture', className].filter(Boolean).join(' ')}
      style={loaded || !image.lqip ? undefined : { backgroundImage: `url(${image.lqip})` }}
    >
      {image.sources.map((s) => (
        <source key={s.type} type={s.type} srcSet={s.srcset} sizes={image.sizes} />
      ))}
      <img
        src={image.src}
        width={image.width}
        height={image.height}
        alt={alt}
        loading={eager || priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        className={['bb-img', imgClassName].filter(Boolean).join(' ')}
        onLoad={() => setLoaded(true)}
      />
    </picture>
  );
}
