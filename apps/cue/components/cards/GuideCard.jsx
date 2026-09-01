import Img from '@/components/ui/Img';

export default function GuideCard({ href, title, img, alt, tag }) {
  return (
    <a className="experience__card guide-home__card" href={href}>
      <div className="experience__image">
        <Img src={`/assets/images/${img}`} alt={alt || title} width={600} height={600} />
      </div>
      <div className="experience__body">
        {tag && <span className="guide-tag">{tag}</span>}
        <h3 className="experience__name">{title}</h3>
      </div>
    </a>
  );
}
