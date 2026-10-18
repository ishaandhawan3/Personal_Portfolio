export type Diagram = {
  id: string;
  title: string;
  caption: string;
  nodes: { label: string; sub?: string; accent?: boolean }[];
  branch?: { at: number; options: string[] };
};

export const diagrams: Diagram[] = [
  {
    id: "voice",
    title: "AI Voice Platform",
    caption:
      "A phone call becomes an LLM conversation. Transport is chosen per DID from a database row, so the cheap path and the scalable path are the same code.",
    nodes: [
      { label: "Caller", sub: "mobile / landline / softphone" },
      { label: "PSTN transport", sub: "GSM gateway · Twilio SIP · SIP ingress" },
      { label: "Asterisk 20", sub: "realtime PJSIP from PostgreSQL", accent: true },
      { label: "Dialplan", sub: "tenant routing · concurrency · recording" },
      { label: "LiveKit SIP bridge", sub: "custom SIP headers: tenant, device, call ctx", accent: true },
      { label: "AI voice agent", sub: "STT → LLM → TTS" },
      { label: "Back to caller", sub: "audio returned over the same leg" },
    ],
  },
  {
    id: "rag",
    title: "RAG Pipeline",
    caption:
      "Retrieval quality is decided long before the LLM sees anything — in extraction, chunking and the embedding space.",
    nodes: [
      { label: "Documents", sub: "PDF / scans" },
      { label: "Extraction", sub: "PDFPlumber · OCR" },
      { label: "Chunking", sub: "size + overlap tuning" },
      { label: "Embeddings", sub: "Hugging Face / Azure OpenAI", accent: true },
      { label: "Vector store", sub: "FAISS" },
      { label: "Retriever", sub: "top-k + filtering" },
      { label: "LLM", sub: "grounded synthesis", accent: true },
      { label: "Answer", sub: "with citations to chunks" },
    ],
  },
  {
    id: "idp",
    title: "Document Intelligence",
    caption:
      "The model is one stage. The validation and normalization layers around it are what let a number like ~97% mean anything.",
    nodes: [
      { label: "Upload", sub: "high-volume batch" },
      { label: "Classification", sub: "route to schema" },
      { label: "Azure Document Intelligence", sub: "OCR + layout" },
      { label: "LLM post-processing", sub: "field repair + structuring", accent: true },
      { label: "Validation / normalization", sub: "schema + business rules", accent: true },
      { label: "Structured API output", sub: "consumed downstream" },
      { label: "ERP reconciliation", sub: "auto-flag discrepancies" },
    ],
  },
];
