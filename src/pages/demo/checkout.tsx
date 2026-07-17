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
      const nextPath = '/checkout/' + data.sessionId;
      window.localStorage.setItem('pending_checkout', nextPath);
      window.location.href = `/login?next=${encodeURIComponent(nextPath)}`;

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
      <div className="min-h-screen bg-[#f2f2f2] text-[#141414] font-[Inter,sans-serif] pb-16 flex flex-col">

        {/* Nav — matches /demo exactly */}
        <nav className="flex items-center justify-between px-6 py-3 bg-[#f2f2f2] border-b border-black/5">
          <div className="font-semibold text-[15px] text-[#a2a2a2] flex items-center gap-1.5">
            <span className="text-lg">✦</span> Magical events
          </div>
          <div className="flex gap-4 text-sm text-[rgba(19,21,23,0.36)] items-center font-medium">
            <span className="hidden lg:inline">11:29 AM UTC</span>
            <span className="hidden lg:inline">Discover Events</span>
            <img src="/demo/avatar-nav-user.png" alt="User" className="w-[30px] h-[30px] rounded-full object-cover" />
          </div>
        </nav>

        <div className="flex-1 flex flex-col items-center">
          {/* Main content */}
          <div className="w-full max-w-[960px] mx-auto mt-10 lg:mt-16 px-4 flex flex-col gap-12 lg:gap-20">

            {/* Order summary + payment card */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

              {/* Order Summary — matches /demo's left sidebar column (330px) */}
              <div className="w-full lg:w-[330px] lg:shrink-0 flex flex-col gap-5">
                <div className="w-full aspect-square lg:w-[330px] lg:h-[330px] rounded-3xl border border-[rgba(255,255,255,0.16)] shadow-[0_1px_4px_rgba(0,0,0,0.1)] bg-cover bg-center bg-[url('https://i.postimg.cc/TPvzWpB8/event.png')]" />

                <div className="flex flex-col gap-2">
                  <div className="text-xl font-medium text-[#210032]">Onchain Rooftop — Builders' Mixer</div>
                  <div className="text-sm text-[rgba(20,20,20,0.64)]">Wednesday, July 22 · 5:00 PM – 9:00 PM</div>
                  <div className="text-sm text-[rgba(20,20,20,0.64)]">StartDock Coworking Prins Hendrikkade, Amsterdam</div>
                </div>

                <div className="h-px bg-[rgba(33,0,50,0.08)]" />

                <div className="flex flex-col gap-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[rgba(20,20,20,0.64)]">Standard Ticket × 1</span>
                    <span className="text-[#210032]">$5.00</span>
                  </div>
                  <div className="h-px bg-[rgba(33,0,50,0.08)] my-1" />
                  <div className="flex justify-between text-base font-medium">
                    <span className="text-[#210032]">Total</span>
                    <span className="text-[#210032]">$5.00</span>
                  </div>
                </div>
              </div>

              {/* Payment Card — matches /demo's "Get Tickets" card (fluid width, same column as the sidebar's sibling) */}
              <div className="w-full lg:flex-1 lg:min-w-0 bg-white rounded-3xl shadow-[0_1px_4px_rgba(0,0,0,0.1)] border border-[rgba(255,255,255,0.7)] overflow-hidden">
                <div className="bg-[rgba(46,46,46,0.04)] px-5 py-3 text-sm font-medium text-[rgba(72,72,72,0.8)]">
                  Checkout
                </div>

                <div className="p-5 flex flex-col gap-5">
                  <div className="border-b border-[rgba(33,0,50,0.08)] pb-4">
                    <div className="text-sm text-[rgba(20,20,20,0.64)] mb-1">Ticket Price</div>
                    <div className="text-2xl font-medium text-[#210032]">$5.00</div>
                  </div>

                  <div className="text-base text-[#210032]">
                    Welcome! To join the event, please get your ticket below.
                  </div>

                  <button className="h-11 bg-[#636363] text-white rounded-2xl font-medium text-base border-0 cursor-pointer">
                    Pay with card
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-[rgba(33,0,50,0.08)]" />
                    <div className="text-[13px] text-[rgba(20,20,20,0.64)]">or</div>
                    <div className="flex-1 h-px bg-[rgba(33,0,50,0.08)]" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleCryptoBuy}
                      disabled={isProcessing}
                      className={`h-11 bg-[rgba(255,255,255,0.9)] border border-[rgba(33,0,50,0.16)] rounded-2xl flex items-center justify-center gap-2.5 transition-all duration-200 hover:bg-[#fafafa] ${isProcessing ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'}`}
                      style={isProcessing ? { animation: 'pulse-btn 1.5s infinite ease-in-out' } : undefined}
                    >
                      {isProcessing ? (
                        <span
                          className="w-[18px] h-[18px] rounded-full inline-block border-[2.5px] border-[rgba(0,0,0,0.1)]"
                          style={{ borderTopColor: '#210032', animation: 'spin-loader 0.8s linear infinite' }}
                        />
                      ) : (
                        <div className="flex items-center">
                          <img src="/demo/icon-bitcoin.svg" alt="" className="size-4 -mr-1.5" />
                          <div className="size-4 -mr-1.5 rounded-full bg-[#eceff0] flex items-center justify-center">
                            <img src="/demo/icon-ethereum.svg" alt="" className="w-[7px] h-3" />
                          </div>
                          <div className="size-4 rounded-[10px] bg-black/20 backdrop-blur-[2.5px] flex items-center justify-center overflow-hidden">
                            <img src="/demo/icon-plus.svg" alt="" className="size-6" />
                          </div>
                        </div>
                      )}
                      <span className="text-base font-medium text-[#210032]">
                        {isProcessing ? 'Generating Session...' : 'Pay with crypto'}
                      </span>
                    </button>

                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-xs text-[rgba(20,20,20,0.64)]">Powered by</span>
                      <img src="/demo/logo-unicard.svg" alt="UniCard" className="h-[14px] w-auto" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer — matches /demo exactly */}
            <div className="border-t border-[rgba(20,20,20,0.08)] pt-4 flex flex-wrap justify-between items-start gap-4">
              <div className="flex flex-wrap items-center gap-4 text-sm text-[rgba(20,20,20,0.36)]">
                <span className="flex items-center gap-2 text-[#a2a2a2] font-semibold"><span className="text-base">✦</span></span>
                <span className="cursor-pointer">Discover</span>
                <span className="cursor-pointer">Pricing</span>
                <span className="cursor-pointer">Help</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex gap-3 items-center">
                  <img src="/demo/icon-instagram.svg" alt="Instagram" width={16} height={16} />
                  <img src="/demo/icon-x-twitter.svg" alt="X" width={16} height={16} />
                  <img src="/demo/icon-mail.svg" alt="Email" width={16} height={16} />
                </div>
                <div className="border border-[rgba(20,20,20,0.36)] text-[rgba(20,20,20,0.36)] px-2.5 py-1 rounded-full text-[13px] cursor-pointer">
                  Get the App
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style jsx global>{`
        html,
        body {
          background-color: #f2f2f2;
        }
        html::-webkit-scrollbar-track,
        body::-webkit-scrollbar-track {
          background: transparent;
        }
        html::-webkit-scrollbar-thumb,
        body::-webkit-scrollbar-thumb {
          background: rgba(20, 20, 20, 0.16);
        }
        html::-webkit-scrollbar-thumb:hover,
        body::-webkit-scrollbar-thumb:hover {
          background: rgba(20, 20, 20, 0.28);
        }
      `}</style>
    </>
  );
}
