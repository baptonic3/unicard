import Link from 'next/link';
import { PERSONAS, Persona } from './content';
import { DEMO_PATH } from './links';

export default function Steps({ persona }: { persona: Persona }) {
  const content = PERSONAS[persona];

  return (
    <section className="lp-steps" id="how-it-works">
      <div className="lp-steps-panel" key={persona}>
        <div className="lp-steps-header">
          <div className="lp-steps-heading">
            <h2 className="lp-steps-title">{content.stepsTitle}</h2>
            <p className="lp-steps-sub">{content.stepsSub}</p>
          </div>
          <Link href={DEMO_PATH} className="lp-btn lp-btn-outline lp-steps-cta">Try a demo</Link>
        </div>

        <ol className="lp-timeline">
          <span className="lp-timeline-line" aria-hidden="true" />
          {content.steps.map((step, i) => (
            <li className="lp-step" key={step.title}>
              <span className="lp-step-dot">{i + 1}</span>
              <h3 className="lp-step-title">{step.title}</h3>
              <p className="lp-step-desc">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>

      <style jsx>{`
        .lp-steps {
          display: flex;
          justify-content: center;
          padding: 0 20px 96px;
          scroll-margin-top: 120px;
        }
        .lp-steps-panel {
          width: min(1280px, 100%);
          background: var(--lp-beige);
          border: 1px solid var(--lp-beige-border);
          border-radius: 24px;
          padding: 64px 72px;
          animation: lp-fade 0.25s ease;
        }
        @keyframes lp-fade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .lp-steps-panel { animation: none; }
        }
        .lp-steps-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 32px;
          margin-bottom: 52px;
        }
        .lp-steps-heading {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 640px;
        }
        .lp-steps-title {
          margin: 0;
          font-size: 34px;
          line-height: 1.2;
          font-weight: 600;
          letter-spacing: -0.015em;
          color: var(--lp-fg);
        }
        .lp-steps-sub {
          margin: 0;
          font-size: 15px;
          line-height: 1.6;
          color: var(--lp-muted);
        }
        .lp-timeline {
          position: relative;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .lp-timeline-line {
          position: absolute;
          top: 12px;
          left: 0;
          right: 0;
          height: 1px;
          background: var(--lp-warm-border);
        }
        .lp-step {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .lp-step-dot {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 999px;
          background: #fff;
          border: 1px solid var(--lp-warm-border);
          font-family: var(--lp-mono);
          font-size: 11px;
          font-weight: 500;
          color: var(--lp-muted);
        }
        .lp-step-title {
          margin: 0;
          font-size: 16px;
          line-height: 1.4;
          font-weight: 600;
          color: var(--lp-fg);
        }
        .lp-step-desc {
          margin: 0;
          font-size: 13.5px;
          line-height: 1.55;
          color: var(--lp-muted);
        }
        @media (max-width: 767px) {
          .lp-steps {
            padding: 0 20px 56px;
          }
          .lp-steps-panel {
            padding: 32px 24px;
            border-radius: 20px;
          }
          .lp-steps-header {
            flex-direction: column;
            gap: 20px;
            margin-bottom: 32px;
          }
          .lp-steps-title {
            font-size: 26px;
          }
          .lp-timeline {
            grid-template-columns: 1fr;
            gap: 28px;
          }
          .lp-timeline-line {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
