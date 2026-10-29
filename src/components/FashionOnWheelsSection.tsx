"use client";

import Image from "next/image";
import React from "react";

export default function FashionOnWheelsSection() {
  const routeHighlights = [
    {
      area: "Hazratganj & Heritage Corridor",
      desc: "Promotional flag-off through the historic heart of Lucknow with media cameras.",
    },
    {
      area: "Civil Lines & Royal Enclave",
      desc: "City landmark tour with live influencer broadcasts and music on board.",
    },
    {
      area: "Gomti Nagar Premium Malls",
      desc: "High-footfall stops at premier shopping destinations for public cheers and interactive moments.",
    },
    {
      area: "University & Cultural Hubs",
      desc: "Engaging youth audiences and student designers with live street teasers.",
    },
  ];

  return (
    <section id="wheels" className="py-20 bg-white border-b border-border-pink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Concept and Route */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-block px-3 py-1 bg-surface text-pink-dark border border-border-pink text-xs font-bold uppercase tracking-wider rounded">
              SIGNATURE ATTRACTION
            </div>

            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-pink-primary block">
                MOVING BILLBOARD &amp; CELEBRATION
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-charcoal uppercase tracking-tight">
                Fashion on Wheels
              </h2>
            </div>

            <p className="text-sm sm:text-base text-charcoal-muted leading-relaxed">
              An open-branded luxury double-decker bus packed with participants, proud parents, and 
              mentors travels across Lucknow&apos;s most iconic spots leading up to the grand finale. 
              Dressed in event tees and chic casuals, young trendsetters dance, wave to cheerers, and 
              broadcast live reels across social platforms!
            </p>

            {/* Tagline Callout */}
            <div className="p-4 sm:p-5 bg-pink-light border-l-4 border-pink-primary rounded-r">
              <span className="text-[11px] font-black uppercase tracking-wider text-pink-dark block">
                OFFICIAL SLOGAN
              </span>
              <p className="font-serif text-lg sm:text-xl font-bold text-charcoal italic mt-1">
                &ldquo;Tiny Trendsetters, Big Runway Dreams!&rdquo;
              </p>
            </div>

            {/* Route Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {routeHighlights.map((rt, i) => (
                <div key={i} className="p-4 bg-surface border border-border-pink rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-white bg-pink-primary px-1.5 py-0.5 rounded">
                      STOP 0{i + 1}
                    </span>
                    <h3 className="text-xs font-bold text-charcoal uppercase">
                      {rt.area}
                    </h3>
                  </div>
                  <p className="text-[11px] text-charcoal-muted leading-relaxed">
                    {rt.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>

          {/* Right Column: Execution Card */}
          <div className="lg:col-span-5">
            <div className="bg-surface border-2 border-border-pink rounded-xl p-6 sm:p-8 space-y-6">
              
              <div className="flex justify-between items-center pb-4 border-b border-border-pink">
                <span className="text-xs font-black uppercase tracking-wider text-charcoal">
                  CAMPAIGN BLUEPRINT
                </span>
                <span className="text-[10px] font-bold uppercase bg-white border border-border-pink px-2.5 py-1 rounded text-pink-primary">
                  HIGH MEDIA IMPACT
                </span>
              </div>

              {/* Blueprint details */}
              <div className="space-y-3.5">
                <div className="bg-white p-3.5 rounded border border-border-pink shadow-2xs">
                  <div className="text-[11px] font-black text-pink-primary uppercase tracking-wider mb-1">
                    01 &bull; FULL-WRAP VINYL BRANDING
                  </div>
                  <p className="text-xs text-charcoal-muted leading-relaxed">
                    High-impact vehicle wrap displaying partner logos, event dates, and kids fashion graphics.
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded border border-border-pink shadow-2xs">
                  <div className="text-[11px] font-black text-pink-primary uppercase tracking-wider mb-1">
                    02 &bull; DIGITAL REEL HUBS
                  </div>
                  <p className="text-xs text-charcoal-muted leading-relaxed">
                    Live streaming from the bus deck, instant photo booths, and influencer meetups along key junctions.
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded border border-border-pink shadow-2xs">
                  <div className="text-[11px] font-black text-pink-primary uppercase tracking-wider mb-1">
                    03 &bull; PARTICIPANT ENTERTAINMENT TOUR
                  </div>
                  <p className="text-xs text-charcoal-muted leading-relaxed">
                    Kids receive VIP entertainment passes, 4D VR rides, gaming arcade bonding, and tour goodies.
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2">
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLScLhiYtE6aWKlI-T3tou7OzfVQVucW4uxHgf8Q7P5bLI4JKLw/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block py-3.5 text-center text-xs font-extrabold uppercase tracking-widest text-white bg-pink-primary hover:bg-pink-dark rounded transition-colors"
                >
                  Join the Runway Movement
                </a>
              </div>

            </div>
          </div>

        </div>

        {/* Real Proof: Participant Entertainment Tour Photos from Previous Season */}
        <div className="mt-14 pt-10 border-t border-border-pink">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
            <div>
              <span className="text-[10px] font-extrabold tracking-widest uppercase text-gold bg-navy px-2.5 py-1 rounded-full">
                AUTHENTIC TOUR MEMORIES
              </span>
              <h3 className="font-serif text-lg sm:text-2xl font-bold text-navy mt-2">
                Glimpses of Participant Entertainment Tour from Previous Season
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
                Real photos of kids and families enjoying exclusive 4D VR rides and gaming zones during our Phoenix United edition.
              </p>
            </div>
            <span className="text-[11px] font-bold text-navy bg-surface px-3 py-1 rounded-full border border-border-pink self-start sm:self-auto">
              📍 Phoenix United, Bareilly
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: VR Entertainment */}
            <div className="bg-surface rounded-2xl overflow-hidden border border-border-pink hover:border-gold/80 transition-all shadow-sm flex flex-col">
              <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
                <Image
                  src="/images/bareilly-vr-entertainment.jpg"
                  alt="4D Virtual Reality dynamic ride chairs for kids and parents at Phoenix United Bareilly"
                  fill
                  sizes="(max-width: 768px) 94vw, 600px"
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-navy/90 text-gold border border-gold/40 shadow-xs">
                    4D VR RIDE EXPERIENCE
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-serif text-base font-bold text-navy mb-1">
                  Thrilling 4D Virtual Reality Jungle Adventure
                </h4>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  Participants and moms strapped in for a motion-simulated 4D ride, creating unforgettable smiles before the big ramp walk.
                </p>
              </div>
            </div>

            {/* Card 2: Arcade Racing Games */}
            <div className="bg-surface rounded-2xl overflow-hidden border border-border-pink hover:border-gold/80 transition-all shadow-sm flex flex-col">
              <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
                <Image
                  src="/images/bareilly-arcade-games.jpg"
                  alt="Father and kids playing arcade racing games at Phoenix United Bareilly"
                  fill
                  sizes="(max-width: 768px) 94vw, 600px"
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-navy/90 text-gold border border-gold/40 shadow-xs">
                    MALL ARCADE BONDING
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-serif text-base font-bold text-navy mb-1">
                  Arcade Gaming &amp; Family Togetherness
                </h4>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  Pure joy and stress-free entertainment as fathers, mothers, and kids enjoyed motorcycle racing and gaming together.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
