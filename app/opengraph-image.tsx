import { ImageResponse } from "next/og";
import { profile } from "@/lib/data/profile";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#07080a",
          padding: "72px",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#5eead4", fontSize: 26 }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, background: "#5eead4" }} />
          ishaan@portfolio — ~
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 86, color: "#ffffff", letterSpacing: "-0.03em" }}>{profile.name}</div>
          <div style={{ fontSize: 40, color: "#c7ced5" }}>
            AI Engineer building intelligent systems that actually ship.
          </div>
          <div style={{ fontSize: 26, color: "#6b7681", marginTop: 8 }}>
            GenAI · LLM apps · RAG · FastAPI / Django · AI voice infrastructure
          </div>
        </div>
        <div style={{ display: "flex", gap: 28, fontSize: 24, color: "#5eead4" }}>
          <span>{profile.email}</span>
          <span style={{ color: "#2a3037" }}>|</span>
          <span>{profile.links.github.replace("https://", "")}</span>
        </div>
      </div>
    ),
    size,
  );
}
