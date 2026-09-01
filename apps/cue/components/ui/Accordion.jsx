'use client';

export default function Accordion({ items = [] }) {
  return (
    <div className="faq__list">
      {items.map((it, i) => (
        <details className="faq__item" key={i}>
          <summary className="faq__q">{it.q}</summary>
          <div className="faq__a">{typeof it.a === 'string' ? <p>{it.a}</p> : it.a}</div>
        </details>
      ))}
    </div>
  );
}
