"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const slides = [
  {
    id: 1,
    image: "/images/bareilly-grand-stage.jpg",
    alt: "Grand runway stage setup at Phoenix United Mall Bareilly",
    step: "01",
    tag: "CONCERT-GRADE SETUP",
    title: "Official Grand Runway Stage in Mall Atrium",
    subtitle: "Real Glimpses from Phoenix United, Bareilly",
    desc: "A massive multi-level runway stage built inside the central atrium of Phoenix United with concert-grade sound towers, live rock band instruments, LED screens, and international runway specifications.",
    highlights: [
      "Concert-Grade Acoustic Sound & Lights",
      "Full Atrium Multi-Level Runway Ramp",
      "Live Musical Performance Stage Setup",
    ],
    venue: "Phoenix United, Bareilly",
  },
  {
    id: 2,
    image: "/images/bareilly-massive-crowd.jpg",
    alt: "Massive packed house audience cheering at Phoenix United Bareilly",
    step: "02",
    tag: "HOUSE-FULL AUDIENCE",
    title: "Hundreds of Cheering Families & Mall Crowds",
    subtitle: "Real Glimpses from Phoenix United, Bareilly",
    desc: "A roaring, packed-house turnout where parents, mall visitors, and brand sponsors gathered all around the red carpet to cheer for every single young contestant as our celebrity anchor hosted live on stage.",
    highlights: [
      "100+ Families In Live Audience",
      "Celebrity Anchor & Live Mic Interaction",
      "Electrifying Mall Footfall & Support",
    ],
    venue: "Phoenix United, Bareilly",
  },
  {
    id: 3,
    image: "/images/bareilly-doctor-kid.jpg",
    alt: "Toddler dressed as doctor on red carpet at Phoenix United Bareilly",
    step: "03",
    tag: "THEMED TALENT ROUND",
    title: "Fearless Stage Confidence From Day One",
    subtitle: "Real Glimpses from Phoenix United, Bareilly",
    desc: "Our unique thematic rounds give toddlers and kids freedom to express their dreams — like this little doctor rocking the microphone on the Phoenix United red carpet with pure charisma, joy, and zero stage fright.",
    highlights: [
      "Fun Roleplay & Creative Costumes",
      "Live Microphone Speaking Round",
      "Positive, Encouraging Stage Vibe",
    ],
    venue: "Phoenix United, Bareilly",
  },
  {
    id: 4,
    image: "/images/bareilly-solo-girl.jpg",
    alt: "Young girl ramp walk with microphone at Phoenix United Bareilly",
    step: "04",
    tag: "INDEPENDENT RAMP WALK",
    title: "Poise, Grace & Live Microphone Presentation",
    subtitle: "Real Glimpses from Phoenix United, Bareilly",
    desc: "From walking the runway in designer wear to speaking into the mic before hundreds of spectators, our professional grooming workshops empower children with lifelong poise, self-expression, and undeniable star quality.",
    highlights: [
      "Professional Choreography & Walk",
      "Microphone Handling & Articulation",
      "Overcoming Stage Shyness Forever",
    ],
    venue: "Phoenix United, Bareilly",
  },
  {
    id: 5,
    image: "/images/bareilly-judges-panel.jpg",
    alt: "Eminent jury panel evaluating contestants at Phoenix United Bareilly",
    step: "05",
    tag: "EMINENT JURY EVALUATION",
    title: "Fair, Constructive & Celebrated Evaluation",
    subtitle: "Real Glimpses from Phoenix United, Bareilly",
    desc: "Distinguished judges, fashion choreographers, and educators carefully observe each participant's natural charm, expression, and effort. There are no harsh eliminations — only constructive feedback and encouragement.",
    highlights: [
      "Certified Industry Experts & Mentors",
      "Personalized Scoring & Recognition",
      "Respectful & Comfortable Atmosphere",
    ],
    venue: "Phoenix United, Bareilly",
  },
  {
    id: 6,
    image: "/images/bareilly-vr-entertainment.jpg",
    alt: "Kids and parents enjoying 4D VR dynamic rides at Phoenix United Bareilly",
    step: "06",
    tag: "4D VR ENTERTAINMENT",
    title: "Thrilling 4D Virtual Reality Rides for Kids",
    subtitle: "Real Glimpses from Phoenix United, Bareilly",
    desc: "More than just a fashion show — participants and mothers strapped in for thrilling 4D Virtual Reality jungle adventures, making the entire event tour an unforgettable holiday memory for the whole family.",
    highlights: [
      "Full-Motion 4D VR Gaming Seats",
      "Exclusive Entertainment Pass for Kids",
      "Unforgettable Family Holiday Memories",
    ],
    venue: "Phoenix United, Bareilly",
  },
  {
    id: 7,
    image: "/images/bareilly-arcade-games.jpg",
    alt: "Father and kids playing arcade racing games at Phoenix United Bareilly",
    step: "07",
    tag: "FAMILY BONDING MOMENTS",
    title: "Arcade Racing, Joy & Big Family Smiles",
    subtitle: "Real Glimpses from Phoenix United, Bareilly",
    desc: "Bursting with pure laughter as fathers, mothers, and kids raced side-by-side on arcade bikes and gaming zones in the mall, celebrating togetherness at every milestone of the competition.",
    highlights: [
      "Fun Parent-Child Bonding Activities",
      "Stress-Free, Celebratory Atmosphere",
      "Smiles, Friendship & Good Spirits",
    ],
    venue: "Phoenix United, Bareilly",
  },
  {
    id: 8,
    image: "/images/bareilly-grand-award.jpg",
    alt: "Grand stage felicitation with ₹15,000 gift voucher at Phoenix United Bareilly",
    step: "08",
    tag: "GRAND FINALE FELICITATION",
    title: "Real Cash Prizes, Trophies & Brand Gift Vouchers",
    subtitle: "Real Glimpses from Phoenix United, Bareilly",
    desc: "The grand culmination where winners take center stage to receive ₹15,000+ brand gift vouchers, crowns, official sashes, and media recognition before an applauding house-full audience.",
    highlights: [
      "₹15,000+ Brand Gift Vouchers",
      "Official Crowns, Trophies & Sashes",
      "Extensive Media & Press Coverage",
    ],
    venue: "Phoenix United, Bareilly",
  },
];

