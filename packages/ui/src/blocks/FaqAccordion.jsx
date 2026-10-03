import { ChevronDown } from 'lucide-react';
import { RAIL_BODY_TEXT, RAIL_TITLE, FAQ_CAT, FAQ_Q, FAQ_CHEV, FAQ_ROW, FAQ_A } from './railClasses.js';

/**
 * CUE's FAQ section: a title, then questions grouped by category, each a native
 * <details> row. Shared name="faq" means opening one answer closes the previous.
 *
 *   groups  [{ cat, items: [{ q, a }] }]  - `a` is a string (plain text, wrapped
 *           in a <p>) or a node. `answerHtml` true treats a string as trusted HTML.
 */
export default function FaqAccordion({ title, groups = [], answerHtml = false }) {
  if (!groups.length) {
    return <p className="text-body text-muted">Sorry, we could not load this information. Please try again.</p>;
  }
  return (
    <div className={RAIL_BODY_TEXT}>
      {title && <h1 className={RAIL_TITLE}>{title}</h1>}
      {groups.map((group) => (
        <div className="mb-[var(--space-4)]" key={group.cat}>
          <h2 className={FAQ_CAT}>{group.cat}</h2>
          {group.items.map((item, index) => (
            <details className={FAQ_ROW} name="faq" key={index}>
              <summary className={FAQ_Q}>
                {item.q}
                <ChevronDown className={FAQ_CHEV} strokeWidth={1.7} aria-hidden="true" />
              </summary>
              {answerHtml && typeof item.a === 'string'
                ? <div className={FAQ_A} dangerouslySetInnerHTML={{ __html: item.a }} />
                : <div className={FAQ_A}>{typeof item.a === 'string' ? <p>{item.a}</p> : item.a}</div>}
            </details>
          ))}
        </div>
      ))}
    </div>
  );
}
