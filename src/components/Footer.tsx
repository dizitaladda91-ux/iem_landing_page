"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border-pink pt-12 sm:pt-16 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-border-pink">
          
          {/* Col 1: Brand & Presentation */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-charcoal mb-1">
                Jashn <span className="text-gold-dark">|</span> Realty Presents
              </span>
              <span className="font-serif font-black text-2xl tracking-widest text-pink-primary uppercase leading-none">
                Runway
              </span>
              <span className="text-xs font-extrabold uppercase tracking-widest text-gold-dark mt-1">
                Kids Fashion Week 2026
              </span>
            </div>
            
            <p className="text-xs text-charcoal-muted leading-relaxed max-w-sm">
              <strong className="text-charcoal font-semibold">Jashn Realty Presents Runway Kids Fashion Week 2026</strong> is organized in association with the <strong className="text-charcoal font-semibold">Institute of Event Management (IEM)</strong> and <strong className="text-charcoal font-semibold">AdOnMo</strong> to discover, empower, and celebrate youth talent across India.
            </p>

            <div className="pt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-pink-primary block mb-1">
                OFFICIAL MOTTO
              </span>
              <span className="font-serif italic text-sm text-charcoal font-semibold">
                &ldquo;Big Dreams, Little Steps &bull; Tiny Trendsetters, Big Runway Dreams!&rdquo;
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-charcoal">
              QUICK SECTIONS
            </h4>
            <ul className="space-y-2 text-xs font-medium text-charcoal-muted">
              <li>
                <a href="#gallery" className="hover:text-pink-primary transition-colors text-pink-primary font-bold">
                  Bareilly Highlights
                </a>
              </li>
              <li>
                <a href="#overview" className="hover:text-pink-primary transition-colors">
                  Event Overview
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-pink-primary transition-colors">
                  4 Age Categories
                </a>
              </li>
              <li>
                <a href="#schedule" className="hover:text-pink-primary transition-colors">
                  Audition Roadmap
                </a>
              </li>
              <li>
                <a href="#voting" className="hover:text-pink-primary transition-colors">
                  Social Wild Card
                </a>
              </li>
              <li>
                <a href="#wheels" className="hover:text-pink-primary transition-colors">
                  Fashion on Wheels
                </a>
              </li>
              <li>
                <a href="#prizes" className="hover:text-pink-primary transition-colors">
                  Rewards &amp; Awards
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-charcoal">
              COMPETITION DIVISIONS
            </h4>
            <ul className="space-y-2 text-xs text-charcoal-muted">
              <li>
                <strong className="text-charcoal block">Category 1:</strong>
                Newborn (1–2 Yrs) — Walk with Mom
              </li>
              <li>
                <strong className="text-charcoal block">Category 2:</strong>
                Class 2 – Class 3 Ramp Walk + Themed
              </li>
              <li>
                <strong className="text-charcoal block">Category 3:</strong>
                Class 4 – Class 5 Designer Showcase
              </li>
              <li>
                <strong className="text-charcoal block">Category 4:</strong>
                Sporty Walk with Dad (Father Duo)
              </li>
            </ul>
          </div>

          {/* Col 4: Verified Contacts & Partners */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-charcoal">
              ORGANIZER CONTACTS
            </h4>

            <div className="bg-white border border-border-pink p-4 rounded-lg space-y-2 text-xs shadow-2xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-charcoal-muted block">
                  WHATSAPP HELPLINE &amp; ENQUIRIES
                </span>
                <span className="font-bold text-pink-primary text-sm">
                  +91 95489 18304
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-charcoal-muted block">
                  ADONMO PRODUCTION TEAM
                </span>
                <span className="font-bold text-charcoal">
                  Mayank: +91 9773848123
                </span>
                <span className="text-[11px] text-charcoal-muted block">
                  mayank@adonmo.com
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-charcoal-muted block">
                  INSTITUTE WEBSITE
                </span>
                <a
                  href="https://www.iemworld.in"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-pink-primary hover:underline"
                >
                  www.iemworld.in
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Official Partners Grid Strip */}
        <div className="py-6 border-b border-border-pink">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-2 shrink-0">
              <span className="w-2 h-2 rounded-full bg-gold" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-navy">
                OFFICIAL PARTNERS &amp; SPONSORS
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-navy bg-white px-2.5 py-1 rounded border border-border-pink shadow-2xs">
                Jashn Realty <span className="text-[10px] font-normal text-charcoal-muted">• Presenter</span>
              </span>
              <span className="text-xs font-bold text-black bg-white px-2.5 py-1 rounded border border-border-pink shadow-2xs">
                VAULT <span className="text-[10px] font-normal text-charcoal-muted">by Virat Kohli</span>
              </span>
              <span className="text-xs font-bold text-[#102A6B] bg-white px-2.5 py-1 rounded border border-border-pink shadow-2xs">
                GD Goenka School
              </span>
              <span className="text-xs font-bold text-[#6B5A39] bg-white px-2.5 py-1 rounded border border-border-pink shadow-2xs">
                The Centrum Lucknow
              </span>
              <span className="text-xs font-bold text-[#415FFF] bg-white px-2.5 py-1 rounded border border-border-pink shadow-2xs">
                vivo
              </span>
              <span className="text-xs font-bold text-[#0082C3] bg-white px-2.5 py-1 rounded border border-border-pink shadow-2xs">
                DECATHLON
              </span>
              <span className="text-xs font-bold text-[#E60012] bg-white px-2.5 py-1 rounded border border-border-pink shadow-2xs">
                Yakult
              </span>
              <span className="text-xs font-bold text-[#D62300] bg-white px-2.5 py-1 rounded border border-border-pink shadow-2xs">
                Burger King
              </span>
              <span className="text-xs font-bold text-zinc-900 bg-white px-2.5 py-1 rounded border border-border-pink shadow-2xs">
                Lakmé Academy
              </span>
              <span className="text-xs font-bold text-purple-950 bg-white px-2.5 py-1 rounded border border-border-pink shadow-2xs">
                Mezbaan
              </span>
              <span className="text-xs font-bold text-emerald-900 bg-white px-2.5 py-1 rounded border border-border-pink shadow-2xs">
                Steppingstone
              </span>
              <span className="text-xs font-bold text-[#73632A] bg-white px-2.5 py-1 rounded border border-border-pink shadow-2xs">
                Cafe Nutri
              </span>
              <span className="text-xs font-bold text-[#0B63C5] bg-white px-2.5 py-1 rounded border border-border-pink shadow-2xs">
                AdOnMo+
              </span>
              <span className="text-xs font-bold text-indigo-950 bg-white px-2.5 py-1 rounded border border-border-pink shadow-2xs">
                IEM
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal-muted gap-4">
          <div>
            &copy; {new Date().getFullYear()} Jashn Realty Presents Runway Kids Fashion Week 2026 &bull; Institute of Event Management &amp; AdOnMo. All Rights Reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-wider">
            <a href="#rules" className="hover:text-pink-primary">Guidelines</a>
            <span>&bull;</span>
            <a href="#voting" className="hover:text-pink-primary">Fair Play Policy</a>
            <span>&bull;</span>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLScLhiYtE6aWKlI-T3tou7OzfVQVucW4uxHgf8Q7P5bLI4JKLw/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-primary hover:underline"
            >
              Register Now
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
