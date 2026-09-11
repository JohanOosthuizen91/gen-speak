export type GenerationId = "alpha" | "genz" | "millennial" | "genx" | "boomer";

export type Generation = {
  id: GenerationId;
  label: string;
  years: string;
  emoji: string;
  tagline: string;
  accent: string;
  accentSoft: string;
  ink: string;
  font: string;
  styleGuide: string;
};

export const GENERATIONS: Generation[] = [
  {
    id: "alpha",
    label: "Gen Alpha",
    years: "2013–now",
    emoji: "🧃",
    tagline: "skibidi rizz, no cap",
    accent: "#ff4fd8",
    accentSoft: "#ffd6f5",
    ink: "#2b0033",
    font: "var(--font-alpha)",
    styleGuide:
      "Gen Alpha (born 2013 onward). Chaotic, hyper-online kid energy shaped by YouTube, Roblox and TikTok brainrot. Vocabulary: skibidi, rizz, sigma, gyat, fanum tax, ohio, mewing, bussin, cap/no cap, W/L, cooked, aura, mogging, goated, ratio, sus, gg. Very short sentences, lots of emoji spam, occasional ALL CAPS, references to Roblox, Minecraft, Skibidi Toilet and MrBeast.",
  },
  {
    id: "genz",
    label: "Gen Z",
    years: "1997–2012",
    emoji: "💅",
    tagline: "it's giving main character",
    accent: "#a3ff12",
    accentSoft: "#e6ffb8",
    ink: "#0d1a00",
    font: "var(--font-ui)",
    styleGuide:
      "Gen Z (born 1997–2012). Deadpan, ironic, terminally online. Vocabulary: slay, it's giving, no cap, fr fr, bet, lowkey/highkey, mid, ate (and left no crumbs), delulu, rizz, bussin, sus, vibe check, NPC, main character energy, cooked, based, touch grass, era, I'm deceased, understood the assignment, periodt. Mostly lowercase, minimal punctuation, sparse but pointed emoji use (💀 😭 ✨ 🫠), self-deprecating humour.",
  },
  {
    id: "millennial",
    label: "Millennial",
    years: "1981–1996",
    emoji: "🥑",
    tagline: "adulting is hard, doggo",
    accent: "#ff8fab",
    accentSoft: "#ffe0e9",
    ink: "#3a1020",
    font: "var(--font-millennial)",
    styleGuide:
      "Millennial (born 1981–1996). Earnest, self-aware, slightly exhausted. Vocabulary: adulting, doggo, I can't even, literally dying, epic fail, on fleek, YOLO, bae, squad goals, basic, extra, lit, savage, sorry not sorry, this is everything, all the feels, I did a thing, because reasons, treat yo self. Uses hashtags ironically, the 😂 emoji unironically, references Harry Potter, The Office, avocado toast, student loans and side hustles.",
  },
  {
    id: "genx",
    label: "Gen X",
    years: "1965–1980",
    emoji: "📼",
    tagline: "whatever. as if.",
    accent: "#ff7a00",
    accentSoft: "#ffe3c4",
    ink: "#1f1208",
    font: "var(--font-genx)",
    styleGuide:
      "Gen X (born 1965–1980). Dry, sarcastic, detached, allergic to enthusiasm. Vocabulary: whatever, as if, talk to the hand, dude, rad, gnarly, bogus, chill pill, my bad, psych, phat, da bomb, all that and a bag of chips, word, don't have a cow, gag me with a spoon, stoked, wicked, no duh, later. Slacker energy, references to MTV, mixtapes, grunge, Reality Bites, dial-up and latchkey afternoons. Keeps it short, unimpressed, with a shrug baked in.",
  },
  {
    id: "boomer",
    label: "Boomer",
    years: "1946–1964",
    emoji: "📞",
    tagline: "back in my day...",
    accent: "#c9a227",
    accentSoft: "#f5ead0",
    ink: "#2a2210",
    font: "var(--font-boomer)",
    styleGuide:
      "Baby Boomer (born 1946–1964). Warm, formal, slightly long-winded, faintly baffled by technology. Vocabulary: groovy, far out, right on, dig it, neat, swell, heavens to Betsy, in my day, kids these days, the cat's pajamas, hunky-dory, gee whiz, well I'll be, golly. Full sentences with proper punctuation, uses ellipses liberally..., Facebook-post cadence, references rotary phones, the good old days, hard work, and asking to speak to the manager.",
  },
];

export const GENERATION_MAP = Object.fromEntries(
  GENERATIONS.map((g) => [g.id, g]),
) as Record<GenerationId, Generation>;
