"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";

// -------------------------------------------------------------
// SPONSORS DATA (Add or remove sponsors here dynamically)
// -------------------------------------------------------------
export interface Sponsor {
  name: string;
  url: string;
  logo?: string;
}

export const sponsorsList: Sponsor[] = [
  {
    name: "Jashn Realty",
    url: "https://www.jashnrealty.com/",
    logo: "https://cdn.jashnrealty.com/assets/v2/images/logo-blue.png?ver=9",
  },
];

// Single constant for iframe load count detection:
// 1st load = form opened initially, 2nd load = form submitted.
export const SUBMIT_LOAD_COUNT = 2;

export default function RegistrationFormSection() {
  const [iframeLoadCount, setIframeLoadCount] = useState(0);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  // Official Google Form embed URL
  const GOOGLE_FORM_EMBED_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLScLhiYtE6aWKlI-T3tou7OzfVQVucW4uxHgf8Q7P5bLI4JKLw/viewform?embedded=true";

  // Handle iframe load counter
  const handleIframeLoad = () => {
    setIframeLoadCount((prev) => {
      const nextCount = prev + 1;
      if (nextCount >= SUBMIT_LOAD_COUNT) {
        setIsFormSubmitted(true);
        triggerCelebration();
      }
      return nextCount;
    });
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#2e2c75", "#D4AF37", "#F6E29C", "#112266", "#FFFFFF"],
      });
    } catch {
      // ignore
    }
  };

  return (
    <section id="register" className="py-20 bg-white border-b border-border-pink relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header - Clean & Direct, No Confusing Option Buttons */}
        <div className="max-w-3xl mb-10">
          <div className="inline-block px-3 py-1 bg-surface text-pink-dark border border-border-pink text-xs font-bold uppercase tracking-wider rounded mb-3">
            JASHN REALTY PRESENTS &bull; CONTESTANT NOMINATION
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-charcoal uppercase tracking-tight">
            Register Child &amp; Official Nomination
          </h2>
          <p className="mt-2 text-sm sm:text-base text-charcoal-muted leading-relaxed">
            Complete your official entry for <strong className="text-pink-primary font-semibold">Jashn Realty Presents Runway Kids Fashion Week 2026</strong> directly below. Free entry for all age categories!
          </p>
        </div>

        {/* EMBEDDED GOOGLE FORM OR POST-SUBMISSION JASHN REALTY THANK YOU CARD */}
        <div className="w-full">
          {!isFormSubmitted ? (
            /* Google Form iFrame Container */
            <div className="bg-surface border-2 border-border-pink rounded-2xl p-3 sm:p-6 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-border-pink text-xs text-charcoal-muted">
                <span className="font-bold text-pink-primary uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-pink-primary animate-pulse" />
                  LIVE REGISTRATION FORM &bull; FREE ENTRY
                </span>
                <span className="text-[11px] hidden sm:inline">
                  1st Mega Audition: 01 Nov 2026 @ Jashn Realty
                </span>
              </div>

              {/* Google Form iFrame with Load Event Listener */}
              <div className="relative w-full rounded-xl overflow-hidden bg-white min-h-[750px] sm:min-h-[850px]">
                <iframe
                  id="google-form-iframe"
                  src={GOOGLE_FORM_EMBED_URL}
                  width="100%"
                  height="850"
                  frameBorder="0"
                  marginHeight={0}
                  marginWidth={0}
                  onLoad={handleIframeLoad}
                  title="Official Google Registration Form"
                  className="w-full min-h-[750px] sm:min-h-[850px] border-0"
                >
                  Loading registration form…
                </iframe>
              </div>

              {/* Instant Submission Confirmation Action Bar */}
              <div className="mt-4 pt-4 border-t border-border-pink flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border">
                <div className="text-xs text-charcoal">
                  <strong className="text-pink-primary font-bold">Done filling the form?</strong> Click here if you have submitted the response to view your official Jashn Realty confirmation card.
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsFormSubmitted(true);
                    triggerCelebration();
                  }}
                  className="shrink-0 px-6 py-3 text-xs font-extrabold uppercase tracking-widest text-white bg-[#2e2c75] hover:bg-[#1f1d53] rounded-lg shadow-md transition-all active:scale-95 flex items-center gap-2"
                >
                  <span>I Have Submitted Form &rarr;</span>
                </button>
              </div>
            </div>
          ) : (
            /* POST-SUBMISSION OFFICIAL JASHN REALTY & JASHN ELEVATE FESTIVE THANK YOU CARD */
            <div
              id="thank-you-section"
              className="bg-white border-2 border-border-pink rounded-3xl p-6 sm:p-12 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-500 max-w-3xl mx-auto relative overflow-hidden"
            >
              {/* Top Accent Strip with Jashn Realty Brand Color */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#112266] via-[#2e2c75] to-[#D4AF37]" />

              {/* Festive Celebration Icon */}
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-pink-soft border-2 border-gold flex items-center justify-center text-3xl shadow-inner">
                🎉
              </div>

              {/* Main Heading */}
              <h3 className="font-serif text-2xl sm:text-4xl font-black text-charcoal tracking-tight">
                Thank You for Registering!
              </h3>

              {/* Subheading acknowledgment */}
              <p className="mt-2 text-sm sm:text-base text-charcoal font-semibold max-w-xl mx-auto">
                Thank you for being part of <strong className="text-pink-primary">Jashn Realty Presents RUNWAY – KIDS FASHION WEEK</strong>.
              </p>

              {/* LUXURY JASHN ELEVATE FESTIVE OFFERS SHOWCASE CARD */}
              <div className="mt-8 bg-gradient-to-br from-[#0c1947] via-[#112266] to-[#1c2c6e] text-white rounded-2xl p-6 sm:p-8 border-2 border-gold/70 shadow-2xl relative overflow-hidden text-left">
                {/* Background decorative gold glow */}
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-gold/15 rounded-full blur-2xl pointer-events-none" />

                {/* Card Header: Jashn Realty Logo & Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/15">
                  <div className="h-12 w-40 bg-white rounded-lg p-2 flex items-center justify-center shadow">
                    <img
                      src="https://cdn.jashnrealty.com/assets/v2/images/logo-blue.png?ver=9"
                      alt="Jashn Realty"
                      className="max-h-9 max-w-full object-contain"
                    />
                  </div>
                  <span className="self-start sm:self-auto text-[10px] font-extrabold uppercase tracking-widest bg-gold text-[#112266] px-3 py-1 rounded-full shadow font-mono">
                    EXCLUSIVE FESTIVE OFFERS
                  </span>
                </div>

                {/* Offer Lead Text */}
                <div className="mt-5 mb-6">
                  <h4 className="font-serif text-lg sm:text-xl font-bold text-[#F6E29C] leading-snug">
                    Discover premium living at <span className="underline decoration-gold underline-offset-4 text-white">Jashn Elevate, Lucknow</span>, with our exclusive festive offers!
                  </h4>
                </div>

                {/* 4 Key Offers Bullet Grid */}
                <div className="space-y-3.5">
                  <div className="flex items-start gap-3 bg-white/10 hover:bg-white/15 p-3 rounded-xl border border-white/10 transition-colors">
                    <span className="text-xl shrink-0">✨</span>
                    <div className="text-xs sm:text-sm text-white/95 leading-snug">
                      <strong className="text-gold font-bold">10:90 Payment Plan</strong> &ndash; First Time in Lucknow
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white/10 hover:bg-white/15 p-3 rounded-xl border border-white/10 transition-colors">
                    <span className="text-xl shrink-0">🥇</span>
                    <div className="text-xs sm:text-sm text-white/95 leading-snug">
                      <strong className="text-gold font-bold">Get Up to 40g of Gold</strong> on Your Dream Home
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white/10 hover:bg-white/15 p-3 rounded-xl border border-white/10 transition-colors">
                    <span className="text-xl shrink-0">🎁</span>
                    <div className="text-xs sm:text-sm text-white/95 leading-snug">
                      <strong className="text-gold font-bold">Win Assured Gifts Worth Up to 1 Lakh</strong> with the Spin the Wheel
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white/10 hover:bg-white/15 p-3 rounded-xl border border-white/10 transition-colors">
                    <span className="text-xl shrink-0">📱</span>
                    <div className="text-xs sm:text-sm text-white/95 leading-snug">
                      <strong className="text-gold font-bold">Stand a Chance to Win an iPhone 17</strong> with the Push the Buzzer challenge!
                    </div>
                  </div>
                </div>

                {/* Explore More CTA Button */}
                <div className="mt-7 pt-5 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-white/80 block">Explore More Offers:</span>
                    <a
                      href="https://shorturl.at/iefKV"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm font-bold text-gold hover:text-white underline underline-offset-2 break-all"
                    >
                      https://shorturl.at/iefKV
                    </a>
                  </div>

                  <a
                    href="https://shorturl.at/iefKV"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3 text-center text-xs font-black uppercase tracking-widest text-[#112266] bg-gold hover:bg-[#F6E29C] rounded-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>Claim Festive Offers</span>
                    <span>&rarr;</span>
                  </a>
                </div>

                {/* Bottom Tagline */}
                <div className="mt-5 text-center sm:text-left text-xs font-serif font-black tracking-widest text-[#F6E29C] uppercase pt-3 border-t border-white/10">
                  Your Dream Home. Extraordinary Rewards.
                </div>
              </div>

              {/* Audition Details & Actions */}
              <div className="mt-8 pt-6 border-t border-border-pink flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-muted">
                <div className="text-center sm:text-left">
                  <span className="font-bold text-charcoal block">1st Mega Audition &amp; Screening:</span>
                  <span>01 Nov 2026 @ Jashn Realty, Lucknow</span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      "*Thank You for Registering!*\n\nThank you for being part of *Jashn Realty Presents RUNWAY – KIDS FASHION WEEK.*\n\nDiscover premium living at *Jashn Elevate, Lucknow*, with our exclusive festive offers!\n\n✨ *10:90 Payment Plan* – First Time in Lucknow\n🥇 *Get Up to 40g of Gold* on Your Dream Home\n🎁 *Win Assured Gifts Worth Up to 1 Lakh* with the Spin the Wheel\n📱 *Stand a Chance to Win an iPhone 17* with the Push the Buzzer challenge!\n\n*Explore More:* https://shorturl.at/iefKV\n\nYour Dream Home. Extraordinary Rewards."
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-pink-dark bg-white border border-border-pink hover:bg-pink-soft rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <span>Share on WhatsApp</span>
                  </a>

                  <button
                    onClick={() => {
                      setIframeLoadCount(0);
                      setIsFormSubmitted(false);
                    }}
                    className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-charcoal bg-surface border border-border-pink hover:bg-white rounded-lg transition-colors"
                  >
                    Submit Another Entry
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </section>
  );
}
