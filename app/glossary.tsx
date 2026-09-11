import { GENERATIONS } from "@/lib/generations";

export function Glossary() {
  return (
    <section className="glossary">
      <h2>A short dictionary of generational slang</h2>
      <p className="lede">
        Every generation builds a vocabulary the ones on either side of it cannot quite read. Here is what the
        translator is drawing on, and what the words actually mean.
      </p>

      {/* <details> keeps collapsed text in the HTML, so search engines still index every entry. */}
      {GENERATIONS.map((g, i) => (
        <details key={g.id} className="gloss" style={{ borderColor: g.accent }} open={i === 0}>
          <summary>
            <h3>
              <span aria-hidden>{g.emoji}</span> {g.label} <small>{g.years}</small>
            </h3>
            <span className="marker" aria-hidden />
          </summary>
          <div className="gloss-body">
            <p>{g.blurb}</p>
            <dl>
              {g.terms.map((t) => (
                <div key={t.term}>
                  <dt style={{ background: g.accentSoft, color: g.ink }}>{t.term}</dt>
                  <dd>{t.meaning}</dd>
                </div>
              ))}
            </dl>
          </div>
        </details>
      ))}

      <h2>Questions people ask</h2>
      <dl className="faq">
        <dt>Is the generational translator free?</dt>
        <dd>Yes. There is no sign-up, no account and no payment. Translations are capped daily to keep it that way.</dd>
        <dt>Which generations can it translate between?</dt>
        <dd>
          Gen Alpha, Gen Z, Millennial, Gen X and Boomer. You write in plain English and pick the voice you want back.
        </dd>
        <dt>Is the slang accurate?</dt>
        <dd>
          It is exaggerated on purpose. Real people mix registers and rarely stack this much slang into one sentence, so
          treat the output as a joke rather than a phrasebook.
        </dd>
        <dt>Does it work the other way round?</dt>
        <dd>
          Not yet. It translates from plain English into a generation&apos;s slang, rather than decoding slang back into
          plain English.
        </dd>
      </dl>
    </section>
  );
}
