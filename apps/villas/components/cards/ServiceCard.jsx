import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CAPS, Card } from '@cahyana/ui';

const SERVICE_IMAGE_WIDTH_PX = 700;
const SERVICE_IMAGE_HEIGHT_PX = 460;
const ICON_STROKE_WIDTH_LIGHT = 1.6;

export default function ServiceCard({ href, img: image, alt, name, desc, cta }) {
  return (
    <Card as={Link} hover href={href} className="flex flex-col overflow-hidden">
      <img
        src={image}
        alt={alt}
        width={SERVICE_IMAGE_WIDTH_PX}
        height={SERVICE_IMAGE_HEIGHT_PX}
        loading="lazy"
        className="w-full aspect-[3/2] object-cover"
      />
      <div className="p-5">
        <h3 className="text-h3 font-semibold text-gold">{name}</h3>
        <p className="mt-1.5 text-small text-muted">{desc}</p>
        <span className={`${CAPS} mt-3 inline-flex items-center gap-1 text-cta`}>
          {cta}
          <ArrowRight
            className="w-[var(--icon-sm)] h-[var(--icon-sm)]"
            strokeWidth={ICON_STROKE_WIDTH_LIGHT}
            aria-hidden="true"
          />
        </span>
      </div>
    </Card>
  );
}
