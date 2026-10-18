export type StackGroup = {
  id: string;
  label: string;
  hint: string;
  items: string[];
};

export const stack: StackGroup[] = [
  {
    id: "genai",
    label: "GenAI / LLM",
    hint: "where most of my work lives",
    items: [
      "LLM applications",
      "RAG",
      "LangChain",
      "LangGraph",
      "Azure OpenAI",
      "Azure Document Intelligence",
      "Hugging Face",
      "FAISS",
      "Prompt engineering",
      "AI agents",
      "Ollama",
    ],
  },
  {
    id: "ml",
    label: "ML / DL",
    hint: "models, not just APIs",
    items: ["PyTorch", "TensorFlow", "Keras", "Scikit-learn", "NLP", "Neural networks", "Isolation Forest", "GANs"],
  },
  {
    id: "backend",
    label: "Backend",
    hint: "the part that has to stay up",
    items: ["Python", "FastAPI", "Django", "Flask", "REST APIs", "Uvicorn", "Pydantic", "C/C++"],
  },
  {
    id: "data",
    label: "Data",
    hint: "storage and analysis",
    items: ["PostgreSQL", "MySQL", "SQL", "Pandas", "NumPy", "SciPy", "PySpark", "Power BI"],
  },
  {
    id: "infra",
    label: "Cloud / Infra",
    hint: "deploy and observe",
    items: ["Azure", "AWS", "GCP", "Docker", "Linux", "Git", "Grafana", "OpenTelemetry", "AWS S3"],
  },
  {
    id: "realtime",
    label: "Telephony / Real-time",
    hint: "the unusual one",
    items: ["Asterisk 20", "PJSIP", "SIP", "LiveKit", "Twilio", "GSM / FXO gateways", "RTP / SRTP"],
  },
  {
    id: "tools",
    label: "Tools",
    hint: "day to day",
    items: ["Streamlit", "Gradio", "n8n", "Jupyter", "Postman"],
  },
];

export const growing = [
  "AI system design",
  "Distributed systems",
  "Cloud architecture",
  "Kubernetes",
  "LLM infrastructure",
  "Production ML systems",
  "Advanced Python",
  "DSA",
];
