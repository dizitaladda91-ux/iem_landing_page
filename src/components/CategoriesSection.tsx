"use client";

import React, { useState } from "react";

interface CategoryDetail {
  id: string;
  categoryNumber: string;
  title: string;
  ageGroup: string;
  partnerInfo: string;
  description: string;
  styling: string[];
  keyHighlights: string[];
}

const categories: CategoryDetail[] = [
  {
    id: "cat-1",
    categoryNumber: "CATEGORY 01",
    title: "Newborn — Walk with Mom",
    ageGroup: "1 – 2 Years (Newborn to Toddler)",
    partnerInfo: "Mother & Baby Duo",
    description:
      "Parents and baby participate in a charming ramp walk, with the baby safely seated in a decorated stroller or baby cart. Designed for sheer comfort and adoration.",
    styling: [
      "Cute coordinated pastel outfits for Mom & Baby",
      "Decorated stroller or theme-compliant baby carrier",
      "Comfort-first fabrics (soft cotton, breathable silks)",
    ],
    keyHighlights: [
      "No stress or complex walking required",
      "Special 'Best Parent-Child Duo' recognition",
      "Professional photographic stage keepsake",
    ],
  },
  {
    id: "cat-2",
    categoryNumber: "CATEGORY 02",
    title: "Independent Ramp Walk + Themed Round",
    ageGroup: "Class 2 – Class 3 (Approx. 6 – 8 Years)",
    partnerInfo: "Solo Participant",
    description:
      "Young stars showcase their innocence and cheerful persona through a solo ramp walk accompanied by a playful themed round (Ethnic, Western, or Creative Fantasy).",
    styling: [
      "Round A: Traditional Ethnic or Festive Wear",
      "Round B: Modern Casual Chic or Smart Western",
      "Props allowed: Sunshades, theme props, hats",
    ],
    keyHighlights: [
      "Focus on cheerful smiles and natural walking rhythm",
      "Basic choreographic hand waving and posture cues",
      "Awards for 'Best Smile' and 'Little Star'",
    ],
  },
  {
    id: "cat-3",
    categoryNumber: "CATEGORY 03",
    title: "Groomed Fashion Walk + Designer Showcase",
    ageGroup: "Class 4 – Class 5 (Approx. 9 – 11 Years)",
    partnerInfo: "Solo Participant",
    description:
      "A sophisticated runway round featuring curated designer collections. Kids receive intensive stage grooming, posture refinement, and runway pacing training.",
    styling: [
      "Designer kidswear collections provided / coordinated",
      "High-fashion Indo-Western or formal runway attire",
      "Professional runway grooming & expression guidance",
    ],
    keyHighlights: [
      "Direct talent scouting by kidswear brand partners",
      "Consideration for HNI Kids Fashion Calendar feature",
      "Awards for 'Best Walk' and 'Mr. & Miss Runway Star'",
    ],
  },
  {
    id: "cat-4",
    categoryNumber: "CATEGORY 04",
    title: "Sporty Walk with Dad",
    ageGroup: "All Registered Age Groups (Open Duo)",
    partnerInfo: "Father & Child Duo",
    description:
      "Wear sporty athletic outfits and carry sports kits or equipment to showcase an active, vibrant, and energetic father-child bond on the runway stage.",
    styling: [
      "Matching athletic jersey, tracksuits, or sportswear",
      "Sports prop: Cricket bat, tennis racquet, basketball, skates",
      "Energetic high-fives and victory celebration poses",
    ],
    keyHighlights: [
      "Celebrates the energetic father-child connection",
      "High audience applause and cheerful engagement",
      "Special 'Best Dynamic Duo' trophy and hamper",
    ],
  },
];

