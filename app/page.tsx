"use client";

import { useState, type CSSProperties } from "react";
import { GENERATIONS, type Generation } from "@/lib/generations";

const MAX = 600;

const SAMPLES = [
  "Hey team, quick reminder the quarterly report is due Friday. Let me know if you need anything.",
  "I'm not going out tonight, I'd rather stay in and watch a movie.",
  "Can you believe the price of groceries these days?",
  "Sorry I'm late, my alarm didn't go off.",
];

export default function Home() {
  const [text, setText] = useState("");
  const [gen, setGen] = useState<Generation>(GENERATIONS[1]);
  const [result, setResult] = useState<{ gen: Generation; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const over = text.length > MAX;
  const canGo = text.trim().length > 0 && !over && !loading;

  async function translate() {
    if (!canGo) return;
    setLoading(true);
    setError(null);
    setCopied(false);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, generation: gen.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setResult({ gen, text: data.translation });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!result) return;
    await navigator.clipboard.writeText(result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const theme = {
    "--accent": gen.accent,
    "--accent-soft": gen.accentSoft,
  } as CSSProperties;

  const shown = result?.gen ?? gen;
  const resultTheme = {
    "--accent-soft": shown.accentSoft,
    "--result-ink": shown.ink,
    "--result-font": shown.font,
  } as CSSProperties;

  return (
    <main style={theme}>
      <div className="wrap">
        <header>
          <span className="kicker">Generational translator</span>
          <h1>
            Say it like a <span className="swap">{gen.label}</span>
          </h1>
          <p className="sub">
            Type plain English, pick a generation, and get it back in their slang. {gen.emoji} {gen.tagline}
          </p>
        </header>

        <ul className="gens" aria-label="Pick a generation">
          {GENERATIONS.map((g) => (
            <li key={g.id}>
              <button
                type="button"
                className="gen"
                aria-pressed={g.id === gen.id}
                style={{ "--gen-accent": g.accent } as CSSProperties}
                onClick={() => setGen(g)}
              >
                <span aria-hidden>{g.emoji}</span>
                {g.label}
                <small>{g.years}</small>
              </button>
            </li>
          ))}
        </ul>

        <section className="card">
          <label htmlFor="input">Plain English</label>
          <textarea
            id="input"
            value={text}
            placeholder="Type something normal…"
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") translate();
            }}
          />
          <div className="row">
            <span className={`count${over ? " over" : ""}`}>
              {text.length}/{MAX} · Ctrl+Enter to translate
            </span>
            <button type="button" className="btn" onClick={translate} disabled={!canGo}>
              {loading ? "Translating" : `Translate to ${gen.label}`}
              {loading && <span className="dots" />}
            </button>
          </div>
          <div className="samples">
            {SAMPLES.map((s) => (
              <button key={s} type="button" className="sample" onClick={() => setText(s)}>
                {s.length > 42 ? s.slice(0, 42) + "…" : s}
              </button>
            ))}
          </div>
        </section>

        {error && <div className="error" role="alert">{error}</div>}

        {(result || loading) && (
          <section className={`card result${loading ? " loading" : ""}`} style={resultTheme} aria-live="polite">
            <div className="head">
              <div className="who">
                <span className="emoji" aria-hidden>{shown.emoji}</span>
                {shown.label} says
              </div>
              {result && !loading && (
                <button type="button" className="btn ghost" onClick={copy}>
                  {copied ? "Copied!" : "Copy"}
                </button>
              )}
            </div>
            <p>{loading ? "Cooking…" : result?.text}</p>
          </section>
        )}

        <footer>
          Powered by a small open model. Slang may be exaggerated for comedic effect.
        </footer>
      </div>
    </main>
  );
}
