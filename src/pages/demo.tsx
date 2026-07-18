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
      <div className="min-h-screen bg-[#f2f2f2] text-[#141414] font-[Inter,sans-serif] pb-16">
        {/* Luma-like Nav */}
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

        {/* Main content grid — reorders into a single column below the lg breakpoint, matching the Figma mobile frame */}
        <div className="demo-grid max-w-[960px] mx-auto mt-10 lg:mt-16 px-4">

          {/* Cover Image */}
          <div className="demo-cover">
            <div className="w-full aspect-square rounded-3xl border border-[rgba(20,20,20,0.04)] bg-cover bg-center bg-[url('/demo/cover-image.png')]" />
          </div>

          {/* Presenter / Host Info */}
          <div className="demo-presenter flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <img src="/demo/avatar-blockspace.png" alt="Blockspace" className="w-8 h-8 rounded-lg object-cover border border-[rgba(20,20,20,0.08)]" />
                <div className="flex-1">
                  <div className="text-xs text-[rgba(72,72,72,0.8)]">Presented by</div>
                  <div className="font-medium text-[#141414] text-base">Blockspace</div>
                </div>
                <div className="bg-[rgba(46,46,46,0.04)] px-4 py-1.5 rounded-full text-sm font-medium text-[rgba(20,20,20,0.64)] cursor-pointer">
                  Follow
                </div>
              </div>

              <p className="text-sm text-[rgba(72,72,72,0.8)] leading-relaxed m-0">
                A self-organizing bunch of crypto nerds.<br />
                We host meetups, hackathons &amp; conferences around the world.
              </p>

              {/* Social Icons */}
              <div className="flex gap-1.5 -ml-1.5">
                <span className="p-1.5 flex"><img src="/demo/icon-instagram.svg" alt="Instagram" width={16} height={16} /></span>
                <span className="p-1.5 flex"><img src="/demo/icon-linkedin.svg" alt="LinkedIn" width={16} height={16} /></span>
                <span className="p-1.5 flex"><img src="/demo/icon-globe.svg" alt="Website" width={16} height={16} /></span>
              </div>
            </div>

            <div className="border-t border-[rgba(20,20,20,0.08)] pt-4">
              <div className="text-sm font-medium text-[rgba(72,72,72,0.8)] mb-4">Hosted By</div>
              <div className="flex items-center gap-2">
                <img src="/demo/avatar-blockspace.png" alt="Blockspace" className="w-6 h-6 rounded-full object-cover" />
                <div className="text-base font-medium text-[#141414]">Blockspace</div>
              </div>
            </div>

            <div className="border-t border-[rgba(20,20,20,0.08)] pt-4">
              <div className="text-sm font-medium text-[rgba(72,72,72,0.8)] mb-4">25 Going</div>
              <div className="flex items-center gap-3">
                <div className="flex">
                  <img src="/demo/attendee-1.png" alt="" className="w-6 h-6 rounded-full object-cover border-2 border-[#f2f2f2] z-[4]" />
                  <img src="/demo/attendee-2.png" alt="" className="w-6 h-6 rounded-full object-cover border-2 border-[#f2f2f2] -ml-2 z-[3]" />
                  <img src="/demo/attendee-3.png" alt="" className="w-6 h-6 rounded-full object-cover border-2 border-[#f2f2f2] -ml-2 z-[2]" />
                  <img src="/demo/attendee-4.png" alt="" className="w-6 h-6 rounded-full object-cover border-2 border-[#f2f2f2] -ml-2 z-[1]" />
                </div>
                <div className="text-sm text-[rgba(72,72,72,0.8)]">Fabio Gori, Eugen Iordache...</div>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <span className="text-sm font-medium text-[rgba(20,20,20,0.36)]">Contact the Host</span>
              <span className="text-sm font-medium text-[rgba(20,20,20,0.36)]">Report Event</span>
            </div>

            <div className="inline-flex items-center px-2.5 py-1 rounded-full border border-[rgba(20,20,20,0.08)] text-sm text-[rgba(20,20,20,0.36)] font-medium self-start">
              # Crypto
            </div>
          </div>

          {/* Title / Date / Location */}
          <div className="demo-header flex flex-col gap-4">
            <div className="bg-[rgba(46,46,46,0.04)] inline-flex items-center px-2 py-1 rounded-lg text-[13px] text-[#141414] font-medium self-start">
              📍 Featured in Amsterdam
            </div>
            <h1 className="text-[38px] font-semibold text-[#141414] leading-[1.15] m-0">
              Onchain Rooftop — Builders' Mixer
            </h1>

            <div className="flex gap-4 items-center mt-2">
              <div className="border border-[rgba(20,20,20,0.08)] rounded-lg w-11 h-11 flex flex-col items-center justify-center">
                <span className="text-[10px] font-semibold text-[rgba(72,72,72,0.8)] uppercase">Jul</span>
                <span className="text-base font-medium text-[rgba(72,72,72,0.8)]">22</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="text-base font-medium text-[#141414]">Wednesday, July 22</div>
                <div className="text-sm text-[rgba(72,72,72,0.8)]">5:30 PM - 9:00 PM GMT+2</div>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="border border-[rgba(20,20,20,0.08)] rounded-lg w-11 h-11 flex items-center justify-center">
                <img src="/demo/icon-location-pin.svg" alt="" className="h-5 w-auto" />
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="text-base font-medium text-[#141414] flex items-center gap-1">
                  StartDock Coworking Prins Hendrikkade
                  <img src="/demo/icon-external-arrow.svg" alt="" width={16} height={16} className="opacity-50" />
                </div>
                <div className="text-sm text-[rgba(72,72,72,0.8)]">Amsterdam, Netherlands</div>
              </div>
            </div>
          </div>

          {/* Ticket Box */}
          <div className="demo-ticket bg-[rgba(255,255,255,0.32)] border border-[rgba(255,255,255,0.16)] rounded-3xl shadow-[0_1px_4px_rgba(0,0,0,0.1)] overflow-hidden">
            <div className="bg-[rgba(46,46,46,0.04)] px-5 py-3 text-sm font-medium text-[rgba(72,72,72,0.8)]">
              Get Tickets
            </div>
            <div className="p-5 flex flex-col gap-5 bg-white">
              <div className="border-b border-[rgba(33,0,50,0.08)] pb-4">
                <div className="text-sm text-[rgba(20,20,20,0.64)] mb-1">Ticket Price</div>
                <div className="text-2xl font-medium text-[#210032]">$5.00</div>
              </div>
              <div className="text-base text-[#210032]">
                Welcome! To join the event, please get your ticket below.
              </div>
              <button
                onClick={() => router.push('/demo/checkout')}
                className="w-full bg-[#636363] text-white text-base font-medium py-3.5 border-0 rounded-2xl cursor-pointer transition-opacity duration-200 hover:opacity-90"
              >
                Get Ticket
              </button>
            </div>
          </div>

          {/* About Event */}
          <div className="demo-about border-t border-[rgba(20,20,20,0.08)] pt-6 mt-3">
            <h3 className="text-sm font-medium text-[rgba(72,72,72,0.8)] mb-6">About Event</h3>
            <h2 className="text-xl font-semibold text-[#141414] mb-4">Join our casual meetup for Amsterdam's biggest onchain nerds!</h2>
            <p className="text-base text-[#141414] leading-relaxed mb-4">
              Step away from the keyboard and meet the people building the onchain future. Onchain Amsterdam is a canal-side evening mixer for hackathon builders, founders, and friends — good music, cold drinks, and golden-hour views over Prins Hendrikkade, a two-minute walk from Amsterdam Centraal.
            </p>
            <p className="text-base text-[#141414] leading-relaxed mb-4">
              Whether you're mid-hack, scouting a co-founder, or just want to talk shop with people who actually ship, come through. Expect lightning demos from teams building this weekend, a welcome drink on us, and plenty of room to hang at StartDock's canal-house loft.
            </p>

            <h2 className="text-xl font-semibold text-[#141414] mt-8 mb-4">// FOR WHO</h2>
            <p className="text-base text-[#141414] leading-relaxed mb-4">
              Onchain builders, top to bottom — Solidity &amp; Rust devs, protocol and infra engineers, wallet and account-abstraction hackers, DeFi, stablecoin, and payments teams, and the founders shipping it all. If you're deploying contracts this weekend, debugging RPCs at 3 AM, or juggling gas across five chains, this is your crowd. Curious newcomers running their first cast send are just as welcome.
            </p>

            <h2 className="text-xl font-semibold text-[#141414] mt-8 mb-4">// AGENDA</h2>
            <ul className="list-none p-0 m-0 flex flex-col gap-3 text-base text-[#141414]">
              <li>17:30 👋 Walk-in</li>
              <li>18:00 🍕 Pizza (be early!)</li>
              <li>19:35 💻 Lightning demos</li>
              <li>19:45 🍺 Drinks &amp; Networking</li>
              <li>20:00 🤝 Networking</li>
              <li>21:00 🔚 End</li>
            </ul>
          </div>

          {/* Location Section */}
          <div className="demo-location border-t border-[rgba(20,20,20,0.08)] pt-6 mt-3">
            <h3 className="text-sm font-medium text-[rgba(72,72,72,0.8)] mb-6">Location</h3>
            <div className="text-base font-medium text-[#141414] mb-1">
              StartDock Coworking Prins Hendrikkade
            </div>
            <div className="text-sm text-[rgba(72,72,72,0.8)] mb-5">
              Prins Hendrikkade 21e, 1012 TL Amsterdam, Netherlands
            </div>

            <div className="w-full h-[199px] rounded-xl border border-[rgba(20,20,20,0.04)] overflow-hidden">
              <iframe
                src="https://www.google.com/maps?q=StartDock+Coworking+Prins+Hendrikkade,+Prins+Hendrikkade+21e,+1012+TL+Amsterdam,+Netherlands&output=embed"
                width="100%"
                height="199"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="StartDock Coworking Prins Hendrikkade location map"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="max-w-[960px] mx-auto mt-12 px-4">
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
      <style jsx>{`
        .demo-grid {
          display: grid;
          grid-template-columns: 1fr;
          grid-template-areas:
            'cover'
            'header'
            'ticket'
            'about'
            'location'
            'presenter';
          row-gap: 24px;
        }
        @media (min-width: 1024px) {
          .demo-grid {
            grid-template-columns: 330px 1fr;
            column-gap: 48px;
            row-gap: 24px;
            grid-template-areas:
              'cover header'
              'presenter ticket'
              'presenter about'
              'presenter location';
          }
        }
        .demo-cover { grid-area: cover; }
        .demo-header { grid-area: header; }
        .demo-ticket { grid-area: ticket; }
        .demo-about { grid-area: about; }
        .demo-location { grid-area: location; }
        .demo-presenter { grid-area: presenter; }
      `}</style>
    </>
  );
}
