"use client";

import React, { useState, useEffect } from "react";

export default function HeroSection() {
  // Live Countdown state - Targeting Mega Audition: 22 Nov 2026
  const [timeLeft, setTimeLeft] = useState({
    days: 23,
    hours: 14,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    // Target: Mega Audition Nov 22, 2026 @ Jashn Realty & GD Goenka
    const targetDate = new Date("2026-11-22T10:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-surface pt-6 pb-12 sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-20 border-b border-border-pink overflow-hidden">
      {/* Background architectural grid lines - Clean & elegant, no gradients */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="h-full w-full border-x border-border-pink max-w-7xl mx-auto flex justify-between">
          <div className="w-px h-full bg-border-pink"></div>
          <div className="w-px h-full bg-border-pink"></div>
          <div className="w-px h-full bg-border-pink"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 items-start gap-8 sm:gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            
            {/* Super Header Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white border border-gold/70 rounded-full text-[9px] sm:text-xs font-bold uppercase tracking-wider text-pink-primary max-w-full shadow-sm">
              <span className="w-2 h-2 shrink-0 rounded-full bg-gold animate-ping"></span>
              <span className="leading-relaxed truncate sm:whitespace-normal">
                OFFICIAL NOMINATIONS OPEN TILL 14TH NOV &bull; LUCKNOW EDITION
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2.5 sm:space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-[0.18em] text-pink-primary">
                <span>Jashn <span className="text-gold font-black">|</span> Realty Presents</span>
                <span className="text-gold font-black">&bull;</span>
                <span className="text-charcoal font-semibold">Lucknow 2026</span>
              </div>
              
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-charcoal leading-none">
                Runway
                <span className="block text-2xl sm:text-3xl md:text-4xl font-extrabold text-pink-primary tracking-normal mt-1">
                  Kids Fashion Week
                </span>
              </h1>
              
              <p className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider text-charcoal mt-1">
                Walk <span className="text-gold">&bull;</span> Create <span className="text-gold">&bull;</span> Shine
              </p>
            </div>

            {/* Subtitle / Event Summary */}
            <p className="text-sm sm:text-base text-charcoal-muted leading-relaxed max-w-2xl font-normal">
              A high-fashion runway experience designed for children of all ages. From stroller-friendly newborn walks to high-energy teen ramp routines, give your child the stage to express their personality, build confidence, and shine.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLScLhiYtE6aWKlI-T3tou7OzfVQVucW4uxHgf8Q7P5bLI4JKLw/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center items-center px-6 py-3.5 text-xs font-extrabold uppercase tracking-widest text-white bg-pink-primary hover:bg-pink-dark rounded transition-colors shadow-sm"
              >
                Nominate Your Child [Free Entry]
              </a>
              <a
                href="#schedule"
                className="inline-flex justify-center items-center px-6 py-3.5 text-xs font-extrabold uppercase tracking-widest text-pink-dark bg-white border border-border-pink hover:bg-pink-soft rounded transition-colors"
              >
                View Full Event Flow
              </a>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border-pink">
              <div className="bg-white p-2.5 sm:p-3 rounded border border-border-pink shadow-2xs">
                <div className="text-xl font-serif font-black text-pink-primary">04</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted">
                  Age Categories
                </div>
              </div>
              <div className="bg-white p-2.5 sm:p-3 rounded border border-border-pink shadow-2xs">
                <div className="text-xl font-serif font-black text-pink-primary">₹11,000</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted">
                  Cash Prize + Hamper
                </div>
              </div>
              <div className="bg-white p-2.5 sm:p-3 rounded border border-border-pink shadow-2xs">
                <div className="text-xl font-serif font-black text-charcoal">14 NOV</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted">
                  Nominations Close
                </div>
              </div>
              <div className="bg-white p-2.5 sm:p-3 rounded border border-border-pink shadow-2xs">
                <div className="text-xl font-serif font-black text-gold-dark">22 NOV</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted">
                  Mega Audition @ Jashn
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Live Countdown & Event Brief */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white border border-border-pink rounded-xl p-5 sm:p-6 shadow-lg relative">
              
              {/* Event Badge Header */}
              <div className="flex flex-wrap justify-between items-start gap-3 pb-5 border-b border-border-pink">
                <div>
                  <span className="text-[10px] font-extrabold tracking-widest uppercase bg-pink-soft text-pink-dark px-2.5 py-1 rounded">
                    OFFICIAL EVENT BRIEF
                  </span>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-charcoal mt-2">
                    Mega Auditions &amp; Screening
                  </h3>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs font-bold text-charcoal block">22 Nov 2026</span>
                  <span className="text-[11px] font-medium text-charcoal-muted">Jashn Realty &amp; GD Goenka</span>
                </div>
              </div>

              {/* Countdown Clock Display */}
              <div className="py-5">
                <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-3 text-center">
                  COUNTDOWN TO MEGA AUDITIONS (22 NOV 2026)
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-surface border border-border-pink p-2 sm:p-2.5 rounded">
                    <span className="text-lg sm:text-xl font-bold font-serif text-charcoal block">
                      {timeLeft.days}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-charcoal-muted">Days</span>
                  </div>
                  <div className="bg-surface border border-border-pink p-2 sm:p-2.5 rounded">
                    <span className="text-lg sm:text-xl font-bold font-serif text-charcoal block">
                      {timeLeft.hours}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-charcoal-muted">Hours</span>
                  </div>
                  <div className="bg-surface border border-border-pink p-2 sm:p-2.5 rounded">
                    <span className="text-lg sm:text-xl font-bold font-serif text-charcoal block">
                      {timeLeft.minutes}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-charcoal-muted">Mins</span>
                  </div>
                  <div className="bg-surface border border-border-pink p-2 sm:p-2.5 rounded">
                    <span className="text-lg sm:text-xl font-bold font-serif text-pink-primary block">
                      {timeLeft.seconds}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-pink-dark">Secs</span>
                  </div>
                </div>
              </div>

              {/* Highlights Feature List */}
              <div className="space-y-3 pt-2 border-t border-border-pink">
                <div className="flex items-start gap-3">
                  <span className="text-xs font-black text-pink-primary bg-pink-soft px-2 py-0.5 rounded">
                    01
                  </span>
                  <div className="text-xs text-charcoal leading-tight">
                    <strong className="font-bold">Free Nomination Till 14 Nov:</strong> Open registrations for all categories with instant participation card.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xs font-black text-pink-primary bg-pink-soft px-2 py-0.5 rounded">
                    02
                  </span>
                  <div className="text-xs text-charcoal leading-tight">
                    <strong className="font-bold">Mega Auditions (22 Nov):</strong> Batch assembly @ GD Goenka &amp; on-ground auditions @ Jashn Realty.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xs font-black text-pink-primary bg-pink-soft px-2 py-0.5 rounded">
                    03
                  </span>
                  <div className="text-xs text-charcoal leading-tight">
                    <strong className="font-bold">Proposed Grand Finale (29 Nov):</strong> Finalist runway showcase @ The Centrum Lucknow.
                  </div>
                </div>
              </div>

              {/* Instant Registration Jump CTA */}
              <div className="mt-6 pt-4 border-t border-border-pink">
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLScLhiYtE6aWKlI-T3tou7OzfVQVucW4uxHgf8Q7P5bLI4JKLw/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block py-3 text-center text-xs font-extrabold uppercase tracking-widest text-white bg-pink-primary hover:bg-pink-dark rounded transition-colors"
                >
                  Start Registration &amp; Generate Card
                </a>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
