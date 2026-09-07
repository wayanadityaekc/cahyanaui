export default function Mosaic({ images, variant }) {
  return (
    <div className={`mosaic ${variant === 'three' ? 'three' : ''}`.trim()}>
      {images.map((img) => (
        <img key={img.src} src={img.src} alt={img.alt} width={700} height={500} loading="lazy" />
      ))}
    </div>
  );
}
