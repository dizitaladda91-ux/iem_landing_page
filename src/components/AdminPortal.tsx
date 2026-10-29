"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

interface Candidate {
  id: string;
  name: string;
  age: string;
  category: string;
  city: string;
  imageUrl: string;
  badge: string;
  bio?: string;
  votes: number;
  likes: number;
  shares: number;
  isActive: boolean;
  createdAt: string;
}

interface VoteLead {
  id: string;
  contestantId: string;
  contestantName: string;
  voterName: string;
  voterPhone: string;
  voterEmail: string;
  voterCity?: string;
  timestamp: string;
}

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  category: string;
  user: string;
  description: string;
  details?: string;
  ip?: string;
}

interface Stats {
  totalCandidates: number;
  activeCandidates: number;
  totalVotes: number;
  totalVerifiedLeads: number;
  uniqueVotersCount: number;
  totalLogsCount?: number;
  leadingCandidate: Candidate | null;
  dbMode: string;
}

const CATEGORIES = [
  "Walk with Mom / Dad (Newborn)",
  "Independent Solo Ramp Walk",
  "Groomed Fashion Walk",
  "Sporty Walk with Dad",
  "Cutest Smile & Walk with Mom",
];

const AGE_PRESETS = [
  "1.5 - 2 Yrs (Toddler)",
  "4 - 5 Yrs (Kindergarten)",
  "6 - 7 Yrs (Class 1-2)",
  "8 - 9 Yrs (Class 3-4)",
  "10 - 12 Yrs (Junior)",
];

const BADGES = [
  "WILD CARD CONTENDER",
  "TRENDING IN VOTING",
  "STAGE NOMINEE",
  "POPULAR DUO",
  "AUDIENCE FAVORITE",
  "RUNWAY STAR",
];

const SAMPLE_AVATARS = [
  { label: "Doctor Kid", url: "/images/bareilly-doctor-kid.jpg" },
  { label: "Solo Ramp Girl", url: "/images/bareilly-solo-girl.jpg" },
  { label: "Traditional Walk", url: "/images/bareilly-traditional-walk.jpg" },
  { label: "Mom & Son Duo", url: "/images/bareilly-rampwalk-mom-son.jpg" },
  { label: "Category 1 Star", url: "/images/category-1.jpg" },
  { label: "Category 2 Fashion", url: "/images/category-2.jpg" },
  { label: "Category 3 Charm", url: "/images/category-3.jpg" },
];

