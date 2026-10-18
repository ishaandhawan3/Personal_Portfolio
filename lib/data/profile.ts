export const profile = {
  name: "Ishaan Dhawan",
  handle: "ishaan",
  role: "AI Engineer",
  headline: "AI Engineer building intelligent systems that actually ship.",
  tagline:
    "Generative AI, LLM applications and RAG, wired into real backends — FastAPI, Django, Postgres — and real infrastructure, down to the phone network.",
  location: "Bangalore, India",
  email: "ishaanaadi2000@gmail.com",
  phone: "+91 82838 06083",
  links: {
    github: "https://github.com/ishaandhawan3",
    linkedin: "https://www.linkedin.com/in/ishaanaadi2000",
  },
  githubUser: "ishaandhawan3",
  // Drop a PDF at /public/resume.pdf to enable the `resume` command + nav button.
  resumePath: "/resume.pdf",
  summary: [
    "I build production GenAI systems — intelligent document processing, LLM-based extraction and reconciliation pipelines, and anomaly detection — and the backends that carry them.",
    "Most of my work lives at the seam between a model and a system that has to stay up: Azure Document Intelligence and LLM post-processing behind validation layers, FastAPI services other teams consume, a multi-tenant Asterisk voice platform that bridges AI voice agents to the public phone network.",
    "I'm a CSE (AI/ML) graduate from Chandigarh University, currently a Data Science Engineer at DIONCE Technologies, and I'm pushing deeper into AI system design, LLM infrastructure and cloud architecture.",
  ],
  availability: [
    "AI engineering roles",
    "GenAI / LLM product work",
    "AI + backend systems consulting",
    "Technical collaborations",
  ],
  education: {
    degree: "B.E. Computer Science Engineering — AI/ML",
    school: "Chandigarh University, Punjab, India",
    period: "2021 – 2025",
  },
} as const;

export type Profile = typeof profile;
