import type { ReactNode } from 'react';
import { Icon } from '../shared/Icon';

/** Renders WhatsApp's *bold* and _italic_ markers the way the app will show them. */
function formatLine(line: string, key: number): ReactNode {
  const parts: ReactNode[] = [];
  const re = /\*([^*\n]+)\*|_([^_\n]+)_/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = re.exec(line))) {
    if (match.index > last) parts.push(line.slice(last, match.index));
    parts.push(match[1] ? <strong key={i++}>{match[1]}</strong> : <em key={i++}>{match[2]}</em>);
    last = match.index + match[0].length;
  }
  if (last < line.length) parts.push(line.slice(last));
  return (
    <span key={key} className="wa-line">
      {parts.length ? parts : ' '}
    </span>
  );
}

export function WhatsAppPreview({
  text,
  title,
  brand,
}: {
  text: string;
  title: string;
  brand: string;
}) {
  return (
    <figure className="wa-preview">
      <figcaption className="wa-head">
        <span className="wa-avatar" aria-hidden="true">
          <Icon name="whatsapp" size={16} />
        </span>
        <span>
          <span className="block text-sm font-semibold">{brand}</span>
          <span className="block text-xs opacity-80">{title}</span>
        </span>
      </figcaption>
      <div className="wa-chat">
        <div className="wa-bubble">{text.split('\n').map(formatLine)}</div>
      </div>
    </figure>
  );
}
