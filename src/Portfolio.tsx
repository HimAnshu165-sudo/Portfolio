import React, { useState, useEffect, useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Points, PointMaterial, Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import confetti from "canvas-confetti";

// React Icons
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaEnvelope,
  FaDownload,
  FaPaperPlane,
  FaArrowUp,
  FaChevronLeft,
  FaChevronRight,
  FaReact,
  FaNodeJs,
  FaHtml5,
  FaCss3Alt,
  FaGitAlt,
  FaFigma,
  FaServer,
  FaDatabase,
  FaCode,
  FaMapMarkerAlt
} from "react-icons/fa";
import {
  SiTypescript,
  SiTailwindcss,
  SiNextdotjs,
  SiExpress,
  SiMongodb,
  SiFirebase,
  SiPostman,
  SiVite
} from "react-icons/si";

gsap.registerPlugin(ScrollTrigger);

// ── TYPES & INTERFACES ──────────────────────────────────────────────────

interface SkillItem {
  name: string;
  percentage: number;
  icon: React.ReactNode;
}

interface SkillCategory {
  title: string;
  skills: SkillItem[];
}

interface ProjectItem {
  id: number;
  title: string;
  sub: string;
  desc: string;
  tags: string[];
  category: string;
  gradient: string;
  demoLink: string;
  githubLink: string;
}

interface TimelineItem {
  id: number;
  year: string;
  title: string;
  company: string;
  desc: string;
  tags: string[];
}

interface ServiceItem {
  title: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
}

interface TestimonialItem {
  name: string;
  role: string;
  company: string;
  text: string;
  avatarSeed: string;
}

// ── DATA DEFINITIONS ────────────────────────────────────────────────────

const SKILLS_DATA: SkillCategory[] = [
  {
    title: "Frontend Stack",
    skills: [
      { name: "React.js", percentage: 90, icon: <FaReact className="text-cyan-400" /> },
      { name: "TypeScript", percentage: 82, icon: <SiTypescript className="text-blue-500" /> },
      { name: "JavaScript", percentage: 92, icon: <span className="text-yellow-400 font-bold">JS</span> },
      { name: "HTML5", percentage: 95, icon: <FaHtml5 className="text-orange-500" /> },
      { name: "CSS3", percentage: 90, icon: <FaCss3Alt className="text-blue-400" /> },
      { name: "Tailwind CSS", percentage: 95, icon: <SiTailwindcss className="text-cyan-400" /> }
    ]
  },
  {
    title: "Backend Core",
    skills: [
      { name: "Node.js", percentage: 85, icon: <FaNodeJs className="text-green-500" /> },
      { name: "Express.js", percentage: 88, icon: <SiExpress className="text-slate-400" /> },
      { name: "REST APIs", percentage: 90, icon: <FaServer className="text-purple-400" /> }
    ]
  },
  {
    title: "Database Hub",
    skills: [
      { name: "MongoDB", percentage: 80, icon: <SiMongodb className="text-green-600" /> },
      { name: "Firebase", percentage: 75, icon: <SiFirebase className="text-amber-500" /> }
    ]
  },
  {
    title: "Tools & Workflow",
    skills: [
      { name: "Git", percentage: 88, icon: <FaGitAlt className="text-red-500" /> },
      { name: "GitHub", percentage: 90, icon: <FaGithub className="text-slate-300" /> },
      { name: "Postman", percentage: 85, icon: <SiPostman className="text-orange-500" /> },
      { name: "Figma", percentage: 80, icon: <FaFigma className="text-pink-400" /> }
    ]
  }
];

const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 1,
    title: "Village Marketplace",
    sub: "Hyperlocal E-Commerce Platform",
    desc: "A rural commerce engine connecting village artisans and farmers with urban markets. Integrates cart calculations, automated logistics dispatching, and secure transactions.",
    tags: ["React.js", "Node.js", "MongoDB", "Express", "Tailwind CSS"],
    category: "fullstack",
    gradient: "from-purple-600 via-indigo-600 to-blue-500",
    demoLink: "#",
    githubLink: "https://github.com/HimAnshu165-sudo"
  },
  {
    id: 2,
    title: "QR Payment Manager",
    sub: "Merchant Billing Portal",
    desc: "An enterprise onboarding system for QR code deployment and merchant billing auditing. Features automated invoice generation and role-based validation filters.",
    tags: ["React.js", "TypeScript", "Node.js", "Express", "JWT Session"],
    category: "enterprise",
    gradient: "from-orange-500 via-red-500 to-pink-500",
    demoLink: "#",
    githubLink: "https://github.com/HimAnshu165-sudo"
  },
  {
    id: 3,
    title: "Music Streaming App",
    sub: "Responsive Audio Client",
    desc: "A responsive client-side music player with real-time audio analysis, playlist generation, and dynamic filtering based on artists and mood profiles.",
    tags: ["React.js", "Zustand", "Tailwind CSS", "HTML5 Audio", "Vite"],
    category: "frontend",
    gradient: "from-cyan-500 via-teal-500 to-emerald-500",
    demoLink: "#",
    githubLink: "https://github.com/HimAnshu165-sudo"
  }
];

const TIMELINE_DATA: TimelineItem[] = [
  {
    id: 1,
    year: "2023 - 2024",
    title: "Learning Journey & Foundations",
    company: "Self-Directed Study",
    desc: "Mastered data structures, core JavaScript engines, web protocol architectures, and standard algorithms. Built dozens of repository proof-of-concepts.",
    tags: ["JavaScript ES6", "Algorithms", "Web Standards", "Git & GitHub"]
  },
  {
    id: 2,
    year: "2024",
    title: "Academic Project Engineering",
    company: "University Lab Tasks",
    desc: "Architected relational and document schemas. Coded server engines with structured query routes and client mockups for university evaluations.",
    tags: ["React.js", "MongoDB", "Relational Database", "Express APIs"]
  },
  {
    id: 3,
    year: "2024 - 2025",
    title: "Freelance Project Contracts",
    company: "Remote Deliveries",
    desc: "Constructed responsive corporate landing spaces, client portfolio modules, and third-party API integration scripts for startups and design agencies.",
    tags: ["Tailwind CSS", "Framer Motion", "Third-party Integration", "Vite"]
  },
  {
    id: 4,
    year: "2025 - Present",
    title: "Full Stack Development Experience",
    company: "Tramo Technologies (9 Months)",
    desc: "Currently developing internal enterprise portals and management tools. Built role-based access systems, dashboard analytics, and secure session management.",
    tags: ["React.js", "TypeScript", "Node.js", "Enterprise Portals", "Express"]
  }
];

