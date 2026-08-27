/**
 * Every piece of portfolio copy lives here so the section components stay
 * presentational and the case-study routes can be generated from one list.
 */

export const SITE = {
  name: "Archit Kandu",
  role: "Full Stack Engineer",
  location: "Gurugram, India",
  availability: "Gurugram, India — open to conversations",
  url: "https://architkandu.com",
  email: "architkandu@gmail.com",
  phone: "+91 97924 45971",
  phoneHref: "tel:+919792445971",
  github: "https://github.com/ArchitKandu",
  linkedin: "https://linkedin.com/in/architkandu",
  resume: "/resume.pdf",
} as const;

export const SOCIAL_LINKS = [
  { label: "architkandu.com", href: SITE.url },
  { label: "GitHub", href: SITE.github },
  { label: "LinkedIn", href: SITE.linkedin },
] as const;

/** Anchor ids double as the IntersectionObserver keys for the nav highlight. */
export const SECTIONS = [
  { id: "hero", nav: "Home" },
  { id: "about", nav: "About" },
  { id: "stack", nav: "Stack" },
  { id: "journey", nav: "Journey" },
  { id: "work", nav: "Work" },
  { id: "contact", nav: "Contact" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

/** The numbered rail on the right edge skips the hero. */
export const INDICATOR_SECTIONS = SECTIONS.filter((s) => s.id !== "hero").map(
  (section, index) => ({
    ...section,
    num: `0${index + 1}`,
  }),
);

export const HERO = {
  firstName: "Archit",
  lastName: "Kandu",
  lead:
    "Full Stack Engineer on the early engineering team at an AI-first legal tech startup. I own features end to end — system design, implementation, testing, deployment — across Next.js, TypeScript, Google Cloud and Firebase.",
} as const;

export const ABOUT = {
  headline: ["Product-focused engineering,", "from architecture to deploy."],
  body:
    "I build scalable web applications and cloud infrastructure at an AI-first legal tech startup, where I’m a core member of the early engineering team. My work spans product architecture, technology selection and the technical decisions that took the platform from early prototype to a production-ready system.",
  bodyShort:
    "I build scalable web applications and cloud infrastructure at an AI-first legal tech startup, as a core member of the early engineering team. My work spans architecture, technology selection and the decisions that took the platform to production.",
  aside:
    "Day to day I work close to AI-driven backend systems built with FastAPI, LangChain and LangGraph, and I stay involved in architecture discussions, technical planning and mentoring inside a small, fast-moving team.",
  facts: [
    { value: "2+ yrs", label: "Building in production" },
    { value: "End to end", label: "System design to deployment" },
    { value: "Core", label: "Early engineering team" },
  ],
  now: [
    { key: "Role", value: "Full Stack Engineer", valueShort: "Full Stack Engineer" },
    {
      key: "Company",
      value: "Blackcoat.ai — AI-first legal tech",
      valueShort: "Blackcoat.ai",
    },
    { key: "Based in", value: "Gurugram, India", valueShort: "Gurugram, India" },
    {
      key: "Focus",
      value: "Next.js · TypeScript · GCP · Firebase",
      valueShort: "Next.js · TypeScript",
    },
  ],
} as const;

export type StackCategory = {
  name: string;
  items: readonly string[];
};

export const STACK_CATEGORIES: readonly StackCategory[] = [
  { name: "Frontend", items: ["Next.js", "React", "HTML", "CSS"] },
  {
    name: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "SQL", "C/C++"],
  },
  { name: "AI / LLM", items: ["LangChain", "LangGraph", "Prompt Engineering"] },
  {
    name: "Cloud & DevOps",
    items: ["Google Cloud Platform", "Firebase", "Docker"],
  },
  { name: "Backend", items: ["FastAPI", "Node.js", "Express.js", "REST APIs"] },
  { name: "Databases", items: ["MongoDB", "Firestore"] },
  {
    name: "Tools",
    items: ["Git", "GitHub", "Postman", "Cursor", "Windsurf", "MCP"],
  },
];

/** Technologies rendered with the heavier, larger treatment. */
export const PRIMARY_STACK: readonly string[] = [
  "Next.js",
  "TypeScript",
  "React",
  "Google Cloud Platform",
  "Firebase",
  "FastAPI",
  "LangChain",
  "LangGraph",
  "Python",
];

export const STACK_NOTES: Readonly<Record<string, string>> = {
  "Next.js":
    "Primary framework for the scalable frontend systems I design and ship at Blackcoat.ai.",
  TypeScript:
    "Default language for product work — every frontend feature I own end to end.",
  React: "The component model underneath everything I build on the web.",
  "Google Cloud Platform":
    "Cloud infrastructure I build and maintain for scalability and reliability.",
  Firebase: "Used for both infrastructure and data on the production platform.",
  FastAPI: "The Python backend services I collaborate with day to day.",
  LangChain: "Powers the AI workflows the product is built around.",
  LangGraph: "Orchestrates the agentic backend flows I integrate against.",
  "Prompt Engineering":
    "Part of working close to AI-driven backend systems.",
  Python: "Backend collaboration, AI workflows, and coursework foundations.",
  "Node.js": "Backend runtime for REST APIs, including the Medimate services.",
  MongoDB: "Document store behind the Medimate backend.",
  Docker: "Containerisation for consistent builds and deploys.",
  MCP: "Model Context Protocol tooling in my day-to-day workflow.",
};

export const STACK_DEFAULT = {
  category: "Core stack",
  skill: "Next.js + TypeScript",
  note:
    "The pairing I reach for first: scalable frontend systems owned end to end, from system design through deployment.",
} as const;

export function findStackCategory(skill: string): string {
  return (
    STACK_CATEGORIES.find((category) => category.items.includes(skill))?.name ??
    "Stack"
  );
}

export type Milestone = {
  short: string;
  kind: string;
  dates: string;
  title: string;
  org: string;
  note: string;
  bullets: readonly string[];
};

/** Ordered oldest to newest; the UI presents them newest first. */
export const MILESTONES: readonly Milestone[] = [
  {
    short: "B.Tech, CSE",
    kind: "Education",
    dates: "2020 — 2024",
    title: "B.Tech, Computer Science and Engineering",
    org: "KIIT University · Bhubaneswar",
    note: "",
    bullets: [
      "Four years of computer science foundations — systems, data, networks and AI — alongside project work in web and backend development.",
      "Graduated in 2024 with a focus on backend systems, cloud and applied AI.",
      "Coursework across data structures, algorithms, databases, operating systems, computer networks, machine learning, artificial intelligence and cloud computing.",
    ],
  },
  {
    short: "SDE Intern",
    kind: "CSG Systems",
    dates: "Feb — Dec 2024",
    title: "Software Development Engineer — Intern",
    org: "CSG Systems International · Bengaluru",
    note: "",
    bullets: [
      "Worked on backend and frontend components within a large, production-scale codebase serving enterprise clients.",
      "Collaborated with senior engineers to analyse requirements and deliver scalable solutions.",
      "Participated in code reviews, bug fixes and unit testing to improve overall code quality.",
    ],
  },
  {
    short: "Full Stack Intern",
    kind: "Blackcoat.ai",
    dates: "Jul — Oct 2025",
    title: "Full Stack Engineer — Intern",
    org: "Blackcoat.ai · Gurugram",
    note: "Promoted to Full Stack Engineer in Nov 2025",
    bullets: [
      "Joined the early engineering team at an AI-first legal tech startup.",
      "Worked across the product’s frontend systems and cloud infrastructure while the platform was still an early prototype.",
      "Day-to-day stack: Next.js and TypeScript on the frontend, Google Cloud and Firebase for infrastructure.",
    ],
  },
  {
    short: "Full Stack Engineer",
    kind: "Blackcoat.ai",
    dates: "Nov 2025 — Present",
    title: "Full Stack Engineer, Early Engineering Team",
    org: "Blackcoat.ai · Gurugram",
    note: "Current role",
    bullets: [
      "Core member of the early engineering team, contributing to product architecture, technology selection and key technical decisions.",
      "Helped transition the platform from early prototype to a production-ready system through architectural and infrastructure improvements.",
      "Designed and developed scalable frontend systems in Next.js and TypeScript, owning features end to end from system design to implementation, testing and deployment.",
      "Built and maintained cloud infrastructure on Google Cloud Platform and Firebase, ensuring scalability and reliability.",
      "Collaborated closely with Python and FastAPI backend services supporting AI workflows powered by LangChain and LangGraph.",
      "Actively involved in technical planning, architecture discussions and mentoring within a small, fast-moving team.",
    ],
  },
];

export type Project = {
  slug: string;
  name: string;
  summary: string;
  tags: readonly string[];
  kind: string;
  repo: string;
  lead: string;
  focus: string;
  objective: string;
  solution: string;
  contribution: string;
};

export const PROJECTS: readonly Project[] = [
  {
    slug: "medimate",
    name: "Medimate",
    summary: "Tracks medication and sends dose reminders",
    tags: ["Node.js", "MongoDB", "REST APIs"],
    kind: "Backend · Personal project",
    repo: SITE.github,
    lead:
      "Medication management backend — services for medication tracking and dose reminders, built around reliability and scale.",
    focus:
      "Reliability and scalability of the API layer. Source is public on GitHub.",
    objective:
      "Give patients a dependable way to track medication and receive dose reminders, with the correctness burden held in the backend rather than the client.",
    solution:
      "Designed and implemented the backend services for medication tracking and dose reminders, exposed through REST APIs on Node.js with MongoDB as the store.",
    contribution:
      "Sole author of the service design and implementation — data model, API surface, and reminder logic, with reliability and scalability as the driving constraints.",
  },
  {
    slug: "repo-cartographer",
    name: "Repo Cartographer",
    summary: "Turns an unfamiliar repository into an onboarding guide",
    tags: ["Python", "LangGraph", "GitHub API", "Gemini"],
    kind: "AI agent · Personal project",
    repo: "https://github.com/ArchitKandu/repo-cartographer",
    lead:
      "Point it at a public GitHub repository and ask a question. It reads the real code through the GitHub API — never cloning — and writes an onboarding guide that cites only the files it actually opened.",
    focus:
      "Making an agent’s output trustworthy rather than merely plausible. Source is public on GitHub.",
    objective:
      "Answering “where does routing happen?” in an unfamiliar codebase takes judgement about what to read next, which a script cannot supply, and no context window holds a whole repository. The failure that matters is a guide confidently citing a file that does not exist, because a reader will trust it and go looking.",
    solution:
      "A LangGraph orchestrator sizes the repository up and fans out to as many as three explorers, one per top-level directory, each in its own context window. A doc-writer with no repository access builds the guide from their notes, and a link-checker with no model in it matches every cited path against the real file tree. Each guide states what it did not read.",
    contribution:
      "Sole author, built in nine phases with each definition of done fixed in advance and the measurement that proved it. The capability boundaries are pinned by tests that need no model, the GitHub tools layer is tested against the live API rather than mocks, and the one irreversible action is gated behind human approval and off by default.",
  },
];

export function findProject(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}

export const CONTACT = {
  headline: ["Let’s build something", "meaningful."],
} as const;
