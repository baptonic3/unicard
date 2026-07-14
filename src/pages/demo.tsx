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
            <span>11:29 AM UTC</span>
            <span>Discover Events</span>
            <div style={{ padding: '8px 16px', borderRadius: 20, background: 'rgba(19,21,23,0.04)', color: 'rgba(19,21,23,0.64)' }}>
              Sign In
            </div>
          </div>
        </nav>

        {/* Main content container */}
        <div style={{ maxWidth: 960, margin: '64px auto 0', display: 'flex', gap: 48, padding: '0 16px', alignItems: 'flex-start' }}>
          
          {/* LEFT COLUMN — Presenter Info */}
          <div style={{ width: 330, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Cover Image Placeholder */}
            <div style={{ width: '100%', height: 330, borderRadius: 24, background: '#e2e8f0', backgroundImage: 'url(https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid rgba(20,20,20,0.04)' }}></div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>B</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: 'rgba(72,72,72,0.8)' }}>Presented by</div>
                  <div style={{ fontWeight: 500, color: '#141414', fontSize: 16 }}>Blockspace</div>
                </div>
                <div style={{ background: 'rgba(46,46,46,0.04)', padding: '6px 16px', borderRadius: 16, fontSize: 14, fontWeight: 500, color: 'rgba(20,20,20,0.64)', cursor: 'pointer' }}>
                  Follow
                </div>
              </div>

              <p style={{ fontSize: 14, color: 'rgba(72,72,72,0.8)', lineHeight: 1.5, margin: 0 }}>
                A self-organizing bunch of AI nerds.<br/>
                We host meetups, hackathons & conferences around the world.
              </p>

              {/* Decorative Icons */}
              <div style={{ display: 'flex', gap: 6 }}>
                <span style={{ color: 'rgba(20,20,20,0.4)' }}>📷</span>
                <span style={{ color: 'rgba(20,20,20,0.4)' }}>📝</span>
                <span style={{ color: 'rgba(20,20,20,0.4)' }}>🔗</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(20,20,20,0.08)', paddingTop: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'rgba(72,72,72,0.8)', marginBottom: 16 }}>Hosted By</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#cbd5e1' }}></div>
                <div style={{ fontSize: 16, fontWeight: 500, color: '#141414' }}>Blockspace</div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(20,20,20,0.08)', paddingTop: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'rgba(72,72,72,0.8)', marginBottom: 16 }}>25 Going</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ display: 'flex' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#f87171', border: '2px solid #f2f2f2', zIndex: 4 }}></div>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#60a5fa', border: '2px solid #f2f2f2', marginLeft: -8, zIndex: 3 }}></div>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#34d399', border: '2px solid #f2f2f2', marginLeft: -8, zIndex: 2 }}></div>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#818cf8', border: '2px solid #f2f2f2', marginLeft: -8, zIndex: 1 }}></div>
                </div>
                <div style={{ fontSize: 14, color: 'rgba(72,72,72,0.8)' }}>Fabio Gori, Eugen Iordache...</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: 'rgba(20,20,20,0.36)' }}>Contact the Host</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: 'rgba(20,20,20,0.36)' }}>Report Event</span>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 10px', borderRadius: 20, border: '1px solid rgba(20,20,20,0.08)', fontSize: 14, color: 'rgba(20,20,20,0.36)', fontWeight: 500, alignSelf: 'flex-start' }}>
              # AI
            </div>
          </div>

          {/* RIGHT COLUMN — Event Details & Ticket Box */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: 'rgba(46,46,46,0.04)', display: 'inline-flex', alignItems: 'center', padding: '4px 8px', borderRadius: 8, fontSize: 13, color: '#141414', fontWeight: 500, alignSelf: 'flex-start' }}>
                 📍 Featured in Amsterdam
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
                <div style={{ border: '1px solid rgba(20,20,20,0.08)', borderRadius: 8, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                  �️
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={{ fontSize: 16, fontWeight: 500, color: '#141414' }}>StartDock Coworking Prins Hendrikkade ↗</div>
                  <div style={{ fontSize: 14, color: 'rgba(72,72,72,0.8)' }}>Amsterdam, Netherlands</div>
                </div>
              </div>
            </div>

            {/* Ticket Box inline inside right column */}
            <div style={{ background: 'rgba(255,255,255,0.32)', border: '1px solid rgba(255,255,255,0.16)', borderRadius: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
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
            <div style={{ borderTop: '1px solid rgba(20,20,20,0.08)', paddingTop: 24, marginTop: 12 }}>
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

            {/* Location Section at the bottom of the right column */}
            <div style={{ borderTop: '1px solid rgba(20,20,20,0.08)', paddingTop: 24, marginTop: 12 }}>
               <h3 style={{ fontSize: 14, fontWeight: 500, color: 'rgba(72,72,72,0.8)', marginBottom: 24 }}>Location</h3>
               <div style={{ fontSize: 16, fontWeight: 500, color: '#141414', marginBottom: 4 }}>
                 StartDock Coworking Prins Hendrikkade
               </div>
               <div style={{ fontSize: 14, color: 'rgba(72,72,72,0.8)', marginBottom: 20 }}>
                 Prins Hendrikkade 21e, 1012 TL Amsterdam, Netherlands
               </div>

               {/* Mock Map Image */}
               <div style={{ width: '100%', height: 199, borderRadius: 12, background: '#e5e3df', backgroundImage: 'url(https://maps.googleapis.com/maps/api/staticmap?center=StartDock+Coworking+Amsterdam&zoom=14&size=600x300&maptype=roadmap&markers=color:red%7Clabel:S%7C52.3789,4.8988&key=)', backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid rgba(20,20,20,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                 <svg width="100%" height="199" viewBox="0 0 566 199" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <g opacity="0.5" style={{ mixBlendMode: 'soft-light' }}>
                     <rect width="566" height="199" rx="12" fill="#777777"/>
                   </g>
                 </svg>
               </div>
            </div>

          </div>
          
        </div>
      </div>
    </>
  );
}
