import { ImageResponse } from "next/og";
import { GENERATIONS } from "@/lib/generations";
import { SITE_NAME } from "@/lib/site";

export const alt = "GenSpeak — translate anything into any generation's slang";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#fbf7ee";
const INK = "#141210";
const ACCENT = "#a3ff12";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PAPER,
          padding: 64,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: "uppercase",
              background: ACCENT,
              color: INK,
              border: `4px solid ${INK}`,
              padding: "10px 18px",
            }}
          >
            {SITE_NAME}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 82, fontWeight: 700, color: INK, letterSpacing: -2 }}>
            Say it like a
          </div>
          <div style={{ display: "flex", marginTop: 12 }}>
            <div
              style={{
                display: "flex",
                fontSize: 82,
                fontWeight: 700,
                color: INK,
                letterSpacing: -2,
                background: ACCENT,
                padding: "4px 20px",
              }}
            >
              Gen Z
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 34, color: "#6b665c", marginTop: 26 }}>
            Type plain English. Pick a generation. Get their slang.
          </div>
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {GENERATIONS.map((g) => (
            <div
              key={g.id}
              style={{
                display: "flex",
                fontSize: 26,
                fontWeight: 700,
                color: INK,
                background: g.accent,
                border: `4px solid ${INK}`,
                borderRadius: 999,
                padding: "10px 22px",
              }}
            >
              {g.label}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
