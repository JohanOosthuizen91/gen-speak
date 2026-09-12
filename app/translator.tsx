"use client";

import { useState, useEffect, type CSSProperties, type ReactNode } from "react";
import { GENERATIONS, type Generation } from "@/lib/generations";
import { XIcon, WhatsAppIcon, RedditIcon, FacebookIcon, ShareIcon, CopyIcon, LinkIcon } from "./icons";

const MAX = 600;

const KOFI = "https://ko-fi.com/johanoosthuizen";

const SAMPLES = [
  "Hey team, quick reminder the quarterly report is due Friday. Let me know if you need anything.",
  "I'm not going out tonight, I'd rather stay in and watch a movie.",
  "Can you believe the price of groceries these days?",
  "Sorry I'm late, my alarm didn't go off.",
];

const SLANG_SAMPLES = [
  "not going out tonight, lowkey staying in for a movie marathon 💀 it's giving hermit era",
  "yo that spot was straight bussin no cap 🔥 W for the squad fr",
  "Well I'll be, the grocery bills these days are just not hunky-dory… in my day a loaf cost pennies.",
  "my bad i'm late, alarm ghosted me, i'm cooked",
];

type Direction = "to-slang" | "to-plain";
type Result = { gen: Generation | null; text: string };

export function Translator({ children }: { children: ReactNode }) {
  const [text, setText] = useState("");
  const [direction, setDirection] = useState<Direction>("to-slang");
  const [gen, setGen] = useState<Generation>(GENERATIONS[1]);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  // navigator is unavailable during server rendering, so this is resolved after mount.
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share), []);

  const toPlain = direction === "to-plain";
  const over = text.length > MAX;
  const canGo = text.trim().length > 0 && !over && !loading;

  function switchTo(next: Direction) {
    if (next === direction) return;
    setDirection(next);
    setResult(null);
    setError(null);
    // Carry the last result across so flipping direction can translate it straight back.
    setText(result?.text ?? "");
  }

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
        body: JSON.stringify({ text, generation: gen.id, direction }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setResult({ gen: toPlain ? null : gen, text: data.translation });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function shareText(r: Result) {
    const how = r.gen ? `my English, translated into ${r.gen.label} slang` : "slang, translated into plain English";
    return `“${r.text}”\n\n— ${how}`;
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
  // Plain English gets the neutral house style rather than any generation's look.
  const shown = toPlain ? null : (result?.gen ?? gen);
  const resultTheme = {
    "--accent-soft": shown?.accentSoft ?? "#f0ece2",
    "--result-ink": shown?.ink ?? "#141210",
    "--result-font": shown?.font ?? "var(--font-ui)",
  } as CSSProperties;

  return (
    <main style={theme}>
      <div className="wrap">
        <header>
          <span className="kicker">Generational translator</span>
          <h1>
            {toPlain ? (
              <>
                What does <span className="swap">that</span> mean?
              </>
            ) : (
              <>
                Say it like a <span className="swap">{gen.label}</span>
              </>
            )}
          </h1>
          <p className="sub">
            {toPlain
              ? "Paste slang you don't recognise and get it back in plain English. Works with any generation. 🔍"
              : `Type plain English, pick a generation, and get it back in their slang. ${gen.emoji} ${gen.tagline}`}
          </p>
        </header>

        <div className="direction" role="group" aria-label="Translation direction">
          <button type="button" aria-pressed={!toPlain} onClick={() => switchTo("to-slang")}>
            English to slang
          </button>
          <button type="button" aria-pressed={toPlain} onClick={() => switchTo("to-plain")}>
            Slang to English
          </button>
        </div>

        {!toPlain && (
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
        )}

        <section className="card">
          <label htmlFor="input">{toPlain ? "Slang" : "Plain English"}</label>
          <textarea
            id="input"
            value={text}
            placeholder={toPlain ? "Paste the slang you're stuck on…" : "Type something normal…"}
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
              {loading ? "Translating" : toPlain ? "Translate to plain English" : `Translate to ${gen.label}`}
              {loading && <span className="dots" />}
            </button>
          </div>
          <div className="samples">
            {(toPlain ? SLANG_SAMPLES : SAMPLES).map((s) => (
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
                  {shown?.emoji ?? "🔍"}
                </span>
                {shown ? `${shown.label} says` : "In plain English"}
              </div>
            </div>
            <p>{loading ? "Cooking…" : result?.text}</p>

            {result && !loading && (
              <div className="share">
                <span className="share-label">{flash ?? "Share it"}</span>
                <div className="share-btns">
                  {canNativeShare && (
                    <button type="button" className="chip" onClick={() => nativeShare(result)}>
                      <ShareIcon />
                      Share
                    </button>
                  )}
                  <button
                    type="button"
                    className="chip only-icon x"
                    onClick={() => openShare(result, "x")}
                    aria-label="Share on X"
                    title="Share on X"
                  >
                    <XIcon />
                  </button>
                  <button
                    type="button"
                    className="chip only-icon whatsapp"
                    onClick={() => openShare(result, "whatsapp")}
                    aria-label="Share on WhatsApp"
                    title="Share on WhatsApp"
                  >
                    <WhatsAppIcon />
                  </button>
                  <button
                    type="button"
                    className="chip only-icon reddit"
                    onClick={() => openShare(result, "reddit")}
                    aria-label="Share on Reddit"
                    title="Share on Reddit"
                  >
                    <RedditIcon />
                  </button>
                  <button
                    type="button"
                    className="chip only-icon facebook"
                    onClick={() => openShare(result, "facebook")}
                    aria-label="Share on Facebook"
                    title="Share on Facebook"
                  >
                    <FacebookIcon />
                  </button>
                  <button type="button" className="chip" onClick={() => copyTranslation(result)}>
                    <CopyIcon />
                    Copy text
                  </button>
                  <button type="button" className="chip" onClick={copyLink}>
                    <LinkIcon />
                    Copy link
                  </button>
                </div>
                <a className="kofi-inline" href={KOFI} target="_blank" rel="noopener noreferrer">
                  ☕ Made you laugh? Buy me a coffee
                </a>
              </div>
            )}
          </section>
        )}

        {children}

        <footer>
          <p>Powered by a small open model. Slang may be exaggerated for comedic effect.</p>
          <p>
            Free, with no ads and no sign-up.{" "}
            <a className="kofi" href={KOFI} target="_blank" rel="noopener noreferrer">
              Buy me a coffee
            </a>{" "}
            if it made you laugh.
          </p>
        </footer>
      </div>
    </main>
  );
}