export default function HeroGalleryCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScroll = containerRef.current.offsetHeight - window.innerHeight;
      if (totalScroll <= 0) return;

      const currentScroll = -rect.top;
      const p = Math.max(0, Math.min(1, currentScroll / totalScroll));
      setProgress(p);

      // Distribute evenly across 8 slides
      const newIndex = Math.min(
        slides.length - 1,
        Math.floor(p * slides.length)
      );
      setActiveIndex(newIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSlide = (index: number) => {
    if (!containerRef.current) return;
    const top = containerRef.current.offsetTop;
    const totalScroll = containerRef.current.offsetHeight - window.innerHeight;
    const targetScroll = top + (index / slides.length) * totalScroll + 20;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  const currentSlide = slides[activeIndex];

  return (
    <div
      id="gallery"
      ref={containerRef}
      className="relative bg-white"
      style={{ height: `${slides.length * 85}vh` }}
    >
      {/* Sticky Screen Pinned Wrapper */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex flex-col justify-between border-b border-border-pink bg-surface select-none">
        
        {/* Top Scroll Progress Line */}
        <div className="w-full h-1.5 bg-border-pink/40 relative z-30">
          <div
            className="h-full bg-gradient-to-r from-gold via-pink-primary to-gold transition-all duration-150"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>

        {/* Decorative Ambient Background Glows */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 left-1/4 w-[420px] h-[420px] rounded-full bg-gold/10 blur-3xl" />
          <div className="absolute -bottom-32 right-1/4 w-[460px] h-[460px] rounded-full bg-pink-primary/10 blur-3xl" />
        </div>

        {/* Main Sticky Grid Container */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex-1 flex items-center py-3 sm:py-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 items-center w-full">
            
            {/* LEFT SIDE: Dynamic Text & Storytelling Content */}
            <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center space-y-3 sm:space-y-4">
              
              {/* Category Proof Pill & Prev/Next Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gold/70 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider text-pink-primary shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                    <span>📍 {currentSlide.venue}</span>
                  </span>
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gold-dark bg-surface-card border border-border-pink px-2.5 py-1 rounded-full">
                    {currentSlide.tag}
                  </span>
                </div>

                {/* Quick Next / Prev Arrows */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => scrollToSlide(Math.max(0, activeIndex - 1))}
                    disabled={activeIndex === 0}
                    className="w-7 h-7 rounded-full bg-white border border-border-pink text-charcoal hover:text-pink-primary disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-xs font-bold transition shadow-2xs"
                    aria-label="Previous image"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSlide(Math.min(slides.length - 1, activeIndex + 1))}
                    disabled={activeIndex === slides.length - 1}
                    className="w-7 h-7 rounded-full bg-white border border-border-pink text-charcoal hover:text-pink-primary disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-xs font-bold transition shadow-2xs"
                    aria-label="Next image"
                  >
                    →
                  </button>
                </div>
              </div>

              {/* Step Counter */}
              <div className="flex items-center gap-3">
                <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-pink-primary leading-none">
                  {currentSlide.step}
                </span>
                <div className="h-8 w-px bg-border-pink" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-charcoal-muted">
                    PREVIOUS EDITION PROOF
                  </span>
                  <span className="text-xs font-bold text-pink-primary">
                    MOMENT {activeIndex + 1} OF {slides.length}
                  </span>
                </div>
              </div>

              {/* Animated Title & Subtitle */}
              <div className="space-y-1.5">
                <h3 className="font-serif text-lg sm:text-2xl lg:text-3xl font-extrabold text-charcoal leading-tight">
                  {currentSlide.title}
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                  {currentSlide.desc}
                </p>
              </div>

              {/* Highlights Checklist */}
              <div className="space-y-1.5 pt-0.5">
                {currentSlide.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-charcoal">
                    <span className="w-4 h-4 rounded-full bg-pink-primary/10 text-pink-primary flex items-center justify-center text-[10px] font-black shrink-0">
                      ✓
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Interactive Step Navigator Pills (8 Dots) */}
              <div className="pt-2 border-t border-border-pink/70 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {slides.map((s, idx) => {
                    const isActive = idx === activeIndex;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => scrollToSlide(idx)}
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                          isActive
                            ? "w-6 bg-pink-primary shadow-xs"
                            : "w-2 bg-border-pink hover:bg-gold"
                        }`}
                        title={`Moment ${idx + 1}: ${s.title}`}
                        aria-label={`Jump to slide ${idx + 1}`}
                      />
                    );
                  })}
                </div>

                <span className="text-[10px] sm:text-[11px] font-bold text-charcoal-muted uppercase tracking-wider shrink-0">
                  Scroll to view all 8 ↓
                </span>
              </div>

              {/* Free Entry Registration Jump CTA */}
              <div className="pt-1">
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLScLhiYtE6aWKlI-T3tou7OzfVQVucW4uxHgf8Q7P5bLI4JKLw/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider text-white bg-pink-primary hover:bg-pink-dark transition-colors shadow-sm"
                >
                  Nominate Your Child for Lucknow [Free Entry]
                </a>
              </div>

            </div>

            {/* RIGHT SIDE: Pinned Stacked Images (Change/Peel one by one on scroll) */}
            <div className="lg:col-span-6 xl:col-span-7 flex items-center justify-center">
              <div className="relative w-full max-w-[580px] aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden border-2 border-gold/70 shadow-[0_25px_60px_-15px_rgba(17,34,102,0.45)] bg-slate-900">
                
                {slides.map((slide, idx) => {
                  const isActive = idx === activeIndex;
                  const isPast = idx < activeIndex;
                  const isFuture = idx > activeIndex;

                  return (
                    <div
                      key={slide.id}
                      className={`absolute inset-0 transition-all duration-700 ease-out ${
                        isActive
                          ? "opacity-100 scale-100 translate-y-0 z-20 pointer-events-auto"
                          : isPast
                          ? "opacity-0 scale-95 -translate-y-10 z-10 pointer-events-none"
                          : "opacity-0 scale-95 translate-y-10 z-0 pointer-events-none"
                      }`}
                    >
                      {/* Blurred Ambient Backdrop Fill */}
                      <div className="absolute inset-0 overflow-hidden">
                        <Image
                          src={slide.image}
                          alt=""
                          fill
                          priority={idx < 2}
                          className="object-cover blur-xl scale-110 opacity-40"
                          aria-hidden="true"
                        />
                      </div>

                      {/* Crisp Main Foreground Image */}
                      <div className="relative w-full h-full p-2 flex items-center justify-center">
                        <Image
                          src={slide.image}
                          alt={slide.alt}
                          fill
                          priority={idx < 2}
                          sizes="(max-width: 768px) 94vw, (max-width: 1280px) 50vw, 580px"
                          className="object-contain"
                        />
                      </div>

                      {/* Top Badge Overlay */}
                      <div className="absolute top-3 left-3 z-30 pointer-events-none">
                        <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-navy/90 text-gold border border-gold/50 backdrop-blur-xs shadow-xs">
                          📍 {slide.venue}
                        </span>
                      </div>

                      {/* Bottom Banner Scrim */}
                      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-navy/95 via-navy/60 to-transparent z-30 pointer-events-none flex items-center justify-between">
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-white leading-tight">
                            {slide.title}
                          </p>
                          <p className="text-[10px] text-gold font-semibold uppercase tracking-wider mt-0.5">
                            Moment {slide.step} of 08 &bull; {slide.tag}
                          </p>
                        </div>
                        <span className="hidden sm:inline-block px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider rounded bg-white/20 text-white backdrop-blur-xs">
                          Bareilly Edition
                        </span>
                      </div>

                    </div>
                  );
                })}

              </div>
            </div>

          </div>
        </div>

        {/* Bottom Helper Bar */}
        <div className="w-full bg-surface-card border-t border-border-pink py-2 px-4 flex items-center justify-between text-[11px] text-charcoal-muted z-20">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-charcoal">
              Verified Track Record: Real Event Moments from Phoenix United, Bareilly
            </span>
          </div>
          <div className="font-bold text-pink-primary hidden sm:block">
            {activeIndex === slides.length - 1
              ? "Next: Lucknow 2026 Overview Section ↓"
              : `Scroll down to see Moment ${activeIndex + 2} of 08 ↓`}
          </div>
        </div>

      </div>
    </div>
  );
}
