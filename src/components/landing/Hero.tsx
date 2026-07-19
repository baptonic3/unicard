import Link from 'next/link';
import { useState } from 'react';
import { PERSONAS, Persona } from './content';
import { PlayIcon } from './icons';
import { CREATE_WALLET_PATH } from './links';

interface HeroProps {
  persona: Persona;
  onPersonaChange: (p: Persona) => void;
}

export default function Hero({ persona, onPersonaChange }: HeroProps) {
  const content = PERSONAS[persona];
  const [playing, setPlaying] = useState(false);

  const startVideo = () => setPlaying(true);

  return (
    <section className="lp-hero">
      <div className="lp-toggle" role="radiogroup" aria-label="Choose audience">
        {(['personal', 'business'] as Persona[]).map((p) => (
          <button
            key={p}
            role="radio"
            aria-checked={persona === p}
            className={`lp-toggle-seg ${persona === p ? 'active' : ''}`}
            onClick={() => onPersonaChange(p)}
          >
            {p === 'personal' ? 'Personal' : 'Business'}
          </button>
        ))}
      </div>

      <div className="lp-hero-copy" key={persona}>
        <h1 className="lp-hero-title">
          {content.heroTitle[0]}
          <br />
          {content.heroTitle[1]}
        </h1>
        <p className="lp-hero-sub">{content.heroSub}</p>
      </div>

      <div className="lp-hero-ctas">
        <Link href={CREATE_WALLET_PATH} className="lp-btn lp-btn-primary">Create wallet</Link>
        <a href="#how-it-works" className="lp-btn lp-btn-outline">How it works</a>
      </div>

      <div className="lp-video" onClick={playing ? undefined : startVideo}>
        {playing ? (
          <iframe
            className="lp-video-el"
            src={`https://www.youtube-nocookie.com/embed/${content.youtubeId}?autoplay=1&rel=0`}
            title="UniCard demo video"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <>
            <img className="lp-video-poster" src="/videos/hero-poster.jpg" alt="" aria-hidden="true" />
            <div className="lp-video-overlay" />
            <button className="lp-video-play" aria-label="Play demo video" onClick={startVideo}>
              <PlayIcon size={26} color="#062018" />
            </button>
            <span className="lp-video-chip">
              <PlayIcon size={10} color="#ffffff" /> {content.videoLabel}
            </span>
          </>
        )}
      </div>

      <style jsx>{`
        .lp-hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 64px 20px 96px;
          gap: 28px;
        }
        .lp-toggle {
          display: flex;
          gap: 2px;
          padding: 4px;
          background: var(--lp-muted-bg);
          border-radius: 999px;
        }
        .lp-toggle-seg {
          padding: 8px 20px;
          border: none;
          border-radius: 999px;
          background: transparent;
          font-family: inherit;
          font-size: 14px;
          font-weight: 500;
          color: var(--lp-muted);
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .lp-toggle-seg.active {
          background: var(--lp-fg);
          color: var(--lp-bg);
        }
        .lp-hero-copy {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
          animation: lp-fade 0.25s ease;
        }
        @keyframes lp-fade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .lp-hero-copy { animation: none; }
        }
        .lp-hero-title {
          margin: 0;
          font-size: 58px;
          line-height: 1.08;
          font-weight: 700;
          letter-spacing: -0.025em;
          text-align: center;
          color: var(--lp-fg);
        }
        .lp-hero-sub {
          margin: 0;
          max-width: 560px;
          font-size: 17px;
          line-height: 1.55;
          text-align: center;
          color: var(--lp-muted);
        }
        .lp-hero-ctas {
          display: flex;
          gap: 12px;
        }
        .lp-video {
          position: relative;
          width: min(1120px, 100%);
          aspect-ratio: 16 / 9;
          margin-top: 20px;
          border-radius: 24px;
          overflow: hidden;
          background: var(--lp-dark-gradient);
          box-shadow: 0 24px 60px -16px rgba(0, 0, 0, 0.25);
          cursor: pointer;
        }
        .lp-video-el {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          border: 0;
        }
        .lp-video-poster {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .lp-video-overlay {
          position: absolute;
          inset: 0;
          background: var(--lp-dark-gradient);
          opacity: 0.5;
        }
        .lp-video-play {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 84px;
          height: 84px;
          border: none;
          border-radius: 999px;
          background: var(--lp-mint);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          transition: transform 0.15s ease;
        }
        .lp-video-play:hover {
          transform: translate(-50%, -50%) scale(1.06);
        }
        .lp-video-chip {
          position: absolute;
          left: 24px;
          bottom: 24px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 13px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.14);
          color: #fff;
          font-size: 13px;
          font-weight: 500;
          backdrop-filter: blur(6px);
        }
        @media (max-width: 767px) {
          .lp-hero {
            padding: 40px 20px 56px;
            gap: 22px;
          }
          .lp-hero-title {
            font-size: 38px;
          }
          .lp-hero-sub {
            font-size: 15px;
          }
          /* mobile order per design: video above the CTAs */
          .lp-video {
            order: 4;
            margin-top: 4px;
            border-radius: 16px;
          }
          .lp-hero-ctas {
            order: 5;
            flex-direction: column;
            width: 100%;
          }
          .lp-hero-ctas :global(.lp-btn) {
            width: 100%;
            justify-content: center;
          }
          .lp-video-play {
            width: 52px;
            height: 52px;
          }
          .lp-video-chip {
            left: 12px;
            bottom: 12px;
          }
        }
      `}</style>
    </section>
  );
}