const SERVICES_DATA: ServiceItem[] = [
  {
    title: "Frontend Development",
    desc: "Building high-performance, responsive React and Next.js web architectures using strict component principles and TypeScript.",
    icon: <FaCode className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Backend Development",
    desc: "Engineering highly scalable REST and GraphQL APIs with Node.js, Express, and structured middleware routing layers.",
    icon: <FaServer className="w-6 h-6" />,
    color: "from-purple-500 to-indigo-500"
  },
  {
    title: "Full Stack Web Apps",
    desc: "Architecting end-to-end full stack web platforms, fully linking document databases with responsive user interfaces.",
    icon: <FaReact className="w-6 h-6" />,
    color: "from-pink-500 to-rose-500"
  },
  {
    title: "API Integration",
    desc: "Connecting payment gateways, authentication providers, cloud storage grids, and enterprise webhooks securely.",
    icon: <SiVite className="w-6 h-6" />,
    color: "from-amber-500 to-orange-500"
  },
  {
    title: "Database Design",
    desc: "Designing optimized database structures in MongoDB, indexing fields, and writing aggregations for analytics.",
    icon: <FaDatabase className="w-6 h-6" />,
    color: "from-green-500 to-emerald-500"
  },
  {
    title: "Responsive UI Dev",
    desc: "Translating Figma layout specs to pixel-perfect mobile-responsive code with custom scroll and hover motions.",
    icon: <FaFigma className="w-6 h-6" />,
    color: "from-teal-500 to-cyan-500"
  }
];

const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    name: "Aman Verma",
    role: "Project Director",
    company: "Tramo Technologies",
    text: "Himanshu's ability to pick up enterprise requirements and implement them into clean dashboards is exceptional. His work on session layers improved our security significantly.",
    avatarSeed: "aman"
  },
  {
    name: "Sarah Jenkins",
    role: "Product Owner",
    company: "Horizon Agencies",
    text: "Delivered a pixel-perfect, highly responsive landing portal on a tight timeline. The Framer Motion animations were subtle and exactly matched our brand's feel.",
    avatarSeed: "sarah"
  },
  {
    name: "Vikram Malhotra",
    role: "Technical Lead",
    company: "Agrobreed Systems",
    text: "An engineer with strong design values. Himanshu took care of the database schemas, route authentication, and the front-end code, delivering a robust end-to-end product.",
    avatarSeed: "vikram"
  }
];

// ── 3D CANVAS GALAXY & LIQUID SPHERE ────────────────────────────────────

function Scene3D({ theme }: { theme: "dark" | "light" }) {
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.04;
      pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.015;
    }
  });

  const [positions] = useState(() => {
    const count = 350;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * Math.random() - 1.0);
      const r = 2.4 + Math.random() * 0.6; // Spherical distribution shell
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  });

  const sphereColor = theme === "dark" ? "#a855f7" : "#2563eb";
  const starsColor = theme === "dark" ? "#d8b4fe" : "#60a5fa";

  return (
    <group>
      <ambientLight intensity={theme === "dark" ? 0.35 : 0.9} />
      <pointLight
        position={[8, 8, 8]}
        intensity={theme === "dark" ? 2.5 : 3.0}
        color={theme === "dark" ? "#a855f7" : "#3b82f6"}
      />
      <pointLight position={[-8, -8, -8]} intensity={0.6} color="#d946ef" />

      {/* Morphing Liquid Sphere */}
      <Sphere args={[1.1, 64, 64]} scale={1.0}>
        <MeshDistortMaterial
          color={sphereColor}
          attach="material"
          distort={0.4}
          speed={2.2}
          roughness={0.15}
          metalness={0.75}
        />
      </Sphere>

      {/* Orbiting Particle Grid */}
      <Points ref={pointsRef} positions={positions} stride={3}>
        <PointMaterial
          transparent
          color={starsColor}
          size={0.06}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.4} />
    </group>
  );
}

// ── CANVAS ERROR BOUNDARY & FALLBACK ────────────────────────────────────

class CanvasErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("3D Canvas rendering failed. Swapping to CSS morphing sphere:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function BlobFallback({ theme }: { theme: "dark" | "light" }) {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <div
        className="w-44 h-44 md:w-56 md:h-56 rounded-full morphing-blob blur-[1px] transition-all duration-500"
        style={{
          background: theme === "dark"
            ? "radial-gradient(circle at 30% 30%, #a855f7 0%, #d946ef 55%, #06b6d4 100%)"
            : "radial-gradient(circle at 30% 30%, #3b82f6 0%, #6366f1 55%, #06b6d4 100%)",
          boxShadow: theme === "dark"
            ? "0 0 50px rgba(168, 85, 247, 0.35), inset -8px -8px 30px rgba(6, 182, 212, 0.25)"
            : "0 0 50px rgba(59, 130, 246, 0.2), inset -8px -8px 30px rgba(6, 182, 212, 0.15)"
        }}
      />
      {/* Orbiter 1 */}
      <div
        className="absolute w-[220px] h-[220px] md:w-[280px] md:h-[280px] border border-dashed border-slate-500/20 rounded-full animate-spin"
        style={{ animationDuration: "25s" }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400" />
      </div>
      {/* Orbiter 2 */}
      <div
        className="absolute w-[180px] h-[180px] md:w-[230px] md:h-[230px] border border-dashed border-slate-500/10 rounded-full animate-spin"
        style={{ animationDuration: "15s", animationDirection: "reverse" }}
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
      </div>
    </div>
  );
}

