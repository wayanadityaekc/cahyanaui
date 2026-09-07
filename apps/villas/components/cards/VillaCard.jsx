import Link from 'next/link';

export default function VillaCard({ href, img, alt, tag, category, name, meta, rating, reviews }) {
  return (
    <Link href={href} className="v-card">
      <div className="v-card-media">
        <img src={img} alt={alt} width={700} height={500} loading="lazy" />
        <span className="tag">{tag}</span>
      </div>
      <div className="v-card-body">
        <p className="v-card-cat">{category}</p>
        <h3>{name}</h3>
        <p className="v-card-meta">{meta}</p>
        <p className="v-card-rating">★ {rating} <span>· {reviews} reviews</span></p>
      </div>
    </Link>
  );
}
