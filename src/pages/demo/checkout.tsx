import React, { useState } from 'react';
import Head from 'next/head';
import Logo from '../../components/landing/Logo';

export default function DemoCheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCryptoBuy = async () => {
    try {
      setIsProcessing(true);
      // POST to UniCard api to generate session
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemSlug: 'onchain-rooftop-mixer',
          successUrl: `${window.location.origin}/demo?success=true`,
          cancelUrl: `${window.location.origin}/demo/checkout`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create session');

      // Go straight to checkout — sign-in now happens inline on that screen.
      window.location.href = `/checkout/${data.sessionId}`;

    } catch (error) {
      console.error(error);
      alert('Error creating checkout session.');
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Head>
        <title>Checkout - Onchain Rooftop</title>
        <style>{`
          @keyframes pulse-btn {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0,0,0,0.0); }
            50% { transform: scale(0.98); box-shadow: 0 0 0 6px rgba(0,0,0,0.04); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0,0,0,0.0); }
          }
          @keyframes spin-loader {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </Head>
      <div style={{ minHeight: '100vh', background: '#f2f2f2', color: '#141414', fontFamily: 'Inter, sans-serif', paddingBottom: 64 }}>

        {/* Nav matching demo.tsx exactly */}
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', background: '#f2f2f2', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <div style={{ fontWeight: 600, fontSize: 15, color: '#a2a2a2', display: 'flex', alignItems: 'center', gap: '6px' }}>
             <span style={{ fontSize: 18 }}>✦</span> Magical events
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 14, color: 'rgba(19,21,23,0.36)', alignItems: 'center', fontWeight: 500 }}>
            <span className="demo-nav-meta">11:29 AM UTC</span>
            <span className="demo-nav-meta">Discover Events</span>
            <img src="/demo/avatar-nav-user.png" alt="User" style={{ width: 33, height: 33, borderRadius: '50%', objectFit: 'cover' }} />
          </div>
        </nav>

        {/* Main content grid — mirrors demo.tsx's cover/summary/checkout layout and breakpoint */}
        <div className="demo-grid">

          {/* Event Image — same size/treatment as the demo page's cover image */}
          <div className="demo-cover">
            <div style={{ width: '100%', aspectRatio: '1 / 1', borderRadius: 24, backgroundImage: 'url(https://i.postimg.cc/TPvzWpB8/event.png)', backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid rgba(20,20,20,0.04)' }}></div>
          </div>

          {/* Order Summary */}
          <div className="demo-summary">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 20, fontWeight: 500, color: '#210032' }}>Onchain Rooftop — Builders' Mixer</div>
              <div style={{ fontSize: 14, color: 'rgba(20,20,20,0.64)' }}>Wednesday, July 22 · 5:00 PM – 9:00 PM</div>
              <div style={{ fontSize: 14, color: 'rgba(20,20,20,0.64)' }}>StartDock Coworking Prins Hendrikkade, Amsterdam</div>
            </div>

            <div style={{ height: 1, background: 'rgba(33,0,50,0.08)', margin: '20px 0' }}></div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(20,20,20,0.64)' }}>Standard Ticket × 1</span>
                <span style={{ color: '#210032' }}>$5.00</span>
              </div>
              {/* <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(20,20,20,0.64)' }}>Fees</span>
                <span style={{ color: '#210032' }}>$0.00</span>
              </div> */}
              <div style={{ height: 1, background: 'rgba(33,0,50,0.08)', margin: '4px 0' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 500 }}>
                <span style={{ color: '#210032' }}>Total</span>
                <span style={{ color: '#210032' }}>$5.00</span>
              </div>
            </div>
          </div>

          {/* Checkout Box — same card treatment/behavior as the "Get Tickets" box on the demo page */}
          <div className="demo-checkout-box" style={{ background: 'rgba(255,255,255,0.32)', border: '1px solid rgba(255,255,255,0.16)', borderRadius: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <div style={{ background: 'rgba(46,46,46,0.04)', padding: '12px 20px', fontSize: 14, fontWeight: 500, color: 'rgba(72,72,72,0.8)' }}>
              Checkout
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 20, background: '#fff' }}>
              <div style={{ borderBottom: '1px solid rgba(33,0,50,0.08)', paddingBottom: 16 }}>
                <div style={{ fontSize: 14, color: 'rgba(20,20,20,0.64)', marginBottom: 4 }}>Ticket Price</div>
                <div style={{ fontSize: 24, fontWeight: 500, color: '#210032' }}>$5.00</div>
              </div>

              <div style={{ fontSize: 16, color: '#210032' }}>
                Welcome! To join the event, please get your ticket below.
              </div>

              {/* <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'rgba(20,20,20,0.64)' }}>Name</label>
                <input placeholder="Your full name" style={{ padding: '0 14px', height: 42, borderRadius: 12, border: '1px solid rgba(33,0,50,0.1)', background: 'rgba(255,255,255,0.8)', fontSize: 15, outline: 'none' }} />
              </div> */}

              {/* <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'rgba(20,20,20,0.64)' }}>Email</label>
                <input placeholder="you@example.com" type="email" style={{ padding: '0 14px', height: 42, borderRadius: 12, border: '1px solid rgba(33,0,50,0.1)', background: 'rgba(255,255,255,0.8)', fontSize: 15, outline: 'none' }} />
              </div> */}

              <button style={{ height: 44, background: '#636363', color: '#fff', borderRadius: 16, fontWeight: 500, fontSize: 16, border: 'none', cursor: 'pointer' }}>
                Pay by credit or debit card
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(33,0,50,0.08)' }}></div>
                <div style={{ fontSize: 13, color: 'rgba(20,20,20,0.64)' }}>or</div>
                <div style={{ flex: 1, height: 1, background: 'rgba(33,0,50,0.08)' }}></div>
              </div>

              <button
                onClick={handleCryptoBuy}
                disabled={isProcessing}
                style={{
                  height: 44, background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(33,0,50,0.16)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: isProcessing ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease', animation: isProcessing ? 'pulse-btn 1.5s infinite ease-in-out' : 'none', opacity: isProcessing ? 0.9 : 1
                }}
                onMouseOver={e => !isProcessing && (e.currentTarget.style.background = '#fafafa')}
                onMouseOut={e => !isProcessing && (e.currentTarget.style.background = 'rgba(255,255,255,0.9)')}
              >
                {isProcessing ? (
                  <span style={{ width: 18, height: 18, border: '2.5px solid rgba(0,0,0,0.1)', borderTop: '2.5px solid #210032', borderRadius: '50%', display: 'inline-block', animation: 'spin-loader 0.8s linear infinite' }} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: 16, height: 16, marginRight: -6, zIndex: 1, position: 'relative' }}>
                      <img src="/demo/icon-bitcoin.svg" alt="" width={16} height={16} style={{ display: 'block' }} />
                    </div>
                    <div style={{ width: 16, height: 16, marginRight: -6, zIndex: 2, borderRadius: '50%', background: '#eceff0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src="/demo/icon-ethereum.svg" alt="" width={7} height={12} style={{ display: 'block' }} />
                    </div>
                    <div style={{ width: 16, height: 16, zIndex: 3, borderRadius: '50%', background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(2.5px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src="/demo/icon-plus.svg" alt="" width={16} height={16} style={{ display: 'block' }} />
                    </div>
                  </div>
                )}
                <span style={{ fontSize: 16, fontWeight: 500, color: '#210032' }}>
                  {isProcessing ? 'Generating Session...' : 'Pay with crypto'}
                </span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, color: 'rgba(20,20,20,0.64)', marginTop: -12 }}>
                Powered by <Logo height={13} />
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="demo-footer">
          <div className="demo-footer-links">
            <img src="/demo/icon-sparkle.svg" alt="" width={16} height={16} style={{ opacity: 0.7 }} />
            <span className="demo-footer-link">Discover</span>
            <span className="demo-footer-link">Pricing</span>
            <span className="demo-footer-link">Help</span>
          </div>
          <div className="demo-footer-right">
            <div className="demo-footer-social">
              <span style={{ padding: 9, display: 'flex' }}><img src="/demo/icon-instagram.svg" alt="Instagram" width={16} height={16} /></span>
              <span style={{ padding: 9, display: 'flex' }}><img src="/demo/icon-x-twitter.svg" alt="X" width={16} height={16} /></span>
              <span style={{ padding: 9, display: 'flex' }}><img src="/demo/icon-mail.svg" alt="Email" width={16} height={16} /></span>
            </div>
            <div className="demo-footer-app">Get the App</div>
          </div>
        </div>
      </div>

      {/* Matches the page's own light background — globals.css sets a dark app-wide body
          background, which otherwise shows through as a hairline on the scrollbar track. */}
      <style jsx global>{`
        html,
        body {
          background: #f2f2f2;
        }
      `}</style>

      <style jsx>{`
        .demo-grid {
          display: grid;
          grid-template-columns: 330px minmax(0, 1fr);
          grid-template-areas:
            'cover checkout-box'
            'summary checkout-box';
          column-gap: 48px;
          row-gap: 24px;
          max-width: 960px;
          margin: 64px auto 0;
          padding: 0 16px 0;
          align-items: start;
        }
        .demo-cover { grid-area: cover; }
        .demo-summary { grid-area: summary; }
        .demo-checkout-box { grid-area: checkout-box; }

        .demo-footer {
          max-width: 960px;
          margin: 80px auto 0;
          padding: 17px 16px 0;
          border-top: 1px solid rgba(20, 20, 20, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }
        .demo-footer-links {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .demo-footer-link {
          padding: 8px;
          font-size: 14px;
          color: rgba(20, 20, 20, 0.36);
        }
        .demo-footer-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .demo-footer-social {
          display: flex;
          align-items: center;
        }
        .demo-footer-app {
          border: 1px solid rgba(20, 20, 20, 0.36);
          color: rgba(20, 20, 20, 0.36);
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 13px;
          white-space: nowrap;
        }

        @media (max-width: 900px) {
          .demo-grid {
            grid-template-columns: minmax(0, 1fr);
            grid-template-areas:
              'cover'
              'summary'
              'checkout-box';
            margin-top: 32px;
          }
          .demo-nav-meta {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .demo-footer {
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}
