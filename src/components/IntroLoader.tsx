"use client";

import Image from "next/image";
import React, { useEffect, useState, useCallback } from "react";

export default function IntroLoader() {
  // stage: "brand" -> "poster" -> "exit" -> "done"
  const [stage, setStage] = useState<"brand" | "poster" | "exit" | "done">("brand");

  const finishIntro = useCallback(() => {
    setStage("exit");
    setTimeout(() => {
      setStage("done");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("iem_intro_completed"));
        try {
          sessionStorage.setItem("iem_intro_finished", "true");
        } catch {
          // ignore
        }
      }
    }, 600);
  }, []);

  useEffect(() => {
    // Stage 1: Brand Logo ("Jashn Realty Presents...") rises and fills up
    const t1 = setTimeout(() => {
      setStage("poster");
    }, 1900);

    // Stage 2: Official Runway Poster showcased
    const t2 = setTimeout(() => {
      setStage("exit");
    }, 5200);

    // Stage 3: Smooth exit and complete loader
    const t3 = setTimeout(() => {
      setStage("done");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("iem_intro_completed"));
        try {
          sessionStorage.setItem("iem_intro_finished", "true");
        } catch {
          // ignore
        }
      }
    }, 5900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (stage === "done") return null;

  return (
    <div
      className={`fixed inset-0 h-[100dvh] z-[100] flex items-center justify-center bg-surface px-4 transition-all duration-700 ease-in-out overflow-hidden ${
        stage === "exit"
          ? "-translate-y-full opacity-0 pointer-events-none"
          : "translate-y-0 opacity-100"
      }`}
    >
      {/* Skip button for quick navigation */}
      <button
        type="button"
        onClick={finishIntro}
        className="absolute top-5 right-5 z-20 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-charcoal/80 hover:text-navy bg-white/85 hover:bg-white backdrop-blur-md border border-gold/40 shadow-sm transition-all duration-200 cursor-pointer"
        aria-label="Skip Intro"
      >
        <span>Skip</span>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Soft Royal Navy & Gold Background Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[360px] sm:w-[640px] h-[360px] sm:h-[640px] rounded-full bg-gold/15 blur-3xl" />
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[320px] sm:w-[540px] h-[320px] sm:h-[540px] rounded-full bg-pink-soft/80 blur-3xl" />
      </div>

      {/* Center Content: Jashn Realty Logo First, then Official Single Poster */}
      <div className="relative z-10 w-full max-w-5xl h-full flex items-center justify-center overflow-hidden p-2">
        {stage === "brand" ? (
          <div className="intro-rise-up relative w-[280px] sm:w-[420px] lg:w-[520px] aspect-[684/466] select-none">
            {/* Base Soft Faded Ghost Logo */}
            <Image
              src="/images/runway-logo.png"
              alt="Jashn Realty Presents Runway Kids Fashion Week"
              fill
              priority
              sizes="(max-width: 640px) 280px, (max-width: 1024px) 420px, 520px"
              className="object-contain opacity-20"
            />
            {/* Bottom-to-Top Loading/Filling Full-Color Logo */}
            <div className="intro-text-fill absolute inset-0">
              <Image
                src="/images/runway-logo.png"
                alt="Jashn Realty Presents Runway Kids Fashion Week"
                fill
                priority
                sizes="(max-width: 640px) 280px, (max-width: 1024px) 420px, 520px"
                className="object-contain drop-shadow-[0_10px_25px_rgba(17,34,102,0.18)]"
              />
            </div>
          </div>
        ) : (
          <div className="intro-image-drop relative flex flex-col items-center justify-center max-w-[94vw] max-h-[84dvh]">
            <div className="relative rounded-2xl overflow-hidden border-2 border-gold/70 shadow-[0_25px_60px_-15px_rgba(17,34,102,0.45)] bg-white">
              <Image
                src="/images/runway-poster.png"
                alt="Jashn Realty Presents Runway Kids Fashion Week Official Poster"
                width={1024}
                height={714}
                priority
                className="w-auto h-auto max-w-[92vw] max-h-[78dvh] object-contain block"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
