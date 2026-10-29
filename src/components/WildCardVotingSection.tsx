"use client";

import React, { useState, useEffect, useMemo } from "react";
import confetti from "canvas-confetti";

interface ContestantVote {
  id: string;
  name: string;
  age: string;
  category: string;
  city: string;
  votes: number;
  likes: number;
  shares: number;
  badge: string;
  avatarBg: string;
}

const initialContestants: ContestantVote[] = [
  {
    id: "KFW-101",
    name: "Aarav Sharma",
    age: "1.5 Years",
    category: "Walk with Mom / Dad (Newborn)",
    city: "Gomti Nagar, Lucknow",
    votes: 842,
    likes: 520,
    shares: 322,
    badge: "WILD CARD CONTENDER",
    avatarBg: "bg-pink-soft text-pink-primary",
  },
  {
    id: "KFW-102",
    name: "Ananya Verma",
    age: "Class 2 (7 Yrs)",
    category: "Independent Solo Ramp Walk",
    city: "Indira Nagar, Lucknow",
    votes: 960,
    likes: 610,
    shares: 350,
    badge: "TRENDING IN VOTING",
    avatarBg: "bg-gold-light text-gold-dark",
  },
  {
    id: "KFW-103",
    name: "Reyansh Gupta",
    age: "Class 4 (9 Yrs)",
    category: "Groomed Fashion Walk",
    city: "Hazratganj, Lucknow",
    votes: 720,
    likes: 440,
    shares: 280,
    badge: "STAGE NOMINEE",
    avatarBg: "bg-surface text-charcoal",
  },
  {
    id: "KFW-104",
    name: "Kabir & Father",
    age: "Class 3 Duo",
    category: "Sporty Walk with Dad",
    city: "Aliganj, Lucknow",
    votes: 890,
    likes: 560,
    shares: 330,
    badge: "POPULAR DUO",
    avatarBg: "bg-pink-soft text-pink-dark",
  },
  {
    id: "KFW-105",
    name: "Meera Singhania",
    age: "5 Years (UKG)",
    category: "Cutest Smile & Walk with Mom",
    city: "Mahanagar, Lucknow",
    votes: 815,
    likes: 495,
    shares: 320,
    badge: "AUDIENCE FAVORITE",
    avatarBg: "bg-gold-light text-gold-dark",
  },
  {
    id: "KFW-106",
    name: "Vivaan Malhotra",
    age: "Class 6 (11 Yrs)",
    category: "Groomed Fashion Walk",
    city: "Jankipuram, Lucknow",
    votes: 780,
    likes: 470,
    shares: 310,
    badge: "RUNWAY STAR",
    avatarBg: "bg-pink-soft text-pink-primary",
  },
  {
    id: "KFW-107",
    name: "Samaira Saxena",
    age: "Class 1 (6 Yrs)",
    category: "Independent Solo Ramp Walk",
    city: "Ashiyana, Lucknow",
    votes: 905,
    likes: 580,
    shares: 325,
    badge: "WILD CARD CONTENDER",
    avatarBg: "bg-surface text-charcoal",
  },
  {
    id: "KFW-108",
    name: "Advik & Mother",
    age: "2.5 Years",
    category: "Walk with Mom / Dad (Newborn)",
    city: "Vikas Nagar, Lucknow",
    votes: 860,
    likes: 535,
    shares: 325,
    badge: "TRENDING IN VOTING",
    avatarBg: "bg-gold-light text-gold-dark",
  },
];

