import Link from 'next/link';

export default function ServiceCard({ href, img, alt, name, desc, cta }) {
  return (
    <Link href={href} className="s-card">
      <img src={img} alt={alt} width={700} height={460} loading="lazy" />
      <div className="s-card-body">
        <h3>{name}</h3>
        <p>{desc}</p>
        <span className="s-card-price">{cta} ›</span>
      </div>
    </Link>
  );
}
