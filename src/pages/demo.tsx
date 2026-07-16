import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function DemoEventPage() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Onchain Rooftop — Builders' Mixer</title>
      </Head>
      <div style={{ minHeight: '100vh', background: '#f2f2f2', color: '#141414', fontFamily: 'Inter, sans-serif', paddingBottom: 64 }}>
        {/* Luma-like Nav */}
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

        {/* Main content grid — reorders into a single column matching the Figma mobile breakpoint */}
        <div className="demo-grid">

          {/* Cover Image */}
          <div className="demo-cover">
            <div style={{ width: '100%', aspectRatio: '1 / 1', borderRadius: 24, backgroundImage: 'url(https://i.postimg.cc/TPvzWpB8/event.png)', backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid rgba(20,20,20,0.04)' }}></div>
          </div>

          {/* Presenter / Host Info */}
          <div className="demo-presenter">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <img src="/demo/avatar-blockspace.png" alt="Blockspace" style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover', border: '1px solid rgba(20,20,20,0.08)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: 'rgba(72,72,72,0.8)' }}>Presented by</div>
                  <div style={{ fontWeight: 500, color: '#141414', fontSize: 16 }}>Blockspace</div>
                </div>
                <div style={{ background: 'rgba(46,46,46,0.04)', padding: '6px 16px', borderRadius: 16, fontSize: 14, fontWeight: 500, color: 'rgba(20,20,20,0.64)' }}>
                  Follow
                </div>
              </div>

              <p style={{ fontSize: 14, color: 'rgba(72,72,72,0.8)', lineHeight: 1.5, margin: 0 }}>
                A self-organizing bunch of Crypto nerds. We host meetups, hackathons & conferences around the world.
              </p>

              {/* Social Icons */}
              <div style={{ display: 'flex', gap: 6, marginLeft: -6 }}>
                <span style={{ padding: 6, display: 'flex' }}><img src="/demo/icon-instagram.svg" alt="Instagram" width={16} height={16} /></span>
                <span style={{ padding: 6, display: 'flex' }}><img src="/demo/icon-linkedin.svg" alt="LinkedIn" width={16} height={16} /></span>
                <span style={{ padding: 6, display: 'flex' }}><img src="/demo/icon-globe.svg" alt="Website" width={16} height={16} /></span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(20,20,20,0.08)', paddingTop: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'rgba(72,72,72,0.8)', marginBottom: 16 }}>Hosted By</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <img src="/demo/avatar-blockspace.png" alt="Blockspace" style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }} />
                <div style={{ fontSize: 16, fontWeight: 500, color: '#141414' }}>Blockspace</div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(20,20,20,0.08)', paddingTop: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'rgba(72,72,72,0.8)', marginBottom: 16 }}>25 Going</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ display: 'flex' }}>
                  <img src="/demo/attendee-1.png" alt="" style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover', border: '2px solid #f2f2f2', zIndex: 4 }} />
                  <img src="/demo/attendee-2.png" alt="" style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover', border: '2px solid #f2f2f2', marginLeft: -8, zIndex: 3 }} />
                  <img src="/demo/attendee-3.png" alt="" style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover', border: '2px solid #f2f2f2', marginLeft: -8, zIndex: 2 }} />
                  <img src="/demo/attendee-4.png" alt="" style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover', border: '2px solid #f2f2f2', marginLeft: -8, zIndex: 1 }} />
                </div>
                <div style={{ fontSize: 14, color: 'rgba(72,72,72,0.8)' }}>Fabio Gori, Eugen Iordache...</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: 'rgba(20,20,20,0.36)' }}>Contact the Host</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: 'rgba(20,20,20,0.36)' }}>Report Event</span>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 10px', borderRadius: 20, border: '1px solid rgba(20,20,20,0.08)', fontSize: 14, color: 'rgba(20,20,20,0.36)', fontWeight: 500, alignSelf: 'flex-start' }}>
              # Crypto
            </div>
          </div>

          {/* Event Header — badge, title, date, location */}
          <div className="demo-header">
            <div style={{ background: 'rgba(46,46,46,0.04)', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 6px 4px 4px', borderRadius: 8, fontSize: 13, alignSelf: 'flex-start' }}>
               <img src="/demo/icon-featured-flag.png" alt="" width={18} height={18} style={{ borderRadius: 4 }} />
               <span style={{ color: 'rgba(20,20,20,0.48)' }}>Featured in <span style={{ color: '#141414', fontWeight: 500 }}>Amsterdam</span></span>
               <img src="/demo/icon-chevron.svg" alt="" width={16} height={16} style={{ opacity: 0.5 }} />
            </div>
            <h1 style={{ fontSize: 38, fontWeight: 600, color: '#141414', lineHeight: 1.15, margin: 0 }}>
              Onchain Rooftop — Builders' Mixer
            </h1>

            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 8 }}>
              <div style={{ border: '1px solid rgba(20,20,20,0.08)', borderRadius: 8, width: 44, height: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(72,72,72,0.8)', textTransform: 'uppercase' }}>Jul</span>
                <span style={{ fontSize: 16, fontWeight: 500, color: 'rgba(72,72,72,0.8)' }}>22</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ fontSize: 16, fontWeight: 500, color: '#141414' }}>Wednesday, July 22</div>
                <div style={{ fontSize: 14, color: 'rgba(72,72,72,0.8)' }}>5:30 PM - 9:00 PM GMT+2</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ border: '1px solid rgba(20,20,20,0.08)', borderRadius: 8, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/demo/icon-location-pin.svg" alt="" width={17} height={20} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ fontSize: 16, fontWeight: 500, color: '#141414', display: 'flex', alignItems: 'center', gap: 4 }}>
                  StartDock Coworking Prins Hendrikkade
                  <img src="/demo/icon-external-arrow.svg" alt="" width={12} height={12} style={{ opacity: 0.5 }} />
                </div>
                <div style={{ fontSize: 14, color: 'rgba(72,72,72,0.8)' }}>Amsterdam, Netherlands</div>
              </div>
            </div>
          </div>

          {/* Ticket Box */}
          <div className="demo-ticket" style={{ background: 'rgba(255,255,255,0.32)', border: '1px solid rgba(255,255,255,0.16)', borderRadius: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <div style={{ background: 'rgba(46,46,46,0.04)', padding: '12px 20px', fontSize: 14, fontWeight: 500, color: 'rgba(72,72,72,0.8)' }}>
              Get Tickets
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 20, background: '#fff' }}>
              <div style={{ borderBottom: '1px solid rgba(33,0,50,0.08)', paddingBottom: 16 }}>
                <div style={{ fontSize: 14, color: 'rgba(20,20,20,0.64)', marginBottom: 4 }}>Ticket Price</div>
                <div style={{ fontSize: 24, fontWeight: 500, color: '#210032' }}>$5.00</div>
              </div>
              <div style={{ fontSize: 16, color: '#210032' }}>
                Welcome! To join the event, please get your ticket below.
              </div>
              <button
                onClick={() => router.push('/demo/checkout')}
                style={{ width: '100%', background: '#636363', color: '#fff', fontSize: 16, fontWeight: 500, padding: '14px 0', border: 'none', borderRadius: 16, cursor: 'pointer', transition: '0.2s opacity' }}
                onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
                onMouseOut={e => e.currentTarget.style.opacity = '1'}
              >
                Get Ticket
              </button>
            </div>
          </div>

          {/* About Event */}
          <div className="demo-about" style={{ borderTop: '1px solid rgba(20,20,20,0.08)', paddingTop: 24 }}>
             <h3 style={{ fontSize: 14, fontWeight: 500, color: 'rgba(72,72,72,0.8)', marginBottom: 24 }}>About Event</h3>
             <h2 style={{ fontSize: 20, fontWeight: 600, color: '#141414', marginBottom: 16 }}>Join our casual meetup for Amsterdam's biggest onchain nerds!</h2>
             <p style={{ fontSize: 16, color: '#141414', lineHeight: 1.5, marginBottom: 16 }}>
               Step away from the keyboard and meet the people building the onchain future. Onchain Amsterdam is a canal-side evening mixer for hackathon builders, founders, and friends — good music, cold drinks, and golden-hour views over Prins Hendrikkade, a two-minute walk from Amsterdam Centraal.
             </p>
             <br />
             <p style={{ fontSize: 16, color: '#141414', lineHeight: 1.5, marginBottom: 16 }}>
               Whether you're mid-hack, scouting a co-founder, or just want to talk shop with people who actually ship, come through. Expect lightning demos from teams building this weekend, a welcome drink on us, and plenty of room to hang at StartDock's canal-house loft.
             </p>

             <h2 style={{ fontSize: 20, fontWeight: 600, color: '#141414', margin: '32px 0 16px' }}>// FOR WHO</h2>
             <p style={{ fontSize: 16, color: '#141414', lineHeight: 1.5, marginBottom: 16 }}>
               Onchain builders, top to bottom — Solidity & Rust devs, protocol and infra engineers, wallet and account-abstraction hackers, DeFi, stablecoin, and payments teams, and the founders shipping it all. If you're deploying contracts this weekend, debugging RPCs at 3 AM, or juggling gas across five chains, this is your crowd. Curious newcomers running their first cast send are just as welcome.
             </p>

             <h2 style={{ fontSize: 20, fontWeight: 600, color: '#141414', margin: '32px 0 16px' }}>// AGENDA</h2>
             <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 16, color: '#141414' }}>
               <li>17:30 👋 Walk-in</li>
               <li>18:00 🍕 Pizza (be early!)</li>
               <li>19:35 💻 Lightning demos</li>
               <li>19:45 🍺 Drinks & Networking</li>
               <li>20:00 🤝 Networking</li>
               <li>21:00 🔚 End</li>
             </ul>
          </div>

          {/* Location Section */}
          <div className="demo-location" style={{ borderTop: '1px solid rgba(20,20,20,0.08)', paddingTop: 24 }}>
             <h3 style={{ fontSize: 14, fontWeight: 500, color: 'rgba(72,72,72,0.8)', marginBottom: 24 }}>Location</h3>
             <div style={{ fontSize: 16, fontWeight: 500, color: '#141414', marginBottom: 4 }}>
               StartDock Coworking Prins Hendrikkade
             </div>
             <div style={{ fontSize: 14, color: 'rgba(72,72,72,0.8)', marginBottom: 20 }}>
               Prins Hendrikkade 21e, 1012 TL Amsterdam, Netherlands
             </div>

             {/* Map */}
             <div style={{ width: '100%', height: 199, borderRadius: 12, border: '1px solid rgba(20,20,20,0.04)', overflow: 'hidden' }}>
               <iframe
                 title="Event location map"
                 width="100%"
                 height="199"
                 style={{ border: 0, display: 'block' }}
                 loading="lazy"
                 src="https://www.google.com/maps?q=StartDock+Coworking+Prins+Hendrikkade,+Amsterdam&output=embed"
               />
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
            'cover header'
            'presenter ticket'
            'presenter about'
            'presenter location';
          column-gap: 48px;
          row-gap: 24px;
          max-width: 960px;
          margin: 64px auto 0;
          padding: 0 16px 0;
          align-items: start;
        }
        .demo-cover { grid-area: cover; }
        .demo-presenter { grid-area: presenter; display: flex; flex-direction: column; gap: 24px; }
        .demo-header { grid-area: header; display: flex; flex-direction: column; gap: 16px; }
        .demo-ticket { grid-area: ticket; }
        .demo-about { grid-area: about; }
        .demo-location { grid-area: location; }

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
              'header'
              'ticket'
              'about'
              'location'
              'presenter';
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