export default function AdminPortal() {
  // -------------------------------------------------------------
  // Single-Tab Enforcement State
  // -------------------------------------------------------------
  const tabIdRef = useRef<string>(
    typeof window !== "undefined"
      ? "tab_" + Math.random().toString(36).substring(2, 8) + "_" + Date.now().toString().slice(-4)
      : "tab_init"
  );
  const [tabLockState, setTabLockState] = useState<"ACTIVE" | "BLOCKED" | "TAKEOVER">("ACTIVE");
  const channelRef = useRef<BroadcastChannel | null>(null);

  // -------------------------------------------------------------
  // Auth & Session State
  // -------------------------------------------------------------
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentAdminUser, setCurrentAdminUser] = useState<string>("admin");
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // -------------------------------------------------------------
  // Navigation Tabs: "cards" | "leads" | "logs"
  // -------------------------------------------------------------
  const [activeTab, setActiveTab] = useState<"cards" | "leads" | "logs">("cards");

  // -------------------------------------------------------------
  // Data States
  // -------------------------------------------------------------
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [leads, setLeads] = useState<VoteLead[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingData, setLoadingData] = useState(false);

  // Filters & Search
  const [candidateSearch, setCandidateSearch] = useState("");
  const [candidateCategoryFilter, setCandidateCategoryFilter] = useState("ALL");
  const [leadsSearch, setLeadsSearch] = useState("");
  const [leadsCandidateFilter, setLeadsCandidateFilter] = useState("ALL");
  const [logsSearch, setLogsSearch] = useState("");
  const [logsCategoryFilter, setLogsCategoryFilter] = useState("ALL");

  // Add / Edit Candidate Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [candidateForm, setCandidateForm] = useState({
    name: "",
    age: AGE_PRESETS[0],
    category: CATEGORIES[0],
    city: "Lucknow",
    imageUrl: SAMPLE_AVATARS[0].url,
    badge: BADGES[0],
    bio: "",
    initialVotes: 0,
    isActive: true,
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Cloudinary / File Upload
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick Notification Banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // -------------------------------------------------------------
  // 1. Single-Tab Allowance & Cross-Tab Lock Engine
  // -------------------------------------------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;

    const myTabId = tabIdRef.current;
    let heartbeatTimer: NodeJS.Timeout | null = null;

    // Initialize BroadcastChannel
    try {
      const channel = new BroadcastChannel("iem_portal_tab_lock");
      channelRef.current = channel;

      channel.onmessage = (event) => {
        const data = event.data;
        if (!data) return;

        // Another tab claims the session
        if (data.type === "CLAIM_SESSION" && data.tabId !== myTabId) {
          setTabLockState("TAKEOVER");
        }

        // Another tab pings to see if someone is active
        if (data.type === "PING_TAB" && data.tabId !== myTabId) {
          if (tabLockState === "ACTIVE") {
            channel.postMessage({ type: "PONG_TAB", tabId: myTabId });
          }
        }

        // Response from an already active tab
        if (data.type === "PONG_TAB" && data.tabId !== myTabId) {
          setTabLockState("BLOCKED");
        }

        // Logout triggered in another tab
        if (data.type === "LOGOUT_ALL") {
          setIsAuthenticated(false);
          setTabLockState("ACTIVE");
        }
      };

      // Check current lock in localStorage
      const activeTabId = localStorage.getItem("iem_portal_active_tab_id");
      const lastHeartbeat = parseInt(localStorage.getItem("iem_portal_tab_heartbeat") || "0", 10);
      const now = Date.now();

      // If another tab was active within last 3.5 seconds
      if (activeTabId && activeTabId !== myTabId && now - lastHeartbeat < 3500) {
        setTabLockState("BLOCKED");
        channel.postMessage({ type: "PING_TAB", tabId: myTabId });
      } else {
        // Claim active tab
        claimTabLock(myTabId);
      }

      // Start periodic heartbeat
      heartbeatTimer = setInterval(() => {
        const currentActive = localStorage.getItem("iem_portal_active_tab_id");
        if (currentActive === myTabId) {
          localStorage.setItem("iem_portal_tab_heartbeat", Date.now().toString());
        }
      }, 1500);

      // Handle window close
      const handleUnload = () => {
        const currentActive = localStorage.getItem("iem_portal_active_tab_id");
        if (currentActive === myTabId) {
          localStorage.removeItem("iem_portal_active_tab_id");
          localStorage.removeItem("iem_portal_tab_heartbeat");
          channel.postMessage({ type: "TAB_CLOSED", tabId: myTabId });
        }
      };

      window.addEventListener("beforeunload", handleUnload);

      return () => {
        if (heartbeatTimer) clearInterval(heartbeatTimer);
        window.removeEventListener("beforeunload", handleUnload);
        channel.close();
      };
    } catch (err) {
      console.warn("BroadcastChannel not supported in this environment:", err);
    }
  }, []);

  // Helper to claim lock
  const claimTabLock = (myTabId: string) => {
    localStorage.setItem("iem_portal_active_tab_id", myTabId);
    localStorage.setItem("iem_portal_tab_heartbeat", Date.now().toString());
    setTabLockState("ACTIVE");
    if (channelRef.current) {
      channelRef.current.postMessage({ type: "CLAIM_SESSION", tabId: myTabId });
    }
  };

  // User manually clicks "Take Over Session Here"
  const handleTakeOverSession = async () => {
    const myTabId = tabIdRef.current;
    claimTabLock(myTabId);

    // Record audit log for takeover
    try {
      await fetch("/api/admin/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SESSION_TAKEOVER",
          category: "SECURITY",
          description: `Admin took over single active portal session in Tab ID: ${myTabId}`,
          details: "Previous tab locked by mutual exclusion policy.",
        }),
      });
    } catch {
      // ignore
    }

    showToast("Session claimed successfully! This tab is now the active portal.");
  };

  // -------------------------------------------------------------
  // 2. Auth Check & Handlers
  // -------------------------------------------------------------
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setIsAuthenticated(true);
        if (data.user) setCurrentAdminUser(data.user);
        loadDashboardData();
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();

      if (res.ok) {
        setIsAuthenticated(true);
        setCurrentAdminUser(data.username || "admin");
        claimTabLock(tabIdRef.current);
        loadDashboardData();
        showToast("JWT Authenticated successfully. Single-tab session activated.");
      } else {
        setLoginError(data.error || "Authentication failed. Check your ID & Password.");
      }
    } catch {
      setLoginError("Failed to connect to authentication server.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      // Broadcast logout to all tabs
      if (channelRef.current) {
        channelRef.current.postMessage({ type: "LOGOUT_ALL" });
      }
      localStorage.removeItem("iem_portal_active_tab_id");
      localStorage.removeItem("iem_portal_tab_heartbeat");
      setIsAuthenticated(false);
      showToast("Session ended. JWT revoked across all tabs.");
    }
  };

  // -------------------------------------------------------------
  // 3. Load Data & Audit Logs
  // -------------------------------------------------------------
  const loadDashboardData = async () => {
    setLoadingData(true);
    try {
      // 1. Candidates
      const candRes = await fetch("/api/candidates?includeInactive=true");
      if (candRes.ok) {
        const candData = await candRes.json();
        setCandidates(candData.candidates || []);
      }

      // 2. Leads & Stats
      const leadsRes = await fetch("/api/admin/leads");
      if (leadsRes.ok) {
        const leadsData = await leadsRes.json();
        setLeads(leadsData.leads || []);
        setStats(leadsData.stats || null);
      }

      // 3. Audit Logs
      const logsRes = await fetch("/api/admin/logs?limit=250");
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setLogs(logsData.logs || []);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoadingData(false);
    }
  };

  // -------------------------------------------------------------
  // 4. Easy Candidate Addition & Cloudinary Upload
  // -------------------------------------------------------------
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadMessage("Uploading photo to Cloudinary...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setCandidateForm((prev) => ({ ...prev, imageUrl: data.url }));
        setUploadMessage(
          data.storage === "cloudinary"
            ? "✓ Photo uploaded to Cloudinary successfully!"
            : "✓ Photo saved locally! (Add Cloudinary keys to .env for cloud storage)"
        );
      } else {
        setUploadMessage(`Upload failed: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      setUploadMessage(`Upload failed: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  // Autofill Demo Contestant
  const handleAutofillDemo = () => {
    const demoNames = ["Advait Kapoor", "Shanaya Tandon", "Reyansh Singhal", "Tara Mehra", "Yuvaan Roy"];
    const randomName = demoNames[Math.floor(Math.random() * demoNames.length)];
    const randomAvatar = SAMPLE_AVATARS[Math.floor(Math.random() * SAMPLE_AVATARS.length)];
    const randomAge = AGE_PRESETS[Math.floor(Math.random() * AGE_PRESETS.length)];
    const randomCat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const randomBadge = BADGES[Math.floor(Math.random() * BADGES.length)];

    setCandidateForm({
      name: randomName,
      age: randomAge,
      category: randomCat,
      city: "Lucknow",
      imageUrl: randomAvatar.url,
      badge: randomBadge,
      bio: "High energy, natural stage presence, and charming smile for the runway!",
      initialVotes: Math.floor(Math.random() * 25) + 5,
      isActive: true,
    });
    setFormError("");
    setFormSuccess("✓ Demo contestant details populated! Click 'Save Candidate Card' to publish.");
  };

  const openAddModal = () => {
    setEditingCandidate(null);
    setCandidateForm({
      name: "",
      age: AGE_PRESETS[1],
      category: CATEGORIES[0],
      city: "Lucknow",
      imageUrl: SAMPLE_AVATARS[0].url,
      badge: BADGES[0],
      bio: "",
      initialVotes: 0,
      isActive: true,
    });
    setFormError("");
    setFormSuccess("");
    setUploadMessage("");
    setIsModalOpen(true);
  };

  const openEditModal = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setCandidateForm({
      name: candidate.name,
      age: candidate.age,
      category: candidate.category,
      city: candidate.city,
      imageUrl: candidate.imageUrl,
      badge: candidate.badge,
      bio: candidate.bio || "",
      initialVotes: candidate.votes,
      isActive: candidate.isActive,
    });
    setFormError("");
    setFormSuccess("");
    setUploadMessage("");
    setIsModalOpen(true);
  };

  const handleCandidateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!candidateForm.name.trim() || !candidateForm.age.trim()) {
      setFormError("Child's Name and Age are required fields.");
      return;
    }

    setFormSubmitting(true);

    try {
      const url = editingCandidate
        ? `/api/candidates/${editingCandidate.id}`
        : "/api/candidates";
      const method = editingCandidate ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(candidateForm),
      });

      const data = await res.json();

      if (res.ok) {
        showToast(
          editingCandidate
            ? `Contestant ${editingCandidate.id} updated successfully.`
            : `New contestant card created for ${candidateForm.name}!`
        );
        setIsModalOpen(false);
        loadDashboardData();
      } else {
        setFormError(data.error || "Failed to save contestant card.");
      }
    } catch {
      setFormError("Network error while saving candidate.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleToggleActive = async (candidate: Candidate) => {
    try {
      const res = await fetch(`/api/candidates/${candidate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !candidate.isActive }),
      });
      if (res.ok) {
        setCandidates((prev) =>
          prev.map((c) => (c.id === candidate.id ? { ...c, isActive: !c.isActive } : c))
        );
        showToast(`Card ${candidate.id} visibility toggled to ${!candidate.isActive ? "ACTIVE" : "HIDDEN"}.`);
        loadDashboardData();
      }
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  const handleDeleteCandidate = async (candidate: Candidate) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${candidate.name} (${candidate.id})? This will remove the card and its ${candidate.votes} votes.`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/candidates/${candidate.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCandidates((prev) => prev.filter((c) => c.id !== candidate.id));
        showToast(`Contestant ${candidate.name} was removed.`);
        loadDashboardData();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete candidate.");
      }
    } catch {
      alert("Network error deleting candidate.");
    }
  };

  // -------------------------------------------------------------
  // 5. CSV Exports (Leads & Logs)
  // -------------------------------------------------------------
  const exportLeadsToCSV = () => {
    if (leads.length === 0) {
      alert("No voter leads found to export.");
      return;
    }

    const headers = [
      "Lead ID",
      "Contestant ID",
      "Contestant Name",
      "Voter Name",
      "Voter Phone / WhatsApp",
      "Voter Email",
      "City",
      "Timestamp (IST)",
    ];

    const rows = leads.map((lead) => [
      `"${lead.id}"`,
      `"${lead.contestantId}"`,
      `"${lead.contestantName.replace(/"/g, '""')}"`,
      `"${lead.voterName.replace(/"/g, '""')}"`,
      `"${lead.voterPhone}"`,
      `"${lead.voterEmail}"`,
      `"${(lead.voterCity || "Lucknow").replace(/"/g, '""')}"`,
      `"${new Date(lead.timestamp).toLocaleString("en-IN")}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Runway_Voter_Leads_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Voter leads exported to CSV successfully.");
  };

  const exportLogsToCSV = () => {
    if (logs.length === 0) {
      alert("No audit logs found to export.");
      return;
    }

    const headers = ["Log ID", "Timestamp (IST)", "Action", "Category", "User", "Description", "Details", "IP Address"];
    const rows = logs.map((log) => [
      `"${log.id}"`,
      `"${new Date(log.timestamp).toLocaleString("en-IN")}"`,
      `"${log.action}"`,
      `"${log.category}"`,
      `"${log.user.replace(/"/g, '""')}"`,
      `"${log.description.replace(/"/g, '""')}"`,
      `"${(log.details || "").replace(/"/g, '""')}"`,
      `"${log.ip || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Runway_Audit_Logs_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Audit logs exported to CSV.");
  };

  const handleClearLogs = async () => {
    const confirmClear = window.confirm("Are you sure you want to clear the audit logs history?");
    if (!confirmClear) return;

    try {
      const res = await fetch("/api/admin/logs", { method: "DELETE" });
      if (res.ok) {
        showToast("Audit logs cleared.");
        loadDashboardData();
      }
    } catch {
      alert("Failed to clear audit logs.");
    }
  };

  // -------------------------------------------------------------
  // Filtered Lists
  // -------------------------------------------------------------
  const filteredCandidates = candidates.filter((c) => {
    const q = candidateSearch.toLowerCase().trim();
    const matchesSearch =
      q === "" ||
      c.name.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q);
    const matchesCategory =
      candidateCategoryFilter === "ALL" || c.category === candidateCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredLeads = leads.filter((l) => {
    const q = leadsSearch.toLowerCase().trim();
    const matchesSearch =
      q === "" ||
      l.voterPhone.includes(q) ||
      l.voterEmail.toLowerCase().includes(q) ||
      l.voterName.toLowerCase().includes(q) ||
      l.contestantName.toLowerCase().includes(q) ||
      l.contestantId.toLowerCase().includes(q);
    const matchesCand =
      leadsCandidateFilter === "ALL" || l.contestantId === leadsCandidateFilter;
    return matchesSearch && matchesCand;
  });

  const filteredLogs = logs.filter((log) => {
    const q = logsSearch.toLowerCase().trim();
    const matchesSearch =
      q === "" ||
      log.description.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.user.toLowerCase().includes(q) ||
      (log.details && log.details.toLowerCase().includes(q));
    const matchesCategory =
      logsCategoryFilter === "ALL" || log.category === logsCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // -------------------------------------------------------------
  // Render: Single-Tab Lock Screen Overlay (if blocked or taken over)
  // -------------------------------------------------------------
  if (tabLockState === "BLOCKED" || tabLockState === "TAKEOVER") {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-slate-900 border border-gold/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gold/10 border border-gold/40 flex items-center justify-center text-3xl">
            🔒
          </div>
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gold/20 text-gold border border-gold/50 mb-2">
              Single-Tab Mutual Exclusion Active
            </span>
            <h2 className="font-serif text-2xl font-black text-white">
              {tabLockState === "TAKEOVER"
                ? "Session Terminated in This Tab"
                : "Portal Active in Another Tab"}
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {tabLockState === "TAKEOVER"
                ? "The Runway Admin Portal was opened or claimed in another tab/window. For security and to prevent data collision, this tab has been locked."
                : "Runway Admin Portal is already running in another tab. Security policy enforces exactly one active administrative session."}
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-400 space-y-1 text-left font-mono">
            <div>Current Tab ID: <span className="text-slate-200">{tabIdRef.current}</span></div>
            <div>Protection: <span className="text-emerald-400">HS256 JWT &amp; Tab Lock Heartbeat</span></div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleTakeOverSession}
              className="w-full py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider text-charcoal bg-gold hover:bg-gold-light transition shadow-lg cursor-pointer"
            >
              ⚡ Take Over Session Here
            </button>
            <Link
              href="/#voting"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
            >
              Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Render: Loading Auth Check
  // -------------------------------------------------------------
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-pink-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold uppercase tracking-wider text-charcoal-muted">
            Verifying JWT Security Session...
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Render: Login Screen (if unauthenticated)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal">
            Jashn Realty Presents &bull; Admin Engine
          </span>
          <h1 className="font-serif text-3xl font-black text-pink-primary uppercase tracking-tight">
            Runway Portal
          </h1>
          <p className="text-xs text-charcoal-muted">
            HS256 JWT Protected &bull; Single-Tab Enforced Session
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-border-pink shadow-lg space-y-6">
            <div className="bg-pink-soft/40 border border-border-pink rounded-xl p-3.5 text-xs text-charcoal leading-relaxed">
              <strong className="block font-bold text-pink-primary mb-1">🔐 System Access</strong>
              Credentials are authenticated against your <code className="bg-white px-1 py-0.5 rounded text-[11px] font-mono">.env.local</code> (Default: <code className="font-mono">admin</code> / <code className="font-mono">jashn@runway2026</code>).
            </div>

            {loginError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Admin User ID
                </label>
                <input
                  type="text"
                  required
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  placeholder="e.g. admin"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-surface border border-border-pink rounded-xl focus:outline-none focus:border-pink-primary text-charcoal font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Admin Password
                </label>
                <input
                  type="password"
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-surface border border-border-pink rounded-xl focus:outline-none focus:border-pink-primary text-charcoal font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-pink-primary hover:bg-pink-dark transition shadow-md cursor-pointer disabled:opacity-50"
              >
                {loginLoading ? "Verifying JWT..." : "Sign In to Admin Portal →"}
              </button>
            </form>

            <div className="pt-2 text-center border-t border-border-pink">
              <Link
                href="/#voting"
                className="text-xs font-bold text-pink-primary hover:underline"
              >
                ← Back to Public Voting Section
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Render: Authenticated Dashboard
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-surface flex flex-col text-charcoal">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-charcoal text-white px-5 py-3 rounded-2xl shadow-2xl border border-gold/40 text-xs font-bold flex items-center gap-3 animate-fade-in">
          <span>⚡</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="bg-white border-b border-border-pink sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <Link href="/" className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-widest text-charcoal">
                Jashn Realty Presents
              </span>
              <span className="font-serif font-black text-lg sm:text-xl text-pink-primary uppercase leading-tight">
                Runway Admin Portal
              </span>
            </Link>

            <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Single-Tab Protected</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {stats && (
              <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-surface border border-border-pink text-charcoal-muted">
                <span>{stats.dbMode}</span>
              </span>
            )}

            <Link
              href="/#voting"
              target="_blank"
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-pink-primary bg-surface border border-border-pink hover:bg-pink-soft transition"
            >
              Public Voting ↗
            </Link>

            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition cursor-pointer"
            >
              Logout &amp; End Session
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-border-pink shadow-xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-charcoal-muted block mb-1">
                Contestants
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl sm:text-3xl font-black text-pink-primary">
                  {stats.totalCandidates}
                </span>
                <span className="text-xs text-charcoal-muted">({stats.activeCandidates} active)</span>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-border-pink shadow-xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-charcoal-muted block mb-1">
                Verified Voter Leads
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl sm:text-3xl font-black text-navy">
                  {stats.totalVerifiedLeads}
                </span>
                <span className="text-xs text-charcoal-muted">Phone/Email verified</span>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-border-pink shadow-xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-charcoal-muted block mb-1">
                Total Votes Cast
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl sm:text-3xl font-black text-charcoal">
                  {stats.totalVotes}
                </span>
                <span className="text-xs text-charcoal-muted">Across all kids</span>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-border-pink shadow-xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-charcoal-muted block mb-1">
                Audit Logs Count
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl sm:text-3xl font-black text-emerald-700">
                  {logs.length}
                </span>
                <span className="text-xs text-charcoal-muted">Tracked events</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-border-pink pb-4 gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("cards")}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider transition cursor-pointer ${
                activeTab === "cards"
                  ? "bg-pink-primary text-white shadow-sm"
                  : "bg-white text-charcoal hover:bg-pink-soft border border-border-pink"
              }`}
            >
              Contestant Cards ({candidates.length})
            </button>
            <button
              onClick={() => setActiveTab("leads")}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider transition cursor-pointer ${
                activeTab === "leads"
                  ? "bg-pink-primary text-white shadow-sm"
                  : "bg-white text-charcoal hover:bg-pink-soft border border-border-pink"
              }`}
            >
              Voter Leads ({leads.length})
            </button>
            <button
              onClick={() => setActiveTab("logs")}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider transition cursor-pointer ${
                activeTab === "logs"
                  ? "bg-pink-primary text-white shadow-sm"
                  : "bg-white text-charcoal hover:bg-pink-soft border border-border-pink"
              }`}
            >
              Activity &amp; Audit Logs ({logs.length})
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            {activeTab === "cards" && (
              <button
                onClick={openAddModal}
                className="px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-pink-primary hover:bg-pink-dark transition shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <span>+</span>
                <span>Add Candidate Card</span>
              </button>
            )}

            {activeTab === "leads" && (
              <button
                onClick={exportLeadsToCSV}
                className="px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-emerald-700 hover:bg-emerald-800 transition shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <span>📥</span>
                <span>Export Leads (CSV)</span>
              </button>
            )}

            {activeTab === "logs" && (
              <div className="flex items-center gap-2">
                <button
                  onClick={exportLogsToCSV}
                  className="px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-indigo-700 hover:bg-indigo-800 transition shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <span>📥</span>
                  <span>Export Logs (CSV)</span>
                </button>
                <button
                  onClick={handleClearLogs}
                  className="px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 hover:bg-red-100 transition border border-red-200"
                >
                  Clear History
                </button>
              </div>
            )}
          </div>
        </div>

        {/* --------------------------------------------------------- */}
        {/* VIEW 1: CONTESTANT CARDS MANAGEMENT                       */}
        {/* --------------------------------------------------------- */}
        {activeTab === "cards" && (
          <div className="space-y-6">
            
            {/* Filter & Search Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-border-pink shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={candidateSearch}
                  onChange={(e) => setCandidateSearch(e.target.value)}
                  placeholder="Search by Child Name, ID (KFW-101), or City..."
                  className="w-full px-4 py-2.5 pl-10 text-xs sm:text-sm bg-surface border border-border-pink rounded-xl focus:outline-none focus:border-pink-primary text-charcoal font-medium"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted">🔍</span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-muted shrink-0">
                  Category:
                </span>
                <select
                  value={candidateCategoryFilter}
                  onChange={(e) => setCandidateCategoryFilter(e.target.value)}
                  className="px-3 py-2 text-xs bg-surface border border-border-pink rounded-xl text-charcoal font-medium focus:outline-none focus:border-pink-primary"
                >
                  <option value="ALL">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Candidates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCandidates.map((c) => (
                <div
                  key={c.id}
                  className={`bg-white rounded-2xl border ${
                    c.isActive ? "border-border-pink" : "border-gray-300 opacity-60"
                  } shadow-xs overflow-hidden flex flex-col justify-between transition hover:shadow-md`}
                >
                  <div>
                    <div className="relative aspect-4/3 w-full bg-pink-soft/30 overflow-hidden">
                      <Image
                        src={c.imageUrl || SAMPLE_AVATARS[0].url}
                        alt={c.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-charcoal shadow-xs">
                        {c.id}
                      </div>
                      <div className="absolute top-3 right-3 bg-pink-primary text-white px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-xs">
                        {c.badge}
                      </div>
                      {!c.isActive && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="bg-red-600 text-white font-extrabold uppercase text-xs px-3 py-1 rounded-md">
                            HIDDEN FROM PUBLIC
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-5 space-y-2">
                      <div className="flex items-baseline justify-between">
                        <h3 className="font-serif text-lg font-bold text-charcoal">
                          {c.name}
                        </h3>
                        <span className="text-xs font-semibold text-charcoal-muted">
                          {c.age}
                        </span>
                      </div>

                      <div className="text-xs text-pink-dark font-medium">
                        {c.category}
                      </div>

                      <div className="text-xs text-charcoal-muted">
                        📍 {c.city}
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-border-pink text-xs">
                        <span className="font-bold text-pink-primary">
                          🗳️ {c.votes} Verified Votes
                        </span>
                        <span className="text-charcoal-muted">
                          ❤️ {c.likes} | 🔗 {c.shares}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-surface/50 border-t border-border-pink flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleToggleActive(c)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                        c.isActive
                          ? "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                          : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                      }`}
                    >
                      {c.isActive ? "Hide Card" : "Publish"}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal(c)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-charcoal bg-white border border-border-pink hover:bg-surface transition cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCandidate(c)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredCandidates.length === 0 && (
              <div className="bg-white p-12 rounded-3xl border border-border-pink text-center space-y-3">
                <p className="text-sm font-semibold text-charcoal-muted">
                  No contestants match your search criteria.
                </p>
                <button
                  onClick={openAddModal}
                  className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-pink-primary"
                >
                  Add First Contestant Now
                </button>
              </div>
            )}
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* VIEW 2: VOTER LEADS TABLE                                 */}
        {/* --------------------------------------------------------- */}
        {activeTab === "leads" && (
          <div className="space-y-6">
            
            {/* Filter Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-border-pink shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={leadsSearch}
                  onChange={(e) => setLeadsSearch(e.target.value)}
                  placeholder="Search by Voter Phone, Email, Voter Name, or Contestant..."
                  className="w-full px-4 py-2.5 pl-10 text-xs sm:text-sm bg-surface border border-border-pink rounded-xl focus:outline-none focus:border-pink-primary text-charcoal font-medium"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted">🔍</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-muted shrink-0">
                  By Kid:
                </span>
                <select
                  value={leadsCandidateFilter}
                  onChange={(e) => setLeadsCandidateFilter(e.target.value)}
                  className="px-3 py-2 text-xs bg-surface border border-border-pink rounded-xl text-charcoal font-medium focus:outline-none focus:border-pink-primary"
                >
                  <option value="ALL">All Contestants</option>
                  {candidates.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-border-pink shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border-pink text-left text-xs">
                  <thead className="bg-surface font-black uppercase tracking-wider text-charcoal">
                    <tr>
                      <th className="px-4 py-3.5">Contestant</th>
                      <th className="px-4 py-3.5">Voter Name</th>
                      <th className="px-4 py-3.5">Voter Phone / WhatsApp</th>
                      <th className="px-4 py-3.5">Voter Email</th>
                      <th className="px-4 py-3.5">City</th>
                      <th className="px-4 py-3.5">Vote Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-pink font-medium">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-pink-soft/30 transition">
                        <td className="px-4 py-3">
                          <div className="font-bold text-pink-primary">{lead.contestantName}</div>
                          <div className="text-[10px] text-charcoal-muted font-mono">{lead.contestantId}</div>
                        </td>
                        <td className="px-4 py-3 font-semibold text-charcoal">
                          {lead.voterName || "Supporter"}
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-emerald-800">
                          {lead.voterPhone || "—"}
                        </td>
                        <td className="px-4 py-3 font-mono text-charcoal-muted">
                          {lead.voterEmail || "—"}
                        </td>
                        <td className="px-4 py-3 text-charcoal">
                          {lead.voterCity || "Lucknow"}
                        </td>
                        <td className="px-4 py-3 text-charcoal-muted whitespace-nowrap">
                          {new Date(lead.timestamp).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredLeads.length === 0 && (
                <div className="p-8 text-center text-xs text-charcoal-muted font-medium">
                  No voter leads match your search criteria.
                </div>
              )}
            </div>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* VIEW 3: ACTIVITY & AUDIT LOGS                             */}
        {/* --------------------------------------------------------- */}
        {activeTab === "logs" && (
          <div className="space-y-6">
            
            {/* Filter & Search Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-border-pink shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={logsSearch}
                  onChange={(e) => setLogsSearch(e.target.value)}
                  placeholder="Search logs by Action, Keyword, User, Details, or IP..."
                  className="w-full px-4 py-2.5 pl-10 text-xs sm:text-sm bg-surface border border-border-pink rounded-xl focus:outline-none focus:border-pink-primary text-charcoal font-medium"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted">🔍</span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { label: "All Logs", val: "ALL" },
                  { label: "Auth", val: "AUTH" },
                  { label: "Candidates", val: "CANDIDATE" },
                  { label: "Voting", val: "VOTING" },
                  { label: "Security", val: "SECURITY" },
                ].map((pill) => (
                  <button
                    key={pill.val}
                    onClick={() => setLogsCategoryFilter(pill.val)}
                    className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full transition cursor-pointer ${
                      logsCategoryFilter === pill.val
                        ? "bg-charcoal text-white shadow-xs"
                        : "bg-surface text-charcoal hover:bg-pink-soft border border-border-pink"
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Logs List Table */}
            <div className="bg-white rounded-2xl border border-border-pink shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border-pink text-left text-xs">
                  <thead className="bg-surface font-black uppercase tracking-wider text-charcoal">
                    <tr>
                      <th className="px-4 py-3.5">Timestamp</th>
                      <th className="px-4 py-3.5">Action</th>
                      <th className="px-4 py-3.5">User</th>
                      <th className="px-4 py-3.5">Description</th>
                      <th className="px-4 py-3.5">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-pink font-medium">
                    {filteredLogs.map((log) => {
                      let badgeColor = "bg-gray-100 text-gray-800 border-gray-200";
                      if (log.action === "LOGIN") badgeColor = "bg-emerald-50 text-emerald-800 border-emerald-200";
                      if (log.action === "LOGOUT") badgeColor = "bg-slate-100 text-slate-800 border-slate-300";
                      if (log.action === "VOTE_CAST") badgeColor = "bg-blue-50 text-blue-800 border-blue-200";
                      if (log.action === "CANDIDATE_ADD") badgeColor = "bg-purple-50 text-purple-800 border-purple-200";
                      if (log.action === "CANDIDATE_UPDATE") badgeColor = "bg-amber-50 text-amber-800 border-amber-200";
                      if (log.action === "CANDIDATE_DELETE") badgeColor = "bg-rose-50 text-rose-800 border-rose-200";
                      if (log.action === "PUBLIC_NOMINATION") badgeColor = "bg-emerald-100 text-emerald-900 border-emerald-300";
                      if (log.action.includes("SECURITY") || log.action.includes("TAKEOVER")) {
                        badgeColor = "bg-red-50 text-red-800 border-red-200";
                      }

                      return (
                        <tr key={log.id} className="hover:bg-pink-soft/30 transition">
                          <td className="px-4 py-3 font-mono text-charcoal-muted whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${badgeColor}`}>
                              {log.action}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-bold text-charcoal">
                            {log.user}
                          </td>
                          <td className="px-4 py-3 text-charcoal font-medium">
                            {log.description}
                          </td>
                          <td className="px-4 py-3 text-charcoal-muted text-[11px] font-mono">
                            {log.details || "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredLogs.length === 0 && (
                <div className="p-8 text-center text-xs text-charcoal-muted font-medium">
                  No activity logs recorded yet.
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* ------------------------------------------------------------- */}
      {/* ADD / EDIT CANDIDATE MODAL (STREAMLINED & ULTRA EASY)         */}
      {/* ------------------------------------------------------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-border-pink shadow-2xl p-6 sm:p-8 space-y-6 my-8">
            
            <div className="flex items-center justify-between pb-4 border-b border-border-pink">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-pink-primary">
                  {editingCandidate ? "Edit Mode" : "Fast Registration"}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">
                  {editingCandidate ? `Update ${editingCandidate.name}` : "Add Contestant Card for Voting"}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {!editingCandidate && (
                  <button
                    type="button"
                    onClick={handleAutofillDemo}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition cursor-pointer"
                  >
                    ⚡ Autofill Demo Child
                  </button>
                )}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-surface hover:bg-pink-soft flex items-center justify-center text-charcoal font-bold text-sm"
                >
                  ✕
                </button>
              </div>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
                {formError}
              </div>
            )}

            {formSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
                {formSuccess}
              </div>
            )}

            <form onSubmit={handleCandidateSubmit} className="space-y-5">
              
              {/* Row 1: Name & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                    Child&apos;s Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={candidateForm.name}
                    onChange={(e) => setCandidateForm({ ...candidateForm, name: e.target.value })}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-surface border border-border-pink rounded-xl text-charcoal font-medium focus:outline-none focus:border-pink-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                    City / Locality
                  </label>
                  <input
                    type="text"
                    value={candidateForm.city}
                    onChange={(e) => setCandidateForm({ ...candidateForm, city: e.target.value })}
                    placeholder="e.g. Gomti Nagar, Lucknow"
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-surface border border-border-pink rounded-xl text-charcoal font-medium focus:outline-none focus:border-pink-primary"
                  />
                </div>
              </div>

              {/* Row 2: Age Quick Chips */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                  Age / Class Preset (Click to Select) *
                </label>
                <div className="flex flex-wrap gap-2">
                  {AGE_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setCandidateForm({ ...candidateForm, age: preset })}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-full transition cursor-pointer ${
                        candidateForm.age === preset
                          ? "bg-pink-primary text-white shadow-xs"
                          : "bg-surface text-charcoal hover:bg-pink-soft border border-border-pink"
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  required
                  value={candidateForm.age}
                  onChange={(e) => setCandidateForm({ ...candidateForm, age: e.target.value })}
                  placeholder="Or type custom age, e.g. 5 Years (UKG)"
                  className="mt-2 w-full px-4 py-2 text-xs bg-surface border border-border-pink rounded-xl text-charcoal font-medium focus:outline-none focus:border-pink-primary"
                />
              </div>

              {/* Row 3: Category Quick Chips */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                  Category (Click to Select) *
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCandidateForm({ ...candidateForm, category: cat })}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-full transition cursor-pointer ${
                        candidateForm.category === cat
                          ? "bg-navy text-white shadow-xs"
                          : "bg-surface text-charcoal hover:bg-pink-soft border border-border-pink"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 4: Photo Upload (Cloudinary / Sample / URL) */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal">
                  Contestant Photo (Cloudinary Direct Upload or Preset)
                </label>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-pink-soft/40 border-2 border-border-pink shrink-0">
                    <Image
                      src={candidateForm.imageUrl || SAMPLE_AVATARS[0].url}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-charcoal bg-white border border-border-pink hover:bg-surface rounded-xl shadow-2xs cursor-pointer"
                      >
                        {uploadingImage ? "Uploading..." : "📷 Choose Photo from Device"}
                      </button>
                    </div>

                    {uploadMessage && (
                      <p className="text-xs font-semibold text-emerald-800">
                        {uploadMessage}
                      </p>
                    )}

                    {/* Quick Avatar Presets */}
                    <div className="pt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block mb-1">
                        Or pick from gallery sample photos:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {SAMPLE_AVATARS.map((avatar) => (
                          <button
                            key={avatar.label}
                            type="button"
                            onClick={() => setCandidateForm({ ...candidateForm, imageUrl: avatar.url })}
                            className={`text-[10px] font-bold px-2 py-1 rounded-md transition cursor-pointer ${
                              candidateForm.imageUrl === avatar.url
                                ? "bg-gold text-charcoal font-black"
                                : "bg-surface text-charcoal hover:bg-pink-soft border border-border-pink"
                            }`}
                          >
                            {avatar.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 5: Badge Presets */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                  Contestant Badge
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {BADGES.map((badge) => (
                    <button
                      key={badge}
                      type="button"
                      onClick={() => setCandidateForm({ ...candidateForm, badge })}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition cursor-pointer ${
                        candidateForm.badge === badge
                          ? "bg-pink-primary text-white"
                          : "bg-surface text-charcoal hover:bg-pink-soft border border-border-pink"
                      }`}
                    >
                      {badge}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-border-pink flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-charcoal bg-white border border-border-pink hover:bg-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-pink-primary hover:bg-pink-dark transition shadow-md cursor-pointer disabled:opacity-50"
                >
                  {formSubmitting
                    ? "Saving..."
                    : editingCandidate
                    ? "Update Candidate Card"
                    : "Save & Publish Candidate Card →"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
