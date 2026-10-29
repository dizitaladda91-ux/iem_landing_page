"use client";

import React from "react";

const sponsors = [
  {
    role: "Title Presenter",
    name: "Jashn Realty",
    sub: "Presents Runway Kids Fashion Week",
    badgeColor: "bg-[#0A1440] text-gold border-gold/40",
    nameColor: "text-[#0A1440]",
  },
  {
    role: "Powered By",
    name: "VAULT",
    sub: "by Virat Kohli",
    badgeColor: "bg-black text-white border-zinc-700",
    nameColor: "text-black",
  },
  {
    role: "Co-Powered By",
    name: "GD Goenka School",
    sub: "Lucknow",
    badgeColor: "bg-[#102A6B] text-white border-blue-900",
    nameColor: "text-[#102A6B]",
  },
  {
    role: "Hospitality Partner",
    name: "The Centrum",
    sub: "Lucknow • Hotel | Resort | Convention",
    badgeColor: "bg-[#8C7853] text-white border-[#A8946C]",
    nameColor: "text-[#6B5A39]",
  },
  {
    role: "Associate Partner",
    name: "vivo",
    sub: "Official Smartphone",
    badgeColor: "bg-[#415FFF] text-white border-blue-400",
    nameColor: "text-[#415FFF]",
  },
  {
    role: "Associate Partner",
    name: "DECATHLON",
    sub: "Sports & Fitness",
    badgeColor: "bg-[#0082C3] text-white border-sky-400",
    nameColor: "text-[#0082C3]",
  },
  {
    role: "Supporting Partner",
    name: "Lakmé Academy",
    sub: "Powered by Aptech",
    badgeColor: "bg-zinc-900 text-gold border-gold/50",
    nameColor: "text-zinc-900",
  },
  {
    role: "Supporting Partner",
    name: "Yakult",
    sub: "The Gut Expert",
    badgeColor: "bg-[#E60012] text-white border-red-400",
    nameColor: "text-[#E60012]",
  },
  {
    role: "Supporting Partner",
    name: "Burger King",
    sub: "Taste is King",
    badgeColor: "bg-[#D62300] text-amber-200 border-amber-500",
    nameColor: "text-[#D62300]",
  },
  {
    role: "Associate Partner",
    name: "Mezbaan",
    sub: "All Events",
    badgeColor: "bg-purple-900 text-purple-200 border-purple-700",
    nameColor: "text-purple-950",
  },
  {
    role: "Associate Partner",
    name: "Steppingstone",
    sub: "Strategic Branding Mentoring",
    badgeColor: "bg-emerald-800 text-emerald-100 border-emerald-600",
    nameColor: "text-emerald-900",
  },
  {
    role: "Supporting Partner",
    name: "Cafe Nutri",
    sub: "Health & Nutrition",
    badgeColor: "bg-[#8D7B38] text-white border-[#A8946C]",
    nameColor: "text-[#73632A]",
  },
  {
    role: "Event Partner",
    name: "AdOnMo+",
    sub: "Outdoor Media",
    badgeColor: "bg-[#0B63C5] text-white border-blue-300",
    nameColor: "text-[#0B63C5]",
  },
  {
    role: "Conceptualised By",
    name: "Institute of Event Management",
    sub: "IEM World",
    badgeColor: "bg-indigo-900 text-indigo-100 border-indigo-700",
    nameColor: "text-indigo-950",
  },
  {
    role: "Audition Rounds",
    name: "1st & 14th Nov 2026",
    sub: "Jashn Realty & GD Goenka",
    badgeColor: "bg-gold text-[#0A1440] border-gold-dark",
    nameColor: "text-[#0A1440]",
  },
  {
    role: "Grand Finale",
    name: "22nd Nov 2026",
    sub: "The Centrum, Lucknow",
    badgeColor: "bg-[#0A1440] text-gold border-gold",
    nameColor: "text-[#0A1440]",
  },
  {
    role: "Enquiries & Helpline",
    name: "+91 9548918304",
    sub: "9773848123",
    badgeColor: "bg-emerald-600 text-white border-emerald-700",
    nameColor: "text-emerald-800",
  },
];

export default function AnnouncementTicker() {
  return (
    <div
      className="bg-surface/90 border-y border-border-pink py-2.5 overflow-hidden select-none relative shadow-2xs"
      aria-label="Official Event Sponsors and Partners"
    >
      <div
        className="flex w-max animate-marquee hover:[animation-play-state:paused] items-center"
        style={{ animationDuration: "50s" }}
      >
        {/* Repeat list twice for seamless 100% loop */}
        {[...sponsors, ...sponsors].map((item, idx) => (
          <div key={idx} className="flex items-center mx-2.5 sm:mx-3.5 shrink-0">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-border-pink shadow-2xs hover:border-gold hover:shadow-xs transition-all">
              <span
                className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border shadow-2xs ${item.badgeColor}`}
              >
                {item.role}
              </span>
              <span
                className={`text-xs sm:text-sm font-black tracking-wide ${item.nameColor}`}
              >
                {item.name}
              </span>
              {item.sub && (
                <span className="text-[10px] font-semibold text-charcoal-muted border-l border-border-pink/70 pl-2">
                  {item.sub}
                </span>
              )}
            </div>
            <span className="mx-2.5 sm:mx-3.5 text-gold font-black text-xs select-none">
              ✦
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
