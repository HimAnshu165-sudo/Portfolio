export interface CapabilityCategory {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  skills: string[];
}

export const PROFILE = {
  name: "Himanshu Sharma",
  title: "FULL-STACK DEVELOPER / WEB CREATOR / WEB DESIGNER",
  shortName: "HS",
  roles: [
    "FULL-STACK DEVELOPER",
    "WEB CREATOR",
    "WEB DESIGNER",
  ],
  experienceYears: "1.5",
  projectsShipped: "10+",
  tagline: "I CAN TAKE AN IDEA FROM ZERO TO LIVE.",
  manifesto: [
    "I BUILD FOR THE WEB.",
    "BUT I DON'T BUILD BORING WEBSITES.",
    "CODE. DESIGN. MOTION.",
    "Full-stack development meets visual design and creative interaction.",
  ],
  bio: "I work across design, development, motion, and deployment to create complete web experiences — from the first interface idea to a live production build.",
  contacts: {
    email: "himanshusharma.dev@proton.me", // Centralized contact email (can be updated)
    github: "https://github.com/",
    linkedin: "https://linkedin.com/in/",
    twitter: "https://x.com/",
  },
  capabilities: [
    {
      id: "design",
      number: "01",
      title: "DESIGN",
      subtitle: "VISUAL SYSTEMS & ART DIRECTION",
      description: "Crafting distinct, high-impact digital aesthetics that command attention and elevate brand identity.",
      skills: [
        "Web Design",
        "UI Systems",
        "Responsive Interfaces",
        "Visual Direction",
        "Typography & Layout",
        "Design Engineering",
      ],
    },
    {
      id: "build",
      number: "02",
      title: "BUILD",
      subtitle: "FULL-STACK & ROBUST ARCHITECTURE",
      description: "Engineering resilient, end-to-end architectures that power performant applications from frontend to database.",
      skills: [
        "Next.js",
        "React",
        "TypeScript",
        "Backend Integration",
        "PostgreSQL",
        "Neon",
        "APIs & Workflows",
      ],
    },
    {
      id: "motion",
      number: "03",
      title: "MOTION",
      subtitle: "INTERACTION & WEBGL EXPERIENCES",
      description: "Transforming static pages into kinetic, living digital environments using spring physics, shaders, and 3D depth.",
      skills: [
        "Framer Motion",
        "GSAP & ScrollTrigger",
        "WebGL & Three.js",
        "React Three Fiber",
        "Custom GLSL Shaders",
        "Interactive UI Physics",
      ],
    },
    {
      id: "ship",
      number: "04",
      title: "SHIP",
      subtitle: "PRODUCTION, DEPLOYMENT & SPEED",
      description: "Taking products over the finish line with automated pipelines, custom domains, and uncompromising performance.",
      skills: [
        "Vercel",
        "CI/CD Pipelines",
        "Domain & DNS Config",
        "Production Debugging",
        "Performance Optimization",
        "Git / GitHub Workflows",
      ],
    },
  ] as CapabilityCategory[],
  labTokens: [
    { name: "WEBGL", category: "creative", size: "large", depth: -1.2 },
    { name: "NEXT.JS", category: "stack", size: "large", depth: 0.8 },
    { name: "POSTGRESQL", category: "backend", size: "medium", depth: -0.4 },
    { name: "NEON", category: "backend", size: "medium", depth: 0.3 },
    { name: "GSAP", category: "motion", size: "large", depth: -0.8 },
    { name: "FRAMER", category: "motion", size: "medium", depth: 1.1 },
    { name: "CI/CD", category: "devops", size: "small", depth: -0.2 },
    { name: "DEPLOYMENT", category: "devops", size: "medium", depth: 0.5 },
    { name: "AI WORKFLOWS", category: "ai", size: "medium", depth: -1.0 },
    { name: "GOOGLE FLOW", category: "ai", size: "small", depth: 0.2 },
    { name: "REACT", category: "stack", size: "large", depth: 0.0 },
    { name: "THREE.JS", category: "creative", size: "large", depth: -0.6 },
    { name: "FULL STACK", category: "stack", size: "large", depth: 0.7 },
    { name: "SHADERS", category: "creative", size: "small", depth: -0.5 },
    { name: "TYPESCRIPT", category: "stack", size: "medium", depth: 0.4 },
  ],
};
