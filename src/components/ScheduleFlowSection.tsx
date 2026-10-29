"use client";

import Image from "next/image";
import React, { useState } from "react";

interface ScheduleStep {
  step: string;
  date: string;
  title: string;
  location: string;
  description: string;
  tags: string[];
}

const steps: ScheduleStep[] = [
  {
    step: "01",
    date: "TILL 14TH NOV. 2026",
    title: "Nomination Start (Free Entry)",
    location: "Online & Partner Registration Desks",
    description:
      "Register now and give your child the chance to step onto the Runway of Dreams! Open registrations for boys and girls across all age categories.",
    tags: ["TILL 14 NOV", "FREE ENTRY", "ONLINE REGISTRATION"],
  },
  {
    step: "02",
    date: "22ND NOV. 2026",
    title: "Batch Collection for Mega Audition",
    location: "GD Goenka Public School, Lucknow",
    description:
      "Batch collection and stage assembly for all registered candidates at GD Goenka Public School before the mega on-ground audition rounds.",
    tags: ["22 NOV", "GD GOENKA", "BATCH COLLECTION"],
  },
  {
    step: "03",
    date: "22ND NOV. 2026",
    title: "MEGA AUDITION @ Jashn Realty",
    location: "Jashn Realty, Lucknow",
    description:
      "On-ground auditions to select finalists for Runway – Kids Fashion Week. Friendly, encouraging screening with stage walk, smile, and intro.",
    tags: ["22 NOV", "MEGA AUDITION", "JASHN REALTY"],
  },
  {
    step: "04",
    date: "24TH & 25TH NOV. 2026",
    title: "Portfolio Photoshoot",
    location: "Professional Studio Setup, Lucknow",
    description:
      "A special high-fashion portfolio opportunity for all selected finalist kids. Kids receive high-resolution model portfolios and brand face features.",
    tags: ["24 & 25 NOV", "PORTFOLIO SHOOT", "FINALIST EXCLUSIVE"],
  },
  {
    step: "05",
    date: "26TH & 27TH NOV. 2026",
    title: "Rehearsals & Preparation",
    location: "Choreography Arena, Lucknow",
    description:
      "Choreography & on-stage rehearsals with mentors. Children learn synchronization, posture, runway confidence, and group coordination.",
    tags: ["26 & 27 NOV", "STAGE CHOREOGRAPHY", "MENTOR TRAINING"],
  },
  {
    step: "06",
    date: "28TH NOV. 2026",
    title: "Makeup Guidance Session",
    location: "Grand Finale Green Rooms",
    description:
      "Session with a professional makeup artist using kid-safe, gentle, organic cosmetic styling products and camera-ready prep.",
    tags: ["28 NOV", "PROFESSIONAL MAKEUP", "SKIN-SAFE STYLING"],
  },
  {
    step: "07",
    date: "29TH NOV. 2026 (PROPOSED)",
    title: "Proposed GRAND FINALE: Walk | Create | Shine",
    location: "The Centrum, Lucknow (Proposed)",
    description:
      "The ultimate celebration! Finalist kids take the grand runway before a celebrity jury, VIP guests, brand leaders, and media cameras.",
    tags: ["29 NOV PROPOSED", "GRAND FINALE", "WALK CREATE SHINE"],
  },
];

export default function ScheduleFlowSection() {
  const [selectedStep, setSelectedStep] = useState<number>(0); // Default to Step 01: Till 14 Nov

  return (
    <section id="schedule" className="py-16 sm:py-20 bg-white border-b border-border-pink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-14">
          <div className="inline-block px-3 py-1 bg-surface text-pink-dark border border-border-pink text-xs font-bold uppercase tracking-wider rounded mb-3">
            OFFICIAL EVENT FLOW &bull; WALK | CREATE | SHINE
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-charcoal uppercase tracking-tight">
            Event Flow &amp; Official Roadmap
          </h2>
          <p className="mt-2 text-sm sm:text-base text-charcoal-muted leading-relaxed">
            From the opening nomination window till the spectacular Grand Finale, every milestone is designed 
            to nurture self-confidence and provide an unforgettable runway journey.
          </p>
        </div>

        {/* Official Event Flow Graphic Banner */}
        <div className="mb-12 rounded-2xl overflow-hidden border-2 border-gold/70 shadow-lg bg-surface">
          <div className="relative w-full aspect-[16/9] max-h-[480px]">
            <Image
              src="/images/event-flow-banner.jpg"
              alt="Jashn Realty Presents Runway Kids Fashion Week Official Event Flow - Walk Create Shine"
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-contain bg-pink-soft/30"
              priority
            />
          </div>
          <div className="p-3.5 bg-surface-card border-t border-border-pink flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <span className="font-bold text-pink-primary flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              Official Event Flow &amp; Dates: 14th Nov to 29th Nov 2026
            </span>
            <span className="text-charcoal-muted font-medium">
              Auditions @ GD Goenka &amp; Jashn Realty &bull; Finale @ The Centrum
            </span>
          </div>
        </div>

        {/* Timeline Grid (7 Steps) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {steps.map((st, idx) => {
            const isHighlight = idx === 0 || idx === 2 || idx === 6; // Till 14 Nov, Mega Audition, Finale
            const isSelected = selectedStep === idx;

            return (
              <div
                key={st.step}
                onClick={() => setSelectedStep(idx)}
                className={`cursor-pointer p-5 sm:p-6 rounded-xl border transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? "bg-pink-light border-2 border-pink-primary shadow-md -translate-y-1"
                    : isHighlight
                    ? "bg-surface border-gold/70 hover:border-pink-primary shadow-2xs"
                    : "bg-white border-border-pink hover:bg-surface"
                }`}
              >
                <div>
                  {/* Step badge & date */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-serif text-xl sm:text-2xl font-black text-pink-primary">
                      {st.step}
                    </span>
                    <span
                      className={`text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        isHighlight
                          ? "bg-navy text-gold border-gold/50"
                          : "text-charcoal bg-white border-border-pink"
                      }`}
                    >
                      {st.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-sm sm:text-base font-bold text-charcoal mb-1 leading-snug">
                    {st.title}
                  </h3>

                  {/* Location */}
                  <div className="text-xs font-semibold text-pink-dark mb-2.5">
                    📍 {st.location}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-charcoal-muted leading-relaxed mb-4">
                    {st.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border-pink">
                  {st.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[9px] font-bold uppercase tracking-wider text-charcoal-muted bg-white border border-border-pink px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Focused Step Detail Callout */}
        <div className="mt-10 p-6 sm:p-8 bg-surface border border-gold/60 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-primary">
              SELECTED MILESTONE &bull; STEP {steps[selectedStep].step}
            </span>
            <h4 className="font-serif text-lg sm:text-xl font-bold text-charcoal">
              {steps[selectedStep].title} — <span className="text-gold-dark">{steps[selectedStep].date}</span>
            </h4>
            <p className="text-xs sm:text-sm text-charcoal-muted">
              Venue: <strong className="text-charcoal">{steps[selectedStep].location}</strong>
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLScLhiYtE6aWKlI-T3tou7OzfVQVucW4uxHgf8Q7P5bLI4JKLw/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto text-center px-6 py-3 text-xs font-extrabold uppercase tracking-widest text-white bg-pink-primary hover:bg-pink-dark rounded-full transition-colors shadow-sm"
            >
              Nominate Your Child (Free Entry)
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
