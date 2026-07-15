import React, { useState } from 'react';
import Head from 'next/head';

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
          itemSlug: 'arbitrum-hackathon-uxmaxx', // Note: will change this later 
          successUrl: `${window.location.origin}/demo?success=true`,
          cancelUrl: `${window.location.origin}/demo/checkout`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create session');

      // Redirect user to login, passing the checkout session as the next step
      window.location.href = `/login?next=${encodeURIComponent('/checkout/' + data.sessionId)}`;

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
      <div style={{ minHeight: '100vh', background: '#f2f2f2', color: '#141414', fontFamily: 'Inter, sans-serif', paddingBottom: 64, display: 'flex', flexDirection: 'column' }}>
        
        {/* Nav matching demo.tsx exactly */}
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <div style={{ fontWeight: 600, fontSize: 15, color: '#a2a2a2', display: 'flex', alignItems: 'center', gap: '6px' }}>
             <span style={{ fontSize: 18 }}>✦</span> Magical events
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 14, color: 'rgba(19,21,23,0.36)', alignItems: 'center', fontWeight: 500 }}>
            <span>11:29 AM UTC</span>
            <span>Discover Events</span>
            <div style={{ padding: '8px 16px', borderRadius: 20, background: 'rgba(19,21,23,0.04)', color: 'rgba(19,21,23,0.64)' }}>
              Sign In
            </div>
          </div>
        </nav>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Main 960px wide section */}
          <div style={{ width: 960, margin: '80px auto', display: 'flex', flexDirection: 'column', gap: 80 }}>
            
            {/* 2 Column Layout */}
            <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>
              
              {/* Left Column — Order Summary (360px) */}
              <div style={{ width: 360, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Image */}
                <div style={{ width: 360, height: 360, borderRadius: 24, background: '#e2e8f0', backgroundImage: 'url(https://i.postimg.cc/TPvzWpB8/event.png)', backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid rgba(255,255,255,0.16)', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}></div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: 20, fontWeight: 500, color: '#210032' }}>Onchain Rooftop — Builders' Mixer</div>
                  <div style={{ fontSize: 14, color: 'rgba(20,20,20,0.64)' }}>Wednesday, July 22 · 5:00 PM – 9:00 PM</div>
                  <div style={{ fontSize: 14, color: 'rgba(20,20,20,0.64)' }}>StartDock Coworking Prins Hendrikkade, Amsterdam</div>
                </div>

                <div style={{ height: 1, background: 'rgba(33,0,50,0.08)' }}></div>

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

              {/* Right Column — Payment Card (552px) */}
              <div style={{ width: 552, flexShrink: 0, background: '#fff', borderRadius: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.1)', border: '1px solid rgba(255,255,255,0.7)', overflow: 'hidden' }}>
                <div style={{ background: 'rgba(46,46,46,0.04)', padding: '16px 20px', borderBottom: '1px solid rgba(0,0,0,0.05)', fontSize: 14, fontWeight: 500, color: 'rgba(72,72,72,0.8)' }}>
                  Checkout
                </div>

                <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
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
                    Get Ticket · $5.00
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
                      height: 48, background: '#fff', border: '1px solid rgba(33,0,50,0.16)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: isProcessing ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease', animation: isProcessing ? 'pulse-btn 1.5s infinite ease-in-out' : 'none', opacity: isProcessing ? 0.9 : 1
                    }}
                    onMouseOver={e => !isProcessing && (e.currentTarget.style.background = '#fafafa')}
                    onMouseOut={e => !isProcessing && (e.currentTarget.style.background = '#fff')}
                  >
                    {isProcessing ? (
                      <span style={{ width: 18, height: 18, border: '2.5px solid rgba(0,0,0,0.1)', borderTop: '2.5px solid #210032', borderRadius: '50%', display: 'inline-block', animation: 'spin-loader 0.8s linear infinite' }} />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: 20, height: 20, borderRadius: 10, background: '#f7931a', border: '1.5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 600, zIndex: 3 }}>₿</div>
                        <div style={{ width: 20, height: 20, borderRadius: 10, background: '#627eea', border: '1.5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 600, marginLeft: -6, zIndex: 2 }}>Ξ</div>
                        <div style={{ width: 20, height: 20, borderRadius: 10, background: '#2775ca', border: '1.5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 600, marginLeft: -6, zIndex: 1 }}>$</div>
                      </div>
                    )}
                    <span style={{ fontSize: 16, fontWeight: 500, color: '#210032' }}>
                      {isProcessing ? 'Generating Session...' : 'Pay with crypto'}
                    </span>
                  </button>

                  <div style={{ textAlign: 'center', fontSize: 12, color: 'rgba(20,20,20,0.64)' }}>
                    • powered by Unicard
                  </div>
                </div>
              </div>
            </div>

            {/* Footer exactly matching the layout */}
            <div style={{ width: 960, borderTop: '1px solid rgba(20,20,20,0.08)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: 16, fontSize: 14, color: 'rgba(20,20,20,0.36)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#a2a2a2', fontWeight: 600 }}><span style={{ fontSize: 16 }}>✦</span></span>
                <span style={{ cursor: 'pointer' }}>Discover</span>
                <span style={{ cursor: 'pointer' }}>Pricing</span>
                <span style={{ cursor: 'pointer' }}>Help</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ display: 'flex', gap: 12, color: 'rgba(20,20,20,0.36)', fontSize: 16 }}>
                  <span>📷</span>
                  <span>🐦</span>
                  <span>✉️</span>
                </div>
                <div style={{ border: '1px solid rgba(20,20,20,0.36)', color: 'rgba(20,20,20,0.36)', padding: '4px 10px', borderRadius: 20, fontSize: 13, cursor: 'pointer' }}>
                  Get the App
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
