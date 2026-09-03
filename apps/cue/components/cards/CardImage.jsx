import Img from '@/components/ui/Img';

const PLACEHOLDER_GRADIENT = 'linear-gradient(135deg, rgba(31, 61, 43, 0.92), rgba(46, 90, 64, 0.86))';

export default function CardImage({ img, alt, width = 600, height = 600, children }) {
  if (!img) {
    return (
      <div className="experience__image" style={{ backgroundImage: PLACEHOLDER_GRADIENT }}>
        {children}
      </div>
    );
  }
  return (
    <div className="experience__image">
      <Img src={`/assets/images/${img}`} alt={alt} width={width} height={height} />
      {children}
    </div>
  );
}
