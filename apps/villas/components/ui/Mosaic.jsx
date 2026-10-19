import LoadFallback from '@/components/ui/LoadFallback';

const MOSAIC_IMAGE_WIDTH_PX = 500;
const MOSAIC_IMAGE_HEIGHT_PX = 360;

export default function Mosaic({ images = [] }) {
  if (!images.length) return <LoadFallback className="mt-4" />;
  return (
    <div className="grid grid-cols-3 gap-3 mt-4">
      {images.map((image) => (
        <img
          key={image.src}
          src={image.src}
          alt={image.alt}
          width={MOSAIC_IMAGE_WIDTH_PX}
          height={MOSAIC_IMAGE_HEIGHT_PX}
          loading="lazy"
          className="w-full aspect-[4/3] object-cover"
        />
      ))}
    </div>
  );
}
