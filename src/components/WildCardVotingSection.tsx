"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";

interface ContestantVote {
  id: string;
  name: string;
  age: string;
  category: string;
  city: string;
  imageUrl?: string;
  votes: number;
  likes: number;
  shares: number;
  badge: string;
  bio?: string;
}

const CATEGORY_OPTIONS = [
  "Walk with Mom / Dad (Newborn)",
  "Independent Solo Ramp Walk",
  "Groomed Fashion Walk",
  "Sporty Walk with Dad",
  "Cutest Smile & Walk with Mom",
];

const AGE_OPTIONS = [
  "1.5 - 2 Yrs (Toddler)",
  "4 - 5 Yrs (Kindergarten)",
  "6 - 7 Yrs (Class 1-2)",
  "8 - 9 Yrs (Class 3-4)",
  "10 - 12 Yrs (Junior)",
];

const SAMPLE_AVATARS = [
  { label: "Classic Runway", url: "/images/bareilly-solo-girl.jpg" },
  { label: "Doctor Little Kid", url: "/images/bareilly-doctor-kid.jpg" },
  { label: "Traditional Style", url: "/images/bareilly-traditional-walk.jpg" },
  { label: "Mom & Son Duo", url: "/images/bareilly-rampwalk-mom-son.jpg" },
  { label: "Pink Gown Star", url: "/images/category-1.jpg" },
  { label: "Fashion Smile", url: "/images/category-2.jpg" },
];

