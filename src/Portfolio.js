import { useState, useEffect, useRef } from "react";

// ── Data ───────────────────────────────────────────────────────────────────────
const SKILLS = [
  { name: "React.js", level: 88, icon: "⚛️" },
  { name: "JavaScript", level: 85, icon: "𝙅𝙎" },
  { name: "TypeScript", level: 72, icon: "𝙏𝙎" },
  { name: "Tailwind CSS", level: 90, icon: "🎨" },
  { name: "React Native", level: 75, icon: "📱" },
  { name: "Node.js", level: 68, icon: "🟢" },
  { name: "MongoDB", level: 65, icon: "🍃" },
  { name: "REST APIs", level: 80, icon: "🔌" },
];

const PROJECTS = [
  {
    id: 0,
    title: "E-Lenden",
    sub: "React Native Borrow App",
    desc: "Hyperlocal item borrowing app connecting users with nearby shops — geo-based discovery, real-time availability, QR-based booking & return tracking.",
    tags: ["React Native", "Node.js", "MongoDB", "Expo", "Maps API"],
    icon: "📦",
    accent: "#a855f7",
    glow: "rgba(168,85,247,0.25)",
    link: "#",
  },
  {
    id: 1,
    title: "Dogido",
    sub: "Pet E-Commerce Platform",
    desc: "Complete dog products marketplace with smart cart, real-time order tracking, Razorpay payments, admin dashboard & inventory management.",
    tags: ["React.js", "Node.js", "MongoDB", "Tailwind", "Razorpay"],
    icon: "🐕",
    accent: "#f97316",
    glow: "rgba(249,115,22,0.25)",
    link: "#",
  },
  {
    id: 2,
    title: "Tramo Portal",
    sub: "Internal Company Portal",
    desc: "Internal management portal — employee records, task assignment, leave & attendance tracking, analytics dashboard with role-based access control.",
    tags: ["React.js", "TypeScript", "Node.js", "MongoDB", "JWT Auth"],
    icon: "🏢",
    accent: "#3b82f6",
    glow: "rgba(59,130,246,0.25)",
    link: "#",
  },
  {
    id: 3,
    title: "TravelEasy",
    sub: "Travel Booking Platform",
    desc: "MakeMyTrip-inspired travel UI — flight & hotel search with live API integration, dynamic pricing, seat selection & itinerary builder.",
    tags: ["React.js", "Travel APIs", "Tailwind", "Node.js", "REST"],
    icon: "✈️",
    accent: "#14b8a6",
    glow: "rgba(20,184,166,0.25)",
    link: "#",
  },
  {
    id: 4,
    title: "AgroBreed",
    sub: "Farm Education Website",
    desc: "Livestock farming encyclopedia — breed guides for goats (Boer, Sirohi), cows (Gir, HF), chickens (Broiler, Kadaknath), milk production trackers & care guides.",
    tags: ["React.js", "Tailwind CSS", "Node.js", "MongoDB"],
    icon: "🐐",
    accent: "#22c55e",
    glow: "rgba(34,197,94,0.25)",
    link: "#",
  },
];

const STACK = [
  "React.js", "React Native", "JavaScript", "TypeScript",
  "Tailwind CSS", "Node.js", "Express", "MongoDB",
  "REST APIs", "Git", "Expo", "Figma",
  "VS Code", "Postman", "HTML5", "CSS3", "Razorpay", "JWT Auth",
];

// ── Hooks ──────────────────────────────────────────────────────────────────────
function useTypewriter(words, speed = 80, pause = 2200) {
  const [text, setText] = useState("");
  const [wIdx, setWIdx] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const cur = words[wIdx % words.length];
    const t = setTimeout(
      () => {
        if (!del) {
          setText(cur.slice(0, text.length + 1));
          if (text.length + 1 === cur.length) setTimeout(() => setDel(true), pause);
        } else {
          setText(cur.slice(0, text.length - 1));
          if (text.length - 1 === 0) { setDel(false); setWIdx((i) => i + 1); }
        }
      },
      del ? 35 : speed,
    );
    return () => clearTimeout(t);
  }, [text, del, wIdx]);
  return text;
}

function useVisible(threshold = 0.12) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVis(true); },
      { threshold },
    );
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return [ref, vis];
}

// ── Noise texture ──────────────────────────────────────────────────────────────
const NoiseBg = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
  </svg>
);

