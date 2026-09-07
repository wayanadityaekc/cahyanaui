export default function Mosaic({ images }) {
  return (
    <div className="grid grid-cols-3 gap-3 mt-4">
      {images.map((img) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={img.src}
          src={img.src}
          alt={img.alt}
          width={500}
          height={360}
          loading="lazy"
          className="w-full aspect-[4/3] object-cover rounded-lg"
        />
      ))}
    </div>
  );
}
