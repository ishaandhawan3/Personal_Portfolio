export type Role = {
  id: string;
  title: string;
  company: string;
  location: string;
  start: string;
  end: string;
  current?: boolean;
  blurb: string;
  points: string[];
  stack: string[];
};

export const experience: Role[] = [
  {
    id: "dionce-dse",
    title: "Data Science Engineer",
    company: "DIONCE Technologies",
    location: "Bangalore, India",
    start: "Jan 2026",
    end: "Present",
    current: true,
    blurb:
      "Own production GenAI pipelines end to end — document intelligence, LLM extraction, reconciliation and anomaly detection — plus the telephony layer that puts AI voice agents on real phone numbers.",
    points: [
      "Architected and deployed an end-to-end intelligent document processing pipeline (Azure Document Intelligence + LLM post-processing), reaching ~97% validated extraction accuracy on high-volume production documents and cutting manual review effort.",
      "Built document classification and structured extraction workflows with validation and normalization layers, exposing API-ready outputs consumed by downstream business systems.",
      "Designed an OCR + LLM purchase-order reconciliation system that normalizes extracted fields and auto-flags discrepancies against ERP records.",
      "Architected a hybrid anomaly-detection pipeline combining domain heuristics with Isolation Forest, generating multi-factor 0–100 risk scores to prioritize suspicious transactions.",
      "Built and operate a multi-tenant Asterisk 20 voice platform on Azure that bridges LiveKit AI voice agents to the PSTN across three interchangeable transports, with database-driven realtime PJSIP config and per-tenant routing.",
    ],
    stack: [
      "Python",
      "Azure OpenAI",
      "Azure Document Intelligence",
      "LangChain",
      "FastAPI",
      "Django",
      "PostgreSQL",
      "Scikit-learn",
      "Asterisk",
      "LiveKit",
      "Docker",
    ],
  },
  {
    id: "dionce-intern",
    title: "Data Science Intern",
    company: "DIONCE Technologies",
    location: "Bangalore, India",
    start: "Jul 2025",
    end: "Jan 2026",
    blurb:
      "Took a software license optimization platform for a global life-sciences client from POC to MVP, backend pipelines included.",
    points: [
      "Built a Django-based software license optimization platform, taking it from POC to MVP and surfacing ~€500K in potential cost-saving opportunities.",
      "Developed backend pipelines for Excel ingestion, rule-based analytics and AI-generated reporting, powering dashboards and exportable decision-support insights.",
      "Integrated Azure OpenAI into reporting workflows to generate contextual summaries and explainable business insights from analytical outputs.",
    ],
    stack: ["Python", "Django", "Azure OpenAI", "Pandas", "SQL", "REST APIs"],
  },
  {
    id: "sourcefuse",
    title: "AI/ML Intern",
    company: "SourceFuse Technologies",
    location: "Remote / India",
    start: "Sep 2024",
    end: "Jan 2025",
    blurb:
      "First production exposure to the LLM application stack — RAG pipelines, prompt engineering and Flask services.",
    points: [
      "Built GenAI applications using Python, Flask, LangChain, Hugging Face, prompt engineering and retrieval-augmented generation (RAG).",
      "Optimized retrieval and prompt pipelines, improving chatbot response time by 10%, retrieval efficiency by 20% and response quality by 15%.",
    ],
    stack: ["Python", "Flask", "LangChain", "Hugging Face", "RAG", "Prompt Engineering"],
  },
];
