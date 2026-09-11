"use client";

import { useState, useEffect, type CSSProperties, type ReactNode } from "react";
import { GENERATIONS, type Generation } from "@/lib/generations";

const MAX = 600;

const SAMPLES = [
  "Hey team, quick reminder the quarterly report is due Friday. Let me know if you need anything.",
  "I'm not going out tonight, I'd rather stay in and watch a movie.",
  "Can you believe the price of groceries these days?",
  "Sorry I'm late, my alarm didn't go off.",
];

type Result = { gen: Generation; text: string };

export function Translator({ children }: { children: ReactNode }) {
  const [text, setText] = useState("");
  const [gen, setGen] = useState<Generation>(GENERATIONS[1]);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  // navigator is unavailable during server rendering, so this is resolved after mount.
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share), []);

  const over = text.length > MAX;
  const canGo = text.trim().length > 0 && !over && !loading;

  function say(message: string) {
    setFlash(message);
    setTimeout(() => setFlash(null), 1600);
  }

  async function translate() {
    if (!canGo) return;
    setLoading(true);
    setError(null);
    setFlash(null);
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

  function shareText(r: Result) {
    return `“${r.text}”\n\n— my English, translated into ${r.gen.label} slang`;
  }

  async function nativeShare(r: Result) {
    try {
      await navigator.share({ title: "GenSpeak", text: shareText(r), url: window.location.origin });
    } catch {
      // The viewer dismissed the share sheet. Nothing to report.
    }
  }

  function openShare(r: Result, network: "x" | "whatsapp" | "reddit" | "facebook") {
    const url = window.location.origin;
    const body = shareText(r);
    const href = {
      x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(body)}&url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${body}\n${url}`)}`,
      reddit: `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(body.slice(0, 280))}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    }[network];
    window.open(href, "_blank", "noopener,noreferrer,width=600,height=500");
  }

  async function copyTranslation(r: Result) {
    await navigator.clipboard.writeText(r.text);
    say("Copied!");
  }

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.origin);
    say("Link copied!");
  }

  const theme = { "--accent": gen.accent, "--accent-soft": gen.accentSoft } as CSSProperties;
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

        {error && (
          <div className="error" role="alert">
            {error}
          </div>
        )}

        {(result || loading) && (
          <section className={`card result${loading ? " loading" : ""}`} style={resultTheme} aria-live="polite">
            <div className="head">
              <div className="who">
                <span className="emoji" aria-hidden>
                  {shown.emoji}
                </span>
                {shown.label} says
              </div>
            </div>
            <p>{loading ? "Cooking…" : result?.text}</p>

            {result && !loading && (
              <div className="share">
                <span className="share-label">{flash ?? "Share it"}</span>
                <div className="share-btns">
                  {canNativeShare && (
                    <button type="button" className="chip" onClick={() => nativeShare(result)}>
                      Share
                    </button>
                  )}
                  <button type="button" className="chip" onClick={() => openShare(result, "x")}>
                    X
                  </button>
                  <button type="button" className="chip" onClick={() => openShare(result, "whatsapp")}>
                    WhatsApp
                  </button>
                  <button type="button" className="chip" onClick={() => openShare(result, "reddit")}>
                    Reddit
                  </button>
                  <button type="button" className="chip" onClick={() => openShare(result, "facebook")}>
                    Facebook
                  </button>
                  <button type="button" className="chip" onClick={() => copyTranslation(result)}>
                    Copy text
                  </button>
                  <button type="button" className="chip" onClick={copyLink}>
                    Copy link
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {children}

        <footer>Powered by a small open model. Slang may be exaggerated for comedic effect.</footer>
      </div>
    </main>
  );
}