export default function WildCardVotingSection() {
  const [contestants, setContestants] = useState<ContestantVote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("ALL");

  // Voter Modal State
  const [activeChildForVote, setActiveChildForVote] = useState<ContestantVote | null>(null);
  const [voterForm, setVoterForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "Lucknow",
  });
  const [submittingVote, setSubmittingVote] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [voteSuccessChild, setVoteSuccessChild] = useState<string | null>(null);

  // Fast Child Nomination Modal State (Easy addition for voters/parents)
  const [isNominateModalOpen, setIsNominateModalOpen] = useState(false);
  const [nominateForm, setNominateForm] = useState({
    childName: "",
    age: AGE_OPTIONS[1],
    category: CATEGORY_OPTIONS[0],
    city: "Lucknow",
    imageUrl: SAMPLE_AVATARS[0].url,
    parentName: "",
    parentPhone: "",
    parentEmail: "",
  });
  const [submittingNominate, setSubmittingNominate] = useState(false);
  const [nominateError, setNominateError] = useState<string | null>(null);

  // Load contestants from API
  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/candidates");
      if (res.ok) {
        const data = await res.json();
        setContestants(data.candidates || []);
      }
    } catch (err) {
      console.error("Failed to fetch live contestants:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter contestants based on search query and category filter
  const filteredContestants = useMemo(() => {
    return contestants.filter((child) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        child.name.toLowerCase().includes(q) ||
        child.id.toLowerCase().includes(q) ||
        child.category.toLowerCase().includes(q) ||
        child.city.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategoryFilter === "ALL" ||
        (selectedCategoryFilter === "MOM_DAD" &&
          child.category.toLowerCase().includes("walk with")) ||
        (selectedCategoryFilter === "SOLO" &&
          child.category.toLowerCase().includes("solo")) ||
        (selectedCategoryFilter === "GROOMED" &&
          child.category.toLowerCase().includes("groomed"));

      return matchesSearch && matchesCategory;
    });
  }, [contestants, searchQuery, selectedCategoryFilter]);

  // Open the voter verification modal
  const handleOpenVoteModal = (child: ContestantVote) => {
    setFormError(null);
    setActiveChildForVote(child);
  };

  // Submit the vote via API with Mobile Number or Email verification
  const handleSubmitVote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChildForVote) return;

    const trimmedPhone = voterForm.phone.trim();
    const trimmedEmail = voterForm.email.trim();
    const trimmedName = voterForm.name.trim();

    if (!trimmedPhone && !trimmedEmail) {
      setFormError("Please enter your Mobile Number or Email to cast your verified vote.");
      return;
    }

    if (trimmedPhone && trimmedPhone.replace(/\D/g, "").length < 10) {
      setFormError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setSubmittingVote(true);
    setFormError(null);

    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contestantId: activeChildForVote.id,
          voterName: trimmedName || "Supporter",
          voterPhone: trimmedPhone,
          voterEmail: trimmedEmail,
          voterCity: voterForm.city,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Increment vote count locally
        setContestants((prev) =>
          prev.map((c) =>
            c.id === activeChildForVote.id
              ? { ...c, votes: c.votes + 1, likes: c.likes + 1 }
              : c
          )
        );

        // Trigger confetti celebration
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#112266", "#D4AF37", "#F6E29C", "#0A1440", "#FFFFFF"],
          });
        } catch {
          // ignore
        }

        setVoteSuccessChild(activeChildForVote.name);
        setActiveChildForVote(null);
        setVoterForm({ name: "", phone: "", email: "", city: "Lucknow" });
      } else {
        setFormError(data.error || "Failed to record vote. Please check your details.");
      }
    } catch {
      setFormError("Network error. Please try again in a few moments.");
    } finally {
      setSubmittingVote(false);
    }
  };

  // Fast Child Nomination Submission by Parent / Voter
  const handleSubmitNomination = async (e: React.FormEvent) => {
    e.preventDefault();
    setNominateError(null);

    if (!nominateForm.childName.trim() || !nominateForm.parentPhone.trim()) {
      setNominateError("Child's Name and Parent Mobile Number are required.");
      return;
    }

    if (nominateForm.parentPhone.replace(/\D/g, "").length < 10) {
      setNominateError("Please enter a valid 10-digit mobile number for WhatsApp verification.");
      return;
    }

    setSubmittingNominate(true);

    try {
      const res = await fetch("/api/candidates/nominate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nominateForm),
      });

      const data = await res.json();

      if (res.ok && data.success && data.candidate) {
        // Prepend new candidate to live contestants list
        setContestants((prev) => [data.candidate, ...prev]);

        // Trigger confetti
        try {
          confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.5 },
            colors: ["#E11D48", "#D4AF37", "#0A1440", "#FFFFFF"],
          });
        } catch {
          // ignore
        }

        setVoteSuccessChild(data.candidate.name);
        setIsNominateModalOpen(false);
        setNominateForm({
          childName: "",
          age: AGE_OPTIONS[1],
          category: CATEGORY_OPTIONS[0],
          city: "Lucknow",
          imageUrl: SAMPLE_AVATARS[0].url,
          parentName: "",
          parentPhone: "",
          parentEmail: "",
        });
      } else {
        setNominateError(data.error || "Failed to submit child. Please try again.");
      }
    } catch {
      setNominateError("Network error. Please check your connection.");
    } finally {
      setSubmittingNominate(false);
    }
  };

  return (
    <section id="voting" className="py-20 bg-surface border-b border-border-pink relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-block px-3 py-1 bg-white text-pink-dark border border-border-pink text-xs font-bold uppercase tracking-wider rounded mb-3">
            JASHN REALTY PRESENTS &bull; SOCIAL MEDIA WILD CARD ENTRY
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-charcoal uppercase tracking-tight">
            Direct Finale Entry via Social Voting
          </h2>
          <p className="mt-2 text-sm sm:text-base text-charcoal-muted leading-relaxed">
            Every registered child receives an official branded social media voting creative. The top engaged 
            participants per category earn a direct wild card nomination into the Grand Finale! Search for 
            your child below, nominate a new contestant card, or cast your verified vote.
          </p>
        </div>

        {/* 3 Step Process Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          <div className="bg-white border border-border-pink p-6 sm:p-7 rounded-xl">
            <div className="text-[11px] font-black uppercase tracking-widest text-pink-primary mb-2">
              STEP 01
            </div>
            <h3 className="font-serif text-base font-bold text-charcoal mb-1.5">
              Official Creative Generation
            </h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              After registration, our media team generates an official participant banner with candidate ID and shares it with the family.
            </p>
          </div>

          <div className="bg-white border border-border-pink p-6 sm:p-7 rounded-xl">
            <div className="text-[11px] font-black uppercase tracking-widest text-pink-primary mb-2">
              STEP 02
            </div>
            <h3 className="font-serif text-base font-bold text-charcoal mb-1.5">
              Engagement Scoring Formula
            </h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Total Score = (Verified Votes &times; 10) + (Post Likes &times; 2) + (Valid Shares &times; 5). Duplicate votes are auto-filtered.
            </p>
          </div>

          <div className="bg-white border border-border-pink p-6 sm:p-7 rounded-xl">
            <div className="text-[11px] font-black uppercase tracking-widest text-pink-primary mb-2">
              STEP 03
            </div>
            <h3 className="font-serif text-base font-bold text-charcoal mb-1.5">
              Top Wild Card Selection
            </h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              The highest scoring boy &amp; girl from each age bracket secure a guaranteed wild card ramp walk at The Centrum on 22nd Nov.
            </p>
          </div>
        </div>

        {/* Success Banner if vote cast or child nominated */}
        {voteSuccessChild && (
          <div className="mb-8 p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-center justify-between gap-4 animate-fade-in shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎉</span>
              <div>
                <strong className="text-sm font-bold text-emerald-950 block">
                  Action Successful for {voteSuccessChild}!
                </strong>
                <span className="text-xs text-emerald-800">
                  Your record has been logged in the official Runway directory. Keep sharing with friends &amp; family!
                </span>
              </div>
            </div>
            <button
              onClick={() => setVoteSuccessChild(null)}
              className="text-emerald-800 hover:text-emerald-950 font-bold text-sm px-2 py-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Live Contestant Directory Search & Voting Card Grid */}
        <div className="bg-white border-2 border-border-pink rounded-2xl p-5 sm:p-8 shadow-sm">
          
          {/* Header & Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-border-pink gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-pink-primary bg-pink-soft px-2.5 py-1 rounded">
                  LIVE CONTESTANT DIRECTORY
                </span>
                <span className="text-xs font-bold text-charcoal-muted">
                  {filteredContestants.length} Contestants Active
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal mt-1">
                Search, Nominate &amp; Vote for Contestants
              </h3>
              <p className="text-xs text-charcoal-muted">
                Search child by Name or ID, or click &ldquo;Nominate Child&rdquo; to add a new voting card instantly.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => {
                  setNominateError(null);
                  setIsNominateModalOpen(true);
                }}
                className="px-4 py-2.5 text-xs font-black uppercase tracking-wider text-pink-primary bg-pink-soft border border-pink-primary hover:bg-pink-primary hover:text-white rounded-full transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <span>✨</span>
                <span>Nominate Child for Voting</span>
              </button>

              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLScLhiYtE6aWKlI-T3tou7OzfVQVucW4uxHgf8Q7P5bLI4JKLw/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white bg-pink-primary hover:bg-pink-dark rounded-full transition-colors shadow-sm"
              >
                Audition Registration
              </a>
            </div>
          </div>

          {/* Search Bar & Category Filters */}
          <div className="py-6 border-b border-border-pink space-y-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contestant by Child's Name, Contestant ID (e.g. KFW-102), or City..."
                className="w-full px-4 py-3 pl-11 text-xs sm:text-sm bg-surface border border-border-pink rounded-xl focus:outline-none focus:border-pink-primary text-charcoal font-medium placeholder:text-charcoal-muted"
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted font-bold text-sm">
                🔍
              </span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold uppercase text-charcoal-muted hover:text-pink-primary bg-white px-2 py-0.5 rounded border border-border-pink"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Quick Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-muted mr-1">
                Filter:
              </span>
              {[
                { label: "All Categories", val: "ALL" },
                { label: "Walk with Mom / Dad", val: "MOM_DAD" },
                { label: "Solo Ramp Walk", val: "SOLO" },
                { label: "Groomed Fashion Walk", val: "GROOMED" },
              ].map((pill) => (
                <button
                  key={pill.val}
                  onClick={() => setSelectedCategoryFilter(pill.val)}
                  className={`text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                    selectedCategoryFilter === pill.val
                      ? "bg-pink-primary text-white shadow-sm"
                      : "bg-surface text-charcoal hover:bg-pink-soft border border-border-pink"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contestants Cards Grid */}
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-pink-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold uppercase tracking-wider text-charcoal-muted">
                Loading Contestants Roster...
              </p>
            </div>
          ) : contestants.length === 0 ? (
            <div className="py-16 px-4 text-center max-w-lg mx-auto space-y-4">
              <div className="w-16 h-16 bg-pink-soft text-pink-primary rounded-3xl flex items-center justify-center mx-auto text-2xl font-bold shadow-xs">
                🌟
              </div>
              <div>
                <h4 className="font-serif text-xl font-bold text-charcoal">
                  No Contestants Published Yet
                </h4>
                <p className="text-xs sm:text-sm text-charcoal-muted mt-1 leading-relaxed">
                  Contestant cards posted from the Admin Portal or submitted via Parent Nomination will appear here live with verified voting.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setNominateError(null);
                    setIsNominateModalOpen(true);
                  }}
                  className="px-6 py-2.5 text-xs font-black uppercase tracking-wider bg-pink-primary text-white rounded-full hover:bg-pink-dark transition shadow-sm cursor-pointer"
                >
                  + Nominate Your Child for Voting
                </button>
              </div>
            </div>
          ) : filteredContestants.length === 0 ? (
            <div className="py-14 text-center">
              <div className="w-12 h-12 bg-pink-soft text-pink-primary rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                🔍
              </div>
              <p className="text-sm font-bold text-charcoal">
                No contestants match your search query &ldquo;{searchQuery}&rdquo;.
              </p>
              <p className="text-xs text-charcoal-muted mt-1">
                Can&apos;t find your child? Nominate them directly below!
              </p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategoryFilter("ALL");
                  }}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-white border border-border-pink text-charcoal rounded-full hover:bg-pink-soft cursor-pointer"
                >
                  Reset Filters
                </button>
                <button
                  onClick={() => {
                    setNominateError(null);
                    setIsNominateModalOpen(true);
                  }}
                  className="px-5 py-2 text-xs font-black uppercase tracking-wider bg-pink-primary text-white rounded-full hover:bg-pink-dark transition shadow-sm cursor-pointer"
                >
                  + Nominate Your Child Now
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-6">
              {filteredContestants.map((child) => (
                <div
                  key={child.id}
                  className="bg-surface border border-border-pink rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-gold hover:shadow-lg transition-all duration-300 group"
                >
                  <div>
                    {/* Top Bar */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-white border border-border-pink px-2.5 py-0.5 rounded text-charcoal">
                        ID: {child.id}
                      </span>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-pink-dark bg-pink-soft px-2 py-0.5 rounded truncate max-w-[130px]">
                        {child.badge}
                      </span>
                    </div>

                    {/* Photo Card with Real Image */}
                    <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-slate-900 mb-3 border border-border-pink group-hover:border-gold transition-colors">
                      <Image
                        src={child.imageUrl || "/images/category-1.jpg"}
                        alt={child.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 320px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                        <span className="text-xs font-bold text-white block truncate">
                          {child.name}
                        </span>
                        <span className="text-[10px] text-gold font-medium">
                          {child.age} &bull; {child.city}
                        </span>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="text-[11px] font-semibold text-charcoal mb-3 bg-white border border-border-pink p-2 rounded-lg text-center truncate shadow-2xs">
                      {child.category}
                    </div>

                    {/* Voting Stats */}
                    <div className="grid grid-cols-2 gap-2 text-center mb-4">
                      <div className="bg-white border border-border-pink p-2 rounded-lg shadow-2xs">
                        <span className="text-sm font-black text-pink-primary block">
                          {child.likes}
                        </span>
                        <span className="text-[9px] uppercase font-bold text-charcoal-muted">
                          Social Likes
                        </span>
                      </div>
                      <div className="bg-white border border-border-pink p-2 rounded-lg shadow-2xs">
                        <span className="text-sm font-black text-gold-dark block">
                          {child.votes}
                        </span>
                        <span className="text-[9px] uppercase font-bold text-charcoal-muted">
                          Total Points
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Vote Action Button */}
                  <button
                    onClick={() => handleOpenVoteModal(child)}
                    className="w-full py-2.5 text-xs font-extrabold uppercase tracking-widest rounded-xl bg-pink-primary hover:bg-pink-dark text-white active:scale-95 transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Vote for {child.name.split(" ")[0]}</span>
                    <span>🗳️</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Fair play policy notice */}
          <div className="mt-8 pt-6 border-t border-border-pink flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal-muted gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Fair Play System &bull; 1 Verified Vote per Contestant via Mobile/Email</span>
            </div>
            <div className="font-semibold text-charcoal">
              Organized by Institute of Event Management &amp; AdOnMo
            </div>
          </div>
        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. FAST NOMINATE CHILD MODAL (EASY ADDITION FOR VOTERS)       */}
      {/* ------------------------------------------------------------- */}
      {isNominateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border-2 border-gold/70 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
            
            <button
              onClick={() => setIsNominateModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface border border-border-pink flex items-center justify-center text-charcoal hover:text-pink-primary font-bold text-sm transition-colors cursor-pointer"
            >
              ✕
            </button>

            <div className="pb-4 mb-4 border-b border-border-pink">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-pink-primary bg-pink-soft px-2.5 py-1 rounded-full">
                PARENT NOMINATION &bull; WILD CARD ENTRY
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal mt-2">
                Nominate Child for Runway Voting
              </h3>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Add your child&apos;s card instantly so friends and family can start voting!
              </p>
            </div>

            {nominateError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium leading-relaxed">
                ⚠️ {nominateError}
              </div>
            )}

            <form onSubmit={handleSubmitNomination} className="space-y-4">
              
              {/* Child's Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Child&apos;s Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={nominateForm.childName}
                  onChange={(e) => setNominateForm({ ...nominateForm, childName: e.target.value })}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-surface border border-border-pink rounded-xl focus:outline-none focus:border-pink-primary text-charcoal font-medium"
                />
              </div>

              {/* Age Selection Chips */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Child Age / Class *
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {AGE_OPTIONS.map((age) => (
                    <button
                      key={age}
                      type="button"
                      onClick={() => setNominateForm({ ...nominateForm, age })}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition cursor-pointer ${
                        nominateForm.age === age
                          ? "bg-pink-primary text-white shadow-xs"
                          : "bg-surface text-charcoal hover:bg-pink-soft border border-border-pink"
                      }`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Selection Chips */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Category *
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORY_OPTIONS.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNominateForm({ ...nominateForm, category: cat })}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition cursor-pointer ${
                        nominateForm.category === cat
                          ? "bg-navy text-white shadow-xs"
                          : "bg-surface text-charcoal hover:bg-pink-soft border border-border-pink"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Parent Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                    Parent / Guardian Name
                  </label>
                  <input
                    type="text"
                    value={nominateForm.parentName}
                    onChange={(e) => setNominateForm({ ...nominateForm, parentName: e.target.value })}
                    placeholder="e.g. Meera Sharma"
                    className="w-full px-3.5 py-2 text-xs bg-surface border border-border-pink rounded-xl focus:outline-none focus:border-pink-primary text-charcoal font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                    WhatsApp / Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={nominateForm.parentPhone}
                    onChange={(e) => setNominateForm({ ...nominateForm, parentPhone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3.5 py-2 text-xs bg-surface border border-border-pink rounded-xl focus:outline-none focus:border-pink-primary text-charcoal font-medium"
                  />
                </div>
              </div>

              {/* Photo Preset Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Select Card Photo Style
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {SAMPLE_AVATARS.map((avatar) => (
                    <button
                      key={avatar.label}
                      type="button"
                      onClick={() => setNominateForm({ ...nominateForm, imageUrl: avatar.url })}
                      className={`text-[10px] font-bold px-2 py-1 rounded-md transition cursor-pointer ${
                        nominateForm.imageUrl === avatar.url
                          ? "bg-gold text-charcoal font-black"
                          : "bg-surface text-charcoal hover:bg-pink-soft border border-border-pink"
                      }`}
                    >
                      {avatar.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Action */}
              <div className="pt-3 border-t border-border-pink flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNominateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-charcoal bg-surface hover:bg-pink-soft rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingNominate}
                  className="px-6 py-2.5 text-xs font-extrabold uppercase tracking-widest text-white bg-pink-primary hover:bg-pink-dark rounded-xl shadow-md transition cursor-pointer disabled:opacity-50"
                >
                  {submittingNominate ? "Publishing Card..." : "Create & Publish Child Card 🌟"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. VOTER VERIFICATION FORM MODAL                              */}
      {/* ------------------------------------------------------------- */}
      {activeChildForVote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border-2 border-gold/70 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button
              onClick={() => setActiveChildForVote(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface border border-border-pink flex items-center justify-center text-charcoal hover:text-pink-primary font-bold text-sm transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="pb-4 mb-4 border-b border-border-pink">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-pink-primary bg-pink-soft px-2.5 py-1 rounded-full">
                VOTER VERIFICATION &bull; OFFICIAL BALLOT
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal mt-2">
                Cast Your Vote for {activeChildForVote.name}
              </h3>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Contestant ID: <strong className="text-charcoal">{activeChildForVote.id}</strong> &bull; {activeChildForVote.category}
              </p>
            </div>

            {/* Error Message Box */}
            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium leading-relaxed">
                ⚠️ {formError}
              </div>
            )}

            {/* Verification Form */}
            <form onSubmit={handleSubmitVote} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Voter Full Name
                </label>
                <input
                  type="text"
                  value={voterForm.name}
                  onChange={(e) => setVoterForm({ ...voterForm, name: e.target.value })}
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-surface border border-border-pink rounded-xl focus:outline-none focus:border-pink-primary text-charcoal font-medium"
                />
              </div>

              {/* Mobile / WhatsApp Number (Required) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Mobile Number / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={voterForm.phone}
                  onChange={(e) => {
                    setFormError(null);
                    setVoterForm({ ...voterForm, phone: e.target.value });
                  }}
                  placeholder="e.g. 9876543210 (10 digits)"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-surface border border-border-pink rounded-xl focus:outline-none focus:border-pink-primary text-charcoal font-medium"
                />
                <span className="text-[10px] text-charcoal-muted mt-1 block">
                  Required to verify your genuine vote and prevent duplicate spam votes.
                </span>
              </div>

              {/* Email Address (Optional) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={voterForm.email}
                  onChange={(e) => {
                    setFormError(null);
                    setVoterForm({ ...voterForm, email: e.target.value });
                  }}
                  placeholder="e.g. ramesh@gmail.com"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-surface border border-border-pink rounded-xl focus:outline-none focus:border-pink-primary text-charcoal font-medium"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  City / Area
                </label>
                <input
                  type="text"
                  value={voterForm.city}
                  onChange={(e) => setVoterForm({ ...voterForm, city: e.target.value })}
                  placeholder="e.g. Lucknow"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-surface border border-border-pink rounded-xl focus:outline-none focus:border-pink-primary text-charcoal font-medium"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveChildForVote(null)}
                  className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-charcoal bg-surface hover:bg-pink-soft rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingVote}
                  className="px-6 py-2.5 text-xs font-extrabold uppercase tracking-widest text-white bg-pink-primary hover:bg-pink-dark rounded-xl shadow-md transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <span>{submittingVote ? "Verifying Vote…" : "Submit Official Vote"}</span>
                  <span>✓</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}
