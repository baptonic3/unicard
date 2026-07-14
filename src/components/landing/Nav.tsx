import Link from 'next/link';
import { useState } from 'react';
import Logo from './Logo';
import { ExternalIcon, MenuIcon } from './icons';
import { CREATE_WALLET_PATH, DEMO_PATH, GITHUB_URL, PRESENTATION_URL } from './links';

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = (
    <>
      <a href="#how-it-works" className="lp-nav-link">How it works</a>
      <a href="#faq" className="lp-nav-link">FAQ</a>
      <a href={DEMO_PATH} target="_blank" rel="noopener noreferrer" className="lp-nav-link lp-nav-ext">
        Demo <ExternalIcon />
      </a>
      <a href={PRESENTATION_URL} target="_blank" rel="noopener noreferrer" className="lp-nav-link lp-nav-ext">
        Presentation <ExternalIcon />
      </a>
      <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="lp-nav-link lp-nav-ext">
        GitHub <ExternalIcon />
      </a>
    </>
  );

  return (
    <header className="lp-nav">
      <Link href="/" className="lp-nav-logo" aria-label="UniCard home">
        <Logo height={28} />
      </Link>

      <nav className="lp-nav-links">{links}</nav>

      <div className="lp-nav-right">
        <Link href={CREATE_WALLET_PATH} className="lp-btn lp-btn-primary">Create wallet</Link>
        <button
          className="lp-nav-burger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <MenuIcon open={menuOpen} />
        </button>
      </div>

      {menuOpen && (
        <nav className="lp-nav-mobile" onClick={() => setMenuOpen(false)}>
          {links}
        </nav>
      )}

      <style jsx>{`
        .lp-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
          padding: 0 32px;
          background: var(--lp-bg);
          border-bottom: 1px solid var(--lp-border);
        }
        .lp-nav :global(.lp-nav-logo) {
          display: flex;
          align-items: center;
        }
        .lp-nav-links {
          display: flex;
          align-items: center;
          gap: 26px;
        }
        .lp-nav :global(.lp-nav-link) {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 14px;
          font-weight: 500;
          color: var(--lp-muted);
          text-decoration: none;
          transition: color 0.15s ease;
        }
        .lp-nav :global(.lp-nav-link:hover) {
          color: var(--lp-fg);
        }
        .lp-nav-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .lp-nav-burger {
          display: none;
          background: none;
          border: none;
          color: var(--lp-fg);
          cursor: pointer;
          padding: 6px;
        }
        .lp-nav-mobile {
          display: none;
        }
        @media (max-width: 767px) {
          .lp-nav {
            padding: 0 20px;
          }
          .lp-nav-links {
            display: none;
          }
          .lp-nav-burger {
            display: inline-flex;
          }
          .lp-nav-mobile {
            display: flex;
            flex-direction: column;
            gap: 20px;
            position: absolute;
            top: 64px;
            left: 0;
            right: 0;
            padding: 24px 20px;
            background: var(--lp-bg);
            border-bottom: 1px solid var(--lp-border);
          }
        }
      `}</style>
    </header>
  );
}
