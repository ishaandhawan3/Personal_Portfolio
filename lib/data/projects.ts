export type Project = {
  slug: string;
  name: string;
  kind: string;
  year: string;
  featured: boolean;
  summary: string;
  problem: string;
  built: string[];
  architecture: string[];
  contribution: string;
  tech: string[];
  metrics?: { label: string; value: string; note?: string }[];
  /** null = no public repo. Add a URL here when one exists. */
  repo: string | null;
  demo: string | null;
  /** Shown as a small badge when the code is not public. */
  closedSource?: boolean;
  caveat?: string;
};

export const projects: Project[] = [
  {
    slug: "dionce-telephony",
    name: "Multi-Tenant AI Telephony Platform",
    kind: "Production infrastructure · DIONCE",
    year: "2025 – 2026",
    featured: true,
    summary:
      "A multi-tenant Asterisk 20 voice platform on Azure that bridges LiveKit AI voice agents to the public phone network over three interchangeable transports — with transport selection reduced to a database row.",
    problem:
      "AI voice agents are easy to demo over WebRTC and hard to put on a real phone number. Indian mobile termination through a licensed VoIP carrier is expensive, a single carrier is a single point of failure, and a multi-tenant product needs per-tenant routing, concurrency limits and recordings without a config file per customer.",
    built: [
      "Multi-tenant Asterisk 20 PBX on Azure with database-driven realtime PJSIP — endpoints, auths and AORs live in PostgreSQL, so provisioning a tenant, extension or SIM device is an insert, not an SSH session.",
      "Three interchangeable PSTN transports behind one dialplan: a GSM/FXO gateway (HT813 + SIM), Twilio SIP trunking, and direct SIP ingress.",
      "Per-tenant inbound routing and trunk profiles (ast.tenant_inbound_routes / trunk_profiles) so the carrier a DID rides is a single UPDATE away from changing.",
      "LiveKit ↔ Asterisk SIP bridge carrying custom SIP headers for tenant, device and call context, so the AI agent knows who it is talking to and on whose behalf.",
      "Automated call-recording pipelines shipping per-tenant audio to Azure blob storage, plus CDR-backed usage reporting.",
      "Security and hardening: SIP auth, firewall/IP blocking for scanner traffic, and structured logging for post-incident analysis.",
    ],
    architecture: [
      "Caller / PSTN",
      "GSM gateway · Twilio SIP trunk · SIP ingress",
      "Asterisk 20 (realtime PJSIP, PostgreSQL)",
      "Dialplan: tenant routing, concurrency, recording",
      "LiveKit SIP bridge (custom SIP headers)",
      "AI voice agent (STT → LLM → TTS)",
      "Django backend · Postgres · Azure blob",
    ],
    contribution:
      "I did the telephony engineering: turning a single-tenant PBX into a multi-tenant, database-driven platform, integrating it with the existing Django backend, standing up the LiveKit SIP bridge, and debugging it in production.",
    metrics: [
      { label: "Monthly volume", value: "~500 calls", note: "measured from CDR across 3 tenants" },
      { label: "Answered minutes", value: "800+ / mo", note: "on a 2-vCPU VM" },
      { label: "PSTN transport cost", value: "≈$0.007/min", note: "GSM path vs ≈$0.044/min Twilio-only" },
      { label: "Transports", value: "3", note: "swap = one database row" },
    ],
    caveat:
      "The GSM path is cheap per minute but has a hard concurrency ceiling — one FXO port is one simultaneous call. The real result isn't 'GSM is cheaper'; it's that transport is a per-DID database row, so low-volume Indian mobile traffic rides the cheap path while anything needing scale or international reach rides Twilio. Signaling faults (carrier INVITEs blocked at the firewall, SRTP/TLS trunk instability, false answer-supervision from the GSM gateway) were diagnosed with DSP-level audio analysis (FFT/RMS on captured call legs) and mitigated with a fail-open pickup gate — diagnosed and mitigated, not declared solved.",
    tech: [
      "Asterisk 20",
      "PJSIP",
      "SIP",
      "LiveKit",
      "Django",
      "PostgreSQL",
      "Azure",
      "Linux",
      "Python",
      "Twilio",
      "GSM / FXO",
    ],
    repo: null,
    demo: null,
    closedSource: true,
  },
  {
    slug: "doc-intelligence",
    name: "Intelligent Document Processing Pipeline",
    kind: "Production GenAI · DIONCE",
    year: "2026",
    featured: true,
    summary:
      "Azure Document Intelligence plus LLM post-processing, wrapped in validation and normalization layers, at ~97% validated extraction accuracy on high-volume production documents.",
    problem:
      "OCR alone gives you text, not trustworthy fields. Downstream business systems need structured, normalized, validated output — and a human review queue small enough to actually work through.",
    built: [
      "Document classification followed by structured extraction, so each document type hits the right schema.",
      "LLM post-processing over raw OCR output to repair fields, resolve layout ambiguity and fill structure OCR alone misses.",
      "Validation and normalization layers between the model and the database, with confidence-driven routing to human review.",
      "An OCR + LLM purchase-order reconciliation system that normalizes extracted fields and auto-flags discrepancies against ERP records.",
      "API-ready outputs consumed directly by downstream business systems.",
    ],
    architecture: [
      "Document upload",
      "Classification",
      "Azure Document Intelligence (OCR + layout)",
      "LLM post-processing / field repair",
      "Validation + normalization",
      "Structured output API",
      "ERP reconciliation + review queue",
    ],
    contribution:
      "Architected and deployed the pipeline end to end, including the validation strategy that makes the accuracy number mean something.",
    metrics: [
      { label: "Validated extraction accuracy", value: "~97%" },
      { label: "Documents", value: "High-volume production" },
    ],
    tech: ["Python", "Azure Document Intelligence", "Azure OpenAI", "FastAPI", "PostgreSQL", "Pydantic"],
    repo: null,
    demo: null,
    closedSource: true,
  },
  {
    slug: "anomaly-risk-scoring",
    name: "Hybrid Anomaly Detection & Risk Scoring",
    kind: "Applied ML · DIONCE",
    year: "2026",
    featured: true,
    summary:
      "Domain heuristics combined with Isolation Forest to produce multi-factor 0–100 risk scores that prioritize suspicious transactions for human review.",
    problem:
      "Pure unsupervised anomaly detection flags statistical oddities, not business risk. Pure rules miss everything nobody thought to write down. Reviewers need one ranked queue, not two disagreeing systems.",
    built: [
      "Feature engineering over transaction data, with domain heuristics encoding known fraud and error patterns.",
      "Isolation Forest for unsupervised outlier detection over the engineered feature space.",
      "A multi-factor scoring layer that fuses heuristic and model signals into an explainable 0–100 risk score.",
      "Ranked review queue so analysts spend their time at the top of the distribution.",
    ],
    architecture: [
      "Transaction records",
      "Feature engineering",
      "Domain heuristics  +  Isolation Forest",
      "Multi-factor fusion",
      "0–100 risk score (explainable)",
      "Prioritized review queue",
    ],
    contribution: "Designed and built the pipeline, the scoring model and the explainability layer.",
    tech: ["Python", "Scikit-learn", "Pandas", "NumPy", "PostgreSQL"],
    repo: null,
    demo: null,
    closedSource: true,
  },
  {
    slug: "rag-pdf-parser",
    name: "RAG PDF Parser",
    kind: "Personal project",
    year: "2025",
    featured: true,
    summary:
      "A retrieval-augmented generation system that answers questions over PDF documents, built on open-source embeddings and FAISS.",
    problem:
      "Dropping a whole PDF into a context window is wasteful and unreliable. Answers need to be grounded in the specific passages that support them.",
    built: [
      "Text extraction from PDFs with PDFPlumber, including layout-aware handling.",
      "Chunking with LangChain's CharacterTextSplitter, tuned for overlap vs. retrieval precision.",
      "Hugging Face embeddings into a FAISS vector index for similarity search.",
      "Retriever → LLM answer synthesis grounded in retrieved chunks.",
    ],
    architecture: [
      "PDF",
      "Text extraction (PDFPlumber)",
      "Chunking (CharacterTextSplitter)",
      "Embeddings (Hugging Face)",
      "FAISS vector store",
      "Retriever",
      "LLM",
      "Grounded answer",
    ],
    contribution: "Built the full pipeline — a hands-on study of where RAG quality actually comes from.",
    tech: ["Python", "LangChain", "FAISS", "Hugging Face", "PDFPlumber", "NLP"],
    repo: null, // [ADD GITHUB LINK]
    demo: null,
  },
  {
    slug: "activity-backend",
    name: "Activity Management Backend APIs",
    kind: "Backend engineering",
    year: "2025",
    featured: false,
    summary:
      "FastAPI services for personalized activity generation, search, categorization, lifecycle tracking, media uploads, scoring and feedback.",
    problem:
      "A personalization product needs a backend that handles content lifecycle and user media securely, not just a model endpoint.",
    built: [
      "REST APIs for activity generation, search and categorization.",
      "Lifecycle tracking, scoring and feedback endpoints.",
      "Secure S3-based asset handling for media uploads.",
    ],
    architecture: ["Client", "FastAPI", "Business logic / scoring", "AWS S3 (assets)", "Database"],
    contribution: "Designed and implemented the API surface.",
    tech: ["Python", "FastAPI", "AWS S3", "REST APIs"],
    repo: null, // [ADD GITHUB LINK]
    demo: null,
  },
  {
    slug: "activity-engine",
    name: "Activity Engine",
    kind: "Full-stack prototype",
    year: "2025",
    featured: false,
    summary:
      "An interactive Streamlit application for personalized activity discovery and progress tracking, wired to live backend APIs with role-based workflows.",
    problem: "The API surface needed a usable front end to validate the product loop with real users.",
    built: [
      "Streamlit app for discovery and progress tracking.",
      "Real-time integration with the backend APIs.",
      "Role-based workflows.",
    ],
    architecture: ["Streamlit UI", "FastAPI backend", "AWS S3", "Database"],
    contribution: "Built the application and the integration layer.",
    tech: ["Python", "Streamlit", "FastAPI", "AWS S3"],
    repo: null, // [ADD GITHUB LINK]
    demo: null,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const otherProjects = projects.filter((p) => !p.featured);
export const bySlug = (slug: string) => projects.find((p) => p.slug === slug);
