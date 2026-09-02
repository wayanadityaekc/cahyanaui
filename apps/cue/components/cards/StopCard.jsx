import Img from '@/components/ui/Img';

export default function StopCard({ num, name, desc, img, alt, width = 1200, height = 900, href, tourContext }) {
  const link = href && tourContext ? `${href}?from=${encodeURIComponent(tourContext)}` : href;
  return (
    <article className="stop">
      {img && (
        <div className="stop__image">
          <Img src={`/assets/images/${img}`} alt={alt || name} width={width} height={height} />
        </div>
      )}
      <div className="stop__body">
        {num && <span className="stop__num">{num}</span>}
        <h3 className="stop__name">{link ? <a href={link}>{name}</a> : name}</h3>
        {desc && <p className="stop__desc">{desc}</p>}
      </div>
    </article>
  );
}