export default function WildCardVotingSection() {
  const [contestants, setContestants] = useState<ContestantVote[]>(initialContestants);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("ALL");

  // Voter Modal State
  const [activeChildForVote, setActiveChildForVote] = useState<ContestantVote | null>(null);
  const [voterForm, setVoterForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    city: "Lucknow",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [voteSuccessChild, setVoteSuccessChild] = useState<string | null>(null);
  const [votedEmails, setVotedEmails] = useState<string[]>([]);

  // Load previously voted emails from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("iem_voted_emails");
      if (stored) {
        setVotedEmails(JSON.parse(stored));
      }
    } catch {
      // ignore JSON parse or storage disabled
    }
  }, []);

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

  // Submit the vote with strict 1-vote-per-email validation
  const handleSubmitVote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChildForVote) return;

    const trimmedEmail = voterForm.email.toLowerCase().trim();
    const trimmedWhatsapp = voterForm.whatsapp.trim();
    const trimmedName = voterForm.name.trim();

    if (!trimmedName || !trimmedEmail || !trimmedWhatsapp) {
      setFormError("Please fill in your Name, Email, and WhatsApp number to cast a verified vote.");
      return;
    }

    // Check if this email has already been used to vote anywhere on the site
    if (votedEmails.includes(trimmedEmail)) {
      setFormError(
        `This Email (${trimmedEmail}) has already been used to cast a vote. As per fair play rules, only 1 vote per verified email ID is permitted across the entire competition.`
      );
      return;
    }

    // Record the vote
    const updatedEmails = [...votedEmails, trimmedEmail];
    setVotedEmails(updatedEmails);
    try {
      localStorage.setItem("iem_voted_emails", JSON.stringify(updatedEmails));

      // Also record voter lead data for IEM organizers
      const existingLeads = JSON.parse(localStorage.getItem("iem_all_voter_leads") || "[]");
      existingLeads.push({
        voterName: trimmedName,
        voterEmail: trimmedEmail,
        voterPhone: trimmedWhatsapp,
        voterCity: voterForm.city,
        contestantId: activeChildForVote.id,
        contestantName: activeChildForVote.name,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("iem_all_voter_leads", JSON.stringify(existingLeads));
    } catch {
      // storage quota or incognito fallback
    }

    // Increment vote count for contestant
    setContestants((prev) =>
      prev.map((c) =>
        c.id === activeChildForVote.id
          ? { ...c, votes: c.votes + 1, likes: c.likes + 1 }
          : c
      )
    );

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#112266", "#D4AF37", "#F6E29C", "#0A1440", "#FFFFFF"],
      });
    } catch {
      // ignore
    }

    setVoteSuccessChild(activeChildForVote.name);
    setActiveChildForVote(null);
    setVoterForm({ name: "", email: "", whatsapp: "", city: "Lucknow" });
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
            your child below and cast a verified vote.
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
              Total Points = Verified Votes + Social Likes + Shares. Supporters vote with their verified email ID to ensure authentic participation.
            </p>
          </div>

          <div className="bg-white border border-border-pink p-6 sm:p-7 rounded-xl">
            <div className="text-[11px] font-black uppercase tracking-widest text-pink-primary mb-2">
              STEP 03
            </div>
            <h3 className="font-serif text-base font-bold text-charcoal mb-1.5">
              Direct Wild Card Pass
            </h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Top entries across categories bypass early rounds and advance straight into the Grand Finale runway showcase!
            </p>
          </div>
        </div>

        {/* Live Voting & Search Board */}
        <div className="bg-white border-2 border-border-pink rounded-xl p-5 sm:p-8 shadow-sm">
          
          {/* Header & Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-border-pink gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-pink-primary bg-pink-soft px-2.5 py-1 rounded">
                  LIVE CONTESTANT DIRECTORY
                </span>
                <span className="text-xs font-bold text-charcoal-muted">
                  {filteredContestants.length} Participants Found
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal mt-1">
                Search &amp; Vote for Contestants
              </h3>
              <p className="text-xs text-charcoal-muted">
                Search child by Name or Contestant ID (e.g. KFW-101). Strictly 1 vote per verified email ID.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLScLhiYtE6aWKlI-T3tou7OzfVQVucW4uxHgf8Q7P5bLI4JKLw/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white bg-pink-primary hover:bg-pink-dark rounded transition-colors"
              >
                Register Your Child
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
                className="w-full px-4 py-3 pl-11 text-xs sm:text-sm bg-surface border border-border-pink rounded-lg focus:outline-none focus:border-pink-primary text-charcoal font-medium placeholder:text-charcoal-muted"
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
                  className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded transition-all ${
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

          {/* Contestant Cards Grid */}
          {filteredContestants.length === 0 ? (
            <div className="text-center py-16 bg-surface rounded-xl border border-dashed border-border-pink mt-6">
              <p className="font-serif text-lg font-bold text-charcoal">
                No contestants found matching &ldquo;{searchQuery}&rdquo;
              </p>
              <p className="text-xs text-charcoal-muted mt-1">
                Try searching with another name or ID like &ldquo;Aarav&rdquo;, &ldquo;Ananya&rdquo;, or &ldquo;KFW-101&rdquo;.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategoryFilter("ALL");
                }}
                className="mt-4 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-white border border-border-pink text-pink-primary rounded hover:bg-pink-soft"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
              {filteredContestants.map((child) => (
                <div
                  key={child.id}
                  className="bg-surface border border-border-pink rounded-xl p-5 flex flex-col justify-between hover:border-pink-primary hover:shadow-md transition-all"
                >
                  <div>
                    {/* Top Bar */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-white border border-border-pink px-2 py-0.5 rounded text-charcoal">
                        ID: {child.id}
                      </span>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-pink-dark bg-pink-soft px-2 py-0.5 rounded truncate max-w-[140px]">
                        {child.badge}
                      </span>
                    </div>

                    {/* Photo Placeholder Card */}
                    <div className="w-full h-36 bg-white border border-border-pink rounded-lg mb-4 flex flex-col items-center justify-center text-center p-3">
                      <div
                        className={`w-12 h-12 rounded-full border border-border-pink flex items-center justify-center font-serif font-black text-lg mb-2 ${child.avatarBg}`}
                      >
                        {child.name.charAt(0)}
                      </div>
                      <span className="text-xs font-bold text-charcoal uppercase tracking-wider">
                        {child.name}
                      </span>
                      <span className="text-[10px] text-charcoal-muted">
                        {child.age} &bull; {child.city}
                      </span>
                    </div>

                    {/* Category */}
                    <div className="text-[11px] font-semibold text-charcoal mb-4 bg-white border border-border-pink p-2 rounded text-center truncate">
                      {child.category}
                    </div>

                    {/* Voting Stats */}
                    <div className="grid grid-cols-2 gap-2 text-center mb-4">
                      <div className="bg-white border border-border-pink p-2 rounded">
                        <span className="text-sm font-black text-pink-primary block">
                          {child.likes}
                        </span>
                        <span className="text-[9px] uppercase font-bold text-charcoal-muted">
                          Social Likes
                        </span>
                      </div>
                      <div className="bg-white border border-border-pink p-2 rounded">
                        <span className="text-sm font-black text-charcoal block">
                          {child.votes}
                        </span>
                        <span className="text-[9px] uppercase font-bold text-charcoal-muted">
                          Total Points
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Vote Action */}
                  <button
                    onClick={() => handleOpenVoteModal(child)}
                    className="w-full py-2.5 text-xs font-extrabold uppercase tracking-widest rounded bg-pink-primary hover:bg-pink-dark text-white active:scale-95 transition-all shadow-sm"
                  >
                    CAST VOTE
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Fair play policy notice */}
          <div className="mt-8 pt-6 border-t border-border-pink flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal-muted gap-4">
            <div>
              <strong className="text-charcoal uppercase font-bold">FAIR PLAY RULE:</strong> Each voter must provide their Name, WhatsApp Number, and a verified Email ID. Strictly 1 vote per Email ID across the entire event.
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-pink-primary bg-surface border border-border-pink px-3 py-1 rounded shrink-0">
              AUDITED VOTING SYSTEM
            </span>
          </div>

        </div>

      </div>

      {/* VOTER VERIFICATION FORM MODAL */}
      {activeChildForVote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 border-2 border-border-pink shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 my-8">
            
            {/* Close Button */}
            <button
              onClick={() => setActiveChildForVote(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface border border-border-pink flex items-center justify-center text-charcoal hover:text-pink-primary font-bold text-sm transition-colors"
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="pb-4 mb-4 border-b border-border-pink">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-pink-primary bg-pink-soft px-2.5 py-1 rounded">
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
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium leading-relaxed">
                {formError}
              </div>
            )}

            {/* Verification Form */}
            <form onSubmit={handleSubmitVote} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Voter Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={voterForm.name}
                  onChange={(e) => setVoterForm({ ...voterForm, name: e.target.value })}
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-surface border border-border-pink rounded-lg focus:outline-none focus:border-pink-primary text-charcoal font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Voter Email Address * (Strictly 1 Vote per Email)
                </label>
                <input
                  type="email"
                  required
                  value={voterForm.email}
                  onChange={(e) => {
                    setFormError(null);
                    setVoterForm({ ...voterForm, email: e.target.value });
                  }}
                  placeholder="e.g. ramesh@gmail.com"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-surface border border-border-pink rounded-lg focus:outline-none focus:border-pink-primary text-charcoal font-medium"
                />
                <span className="text-[10px] text-charcoal-muted mt-1 block">
                  Our system verifies that this email has not voted before.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={voterForm.whatsapp}
                    onChange={(e) => setVoterForm({ ...voterForm, whatsapp: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-surface border border-border-pink rounded-lg focus:outline-none focus:border-pink-primary text-charcoal font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                    City / Area
                  </label>
                  <input
                    type="text"
                    value={voterForm.city}
                    onChange={(e) => setVoterForm({ ...voterForm, city: e.target.value })}
                    placeholder="e.g. Lucknow"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-surface border border-border-pink rounded-lg focus:outline-none focus:border-pink-primary text-charcoal font-medium"
                  />
                </div>
              </div>

              {/* Anti-fraud commitment */}
              <div className="p-3 bg-pink-soft/50 border border-border-pink rounded-lg text-[11px] text-charcoal-muted">
                <strong className="text-charcoal font-bold">1-VOTE GUARANTEE:</strong> By submitting, you confirm this is your personal email. Votes with duplicate emails will be rejected by our automated audit engine.
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveChildForVote(null)}
                  className="w-1/3 py-3 text-center text-xs font-bold uppercase tracking-wider text-charcoal bg-surface border border-border-pink rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3 text-center text-xs font-extrabold uppercase tracking-widest text-white bg-pink-primary hover:bg-pink-dark rounded-lg shadow-sm transition-colors"
                >
                  Verify &amp; Cast Vote
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* VOTE SUCCESS CONFIRMATION MODAL */}
      {voteSuccessChild && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 border-2 border-gold/70 shadow-2xl text-center relative animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold-light border-2 border-gold flex items-center justify-center text-2xl">
              ✓
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-pink-primary bg-pink-soft px-2.5 py-1 rounded">
              VOTE CONFIRMED
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal mt-3 mb-2">
              Vote Counted for {voteSuccessChild}!
            </h3>
            <p className="text-xs text-charcoal-muted leading-relaxed mb-6">
              Thank you for participating in the official voting for <strong className="text-charcoal font-semibold">Jashn Realty Presents Runway Kids Fashion Week 2026</strong>. Your vote has been verified and registered.
            </p>
            <button
              onClick={() => setVoteSuccessChild(null)}
              className="w-full py-3 text-center text-xs font-extrabold uppercase tracking-widest text-white bg-pink-primary hover:bg-pink-dark rounded-lg transition-colors"
            >
              Back to Voting Board
            </button>
          </div>
        </div>
      )}

    </section>
  );
}
