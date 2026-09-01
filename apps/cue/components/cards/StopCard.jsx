import Img from '@/components/ui/Img';

export default function StopCard({ title, desc, img, alt, href, tourContext }) {
  const link = href && tourContext ? `${href}?from=${encodeURIComponent(tourContext)}` : href;
  return (
    <article className="stop">
      {img && (
        <div className="stop__image">
          <Img src={`/assets/images/${img}`} alt={alt || title} width={1200} height={900} ratio="4 / 3" />
        </div>
      )}
      <div className="stop__body">
        <h3 className="stop__title">{link ? <a href={link}>{title}</a> : title}</h3>
        {desc && <p className="stop__desc">{desc}</p>}
      </div>
    </article>
  );
}