export default function CategoriesSection() {
  const [activeCategory, setActiveCategory] = useState<CategoryDetail>(categories[0]);

  const handleSelectCategory = (catName: string) => {
    window.open(
      "https://docs.google.com/forms/d/e/1FAIpQLScLhiYtE6aWKlI-T3tou7OzfVQVucW4uxHgf8Q7P5bLI4JKLw/viewform",
      "_blank",
      "noopener,noreferrer"
    );
    const selectElement = document.getElementById("categorySelect") as HTMLSelectElement | null;
    if (selectElement) {
      selectElement.value = catName;
      selectElement.dispatchEvent(new Event("change", { bubbles: true }));
    }
  };

  return (
    <section id="categories" className="py-20 bg-surface border-b border-border-pink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-block px-3 py-1 bg-white text-pink-dark border border-border-pink text-xs font-bold uppercase tracking-wider rounded mb-3">
              RAMP WALK SEGMENTS
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-charcoal uppercase tracking-tight">
              Age Categories &amp; Segments
            </h2>
            <p className="mt-2 text-sm sm:text-base text-charcoal-muted max-w-xl">
              Carefully structured divisions ensuring age-appropriate grooming, comfort, and safety for every young participant.
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-xs font-bold uppercase tracking-widest text-pink-primary bg-white border border-border-pink px-4 py-2 rounded">
            CLICK ANY CATEGORY TO INSPECT
          </div>
        </div>

        {/* 4 Category Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {categories.map((cat) => {
            const isSelected = activeCategory.id === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat)}
                className={`text-left p-5 sm:p-6 rounded-xl border transition-all text-charcoal ${
                  isSelected
                    ? "bg-white border-2 border-pink-primary shadow-md -translate-y-1"
                    : "bg-white border-border-pink hover:border-pink-primary"
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-xs font-black tracking-widest uppercase ${
                    isSelected ? "text-pink-primary" : "text-charcoal-muted"
                  }`}>
                    {cat.categoryNumber}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-extrabold uppercase bg-pink-primary text-white px-2 py-0.5 rounded">
                      ACTIVE
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-base font-bold text-charcoal mb-1.5 leading-snug">
                  {cat.title}
                </h3>
                <div className="text-xs font-semibold text-charcoal-muted">
                  {cat.ageGroup}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Category Detailed Showcase Card */}
        <div className="bg-white border border-border-pink rounded-xl p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-7 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-extrabold tracking-widest uppercase bg-pink-soft text-pink-dark px-3 py-1 rounded border border-border-pink">
                  {activeCategory.categoryNumber}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-charcoal bg-surface px-3 py-1 rounded border border-border-pink">
                  {activeCategory.partnerInfo}
                </span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">
                {activeCategory.title}
              </h3>

              <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                {activeCategory.description}
              </p>

              {/* Styling recommendations */}
              <div className="pt-4 border-t border-border-pink">
                <h4 className="text-xs font-black uppercase tracking-wider text-charcoal mb-3">
                  RECOMMENDED COSTUME &amp; STYLING GUIDELINES
                </h4>
                <div className="space-y-2">
                  {activeCategory.styling.map((style, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-charcoal">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-primary flex-shrink-0"></span>
                      <span>{style}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-surface border border-border-pink p-6 rounded-lg space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-pink-dark">
                KEY HIGHLIGHTS &amp; RECOGNITION
              </h4>
              <div className="space-y-3">
                {activeCategory.keyHighlights.map((hl, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-xs font-black text-pink-primary bg-white border border-border-pink px-2 py-0.5 rounded">
                      0{i + 1}
                    </span>
                    <span className="text-xs text-charcoal-muted leading-relaxed">
                      {hl}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-border-pink">
                <button
                  onClick={() => handleSelectCategory(activeCategory.title)}
                  className="w-full py-3.5 text-center text-xs font-extrabold uppercase tracking-widest text-white bg-pink-primary hover:bg-pink-dark rounded transition-colors"
                >
                  Register in this Category
                </button>
                <p className="text-[11px] text-center text-charcoal-muted mt-2">
                  Free entry nomination • Open to all eligible candidates
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
