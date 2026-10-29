"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";

export default function VisitorLeadCaptureModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [visitorData, setVisitorData] = useState({
    fullName: "",
    whatsapp: "",
    email: "",
    city: "Lucknow",
    role: "Parent of Aspiring Child",
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Check if visitor has already filled or dismissed the capture modal
    try {
      const alreadyCaptured = localStorage.getItem("iem_visitor_captured");
      const alreadyDismissed = sessionStorage.getItem("iem_visitor_dismissed");
      if (alreadyCaptured || alreadyDismissed) {
        return;
      }

      const openModalGracefully = () => {
        // Wait 1.2s after intro transition has fully exited screen
        setTimeout(() => {
          setIsOpen(true);
        }, 1200);
      };

      // If intro has already completed previously in this session
      if (sessionStorage.getItem("iem_intro_finished") === "true") {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 2000);
        return () => clearTimeout(timer);
      }

      // Listen for the custom event fired when the intro animation and loader finish
      window.addEventListener("iem_intro_completed", openModalGracefully, { once: true });

      // Fallback timer (8.5s) to guarantee popup only appears after the 7.3s loader
      const fallbackTimer = setTimeout(() => {
        setIsOpen(true);
      }, 8500);

      return () => {
        window.removeEventListener("iem_intro_completed", openModalGracefully);
        clearTimeout(fallbackTimer);
      };
    } catch {
      // In case localStorage is blocked in private/restricted mode
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = visitorData.fullName.trim();
    const trimmedWhatsapp = visitorData.whatsapp.trim();
    const trimmedEmail = visitorData.email.trim();

    if (!trimmedName || !trimmedWhatsapp || !trimmedEmail) {
      setErrorMsg("Please fill in your Name, WhatsApp number, and Email.");
      return;
    }

    try {
      const existingLeads = JSON.parse(localStorage.getItem("iem_visitor_leads") || "[]");
      existingLeads.push({
        name: trimmedName,
        whatsapp: trimmedWhatsapp,
        email: trimmedEmail,
        city: visitorData.city,
        role: visitorData.role,
        timestamp: new Date().toISOString(),
        source: "Landing Page Instant Capture",
      });
      localStorage.setItem("iem_visitor_leads", JSON.stringify(existingLeads));
      localStorage.setItem("iem_visitor_captured", "true");
    } catch {
      // ignore
    }

    // Confetti celebration
    try {
      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#112266", "#D4AF37", "#F6E29C", "#FFFFFF"],
      });
    } catch {
      // ignore
    }

    setIsSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
    }, 2800);
  };

  const handleDismiss = () => {
    try {
      // Remember dismissal for session to avoid repeating on every reload
      sessionStorage.setItem("iem_visitor_dismissed", "true");
    } catch {
      // ignore
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 border-2 border-gold/70 shadow-2xl relative my-auto">
        
        {/* Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface border border-border-pink flex items-center justify-center text-charcoal hover:text-pink-primary font-bold text-sm transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        {!isSubmitted ? (
          <div>
            {/* Super Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface border border-gold/60 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-pink-primary mb-3">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
              JASHN REALTY &bull; OFFICIAL VISITOR ACCESS
            </div>

            {/* Modal Heading */}
            <h2 className="font-serif text-xl sm:text-2xl font-black text-charcoal uppercase tracking-tight leading-tight">
              Welcome to Jashn Realty Presents Runway Kids Fashion Week
            </h2>
            <p className="mt-2 text-xs text-charcoal-muted leading-relaxed">
              Register below to receive official audition invites, candidate voting alerts, VIP attendee passes, and event updates directly on your WhatsApp.
            </p>

            {/* Error Message */}
            {errorMsg && (
              <div className="mt-3 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
                {errorMsg}
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={visitorData.fullName}
                  onChange={(e) => setVisitorData({ ...visitorData, fullName: e.target.value })}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-surface border border-border-pink rounded-lg focus:outline-none focus:border-pink-primary text-charcoal font-medium placeholder:text-charcoal-muted"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={visitorData.whatsapp}
                    onChange={(e) => setVisitorData({ ...visitorData, whatsapp: e.target.value })}
                    placeholder="e.g. 98765 43210"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-surface border border-border-pink rounded-lg focus:outline-none focus:border-pink-primary text-charcoal font-medium placeholder:text-charcoal-muted"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                    City / Area
                  </label>
                  <input
                    type="text"
                    value={visitorData.city}
                    onChange={(e) => setVisitorData({ ...visitorData, city: e.target.value })}
                    placeholder="e.g. Lucknow"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-surface border border-border-pink rounded-lg focus:outline-none focus:border-pink-primary text-charcoal font-medium placeholder:text-charcoal-muted"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={visitorData.email}
                  onChange={(e) => setVisitorData({ ...visitorData, email: e.target.value })}
                  placeholder="e.g. priya@gmail.com"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-surface border border-border-pink rounded-lg focus:outline-none focus:border-pink-primary text-charcoal font-medium placeholder:text-charcoal-muted"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  I am interested as:
                </label>
                <select
                  value={visitorData.role}
                  onChange={(e) => setVisitorData({ ...visitorData, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-surface border border-border-pink rounded-lg focus:outline-none focus:border-pink-primary text-charcoal font-medium"
                >
                  <option value="Parent of Aspiring Child">Parent of Aspiring Child (Nomination)</option>
                  <option value="Supporter / Voter">Family Member / Voter</option>
                  <option value="Fashion / Media Professional">Media &amp; Press Professional</option>
                  <option value="Brand Partner / Sponsor">Brand Sponsor &amp; Partner</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full py-3.5 text-center text-xs font-extrabold uppercase tracking-widest text-white bg-pink-primary hover:bg-pink-dark rounded-lg shadow-md transition-all active:scale-[0.99]"
                >
                  Get VIP Updates &amp; Enter Portal
                </button>
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="w-full py-2 text-center text-[11px] font-bold uppercase tracking-wider text-charcoal-muted hover:text-charcoal transition-colors"
                >
                  Browse website directly &rarr;
                </button>
              </div>

              <div className="pt-2 border-t border-border-pink text-center text-[10px] text-charcoal-muted">
                1st Audition: 01 Nov @ Jashn Realty &bull; Free Nomination &bull; Organised by IEM &times; AdOnMo
              </div>
            </form>
          </div>
        ) : (
          /* Submission Confirmation */
          <div className="text-center py-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold-light border-2 border-gold flex items-center justify-center text-2xl font-bold text-gold-dark">
              ✓
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-pink-primary bg-pink-soft px-2.5 py-1 rounded">
              ACCESS GRANTED
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal mt-3 mb-2">
              Welcome, {visitorData.fullName}!
            </h3>
            <p className="text-xs text-charcoal-muted leading-relaxed mb-6">
              Your contact details have been successfully recorded with the Institute of Event Management (IEM). Exclusive updates and audition schedule details will be sent to your WhatsApp ({visitorData.whatsapp}).
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-3 text-center text-xs font-extrabold uppercase tracking-widest text-white bg-pink-primary hover:bg-pink-dark rounded-lg transition-colors"
            >
              Continue Exploring Website
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
