"use client";

import React, { useState } from "react";

export default function RulesSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Is there any registration fee for the nomination?",
      a: "Initial nominations are completely free of charge. Parents can submit their child's details online or at official school connect & mall desks without any registration cost.",
    },
    {
      q: "What happens during the 1st Mega Audition on 01st November at Jashn Realty?",
      a: "The audition is designed to be child-friendly, playful, and comfortable. Trainers evaluate basic ramp presence, smiles, and self-introduction. It is an encouraging shortlisting round, not a stressful elimination.",
    },
    {
      q: "How does the Social Media Wild Card Voting work?",
      a: "After you register, our media team generates an official participant creative. When posted online, the top 2 participants per category with the highest organic engagement (Likes + Comments + Shares) receive direct entry into the Grand Finale without an audition.",
    },
    {
      q: "Are parents allowed to accompany children backstage and on the runway?",
      a: "Parents of children in Category 1 (Newborns) and Category 4 (Father Duo) walk right on stage with their kids. For solo categories, parent escorts assist children in the preparation area, while green rooms are dedicated to participants and stylists for safety and order.",
    },
    {
      q: "What documents must be submitted on Audition day?",
      a: "Please carry a recent passport-size photograph of the child, a photocopy of the birth certificate or school ID card (for age group verification), and parent ID proof (Aadhaar or Passport).",
    },
  ];

  const rules = [
    {
      title: "Costumes & Styling",
      points: [
        "Parents prepare outfits in advance (Ethnic, Western, Party wear, or Sports).",
        "Outfits must be comfortable, age-appropriate, and safe for runway walking.",
      ],
    },
    {
      title: "Rehearsals & Workshops",
      points: [
        "Attendance in grooming sessions and choreography practice is mandatory for finalists.",
        "Punctuality is expected to ensure each child receives dedicated trainer time.",
      ],
    },
    {
      title: "Event Day Protocols",
      points: [
        "Participants must report on schedule and wear their official ID badge at all times.",
        "Green room access is reserved for registered kids and official styling crew.",
      ],
    },
    {
      title: "Jury Decision & Conduct",
      points: [
        "Jury scores are based on natural charm, poise, and stage presence. Decisions are final.",
        "Respectful family conduct is mandatory to foster a supportive environment.",
      ],
    },
  ];

  return (
    <section id="rules" className="py-20 bg-white border-b border-border-pink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-block px-3 py-1 bg-surface text-pink-dark border border-border-pink text-xs font-bold uppercase tracking-wider rounded mb-3">
            GUIDELINES &amp; POLICIES
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-charcoal uppercase tracking-tight">
            Official Rules &amp; Parent FAQs
          </h2>
          <p className="mt-2 text-sm sm:text-base text-charcoal-muted leading-relaxed">
            Essential information regarding costumes, rehearsals, documents, and event day decorum to ensure every young participant shines in a safe, celebratory setting.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Official Rules Grid */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-pink-primary mb-2">
              CODE OF PARTICIPATION
            </h3>
            
            {rules.map((rule, idx) => (
              <div
                key={idx}
                className="bg-surface border border-border-pink p-6 rounded-xl"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-black uppercase text-pink-dark bg-white border border-border-pink px-2 py-0.5 rounded">
                    RULE 0{idx + 1}
                  </span>
                  <h4 className="text-sm font-bold text-charcoal uppercase tracking-wide">
                    {rule.title}
                  </h4>
                </div>
                <div className="space-y-1.5 mt-3">
                  {rule.points.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2.5 text-xs text-charcoal-muted leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-primary mt-1.5 flex-shrink-0"></span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Interactive Parent FAQs */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-charcoal mb-2">
              FREQUENTLY ASKED QUESTIONS
            </h3>

            {faqs.map((faq, fIdx) => {
              const isOpen = openFaq === fIdx;
              return (
                <div
                  key={fIdx}
                  className="border border-border-pink rounded-xl overflow-hidden bg-white"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : fIdx)}
                    className="w-full p-5 text-left flex justify-between items-center bg-surface hover:bg-pink-soft transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-bold text-charcoal pr-4">
                      {faq.q}
                    </span>
                    <span className="text-xs font-black text-pink-primary uppercase px-2 py-1 bg-white border border-border-pink rounded">
                      {isOpen ? "HIDE" : "SHOW"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="p-5 text-xs text-charcoal-muted leading-relaxed border-t border-border-pink bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Helpline contact banner */}
            <div className="p-6 bg-pink-light border border-border-pink rounded-xl space-y-2 mt-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-pink-primary block">
                DIRECT PARENT HELPLINE
              </span>
              <div className="text-sm font-bold text-charcoal">
                Need help with your registration or costume guidelines?
              </div>
              <p className="text-xs text-charcoal-muted">
                WhatsApp our organizing team at <strong className="text-charcoal">+91 95489 18304</strong> or email <strong className="text-charcoal">mayank@adonmo.com</strong>.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
