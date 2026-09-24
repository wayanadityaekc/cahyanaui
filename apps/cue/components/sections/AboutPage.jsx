import { ABOUT } from '@/content/shared/about';
import RegistrationBlock from '@/components/sections/RegistrationBlock';
import { infoList } from '@/components/ui/infoClasses';

// Plain-text rewrite (Sep 2026, Wayan): about-us.html standalone is gone, this
// only renders inside Our Company now - so it's one plain version, not the old
// company/standalone toggle. Fact strip, driver cards (+ their click-to-open
// modal), and the hidden gallery placeholder are all dropped - just heading +
// paragraphs telling the story, no boxes.
export default function AboutPage() {
  return (
    <div>
      <h1 className="font-head text-h2 font-bold text-gold mb-2">{ABOUT.title}</h1>
      <p className="mb-6 text-body leading-[1.5] text-muted">{ABOUT.sub}</p>

      <p className="mb-2 text-body text-ink">
        Based in {ABOUT.intro.facts[0].value} - run by {ABOUT.intro.facts[1].value.toLowerCase()} - prices {ABOUT.intro.facts[2].value.toLowerCase()}.
      </p>
      <p className="mb-8 text-body leading-[1.6] text-ink">{ABOUT.intro.text}</p>

      {ABOUT.arows.map((row) => (
        <div className="mb-8" key={row.heading}>
          <span className="block mb-1 text-small font-medium text-muted">{row.kicker}</span>
          <h2 className="m-0 mb-2 font-head text-h2 font-medium text-green">{row.heading}</h2>

          {row.paras.map((p, i) => (
            <p className="mb-3 text-body leading-[1.6] text-ink" key={i}>{p}</p>
          ))}

          {row.steps && (
            <ol className="list-none m-0 p-0">
              {row.steps.map((st) => (
                <li className="mb-3" key={st.n}>
                  <strong className="text-body font-semibold text-green">{st.n}. {st.title}</strong>
                  <p className="m-0 mt-[0.15rem] text-small leading-[1.5] text-muted">{st.text}</p>
                </li>
              ))}
            </ol>
          )}

          {row.list && (
            <ul className={infoList(row.list.cls)}>
              {row.list.items.map((it, i) => <li key={i}>{it}</li>)}
            </ul>
          )}

          {row.drivers && row.drivers.map((d) => (
            <p className="mb-3 text-body leading-[1.6] text-ink" key={d.name}>
              <strong className="font-semibold text-green">{d.name}</strong> - {d.tagline}. {d.desc}
            </p>
          ))}
        </div>
      ))}

      <RegistrationBlock company />
    </div>
  );
}
