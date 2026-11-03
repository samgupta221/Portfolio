/* ==========================================================
   Portfolio content — edit this file to update the site.
   Anything left empty is hidden automatically, so the page
   never shows a broken or placeholder link.
   ========================================================== */

window.PORTFOLIO = {
  email: "samridhigupta2523@gmail.com",

  socials: {
    github: "https://github.com/samgupta221",
    linkedin: "https://www.linkedin.com/in/samridhi-gupta-532659256"
  },

  resume: "assets/Samridhi_Gupta_Frontend_Resume.pdf",

  /* Rotating role text in the hero */
  roles: ["Front-End Developer"],

  /* Add a screenshot to a project with:
       image: "img/your-screenshot.webp", imageAlt: "Describe the screenshot"
     and a deployed link with:  live: "https://..."  */
  projects: [
    {
      title: "NodeFlow — App Graph Builder",
      description:
        "A service-graph visualization dashboard with a connectable node canvas and a live node inspector. Data fetching uses TanStack Query against a mocked REST API with simulated latency and random errors, with loading, retry and caching states, and a responsive desktop and mobile-drawer layout.",
      tech: ["React 18", "TypeScript", "TanStack Query", "Zustand", "ReactFlow", "Radix UI"],
      github: "https://github.com/samgupta221/App-graph-builder"
    },
    {
      title: "AlertCam — Thief Detection Alarm",
      description:
        "A real-time object-detection web app that runs fully client-side. It captures the webcam with WebRTC, draws bounding boxes on an HTML5 Canvas, and sounds an alarm through the Web Audio API when a person is detected.",
      tech: ["Next.js", "React.js", "TensorFlow.js", "WebRTC"],
      github: "https://github.com/samgupta221/Thief-identify"
    },
    {
      title: "ApplyIQ — Career Intelligence Platform",
      description:
        "A SaaS-style career dashboard spanning 11+ screens, including application tracking, skill-gap analysis and interview intelligence. Features interactive charts, smooth animations and light/dark theming.",
      tech: ["React 19", "Vite", "React Router", "Framer Motion", "Recharts"],
      github: "https://github.com/samgupta221/ApplyIQ"
    }
  ],

  achievements: [
    {
      title: "Finalist — Galgotias International Hackathon (Product Development)",
      issuer: "GIH",
      date: "2024",
      description: "Built “Campus Play”, a full-stack MERN platform shortlisted in the Top 16 among 1100+ teams.",
      url: "https://github.com/samgupta221/Certificates/blob/main/GIH.jpg"
    },
    {
      title: "GDG Solution Challenge",
      issuer: "Google Developer Groups",
      date: "2025",
      description: "Built responsive, accessible frontend features for a team’s full-stack solution in a cross-functional hackathon team.",
      url: "https://github.com/samgupta221/Certificates/blob/main/Hack2skill-Certificate.png"
    },
    {
      title: "Full Stack Development Course",
      issuer: "Great Learning",
      date: "2024",
      url: "https://github.com/samgupta221/Certificates/blob/main/Course.jpg"
    },
    {
      title: "Data Analytics Internship",
      issuer: "IBM SkillsBuild",
      date: "July – August 2025"
    }
  ]
};
