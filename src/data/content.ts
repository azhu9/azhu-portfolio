// All site content lives here. To add a position or project, add an object to
// the matching array — the grid layout is generated from these lists.

import type { IconType } from "react-icons";
import {
  SiTypescript,
  SiJavascript,
  SiPython,
  SiPostgresql,
  SiCplusplus,
  SiPhp,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiShadcnui,
  SiSupabase,
  SiGit,
  SiLinux,
  SiVercel,
  SiEspressif,
  SiFigma,
  SiMysql,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";

import rieee from "../assets/rieeeSS.png";
import scar from "../assets/scarSS.png";
import vex from "../assets/vexbots.webp";
import portfolio from "../assets/portfolio.png";
import ruopen from "../assets/ruopenNew.png";
import belt from "../assets/beltcalc.png";

export const profile = {
  name: "Andy Zhu",
  school: "Rutgers University",
  degree: "B.S. Computer Science, Minor in Mathematics",
  graduation: "May 2027",
  // Used for the degree progress bar on the status tile.
  degreeStart: "2023-09-01",
  degreeEnd: "2027-05-15",
  location: "New Brunswick, NJ",
  timeZone: "America/New_York",
  bio: "I build things for the web and for robots. I'm a CS student at Rutgers who loves frontend and full-stack development, embedded systems, and good interface design. Outside of code: robotics, piano, 3D modeling, and keeping up with tech news.",
  current: "Engineering Intern @ Aersys",
  lookingFor: "Open to full-time SWE roles starting 2027",
  resume: "/Andy_Zhu_Resume.pdf",
  typingWpm: 136, // my best, shown on the typing test tile
};

const emailAddress = "azhu625@gmail.com";

export const links = {
  github: "https://github.com/azhu9",
  linkedin: "https://www.linkedin.com/in/azhu0/",
  email: `mailto:${emailAddress}`,
  emailAddress,
};

export interface Position {
  company: string;
  role: string;
  start: string;
  end: string; // "Present" for current roles
  location?: string;
  summary: string;
  tags: string[];
}

export const experience: Position[] = [
  {
    company: "Aersys Inc.",
    role: "Engineering Intern",
    start: "Aug 2026",
    end: "Present",
    location: "Piscataway, NJ",
    summary:
      "Engineering a low-cost camera equipment platform that replicates ~$2,000 systems at a ~$200 target cost. Writing ESP32 firmware and building prototypes end-to-end — 3D-printed enclosures, wiring, and soldering.",
    tags: ["ESP32", "Embedded C++", "Hardware"],
  },
  {
    company: "Austin ECHO",
    role: "Lead Software Engineering Intern",
    start: "May 2026",
    end: "Aug 2026",
    location: "Remote",
    summary:
      "Led a full website redesign with a cross-functional team, from Figma and Notion through WordPress deployment. Built front- and back-end features in JavaScript, PHP, and MySQL, and added Google Analytics for SEO and CTR tracking.",
    tags: ["PHP", "MySQL", "WordPress", "Figma"],
  },
  {
    company: "Rutgers IEEE — VEXU Robotics",
    role: "President & Lead Software Engineer",
    start: "Sep 2023",
    end: "Present",
    location: "New Brunswick, NJ",
    summary:
      "Lead a 10-member engineering team through Agile-style sprints and code reviews. Built autonomous subsystems — odometry, differential drive control, color sorting — and tuned PID and motion profiling for 35% better path accuracy and 60% faster runs. Qualified for Worlds in 2024 and 2025.",
    tags: ["C++", "PID", "Odometry", "Leadership"],
  },
  {
    company: "Rutgers IEEE",
    role: "Webmaster",
    start: "Apr 2025",
    end: "Present",
    location: "New Brunswick, NJ",
    summary:
      "Rebuilt ieee.rutgers.edu on a modern React architecture, cutting average page load time by ~35% and making the site far easier to maintain. Built fully responsive UI components for mobile.",
    tags: ["React", "TailwindCSS"],
  },
  {
    // TODO: replace the dates
    company: "Nayak, Aulak, Brooks & Parzecki",
    role: "Engineering Extern",
    start: "May 2026",
    end: "Aug 2026",
    summary:
      "Designed a modular lightstand organizer through 5 design iterations, engineering mounting geometry and print tolerances to fit industry-standard storage rails. Built prototypes with 3D printing and laser cutting in wood and metal, and co-led a 3-person CAD team in Fusion 360 and SolidWorks.",
    tags: ["Fusion 360", "SolidWorks", "3D Printing", "Laser Cutting"],
  },
  {
    company: "Innovation Foundry",
    role: "Technology Instructor",
    start: "Jun 2024",
    end: "Aug 2024",
    summary:
      "Taught groups of students ages 8–13 mobile app development, AR/VR in Unity, 3D printing, laser cutting, and Arduino. Designed 3D-printed, Arduino-driven puzzles for escape room programs.",
    tags: ["Unity", "Arduino", "Teaching"],
  },
  {
    company: "All Star Code",
    role: "Summer Scholar — Cohort Representative",
    start: "Jun 2022",
    end: "Aug 2022",
    summary:
      "Six-week intensive in HTML, CSS, and JavaScript. Selected as 1 of 30 students to represent the cohort for future teaching partnerships.",
    tags: ["JavaScript", "HTML/CSS"],
  },
];

export interface Project {
  id: string; // unique, used to save tile positions
  title: string;
  description: string;
  image?: string; // omit to show a placeholder until a screenshot is added
  tags: string[];
  github?: string;
  live?: string;
  featured?: boolean; // featured projects also appear on the About and Contact tabs
  details?: string[]; // extra bullet points shown when the card is expanded
}

export const projects: Project[] = [
  {
    id: "media-switcher",
    title: "Media Switcher",
    description:
      "Browser extension for multiviewing live sports and other media, with seamless swapping between streams. A built-in AI detects ad breaks and automatically switches to another stream.",
    tags: ["Browser Extension", "AI"],
    featured: true,
  },
  {
    id: "cad-assistant",
    title: "CAD AI Assistant",
    description:
      "An AI assistant for CAD work. Ask a question from inside the application and it highlights the relevant UI on screen and walks you through the tools step by step.",
    tags: ["AI", "CAD"],
    featured: true,
  },
  {
    id: "img2dxf",
    title: "Image → DXF for Onshape",
    description:
      "Turns PNG/JPG/WEBP images into clean, scaled DXF sketches ready for Onshape. Straight edges become single lines, curves become smooth splines, stray dots are removed, and the result is sized in inches and centered.",
    tags: ["Python", "Potrace", "NumPy", "ezdxf", "Vercel"],
    github: "https://github.com/azhu9/img2dwg",
    live: "https://img2dwg.vercel.app",
    featured: true,
    details: [
      "Python serverless function on Vercel does the conversion with Pillow, NumPy, Potrace, and ezdxf",
      "Straight edges become single lines and curves become smooth splines, so sketches are clean to constrain in Onshape",
      "Removes stray specks, scales the output to a set width or height in inches, and centers it on the origin",
      "Live preview in the browser before downloading the DXF",
    ],
  },
  {
    id: "ruopen",
    title: "RU Open",
    description:
      "Full-stack app that shows Rutgers students whether a classroom is free right now. Relational schema in Supabase/PostgreSQL fed by a Python scraper of Rutgers class directories.",
    image: ruopen,
    tags: ["Next.js", "TypeScript", "Supabase", "PostgreSQL"],
    github: "https://github.com/azhu9/ruopen",
    live: "https://ruopen.vercel.app/",
    featured: true,
    details: [
      "Next.js with React Server Components, TypeScript, and Supabase/PostgreSQL",
      "Relational schema designed for fast room lookups and future expansion",
      "Data pulled from Rutgers class directories with a Python web scraper",
      "Responsive ShadCN UI that works on phones and desktops",
    ],
  },
  {
    id: "buildathon-inventory",
    title: "IEEE Build-a-thon Inventory",
    description:
      "Parts checkout system for the Rutgers IEEE Build-a-thon. Teams browse a component catalog, place orders, and track their status, while admins manage an order queue, team inventories, and email notifications.",
    tags: ["Next.js", "TypeScript", "Supabase", "Resend"],
    github: "https://github.com/azhu9/IEEE-Build-a-thon-Inventory-System",
    live: "https://ieee-build-a-thon-inventory-system.vercel.app",
    featured: true,
    details: [
      "Contestant side: team login, component catalog, cart, checkout, and live order status",
      "Admin side: order queue, inventory overview, and per-team inventory and member management",
      "Email notifications sent through Resend",
      "Next.js App Router with Supabase for auth and data",
    ],
  },
  {
    id: "vex-lib",
    title: "VEXU Programming Library",
    description:
      "C++ library powering Rutgers VEXU robots: driver control, controller macros, and autonomous routines built on PID control and an odometry feedback loop.",
    image: vex,
    tags: ["C++", "PID", "Odometry"],
    github: "https://github.com/azhu9/VEX25-SCAR-24in",
    featured: true,
    details: [
      "Driver control with controller macros for competition matches",
      "Autonomous routines using custom PID controllers and motion profiling",
      "Wheel odometry for position tracking, plus color sorting",
      "Helped the team qualify for the VEX World Championship in 2024 and 2025",
    ],
  },
  {
    // TODO: add the poster image (and a PDF link via `live` if you want one)
    id: "remote-sensing-poster",
    title: "Remote Sensing Research Poster",
    description:
      "Research poster from my remote sensing work. Full poster and write-up coming soon.",
    tags: ["Remote Sensing", "Research"],
  },
  {
    id: "recipeclear",
    title: "RecipeClear",
    description:
      "Paste a recipe URL and get a clean, structured recipe with no life stories or ads. Claude extracts the page into JSON, rendered as cards with serving scaling and a step-by-step Cooking Mode.",
    tags: ["React", "Claude API"],
    github: "https://github.com/azhu9/recipesimplify",
  },
  {
    id: "studymax",
    title: "StudyMax AI",
    description:
      "AI study board that generates flashcards, practice questions, and study guides from your material, with a streaming chat panel and a highlight tool for asking about any part of the page.",
    tags: ["React", "TailwindCSS", "Gemini API"],
    github: "https://github.com/azhu9/studymaxai",
  },
  {
    id: "qr-gen",
    title: "Free QR Generator",
    description:
      "QR code generator with no sign-in, no tracking, and no expiration. Runs entirely in the browser with custom shapes, logos, and error correction levels.",
    tags: ["JavaScript", "HTML/CSS"],
    github: "https://github.com/azhu9/QR-Gen",
    live: "https://fqr-gen.vercel.app",
  },
  {
    id: "flex-accordion",
    title: "Flex Accordion Blocks",
    description:
      "WordPress plugin for accordion menus that are actually good. Fully customizable and flexible, it lets you place any Gutenberg blocks (groups, rows, images, buttons) inside each header and panel instead of plain text.",
    tags: ["WordPress", "PHP", "Gutenberg"],
    github: "https://github.com/azhu9/flex-accordion-blocks",
  },
  {
    id: "rieee",
    title: "Rutgers IEEE Website",
    description:
      "Rebuilt the Rutgers IEEE site as Webmaster. React and Tailwind with flowbite-react and Meraki UI components, plus lazy-loaded images for faster loads.",
    image: rieee,
    tags: ["React", "TailwindCSS", "Flowbite"],
    github: "https://github.com/azhu9/rieee",
    live: "https://rieee.vercel.app/",
  },
  {
    id: "scar-site",
    title: "Rutgers VEXU Website",
    description:
      "Site for SCAR, the Rutgers IEEE VEX U team: animated hero, season-by-season team history with awards and media, sponsors, and a sponsorship form.",
    image: scar,
    tags: ["React", "React Router", "TailwindCSS"],
    github: "https://github.com/azhu9/SCAR-Web-V2",
    live: "https://www.scarrobotics.com/",
  },
  {
    id: "belt-calc",
    title: "Timing Belt Calculator",
    description:
      "Calculates sizes and tolerances for HTD 9mm, 15mm, and GT2 9mm timing belts. Used by VEXU Team SCAR in its robot design process.",
    image: belt,
    tags: ["React", "ShadCN"],
    github: "https://github.com/azhu9/vex-belt-wizard",
    live: "https://belt-calculator.vercel.app/",
  },
  {
    id: "portfolio",
    title: "This Portfolio",
    description:
      "The site you're on: a draggable bento grid with saved layouts, light/dark themes, and a hue slider that recolors everything.",
    image: portfolio,
    tags: ["React", "TypeScript", "TailwindCSS"],
    github: "https://github.com/azhu9/azhu-portfolio",
    live: "https://www.azhu.dev/",
    details: [
      "Draggable bento grid built on react-grid-layout, with layouts saved per tab",
      "Light and dark themes plus a hue slider that recolors the whole site",
      "All content driven from a single data file",
      "Command menu (Ctrl+K), expandable project cards, and a live GitHub tile",
    ],
  },
];

export interface Skill {
  name: string;
  icon: IconType;
  color?: string; // brand color; omit for monochrome logos
}

export const skills: { group: string; items: Skill[] }[] = [
  {
    group: "Languages",
    items: [
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
      { name: "Python", icon: SiPython, color: "#3776AB" },
      { name: "C++", icon: SiCplusplus, color: "#00599C" },
      { name: "Java", icon: FaJava, color: "#ED8B00" },
      { name: "SQL", icon: SiMysql, color: "#4479A1" },
      { name: "PHP", icon: SiPhp, color: "#777BB4" },
    ],
  },
  {
    group: "Frameworks & Tools",
    items: [
      { name: "React", icon: SiReact, color: "#61DAFB" },
      { name: "Next.js", icon: SiNextdotjs },
      { name: "Tailwind", icon: SiTailwindcss, color: "#06B6D4" },
      { name: "ShadCN", icon: SiShadcnui },
      { name: "Supabase", icon: SiSupabase, color: "#3FCF8E" },
      { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
      { name: "Git", icon: SiGit, color: "#F05032" },
      { name: "Linux", icon: SiLinux, color: "#FCC624" },
      { name: "Vercel", icon: SiVercel },
      { name: "Figma", icon: SiFigma, color: "#F24E1E" },
      { name: "ESP32", icon: SiEspressif, color: "#E7352C" },
    ],
  },
];
