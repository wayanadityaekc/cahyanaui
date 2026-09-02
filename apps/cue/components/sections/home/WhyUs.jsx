import { WHY_US } from '@/content/shared/home';

export default function WhyUs() {
  return (
    <section className="whyus" id="why-us">
      <div className="whyus__in">
        <div className="whyus__head">
          <span className="whyus__k">Why Cahyana</span>
          <h2 className="whyus__t">Clear prices, local team, your plan</h2>
        </div>
        <div className="whyus__grid">
          {WHY_US.map((c) => (
            <div className="whyus__col" key={c.title}>
              <span className="whyus__ic" dangerouslySetInnerHTML={{ __html: c.icon }} />
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