// ── CUSTOM HELPER COMPONENTS ───────────────────────────────────────────

// 1. Mouse Follower Background Glow
function CursorGlow() {
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", updatePosition);
    return () => window.removeEventListener("mousemove", updatePosition);
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-30 w-[380px] h-[380px] rounded-full blur-[140px] opacity-25 dark:opacity-20 transition-all duration-75 select-none"
      style={{
        left: `${mousePos.x - 190}px`,
        top: `${mousePos.y - 190}px`,
        background: "radial-gradient(circle, var(--color-primary) 0%, var(--color-secondary) 100%)"
      }}
    />
  );
}

// 2. 3D Card Tilt Component
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const x = (e.clientX - rect.left - w / 2) / (w / 2);
    const y = (e.clientY - rect.top - h / 2) / (h / 2);
    setRotateX(-y * 12);
    setRotateY(x * 12);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: "spring", stiffness: 180, damping: 20 }}
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      className={`glassmorphism-card ${className}`}
    >
      <div style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </motion.div>
  );
}

// 3. Apple/Stripe-style Magnetic Button Wrapper
function MagneticButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const btnRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPos({ x: x * 0.35, y: y * 0.35 });
  };

  const handleLeave = () => {
    setPos({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={btnRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}

// 4. Typewriter Title Hook
function Typewriter({ words }: { words: string[] }) {
  const [wIdx, setWIdx] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: any;
    const activeWord = words[wIdx];
    const speed = isDeleting ? 35 : 75;

    const tick = () => {
      if (!isDeleting) {
        setText(activeWord.substring(0, text.length + 1));
        if (text === activeWord) {
          timer = setTimeout(() => setIsDeleting(true), 1800);
          return;
        }
      } else {
        setText(activeWord.substring(0, text.length - 1));
        if (text === "") {
          setIsDeleting(false);
          setWIdx((prev) => (prev + 1) % words.length);
          return;
        }
      }
      timer = setTimeout(tick, speed);
    };

    timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, wIdx, words]);

  return <span>{text}</span>;
}

// 5. Scroll-linked stats counter
function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [num, setNum] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start: number | null = null;
    const duration = 1.8 * 1000; // 1.8 seconds

    const run = (ts: number) => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / duration, 1);
      setNum(Math.floor(prog * value));
      if (prog < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  }, [isInView, value]);

  return (
    <span ref={ref} className="font-syne font-black text-3xl md:text-5xl text-gradient-accent">
      {num}
      {suffix}
    </span>
  );
}

// 6. SVG Circular Skills indicator
function CircularSkill({ name, icon, percentage, delay }: { name: string; icon: React.ReactNode; percentage: number; delay: number }) {
  const radius = 38;
  const circ = 2 * Math.PI * radius;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="p-5 rounded-2xl glassmorphism-card flex flex-col items-center gap-4 relative group hover:border-[var(--color-primary)]/40 hover:shadow-lg hover:shadow-[var(--color-glow)] transition-all duration-300"
    >
      <div className="relative w-20 h-20 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r={radius}
            className="stroke-slate-200 dark:stroke-white/[0.04]"
            strokeWidth="5"
            fill="transparent"
          />
          <motion.circle
            cx="40"
            cy="40"
            r={radius}
            className="stroke-[url(#skillGrad)]"
            strokeWidth="5"
            fill="transparent"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            whileInView={{ strokeDashoffset: circ - (percentage / 100) * circ }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: delay + 0.1, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="skillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-secondary)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute text-xl flex items-center justify-center text-[var(--color-text)]">
          {icon}
        </div>
      </div>
      <div className="text-center">
        <h4 className="text-xs font-syne font-bold text-[var(--color-text)]">{name}</h4>
        <span className="text-[10px] font-mono text-[var(--color-text-muted)]">{percentage}% Skill</span>
      </div>
    </motion.div>
  );
}

// ── MAIN PORTFOLIO COMPONENT ───────────────────────────────────────────

