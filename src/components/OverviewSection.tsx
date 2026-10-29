"use client";

import React from "react";

export default function OverviewSection() {
  const pillars = [
    {
      num: "01",
      title: "Stage Confidence & Self-Expression",
      desc: "Designed to help kids overcome stage fright, build poise, and experience the thrill of performing in front of an appreciative audience.",
      tag: "EMPOWERMENT",
    },
    {
      num: "02",
      title: "Professional Grooming & Workshops",
      desc: "Expert choreographers and trainers guide children with etiquette, basic ramp walks, expressions, and posture suitable for their age.",
      tag: "TRAINING",
    },
    {
      num: "03",
      title: "Designer Showcases & Brand Tie-ups",
      desc: "Leading kidswear labels, fashion institutes, and lifestyle designers showcase their collections, offering kids direct industry exposure.",
      tag: "OPPORTUNITY",
    },
    {
      num: "04",
      title: "Unforgettable Family Bonding",
      desc: "Special parent-child rounds, entertainment tours, and high-quality portfolio keepsakes ensure memories that last a lifetime.",
      tag: "MEMORIES",
    },
  ];

  return (
    <section id="overview" className="py-20 bg-white border-b border-border-pink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-block px-3 py-1 bg-surface text-pink-dark border border-border-pink text-xs font-bold uppercase tracking-wider rounded mb-3">
            JASHN REALTY PRESENTS &bull; ABOUT THE MOVEMENT
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-charcoal uppercase tracking-tight">
            Nurturing Young Stars, Celebrating Individuality
          </h2>
          <p className="mt-3 text-sm sm:text-base text-charcoal-muted leading-relaxed">
            <strong className="text-pink-primary font-semibold">Jashn Realty Presents Runway Kids Fashion Week 2026</strong> is a premier celebration of style, confidence, and creativity for children. 
            Building on our triumphant past edition at <strong className="text-pink-primary font-semibold">Phoenix United, Bareilly</strong>, this grand season provides a glamorous, respectful platform for kids of all age groups to shine on the runway — 
            from newborns in strollers to energetic pre-teens — while giving brands and designers 
            a dedicated stage in the kidswear segment.
          </p>
        </div>

        {/* 4 Pillars Grid - Solid cards, no icons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, idx) => (
            <div
              key={idx}
              className="bg-surface border border-border-pink p-6 sm:p-7 rounded-xl hover:border-pink-primary transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="font-serif text-2xl sm:text-3xl font-black text-pink-primary">
                  {item.num}
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-pink-dark bg-white border border-border-pink px-2.5 py-1 rounded">
                  {item.tag}
                </span>
              </div>
              <h3 className="text-base font-bold text-charcoal mb-2 group-hover:text-pink-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Mission Statement Box */}
        <div className="mt-12 bg-pink-light border border-border-pink rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5">
            <span className="text-[11px] font-extrabold tracking-widest uppercase text-pink-primary">
              CORE PHILOSOPHY
            </span>
            <h4 className="font-serif text-lg sm:text-xl font-bold text-charcoal">
              &ldquo;Tiny Trendsetters, Big Runway Dreams!&rdquo;
            </h4>
            <p className="text-xs sm:text-sm text-charcoal-muted max-w-2xl">
              Every child is a star. Our screening and audition processes are structured around comfort, 
              encouragement, and constructive development, without undue pressure or harsh elimination.
            </p>
          </div>
          <a
            href="#categories"
            className="w-full sm:w-auto text-center px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white bg-pink-primary hover:bg-pink-dark rounded transition-colors"
          >
            Explore Categories
          </a>
        </div>

      </div>
    </section>
  );
}