// ── Cursor glow ────────────────────────────────────────────────────────────────
function CursorGlow() {
  const [pos, setPos] = useState({ x: -300, y: -300 });
  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <div
      className="fixed pointer-events-none z-0"
      style={{
        left: pos.x, top: pos.y, width: 600, height: 600,
        transform: "translate(-50%,-50%)",
        background: "radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 70%)",
        transition: "left 0.15s ease, top 0.15s ease",
      }}
    />
  );
}

// ── Label ──────────────────────────────────────────────────────────────────────
function Label({ text }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-[11px] font-bold text-red-500/80 uppercase tracking-[0.25em] font-mono">
        — {text} —
      </span>
      <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
    </div>
  );
}

// ── Main Portfolio ─────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [active, setActive] = useState("home");
  const [menu, setMenu] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", msg: "" });
  const [sent, setSent] = useState(false);
  const [hovered, setHovered] = useState(null);

  const typed = useTypewriter(
    ["Frontend Developer", "React.js Developer", "React Native Dev", "UI/UX Builder", "Full Stack Dev"],
    75, 2000,
  );

  useEffect(() => {
    const fn = () => {
      setScrollY(window.scrollY);
      ["home", "about", "skills", "projects", "contact"].forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 90) setActive(id);
      });
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenu(false);
  };

  const [aboutRef, aboutVis] = useVisible();
  const [skillsRef, skillsVis] = useVisible();
  const [projectRef, projectVis] = useVisible();

  const submitForm = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", msg: "" });
    setTimeout(() => setSent(false), 4000);
  };

  const navScrolled = scrollY > 60;

  return (
    <div className="bg-[#07070f] text-white min-h-screen antialiased overflow-x-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes scrollDot { 0%{transform:translateY(0);opacity:1} 80%{transform:translateY(12px);opacity:0} 100%{transform:translateY(0);opacity:0} }
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes ping { 0%{transform:scale(1);opacity:0.75} 80%,100%{transform:scale(2.2);opacity:0} }
        .syne { font-family: 'Syne', sans-serif; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        .grad-text {
          background: linear-gradient(135deg,#ef4444 0%,#f97316 55%,#facc15 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
      `}</style>

      <CursorGlow />
      <NoiseBg />

      {/* ═══ NAV ══════════════════════════════════════════════════════════════ */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${navScrolled ? "py-3" : "py-5"}`}>
        <div className={`mx-4 md:mx-auto md:max-w-5xl rounded-2xl px-5 flex items-center justify-between transition-all duration-500 ${navScrolled ? "bg-white/[0.06] backdrop-blur-2xl border border-white/[0.08] shadow-2xl py-3" : "py-0"}`}>

          <button onClick={() => go("home")} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs text-white font-black syne"
              style={{ background: "linear-gradient(135deg,#ef4444,#f97316)" }}>HS</div>
            <span className="syne font-black text-[15px] tracking-tight text-white/90">
              himanshu<span className="text-red-500">.</span>
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {["home", "about", "skills", "projects", "contact"].map((id) => (
              <button key={id} onClick={() => go(id)}
                className={`px-4 py-2 rounded-xl text-[13px] font-medium capitalize transition-all duration-200 ${active === id ? "text-white bg-white/10" : "text-white/40 hover:text-white/80 hover:bg-white/5"}`}>
                {id}
              </button>
            ))}
          </nav>

          <button onClick={() => go("contact")}
            className="hidden md:flex items-center gap-2 px-5 py-2 rounded-xl text-[13px] font-bold text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.03]"
            style={{ background: "linear-gradient(135deg,#ef4444,#f97316)" }}>
            Hire Me
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>

          <button className="md:hidden text-white/50 hover:text-white" onClick={() => setMenu(!menu)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menu
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {menu && (
          <div className="md:hidden mx-4 mt-2 rounded-2xl bg-[#111118]/95 backdrop-blur-xl border border-white/10 p-3 flex flex-col gap-1">
            {["home", "about", "skills", "projects", "contact"].map((id) => (
              <button key={id} onClick={() => go(id)}
                className={`text-left px-4 py-2.5 rounded-xl text-sm capitalize font-medium ${active === id ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/5 hover:text-white"}`}>
                {id}
              </button>
            ))}
            <button onClick={() => go("contact")}
              className="mt-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg,#ef4444,#f97316)" }}>
              Hire Me →
            </button>
          </div>
        )}
      </header>

      {/* ═══ HERO ══════════════════════════════════════════════════════════════ */}
      <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
        {/* Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(239,68,68,0.13) 0%, transparent 65%)", filter: "blur(1px)" }} />
          <div className="absolute bottom-[-15%] left-[-8%] w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(249,115,22,0.09) 0%, transparent 65%)" }} />
          <div className="absolute top-[40%] left-[35%] w-[400px] h-[400px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 65%)" }} />
          <div className="absolute inset-0 opacity-[0.13]"
            style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.45) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center pt-24">
          {/* Status pill */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-10 border border-white/[0.08]"
            style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)" }}>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
                style={{ animation: "ping 1.5s ease-in-out infinite" }} />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            <span className="text-[13px] text-white/60 font-medium">
              Available for hire · 7 months exp at{" "}
              <span className="text-white font-semibold">Tramo Technolab</span>
            </span>
          </div>

          {/* Name */}
          <div className="mb-4">
            <h1 className="syne text-[clamp(52px,10vw,115px)] font-black leading-[0.88] tracking-[-0.04em]">
              <span className="block text-white/95">Himanshu</span>
              <span className="block grad-text">Sharma</span>
            </h1>
          </div>

          {/* Typewriter */}
          <div className="flex items-center justify-center gap-2 h-10 mb-6">
            <span className="text-[clamp(16px,3vw,24px)] text-white/50 font-light">{typed}</span>
            <span className="inline-block w-[2px] h-7 bg-red-400" style={{ animation: "blink 1s step-end infinite" }} />
          </div>

          <p className="text-white/40 max-w-md mx-auto text-[15px] leading-relaxed mb-12 font-light">
            Building fast, beautiful web & mobile products. Obsessed with clean code, pixel-perfect UI, and shipping things that work.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <button onClick={() => go("projects")}
              className="group relative overflow-hidden px-8 py-4 rounded-2xl text-[14px] font-bold text-white transition-all duration-300 hover:scale-105"
              style={{ background: "linear-gradient(135deg,#ef4444,#f97316)" }}>
              <span className="relative z-10 flex items-center gap-2">
                View My Work
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
            <button onClick={() => go("contact")}
              className="px-8 py-4 rounded-2xl text-[14px] font-bold text-white/70 hover:text-white border border-white/[0.1] hover:border-white/[0.2] hover:bg-white/[0.05] transition-all duration-200"
              style={{ backdropFilter: "blur(10px)" }}>
              Get in Touch
            </button>
          </div>

          {/* Socials */}
          <div className="flex items-center justify-center gap-3">
            {[
              { n: "GitHub", href: "https://github.com/HimAnshu165-sudo", d: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z", rule: "evenodd" },
              { n: "LinkedIn", href: "https://www.linkedin.com/in/himanshu-sharma-a55611323", d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
              { n: "Twitter", href: "https://twitter.com", d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
            ].map(({ n, href, d, rule }) => (
              <a key={n} href={href} target="_blank" rel="noreferrer"
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white/30 hover:text-white/80 border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.06] transition-all duration-200">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d={d} fillRule={rule} clipRule={rule} />
                </svg>
              </a>
            ))}
            <div className="w-px h-5 bg-white/10 mx-1" />
            <span className="mono text-[12px] text-white/25">hs165990@gmail.com</span>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-20">
          <span className="mono text-[10px] tracking-[0.2em] uppercase text-white/50">scroll</span>
          <div className="w-4 h-7 rounded-full border border-white/30 flex items-start justify-center pt-1">
            <div className="w-0.5 h-2 rounded-full bg-white/50" style={{ animation: "scrollDot 1.6s ease-in-out infinite" }} />
          </div>
        </div>
      </section>

      {/* ═══ ABOUT ═════════════════════════════════════════════════════════════ */}
      <section id="about" className="py-32 px-6 relative" style={{ background: "#07070f" }}>
        <div className="max-w-6xl mx-auto">
          <Label text="About" />
          <div ref={aboutRef} className="mt-16 grid lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div style={{ opacity: aboutVis ? 1 : 0, transform: aboutVis ? "none" : "translateY(30px)", transition: "all 0.7s ease" }}>
              <h2 className="syne text-[clamp(32px,5vw,56px)] font-black leading-tight tracking-tight text-white mb-6">
                7 months.<br />
                <span className="grad-text">5 real products.</span><br />
                100% committed.
              </h2>
              <p className="text-white/45 text-[15px] leading-relaxed mb-6 font-light">
                I'm a full-stack & frontend developer at{" "}
                <span className="text-white font-semibold">Tramo Technolab Pvt Limited</span>, Noida.
                In just 7 months I've shipped 5 production apps — a borrowing app, e-commerce platform,
                company portal, travel booking UI, and an agriculture education site.
              </p>
              <p className="text-white/40 text-[15px] leading-relaxed mb-10 font-light">
                I care deeply about the craft — clean component architecture, smooth UX, and code that's
                actually maintainable. Currently exploring Spring Boot & expanding into backend systems.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Clean Code", "Great UX", "Fast Learner", "Team Player", "Product Mindset"].map((c) => (
                  <span key={c} className="px-3.5 py-1.5 rounded-full text-[12px] font-semibold text-white/60 border border-white/[0.1]"
                    style={{ background: "rgba(255,255,255,0.04)" }}>{c}</span>
                ))}
              </div>
            </div>

            {/* Right: cards */}
            <div className="grid grid-cols-2 gap-4"
              style={{ opacity: aboutVis ? 1 : 0, transform: aboutVis ? "none" : "translateY(30px)", transition: "all 0.7s ease 0.15s" }}>
              <div className="col-span-2 rounded-3xl p-6 relative overflow-hidden border border-white/[0.07]"
                style={{ background: "linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(249,115,22,0.06) 100%)" }}>
                <div className="syne text-5xl font-black grad-text">7 mo.</div>
                <div className="text-white/90 font-bold text-lg mt-1">Full Stack Developer</div>
                <div className="text-white/40 text-sm">Tramo Technolab · 2024–Present · Noida, UP</div>
                <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">💼</div>
              </div>
              {[
                { n: "5+", label: "Projects Shipped", icon: "🚀", c: "rgba(239,68,68,0.08)" },
                { n: "20+", label: "Components Built", icon: "🧩", c: "rgba(249,115,22,0.08)" },
                { n: "100%", label: "Commitment", icon: "🔥", c: "rgba(250,204,21,0.08)" },
                { n: "4", label: "Tech Domains", icon: "⚡", c: "rgba(168,85,247,0.08)" },
              ].map(({ n, label, icon, c }) => (
                <div key={label} className="rounded-2xl p-5 border border-white/[0.07] flex flex-col justify-between" style={{ background: c }}>
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <div className="syne text-3xl font-black text-white mt-3">{n}</div>
                    <div className="text-white/40 text-xs mt-0.5">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SKILLS ════════════════════════════════════════════════════════════ */}
      <section id="skills" className="py-32 px-6 relative" style={{ background: "#0e0e1a" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(239,68,68,0.05) 0%, transparent 60%)" }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <Label text="Skills" />
          <div ref={skillsRef} className="mt-16">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {SKILLS.map((s, i) => (
                <div key={s.name}
                  className="rounded-2xl p-5 border border-white/[0.07] hover:border-white/[0.18] transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    opacity: skillsVis ? 1 : 0,
                    transform: skillsVis ? "none" : "translateY(20px)",
                    transition: `all 0.5s ease ${i * 60}ms`,
                  }}>
                  <div className="text-2xl mb-3">{s.icon}</div>
                  <div className="text-sm font-semibold text-white/90 mb-3">{s.name}</div>
                  <div className="h-[3px] bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all ease-out"
                      style={{
                        width: skillsVis ? `${s.level}%` : "0%",
                        transitionDuration: "1.3s",
                        transitionDelay: `${i * 60 + 300}ms`,
                        background: "linear-gradient(90deg,#ef4444,#f97316,#facc15)",
                      }} />
                  </div>
                  <div className="mono text-[11px] text-white/22 mt-2 text-right">{s.level}%</div>
                </div>
              ))}
            </div>

            {/* Marquee */}
            <div className="overflow-hidden relative">
              <div className="absolute left-0 top-0 bottom-0 w-20 z-10" style={{ background: "linear-gradient(90deg,#0e0e1a,transparent)" }} />
              <div className="absolute right-0 top-0 bottom-0 w-20 z-10" style={{ background: "linear-gradient(-90deg,#0e0e1a,transparent)" }} />
              <div className="flex gap-3" style={{ animation: "marquee 22s linear infinite" }}>
                {[...STACK, ...STACK].map((t, i) => (
                  <span key={i} className="flex-shrink-0 px-4 py-2 rounded-full text-[12px] font-semibold text-white/40 border border-white/[0.08]"
                    style={{ background: "rgba(255,255,255,0.03)" }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PROJECTS ══════════════════════════════════════════════════════════ */}
      <section id="projects" className="py-32 px-6 relative" style={{ background: "#07070f" }}>
        <div className="max-w-6xl mx-auto">
          <Label text="Projects" />
          <p className="text-center text-white/28 text-[14px] mt-3 mb-16 font-light">
            Real products built during 7 months at Tramo Technolab
          </p>

          <div ref={projectRef} className="grid md:grid-cols-3 gap-5">
            {PROJECTS.map((p, i) => (
              <div key={p.id}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="group relative rounded-3xl overflow-hidden border cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  borderColor: hovered === i ? `${p.accent}55` : "rgba(255,255,255,0.07)",
                  boxShadow: hovered === i ? `0 0 60px ${p.glow}` : "none",
                  transform: hovered === i ? "translateY(-7px)" : "none",
                  opacity: projectVis ? 1 : 0,
                  transition: `opacity 0.6s ease ${i * 120}ms, transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease`,
                }}>
                {/* Card header */}
                <div className="relative h-44 flex items-center justify-center overflow-hidden"
                  style={{ background: `radial-gradient(circle at 60% 40%, ${p.glow} 0%, rgba(0,0,0,0.5) 70%)` }}>
                  <div className="text-7xl select-none"
                    style={{
                      filter: `drop-shadow(0 0 28px ${p.accent})`,
                      transform: hovered === i ? "scale(1.15) rotate(-4deg)" : "scale(1)",
                      transition: "transform 0.4s ease",
                    }}>{p.icon}</div>
                  <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full text-white/80 border border-white/10"
                    style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(10px)" }}>
                    {p.sub}
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 h-16"
                    style={{ background: "linear-gradient(transparent, rgba(7,7,15,1))" }} />
                </div>

                <div className="p-6">
                  <h3 className="syne text-xl font-black text-white mb-2">{p.title}</h3>
                  <p className="text-white/38 text-[13px] leading-relaxed mb-5 font-light">{p.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {p.tags.map((t) => (
                      <span key={t} className="text-[11px] px-2.5 py-1 rounded-lg font-semibold text-white/50 border border-white/[0.08]"
                        style={{ background: "rgba(255,255,255,0.04)" }}>{t}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-white/[0.06]" />
                    <a href={p.link}
                      className="flex items-center gap-1.5 text-[12px] font-bold transition-all duration-200"
                      style={{ color: hovered === i ? p.accent : "rgba(255,255,255,0.3)" }}>
                      View Project
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}

            {/* CTA card */}
            <div className="rounded-3xl overflow-hidden border border-white/[0.07] flex flex-col items-center justify-center p-10 text-center"
              style={{ background: "linear-gradient(135deg,rgba(239,68,68,0.08),rgba(249,115,22,0.05))", minHeight: 380 }}>
              <div className="text-5xl mb-5">🤝</div>
              <div className="syne text-xl font-black mb-3">Got a project?</div>
              <p className="text-white/40 text-[14px] leading-relaxed mb-6 font-light">
                Open to freelance, full-time roles, and exciting collaborations.
              </p>
              <button onClick={() => go("contact")}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-[13px] font-bold text-white transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg,#ef4444,#f97316)" }}>
                Get in Touch
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CONTACT ═══════════════════════════════════════════════════════════ */}
      <section id="contact" className="py-32 px-6 relative overflow-hidden" style={{ background: "#0e0e1a" }}>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(239,68,68,0.07) 0%, transparent 65%)" }} />

        <div className="max-w-5xl mx-auto relative z-10">
          <Label text="Contact" />

          {/* Big CTA */}
          <div className="mt-16 rounded-3xl p-0.5 mb-12"
            style={{ background: "linear-gradient(135deg, rgba(239,68,68,0.45), rgba(249,115,22,0.22), rgba(255,255,255,0.05))" }}>
            <div className="rounded-[22px] p-8 md:p-14 text-center" style={{ background: "rgba(8,8,22,0.97)" }}>
              <div className="text-5xl mb-4">👋</div>
              <h2 className="syne text-[clamp(28px,5vw,48px)] font-black text-white mb-4 tracking-tight">
                Let's build something<br />
                <span className="grad-text">great together.</span>
              </h2>
              <p className="text-white/40 text-[15px] max-w-lg mx-auto mb-8 font-light">
                I'm actively looking for new opportunities. Open to freelance, full-time, or collaboration on interesting projects.
              </p>
              <a href="mailto:hs165990@gmail.com"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-[14px] font-bold text-white transition-all duration-200 hover:scale-105"
                style={{ background: "linear-gradient(135deg,#ef4444,#f97316)" }}>
                ✉️ hs165990@gmail.com
              </a>
            </div>
          </div>

          {/* Form + info */}
          <div className="grid md:grid-cols-5 gap-6">
            <div className="md:col-span-2 flex flex-col gap-3">
              {[
                { icon: "📍", l: "Location", v: "Noida 63, Uttar Pradesh" },
                { icon: "🏢", l: "Company", v: "Tramo Technolab Pvt Ltd" },
                { icon: "💼", l: "Status", v: "Open to opportunities" },
                { icon: "⚡", l: "Response", v: "Within 24 hours" },
              ].map(({ icon, l, v }) => (
                <div key={l} className="flex items-center gap-3 p-4 rounded-2xl border border-white/[0.07]"
                  style={{ background: "rgba(255,255,255,0.02)" }}>
                  <span className="text-xl w-8 text-center">{icon}</span>
                  <div>
                    <div className="mono text-[10px] text-white/30 uppercase tracking-wider">{l}</div>
                    <div className="text-[13px] font-semibold text-white/75">{v}</div>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={submitForm} className="md:col-span-3 flex flex-col gap-4">
              {sent && (
                <div className="p-4 rounded-2xl border border-green-500/20 text-green-400 text-[13px] flex items-center gap-2"
                  style={{ background: "rgba(34,197,94,0.06)" }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Sent! I'll get back to you soon.
                </div>
              )}
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { k: "name", l: "Name", p: "Your name", t: "text" },
                  { k: "email", l: "Email", p: "your@email.com", t: "email" },
                ].map(({ k, l, p, t }) => (
                  <div key={k}>
                    <label className="mono block text-[11px] font-bold text-white/30 uppercase tracking-widest mb-2">{l}</label>
                    <input required type={t} value={form[k]} placeholder={p}
                      onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
                      className="w-full px-4 py-3.5 rounded-xl text-[13px] text-white/80 placeholder-white/[0.15] outline-none border border-white/[0.07] focus:border-red-500/40 transition-colors"
                      style={{ background: "rgba(255,255,255,0.04)" }} />
                  </div>
                ))}
              </div>
              <div>
                <label className="mono block text-[11px] font-bold text-white/30 uppercase tracking-widest mb-2">Message</label>
                <textarea required rows={5} value={form.msg} placeholder="Tell me about your project or idea..."
                  onChange={(e) => setForm((f) => ({ ...f, msg: e.target.value }))}
                  className="w-full px-4 py-3.5 rounded-xl text-[13px] text-white/80 placeholder-white/[0.15] outline-none border border-white/[0.07] focus:border-red-500/40 transition-colors resize-none"
                  style={{ background: "rgba(255,255,255,0.04)" }} />
              </div>
              <button type="submit"
                className="py-4 rounded-2xl text-[14px] font-bold text-white transition-all duration-200 hover:scale-[1.02] hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#ef4444,#f97316)" }}>
                Send Message →
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ════════════════════════════════════════════════════════════ */}
      <footer className="py-8 px-6 border-t border-white/[0.06]" style={{ background: "#07070f" }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center syne font-black text-xs text-white"
              style={{ background: "linear-gradient(135deg,#ef4444,#f97316)" }}>HS</div>
            <span className="syne font-black text-sm text-white/80">
              himanshu<span className="text-red-500">.</span>
            </span>
          </div>
          <p className="mono text-[12px] text-white/20">
            © {new Date().getFullYear()} Himanshu Sharma · React & Tailwind CSS
          </p>
          <div className="flex gap-6">
            {["GitHub", "LinkedIn", "Twitter"].map((s) => (
              <a key={s} href="#" className="text-[12px] text-white/20 hover:text-white/60 transition-colors">{s}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}