export default function Portfolio() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [active, setActive] = useState("home");
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Testimonials state
  const [tIndex, setTIndex] = useState(0);

  // Contact form state
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [formErr, setFormErr] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  // Experience timeline ref for GSAP scroll fills
  const timelineRef = useRef<HTMLDivElement>(null);

  // Theme Sync on Mount
  useEffect(() => {
    const saved = localStorage.getItem("theme") as "dark" | "light" | null;
    const initial = saved || "dark";
    setTheme(initial);
    if (initial === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const target = theme === "dark" ? "light" : "dark";
    setTheme(target);
    localStorage.setItem("theme", target);
    if (target === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Track window scroll and active section
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = ["home", "about", "skills", "projects", "timeline", "services", "testimonials", "contact"];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActive(id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP Experience Timeline Scroll Trigger (Vertical Fills)
  useEffect(() => {
    if (!timelineRef.current) return () => {};
    const progressLine = timelineRef.current.querySelector(".timeline-progress-line");
    if (!progressLine) return () => {};

    const anim = gsap.fromTo(
      progressLine,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top center",
          end: "bottom center",
          scrub: true
        }
      }
    );

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, []);

  // Testimonial Autoplay Carousel loop
  useEffect(() => {
    const interval = setInterval(() => {
      setTIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  const navigateTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenu(false);
  };

  // Form validations & Submission
  const validateForm = () => {
    const err = { name: "", email: "", message: "" };
    let ok = true;
    if (!form.name.trim()) {
      err.name = "Full name is required.";
      ok = false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      err.email = "Email address is required.";
      ok = false;
    } else if (!emailRegex.test(form.email.trim())) {
      err.email = "Enter a valid email.";
      ok = false;
    }
    if (!form.message.trim()) {
      err.message = "Message details are required.";
      ok = false;
    }
    setFormErr(err);
    return ok;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });

      // Trigger Confetti Celebrations
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.6 }
      });

      // Clear success notification
      setTimeout(() => setSent(false), 5000);
    }, 1500);
  };

  return (
    <div className="bg-[var(--color-bg)] text-[var(--color-text)] min-h-screen antialiased transition-colors duration-300 relative">
      
      {/* Blueprint Dotted Background Grid */}
      <div className="fixed inset-0 bg-blueprint-grid opacity-[0.45] dark:opacity-[0.3] pointer-events-none z-0 select-none bg-fixed" />
      
      {/* Background Interactive Glow */}
      <CursorGlow />

      {/* Background Stars/Glow Overlay grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/5 via-transparent to-transparent pointer-events-none select-none z-0" />

      {/* ── NAVIGATION HEADER ───────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 flex justify-center px-4 ${
          scrolled ? "pt-3 md:pt-4" : "pt-6"
        }`}
      >
        <nav
          className={`w-full max-w-5xl rounded-full px-5 md:px-7 py-2.5 flex items-center justify-between transition-all duration-500 ${
            scrolled
              ? "bg-[var(--color-nav-bg)] backdrop-blur-xl border border-[var(--color-border)] shadow-xl shadow-black/5"
              : "bg-transparent border border-transparent"
          }`}
        >
          {/* Logo brand */}
          <button
            onClick={() => navigateTo("home")}
            className="flex items-center gap-2 group font-syne font-black text-sm tracking-tight text-[var(--color-text)]/90"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs text-white bg-gradient-to-tr from-purple-500 to-cyan-500 shadow-md group-hover:rotate-12 transition-transform duration-300">
              HS
            </div>
            <span>himanshu<span className="text-[var(--color-primary)] font-black">.</span></span>
          </button>

          {/* Nav Links Desktop */}
          <div className="hidden md:flex items-center bg-[var(--color-badge-bg)] border border-[var(--color-border)] p-1 rounded-full text-[10px] font-mono tracking-wider uppercase relative">
            {["home", "about", "skills", "projects", "timeline", "services", "contact"].map((id) => {
              const isActive = active === id;
              return (
                <button
                  key={id}
                  onClick={() => navigateTo(id)}
                  className="relative px-3.5 py-1.5 transition-colors duration-300 hover:text-[var(--color-text)] select-none focus:outline-none"
                  style={{ color: isActive ? "var(--color-text)" : "var(--color-text-muted)" }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavHighlight"
                      className="absolute inset-0 bg-white dark:bg-white/[0.06] border border-slate-200/50 dark:border-white/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  )}
                  <span className={isActive ? "font-bold" : ""}>{id}</span>
                </button>
              );
            })}
          </div>

          {/* Theme Switcher and Actions */}
          <div className="flex items-center gap-3">
            {/* Toggle Switch */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-[var(--color-border)] bg-[var(--color-badge-bg)] text-[var(--color-text)] hover:bg-white/5 hover:border-[var(--color-text)] transition-all"
              aria-label="Toggle Theme Mode"
            >
              {theme === "dark" ? (
                <svg className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: "10s" }} fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 14.05l-.707.707a1 1 0 001.414 1.414l.707-.707a1 1 0 00-1.414-1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z"/></svg>
              ) : (
                <svg className="w-4 h-4 text-slate-700" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
              )}
            </button>

            {/* Mobile Menu Icon */}
            <button
              onClick={() => setMenu(!menu)}
              className="md:hidden w-9 h-9 rounded-full flex items-center justify-center border border-[var(--color-border)] text-[var(--color-text)] transition-colors hover:bg-white/5"
            >
              {menu ? <span className="font-bold text-xs">✕</span> : <span className="text-lg">☰</span>}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {menu && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-[65px] left-4 right-4 rounded-2xl bg-[var(--color-tooltip-bg)] backdrop-blur-2xl border border-[var(--color-border)] p-3.5 flex flex-col gap-1 shadow-2xl z-50"
            >
              {["home", "about", "skills", "projects", "timeline", "services", "contact"].map((id) => (
                <button
                  key={id}
                  onClick={() => navigateTo(id)}
                  className={`text-left px-4 py-2.5 rounded-xl text-[12px] font-mono tracking-widest capitalize transition-colors ${
                    active === id
                      ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold border border-[var(--color-primary)]/20"
                      : "text-[var(--color-text-muted)] hover:bg-white/5 hover:text-[var(--color-text)]"
                  }`}
                >
                  {id}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── HERO SECTION ──────────────────────────────────────────────────────── */}
      <section
        id="home"
        className="relative min-h-screen flex flex-col justify-center items-center px-4 md:px-8 pt-28 pb-16 overflow-hidden z-10"
      >
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center relative">
          
          {/* Left Hero Text Panel */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left space-y-6 md:space-y-7 z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-fit"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glassmorphism text-[10px] font-mono tracking-widest uppercase text-[var(--color-primary)] shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-ping" />
                Available for Contract & Full-Time Inquiries
              </div>
            </motion.div>

            <div className="space-y-3">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-xs md:text-sm font-mono tracking-[0.25em] text-[var(--color-text-muted)] uppercase"
              >
                Let's construct something notable
              </motion.p>
              
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-syne font-black tracking-tight leading-[1.1] text-[var(--color-text)]"
              >
                Hi, I'm <span className="text-gradient-accent">Himanshu Sharma</span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="h-8 md:h-10 flex items-center"
              >
                <p className="text-sm sm:text-base md:text-lg font-mono text-[var(--color-text-muted)] flex items-center gap-2">
                  <span className="text-[var(--color-primary)] font-bold">&gt;</span>
                  <Typewriter
                    words={[
                      "React Developer",
                      "Node.js Developer",
                      "MongoDB Enthusiast",
                      "Problem Solver",
                      "UI/UX Explorer"
                    ]}
                  />
                  <span className="w-1.5 h-4 md:h-5 bg-[var(--color-primary)] animate-pulse inline-block" />
                </p>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xs sm:text-sm md:text-base text-[var(--color-text-muted)] leading-relaxed max-w-xl font-satoshi"
            >
              Full Stack Web Developer crafting high-fidelity design systems and robust back-end integrations. Focused on conceptualizing clean visual layouts and converting them into production code.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap items-center gap-3.5 pt-2"
            >
              <MagneticButton>
                <a
                  href="./Resume 1.pdf"
                  download
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-xs font-mono tracking-widest font-bold bg-[var(--color-text)] text-[var(--color-bg)] hover:opacity-90 transition-all shadow-md"
                >
                  <FaDownload className="w-3.5 h-3.5" />
                  DOWNLOAD RESUME
                </a>
              </MagneticButton>
              <MagneticButton>
                <button
                  onClick={() => navigateTo("contact")}
                  className="px-6 py-3.5 rounded-full text-xs font-mono tracking-widest font-bold glassmorphism hover:bg-white/5 transition-all flex items-center gap-2 border border-[var(--color-glass-border)]"
                >
                  CONTACT ME
                </button>
              </MagneticButton>
            </motion.div>

            {/* Social Icons Strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center gap-5 pt-6 md:pt-8"
            >
              {[
                { url: "https://github.com/HimAnshu165-sudo", icon: <FaGithub /> },
                { url: "https://www.linkedin.com/in/himanshu-sharma-a55611323", icon: <FaLinkedin /> },
                { url: "https://twitter.com", icon: <FaTwitter /> },
                { url: "mailto:h64933916@gmail.com", icon: <FaEnvelope /> }
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-lg text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors duration-300"
                >
                  {s.icon}
                </a>
              ))}
            </motion.div>
          </div>

          {/* Right Hero 3D Scene Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, delay: 0.2 }}
            className="lg:col-span-5 w-full h-[320px] lg:h-[480px] cursor-grab active:cursor-grabbing relative select-none"
          >
            {/* 3D R3F Canvas */}
            <div className="absolute inset-0 z-10 w-full h-full">
              <CanvasErrorBoundary fallback={<BlobFallback theme={theme} />}>
                <Canvas camera={{ position: [0, 0, 4.2] }}>
                  <Suspense fallback={null}>
                    <Scene3D theme={theme} />
                  </Suspense>
                </Canvas>
              </CanvasErrorBoundary>
            </div>
            {/* Background glowing rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[var(--color-primary)]/10 rounded-full filter blur-3xl z-0 pointer-events-none" />
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 flex justify-center pointer-events-none select-none">
          <div className="w-[18px] h-7 rounded-full border border-slate-500/30 p-1 flex justify-center">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full"
            />
          </div>
        </div>
      </section>

      {/* ── ABOUT SECTION ─────────────────────────────────────────────────────── */}
      <section
        id="about"
        className="py-24 md:py-32 px-4 md:px-8 border-t border-[var(--color-border)] relative z-10 overflow-hidden"
      >
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="flex flex-col items-center text-center space-y-3">
            <span className="text-[10px] font-mono tracking-[0.25em] text-[var(--color-primary)] uppercase">
              — core identity —
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-syne font-black text-gradient">
              Synthesizing Design & Logic
            </h2>
            <div className="w-8 h-0.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full mt-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            {/* Bio Content Card */}
            <div className="md:col-span-7 space-y-5">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-syne font-bold text-[var(--color-text)]">
                  Hi, I am Himanshu.
                </h3>
                <p className="text-xs md:text-sm text-[var(--color-text-muted)] leading-relaxed font-satoshi">
                  As a passionate Full Stack Developer, I specialize in crafting scalable web applications and intuitive modern user interfaces. I bridge the gap between frontend aesthetics and robust, structured server architectures.
                </p>
                <p className="text-xs md:text-sm text-[var(--color-text-muted)] leading-relaxed font-satoshi">
                  Currently engineering dashboard tools at Tramo Technologies, I leverage clean code practices in TypeScript and React to build internal administration consoles and JWT-secured server environments. My focus is writing clean logic that maintains accessibility standards.
                </p>
              </motion.div>
            </div>

            {/* Counters Grid Card */}
            <div className="md:col-span-5 grid grid-cols-2 gap-4">
              {[
                { val: 3, label: "Years Learning", suffix: "+" },
                { val: 15, label: "Projects Completed", suffix: "+" },
                { val: 12, label: "Technologies Mastered", suffix: "" },
                { val: 9, label: "Months Professional Experience", suffix: "" }
              ].map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="p-5 rounded-2xl glassmorphism-card border border-[var(--color-border)] flex flex-col justify-center gap-1.5"
                >
                  <Counter value={c.val} suffix={c.suffix} />
                  <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--color-text-muted)] leading-tight">
                    {c.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS SECTION ────────────────────────────────────────────────────── */}
      <section
        id="skills"
        className="py-24 md:py-32 px-4 md:px-8 border-t border-[var(--color-border)] relative z-10"
      >
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="flex flex-col items-center text-center space-y-3">
            <span className="text-[10px] font-mono tracking-[0.25em] text-[var(--color-primary)] uppercase">
              — technical competency —
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-syne font-black text-gradient">
              Skills Architecture
            </h2>
            <div className="w-8 h-0.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full mt-1" />
          </div>

          <div className="space-y-12">
            {SKILLS_DATA.map((cat, idx) => (
              <div key={idx} className="space-y-5">
                <motion.h3
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)] border-l-2 border-[var(--color-primary)] pl-3"
                >
                  {cat.title}
                </motion.h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  {cat.skills.map((skill, sIdx) => (
                    <CircularSkill
                      key={sIdx}
                      name={skill.name}
                      icon={skill.icon}
                      percentage={skill.percentage}
                      delay={sIdx * 0.08}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS SECTION ──────────────────────────────────────────────────── */}
      <section
        id="projects"
        className="py-24 md:py-32 px-4 md:px-8 border-t border-[var(--color-border)] relative z-10"
      >
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="flex flex-col items-center text-center space-y-3">
            <span className="text-[10px] font-mono tracking-[0.25em] text-[var(--color-primary)] uppercase">
              — portfolio showcase —
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-syne font-black text-gradient">
              Selected Creations
            </h2>
            <div className="w-8 h-0.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full mt-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PROJECTS_DATA.map((proj, pIdx) => (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: pIdx * 0.15 }}
                className="h-full flex"
              >
                <TiltCard className="flex flex-col justify-between w-full h-full">
                  <div className="p-6 md:p-8 space-y-5 flex-grow">
                    {/* Visual Preview Banner Mock */}
                    <div className={`w-full h-44 rounded-xl bg-gradient-to-tr ${proj.gradient} relative overflow-hidden p-4 flex flex-col justify-between group-hover:scale-[1.01] transition-transform duration-300`}>
                      <div className="absolute inset-0 bg-black/15 backdrop-blur-[0.5px] z-0" />
                      
                      {proj.id === 1 && (
                        <div className="relative z-10 w-full h-full flex flex-col justify-between text-white font-sans text-[10px]">
                          <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-red-400" />
                              <span className="w-2 h-2 rounded-full bg-yellow-400" />
                              <span className="w-2 h-2 rounded-full bg-green-400" />
                              <span className="font-mono text-[9px] text-white/60 ml-1">village-bazaar.in</span>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-300 font-bold border border-green-500/30">Active Portal</span>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 my-2">
                            <div className="bg-white/10 rounded p-1.5 flex flex-col justify-between backdrop-blur-md">
                              <span className="text-white/50 text-[8px] uppercase">Artisans</span>
                              <span className="font-syne font-black text-xs">480+</span>
                            </div>
                            <div className="bg-white/10 rounded p-1.5 flex flex-col justify-between backdrop-blur-md">
                              <span className="text-white/50 text-[8px] uppercase">Orders</span>
                              <span className="font-syne font-black text-xs">1,240</span>
                            </div>
                            <div className="bg-white/10 rounded p-1.5 flex flex-col justify-between backdrop-blur-md">
                              <span className="text-white/50 text-[8px] uppercase">Revenue</span>
                              <span className="font-syne font-black text-xs">₹1.4L</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1.5 text-[8px] text-white/60 bg-white/5 rounded px-2 py-1 font-mono">
                            <span>$ npm run dispatch</span>
                            <span className="animate-pulse">_</span>
                          </div>
                        </div>
                      )}

                      {proj.id === 2 && (
                        <div className="relative z-10 w-full h-full flex flex-col justify-between text-white font-sans text-[10px]">
                          <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                            <div className="flex items-center gap-1">
                              <span className="font-mono text-[9px] text-white/60">merchant-qr.tramo</span>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">Admin Dashboard</span>
                          </div>
                          
                          <div className="flex items-center justify-between gap-3 my-2">
                            <div className="w-12 h-12 bg-white rounded p-1 flex items-center justify-center shrink-0 shadow-md">
                              <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100">
                                <rect x="5" y="5" width="25" height="25" fill="currentColor" />
                                <rect x="70" y="5" width="25" height="25" fill="currentColor" />
                                <rect x="5" y="70" width="25" height="25" fill="currentColor" />
                                <rect x="15" y="15" width="5" height="5" fill="white" />
                                <rect x="80" y="15" width="5" height="5" fill="white" />
                                <rect x="15" y="80" width="5" height="5" fill="white" />
                                <rect x="40" y="40" width="20" height="20" fill="currentColor" />
                                <rect x="70" y="70" width="10" height="10" fill="currentColor" />
                                <rect x="45" y="75" width="10" height="15" fill="currentColor" />
                                <rect x="80" y="45" width="15" height="10" fill="currentColor" />
                              </svg>
                            </div>
                            
                            <div className="flex-grow space-y-1">
                              <div className="flex justify-between text-[8px] text-white/60">
                                <span>Session Verification</span>
                                <span className="text-green-400">JWT OK</span>
                              </div>
                              <div className="w-full bg-white/20 rounded-full h-1">
                                <div className="bg-emerald-400 h-1 rounded-full w-[85%]" />
                              </div>
                              <div className="flex justify-between text-[8px] text-white/50">
                                <span>Audit Queue</span>
                                <span>0 pending</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-[8px] text-white/70 font-mono flex items-center justify-between">
                            <span>Role: Merchant Admin</span>
                            <span className="text-[9px] font-bold">200 Verified</span>
                          </div>
                        </div>
                      )}

                      {proj.id === 3 && (
                        <div className="relative z-10 w-full h-full flex flex-col justify-between text-white font-sans text-[10px]">
                          <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                            <span className="font-mono text-[9px] text-white/60">stream.himanshu</span>
                            <div className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span className="text-[8px] text-white/60">Stereo Audio</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 my-2">
                            <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/20 flex items-center justify-center relative shadow-lg">
                              <div className="w-3.5 h-3.5 rounded-full bg-slate-700 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                              </div>
                            </div>
                            
                            <div className="flex-grow space-y-1">
                              <h4 className="font-bold text-xs leading-tight">Neon Pulse</h4>
                              <p className="text-[8px] text-white/50 uppercase">Himanshu Sharma</p>
                              <div className="flex items-end gap-0.5 h-3 pt-0.5">
                                {[35, 75, 55, 95, 60, 85, 40, 90, 70, 45, 80, 65, 50, 75].map((val, i) => (
                                  <div key={i} className="flex-grow bg-white/40 rounded-t-sm" style={{ height: `${val}%` }} />
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-[8px] text-white/60 font-mono">
                            <span>01:42 / 03:55</span>
                            <div className="flex gap-2">
                              <span>◀◀</span>
                              <span>▶</span>
                              <span>▶▶</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[9px] font-mono tracking-widest text-[var(--color-text-muted)] uppercase">
                        {proj.sub}
                      </span>
                      <h3 className="text-lg font-syne font-bold text-[var(--color-text)] tracking-tight">
                        {proj.title}
                      </h3>
                    </div>

                    <p className="text-xs text-[var(--color-text-muted)] leading-relaxed font-satoshi">
                      {proj.desc}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {proj.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[9px] font-mono px-2 py-0.5 rounded bg-[var(--color-badge-bg)] border border-[var(--color-badge-border)] text-[var(--color-text-muted)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="px-6 md:px-8 py-4 border-t border-[var(--color-border)] bg-white/[0.005] dark:bg-white/[0.005] flex items-center justify-between">
                    <a
                      href={proj.githubLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] font-mono tracking-widest text-[var(--color-text-muted)] hover:text-[var(--color-primary)] flex items-center gap-1.5 transition-colors"
                    >
                      <FaGithub className="w-3.5 h-3.5" />
                      REPOSITORY
                    </a>
                    <a
                      href={proj.demoLink}
                      className="text-[10px] font-mono tracking-widest text-[var(--color-primary)] hover:opacity-85 flex items-center gap-1 transition-all"
                    >
                      LIVE DEMO
                      <span>→</span>
                    </a>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE SECTION ─────────────────────────────────────────────────── */}
      <section
        id="timeline"
        ref={timelineRef}
        className="py-24 md:py-32 px-4 md:px-8 border-t border-[var(--color-border)] relative z-10"
      >
        <div className="max-w-5xl mx-auto space-y-16 relative">
          <div className="flex flex-col items-center text-center space-y-3">
            <span className="text-[10px] font-mono tracking-[0.25em] text-[var(--color-primary)] uppercase">
              — career milestones —
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-syne font-black text-gradient">
              Experience & Journey
            </h2>
            <div className="w-8 h-0.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full mt-1" />
          </div>

          <div className="relative mt-12 md:mt-16">
            {/* Vertical Line */}
            <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 w-0.5 h-full bg-slate-200 dark:bg-white/[0.04]">
              {/* Dynamic scroll fill bar */}
              <div className="timeline-progress-line absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-secondary)] origin-top scale-y-0" />
            </div>

            {/* Alternating Cards */}
            <div className="space-y-12">
              {TIMELINE_DATA.map((item, idx) => {
                const isLeft = idx % 2 === 0;
                return (
                  <div key={item.id} className="relative flex flex-col md:flex-row items-center justify-between">
                    
                    {/* Spacer/Content left */}
                    <div className={`w-full pl-8 md:pl-0 flex justify-start text-left md:w-[45%] ${isLeft ? "md:justify-end md:text-right" : "md:order-last md:justify-start md:text-left"}`}>
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className={`w-full p-6 rounded-2xl glassmorphism-card border border-[var(--color-border)] relative ${
                          isLeft ? "timeline-card-left" : "timeline-card-right"
                        }`}
                      >
                        <div className={`flex flex-col mb-3 items-start ${isLeft ? "md:items-end" : "md:items-start"}`}>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[var(--color-primary)]/10 text-[var(--color-primary)] mb-1 font-bold">
                            {item.year}
                          </span>
                          <h4 className="text-sm font-syne font-bold text-[var(--color-text)]">
                            {item.title}
                          </h4>
                          <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
                            {item.company}
                          </span>
                        </div>
                        <p className="text-[11px] md:text-xs text-[var(--color-text-muted)] leading-relaxed font-satoshi mb-4">
                          {item.desc}
                        </p>
                        <div className={`flex flex-wrap gap-1 justify-start ${isLeft ? "md:justify-end" : "md:justify-start"}`}>
                          {item.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[9px] font-mono px-2 py-0.5 rounded bg-[var(--color-badge-bg)] text-[var(--color-text-muted)]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    </div>

                    {/* Hinge Pin */}
                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-[var(--color-primary)] bg-[var(--color-bg)] z-10" />

                    {/* Spacer/Content right */}
                    <div className="hidden md:block w-[45%]" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES SECTION ─────────────────────────────────────────────────── */}
      <section
        id="services"
        className="py-24 md:py-32 px-4 md:px-8 border-t border-[var(--color-border)] relative z-10"
      >
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="flex flex-col items-center text-center space-y-3">
            <span className="text-[10px] font-mono tracking-[0.25em] text-[var(--color-primary)] uppercase">
              — custom operations —
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-syne font-black text-gradient">
              Professional Capabilities
            </h2>
            <div className="w-8 h-0.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full mt-1" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES_DATA.map((serv, sIdx) => (
              <motion.div
                key={sIdx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: sIdx * 0.1 }}
                className="p-6 rounded-2xl glassmorphism-card border border-[var(--color-border)] group card-hover-effect flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className={`p-3 w-fit rounded-xl bg-gradient-to-br ${serv.color} text-white shadow-sm`}>
                    {serv.icon}
                  </div>
                  <h3 className="text-sm font-syne font-bold text-[var(--color-text)]">
                    {serv.title}
                  </h3>
                  <p className="text-[11px] md:text-xs text-[var(--color-text-muted)] leading-relaxed font-satoshi">
                    {serv.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS SECTION ─────────────────────────────────────────────── */}
      <section
        id="testimonials"
        className="py-24 md:py-32 px-4 md:px-8 border-t border-[var(--color-border)] relative z-10"
      >
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="flex flex-col items-center text-center space-y-3">
            <span className="text-[10px] font-mono tracking-[0.25em] text-[var(--color-primary)] uppercase">
              — client feedback —
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-syne font-black text-gradient">
              Project Partnerships
            </h2>
            <div className="w-8 h-0.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full mt-1" />
          </div>

          <div className="relative p-6 md:p-8 rounded-2xl glassmorphism border border-[var(--color-border)] shadow-xl overflow-hidden min-h-[220px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={tIndex}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.5 }}
                className="space-y-5"
              >
                <p className="text-xs md:text-sm text-[var(--color-text-muted)] leading-relaxed italic font-satoshi">
                  "{TESTIMONIALS_DATA[tIndex].text}"
                </p>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-500 flex items-center justify-center font-bold text-white text-xs">
                    {TESTIMONIALS_DATA[tIndex].name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-syne font-bold text-[var(--color-text)]">
                      {TESTIMONIALS_DATA[tIndex].name}
                    </h4>
                    <p className="text-[9px] font-mono text-[var(--color-text-muted)]">
                      {TESTIMONIALS_DATA[tIndex].role} &middot; {TESTIMONIALS_DATA[tIndex].company}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Dots */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {TESTIMONIALS_DATA.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTIndex(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    tIndex === i ? "w-4 bg-[var(--color-primary)]" : "bg-slate-400/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT SECTION ───────────────────────────────────────────────────── */}
      <section
        id="contact"
        className="py-24 md:py-32 px-4 md:px-8 border-t border-[var(--color-border)] relative z-10"
      >
        <div className="max-w-5xl mx-auto space-y-16 relative">
          
          {/* Animated world map vector in background */}
          <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.02] flex items-center justify-center pointer-events-none select-none">
            <svg className="w-full max-w-2xl" viewBox="0 0 1000 500" fill="none" stroke="currentColor" strokeWidth="2">
              {/* Abstract layout paths representing map dots */}
              <circle cx="200" cy="150" r="10" />
              <circle cx="350" cy="220" r="15" />
              <circle cx="500" cy="180" r="20" />
              <circle cx="680" cy="300" r="12" />
              <circle cx="850" cy="240" r="18" />
              <path d="M200 150 Q275 185 350 220 T500 180 T680 300 T850 240" strokeDasharray="5,5" />
            </svg>
          </div>

          <div className="flex flex-col items-center text-center space-y-3 relative z-10">
            <span className="text-[10px] font-mono tracking-[0.25em] text-[var(--color-primary)] uppercase">
              — client connection —
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-syne font-black text-gradient">
              Initiate Project
            </h2>
            <div className="w-8 h-0.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full mt-1" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
            {/* Left Column details card */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6 lg:space-y-0 lg:py-2">
              <div className="space-y-4 text-center lg:text-left">
                <h3 className="text-lg font-syne font-bold text-[var(--color-text)]">
                  Let's engineer something memorable.
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed font-satoshi max-w-sm mx-auto lg:mx-0">
                  Whether you need a dynamic interface client, custom backend REST API routes, or a complete database configuration — transmit your message below.
                </p>
              </div>

              {/* Cards details list */}
              <div className="space-y-3 font-mono text-[11px] text-[var(--color-text-muted)]">
                <a
                  href="mailto:h64933916@gmail.com"
                  className="flex items-center gap-3.5 p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-badge-bg)] hover:bg-white/5 hover:border-[var(--color-text)] transition-all group"
                >
                  <FaEnvelope className="w-4 h-4 text-red-500" />
                  <span>h64933916@gmail.com</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/himanshu-sharma-a55611323"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3.5 p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-badge-bg)] hover:bg-white/5 hover:border-[var(--color-text)] transition-all group"
                >
                  <FaLinkedin className="w-4 h-4 text-blue-500" />
                  <span>linkedin.com/in/himanshu-sharma</span>
                </a>
                <div
                  className="flex items-center gap-3.5 p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-badge-bg)]"
                >
                  <FaMapMarkerAlt className="w-4 h-4 text-green-500" />
                  <span>Gurugram, Haryana, India</span>
                </div>
              </div>
            </div>

            {/* Right Column contact form */}
            <div className="lg:col-span-7">
              <div className="p-6 md:p-8 rounded-2xl glassmorphism border border-[var(--color-glass-border)] shadow-xl relative">
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  
                  {/* Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
                        Your Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl bg-[var(--color-input-bg)] border ${
                          formErr.name ? "border-red-500 focus:border-red-500" : "border-[var(--color-input-border)] focus:border-[var(--color-primary)]"
                        } text-xs font-mono text-[var(--color-text)] transition-all outline-none`}
                      />
                      {formErr.name && <p className="text-[9px] font-mono text-red-500">{formErr.name}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl bg-[var(--color-input-bg)] border ${
                          formErr.email ? "border-red-500 focus:border-red-500" : "border-[var(--color-input-border)] focus:border-[var(--color-primary)]"
                        } text-xs font-mono text-[var(--color-text)] transition-all outline-none`}
                      />
                      {formErr.email && <p className="text-[9px] font-mono text-red-500">{formErr.email}</p>}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="Project Partnership details..."
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--color-input-bg)] border border-[var(--color-input-border)] focus:border-[var(--color-primary)] text-xs font-mono text-[var(--color-text)] transition-all outline-none"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
                      Message details
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Describe your design rules, goals, tech stack preferences and timeline..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl bg-[var(--color-input-bg)] border ${
                        formErr.message ? "border-red-500 focus:border-red-500" : "border-[var(--color-input-border)] focus:border-[var(--color-primary)]"
                      } text-xs font-mono text-[var(--color-text)] transition-all outline-none resize-none`}
                    />
                    {formErr.message && <p className="text-[9px] font-mono text-red-500">{formErr.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl font-mono text-[10px] font-bold tracking-widest text-[var(--color-bg)] bg-[var(--color-text)] hover:opacity-90 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-slate-500 border-t-white rounded-full animate-spin" />
                    ) : sent ? (
                      <span>MESSAGE DISPATCHED ✓</span>
                    ) : (
                      <>
                        <FaPaperPlane className="w-3 h-3" />
                        <span>TRANSMIT ENQUIRY</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────────── */}
      <footer className="py-12 px-4 md:px-8 border-t border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-muted)] text-[10px] md:text-xs font-mono transition-colors duration-300 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="font-syne font-black text-sm text-[var(--color-text)]">himanshu.</span>
            <span className="text-[9px] text-slate-500 dark:text-slate-600">© 2026. All rights reserved.</span>
          </div>

          {/* Sitemaps */}
          <div className="flex items-center justify-center flex-wrap gap-5 text-[9px] tracking-wider">
            {["home", "about", "skills", "projects", "timeline", "services", "contact"].map((id) => (
              <button key={id} onClick={() => navigateTo(id)} className="hover:text-[var(--color-text)] transition-colors uppercase">
                {id}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a href="https://github.com/HimAnshu165-sudo" target="_blank" rel="noreferrer" className="hover:text-[var(--color-text)] transition-colors">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/himanshu-sharma-a55611323" target="_blank" rel="noreferrer" className="hover:text-[var(--color-text)] transition-colors">
              LinkedIn
            </a>
            
            {/* Back to Top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="w-8 h-8 rounded-full border border-[var(--color-border)] hover:bg-white/5 flex items-center justify-center hover:scale-105 transition-all text-xs"
              aria-label="Back to top"
            >
              <FaArrowUp />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
