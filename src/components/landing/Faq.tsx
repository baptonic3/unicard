import { useState } from 'react';
import { FAQ_ITEMS } from './content';
import { PlusIcon } from './icons';

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="lp-faq" id="faq">
      <h2 className="lp-faq-title">Frequently asked questions</h2>
      <div className="lp-faq-list">
        {FAQ_ITEMS.map((item, i) => {
          const open = openIndex === i;
          return (
            <div className="lp-faq-row" key={item.question}>
              <button
                className="lp-faq-question"
                aria-expanded={open}
                onClick={() => setOpenIndex(open ? null : i)}
              >
                <span>{item.question}</span>
                <span className="lp-faq-icon">
                  <PlusIcon open={open} />
                </span>
              </button>
              {open && <p className="lp-faq-answer">{item.answer}</p>}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .lp-faq {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px 20px 96px;
          scroll-margin-top: 100px;
        }
        .lp-faq-title {
          margin: 0 0 36px;
          font-size: 34px;
          font-weight: 600;
          letter-spacing: -0.015em;
          text-align: center;
          color: var(--lp-fg);
        }
        .lp-faq-list {
          width: min(760px, 100%);
        }
        .lp-faq-row {
          padding: 6px 0;
          border-bottom: 1px solid var(--lp-border);
        }
        .lp-faq-question {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          width: 100%;
          padding: 18px 0;
          border: none;
          background: none;
          font-family: inherit;
          font-size: 16px;
          font-weight: 500;
          text-align: left;
          color: var(--lp-fg);
          cursor: pointer;
        }
        .lp-faq-icon {
          display: inline-flex;
          flex-shrink: 0;
          color: var(--lp-muted);
        }
        .lp-faq-answer {
          margin: 0;
          padding: 0 40px 20px 0;
          font-size: 14px;
          line-height: 1.6;
          color: var(--lp-muted);
        }
        @media (max-width: 767px) {
          .lp-faq {
            padding-bottom: 56px;
          }
          .lp-faq-title {
            font-size: 26px;
          }
        }
      `}</style>
    </section>
  );
}
