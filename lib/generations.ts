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
  /** Sampled per request so no single word becomes the model's signature tic. */
  vocabulary: string[];
  /** How many slang terms one message carries. Gen Alpha stacks them; Gen X does not. */
  slangCap: number;
  blurb: string;
  terms: { term: string; meaning: string }[];
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
      "Gen Alpha (born 2013 onward). Chaotic, hyper-online kid energy shaped by YouTube, Roblox and TikTok brainrot. Very short sentences, lots of emoji spam, occasional ALL CAPS, references to Roblox, Minecraft, Skibidi Toilet and MrBeast. Talks to an imaginary audience the way a streamer talks to chat. Stacks slang densely rather than sprinkling it, and prefers a specific term over a vague one: something is not just good, it has aura, and someone is not just annoying, they are glazing or tweaking. Never reaches for millennial or older Gen Z leftovers such as lit, epic, on fleek, bae, YOLO or savage.",
    vocabulary: [
      "skibidi", "rizz", "negative rizz", "sigma", "gyatt", "fanum tax", "ohio", "mewing",
      "no cap", "bussin", "W/L", "cooked", "ratio", "sus", "goated", "mogging", "gg",
      "aura", "aura points", "negative aura", "aura farming", "chat", "tweaking",
      "crash out", "glazing", "brain rot", "chopped", "NPC", "drip", "sheesh", "yeet",
      "cap", "bet", "diabolical", "cooking",
      // "6-7" is deliberately absent: it hijacked real numbers, turning "lands at 6pm"
      // into "lands 6-7". It stays in the dictionary below so decoding still explains it.
    ],
    slangCap: 6,
    blurb:
      "The first generation who never knew a world without tablets. Their slang comes straight off YouTube Shorts, Roblox lobbies and TikTok, and it mutates faster than any before it. Words often carry no fixed meaning at all, working instead as pure emphasis.",
    terms: [
      { term: "skibidi", meaning: "A nonsense intensifier from the Skibidi Toilet videos. It can mean good, bad, or nothing at all." },
      { term: "rizz", meaning: "Charisma, specifically the skill of flirting well. Short for charisma. Negative rizz is the opposite: actively repelling people." },
      { term: "aura", meaning: "The impression you give off, counted like a score. Doing something cool earns aura points, and embarrassing yourself loses them." },
      { term: "aura farming", meaning: "Acting deliberately cool in the hope of being seen doing it." },
      { term: "chat", meaning: "The imaginary audience a Gen Alpha speaker addresses, borrowed from livestreaming. \"Chat, is this real?\"" },
      { term: "crash out", meaning: "To lose your temper completely, or to spiral over something." },
      { term: "tweaking", meaning: "Acting erratically, overreacting, or being plainly wrong. \"You're tweaking.\"" },
      { term: "glazing", meaning: "Praising someone so excessively that it becomes embarrassing to watch." },
      { term: "sigma", meaning: "Someone confident who succeeds on their own terms rather than following the group." },
      { term: "fanum tax", meaning: "Taking a bite of a friend's food without asking. Named after a streamer who kept doing it." },
      { term: "gyatt", meaning: "A shout of surprise, usually at how someone looks." },
      { term: "mewing", meaning: "Pressing your tongue against the roof of your mouth, believed to sharpen the jawline." },
      { term: "ohio", meaning: "Cringeworthy, weird or broken. The state's name became shorthand for anything going badly wrong." },
      { term: "brain rot", meaning: "Content with no substance whatsoever, and the mental state of having watched too much of it." },
      { term: "6-7", meaning: "A meme with no meaning at all, said with a hand gesture whenever the numbers six and seven appear together." },
    ],
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
      "Gen Z (born 1997–2012). Deadpan, ironic, terminally online. Mostly lowercase, minimal punctuation, sparse but pointed emoji use (💀 😭 ✨ 🫠), self-deprecating humour.",
    vocabulary: [
      "slay", "it's giving", "no cap", "fr fr", "bet", "lowkey", "highkey", "mid",
      "delulu", "rizz", "bussin", "sus", "vibe check", "NPC", "cooked", "based",
      "touch grass", "I'm deceased", "understood the assignment", "main character energy",
      "ate and left no crumbs", "era", "periodt", "the ick", "ghosted", "flop",
      "menty b", "living rent free", "unserious", "glow up", "hits different",
      "caught in 4k", "sending me", "beige flag",
    ],
    slangCap: 3,
    blurb:
      "Gen Z slang is built on irony. Enthusiasm is usually a joke, capital letters are suspicious, and the funniest response to disaster is understatement. Much of the vocabulary arrived through TikTok, but a large share originates in Black American English and drag culture long before it reached a wider audience.",
    terms: [
      { term: "it's giving", meaning: "Introduces the impression something creates, as in \"it's giving desperate\"." },
      { term: "no cap", meaning: "No exaggeration, I mean it. A cap is a lie." },
      { term: "delulu", meaning: "Delusional, usually said affectionately about someone's unrealistic hopes." },
      { term: "mid", meaning: "Thoroughly average, and disappointing precisely because it is average." },
      { term: "ate", meaning: "Performed brilliantly. Often extended to \"ate and left no crumbs\"." },
      { term: "cooked", meaning: "Doomed or beyond saving, as in \"we're cooked\"." },
      { term: "the ick", meaning: "A sudden, irreversible turn-off, usually triggered by something trivial." },
      { term: "living rent free", meaning: "Occupying your thoughts constantly without your permission." },
      { term: "hits different", meaning: "Affects you more strongly than the same thing normally would." },
      { term: "caught in 4k", meaning: "Caught red-handed, with proof clear enough to be undeniable." },
    ],
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
      "Millennial (born 1981–1996). Earnest, self-aware, slightly exhausted. Writes in normal sentence case with ordinary punctuation, never all lowercase. Uses hashtags ironically, the 😂 emoji unironically, references Harry Potter, The Office, avocado toast, student loans and side hustles.",
    vocabulary: [
      "adulting", "doggo", "I can't even", "literally dying", "epic fail", "on fleek",
      "YOLO", "bae", "basic", "extra", "lit", "savage", "sorry not sorry",
      "this is everything", "all the feels", "I did a thing", "because reasons",
      "treat yo self", "squad goals", "same", "the struggle is real", "nailed it",
      "throwing shade", "hangry", "FOMO", "ship it", "totes", "cray", "humblebrag",
      "spirit animal", "winning at life",
    ],
    slangCap: 2,
    blurb:
      "Millennials grew up alongside the internet rather than inside it, and their slang carries the earnestness of early social media. Much of it treats ordinary adult life as a minor heroic feat. The vocabulary peaked around 2015 and now reads as unmistakably dated, which is part of its charm.",
    terms: [
      { term: "adulting", meaning: "Doing dull grown-up tasks, framed as an achievement worth announcing." },
      { term: "on fleek", meaning: "Perfectly styled. Peaked in 2015 and never recovered." },
      { term: "I can't even", meaning: "I am too overwhelmed to finish this sentence." },
      { term: "doggo", meaning: "A dog, in the deliberately childish vocabulary of DoggoLingo." },
      { term: "squad goals", meaning: "A group whose friendship looks worth aspiring to." },
      { term: "sorry not sorry", meaning: "An apology withdrawn in the same breath it is offered." },
      { term: "throwing shade", meaning: "Criticising someone so indirectly they may not notice it happening." },
      { term: "FOMO", meaning: "Fear of missing out. The dread that something better is happening elsewhere." },
      { term: "hangry", meaning: "Bad-tempered because you have not eaten. A blend of hungry and angry." },
    ],
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
      "Gen X (born 1965–1980). Dry, sarcastic, detached, allergic to enthusiasm. Slacker energy, references to MTV, mixtapes, grunge, Reality Bites, dial-up and latchkey afternoons. Keeps it short, unimpressed, with a shrug baked in.",
    vocabulary: [
      "whatever", "as if", "talk to the hand", "dude", "rad", "gnarly", "bogus",
      "chill pill", "my bad", "psych", "phat", "da bomb", "all that and a bag of chips",
      "don't have a cow", "gag me with a spoon", "no duh", "later", "stoked", "wicked", "word",
      "cool beans", "diss", "buggin'", "not!", "eat my shorts", "grody", "heinous",
      "tubular", "trippin'", "wack", "scrub", "word up", "crib", "book it", "bail",
      "bite me", "take a chill pill", "righteous", "hella", "aight",
    ],
    slangCap: 2,
    blurb:
      "Gen X slang runs on detachment. Caring visibly about anything was the one real misstep, so praise arrives disguised as indifference. The vocabulary comes from skate culture, MTV and the mall, and much of what sounds like an insult is meant warmly.",
    terms: [
      { term: "as if", meaning: "A flat refusal, popularised by the film Clueless." },
      { term: "talk to the hand", meaning: "I have stopped listening. Delivered with a raised palm." },
      { term: "da bomb", meaning: "Excellent. Nothing to do with explosives." },
      { term: "psych", meaning: "Just kidding, said immediately after a fake-out." },
      { term: "bogus", meaning: "Unfair, or simply bad." },
      { term: "all that and a bag of chips", meaning: "Even better than all that. Rarely said without irony." },
      { term: "gnarly", meaning: "Impressively extreme. Borrowed from surfers, where it first described a frightening wave." },
      { term: "cool beans", meaning: "That suits me fine. Agreement with a shrug attached." },
      { term: "take a chill pill", meaning: "Calm down. The imaginary medication was the whole joke." },
      { term: "not!", meaning: "Tacked onto the end of a sentence to reverse everything just said." },
      { term: "grody", meaning: "Disgusting. Often intensified to grody to the max." },
      { term: "buggin'", meaning: "Panicking or behaving irrationally." },
      { term: "wack", meaning: "Bad, poor quality, or unreasonable." },
      { term: "phat", meaning: "Excellent. Spelled with a P so nobody mistook it for the other word." },
    ],
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
      "Baby Boomer (born 1946–1964). Warm, formal, slightly long-winded, faintly baffled by technology. Sometimes opens with a greeting or a mild exclamation, but just as often starts straight into the point. Full sentences with proper punctuation, uses ellipses liberally..., Facebook-post cadence, references rotary phones, the good old days, hard work, and asking to speak to the manager.",
    vocabulary: [
      "groovy", "far out", "right on", "dig it", "neat", "swell", "heavens to Betsy",
      "in my day", "kids these days", "the cat's pajamas", "hunky-dory", "gee whiz",
      "well I'll be", "golly", "keen", "swinging", "outta sight", "can you dig it",
      "lay it on me", "what a gas", "solid", "copacetic", "the bee's knees",
      "cruisin' for a bruisin'", "hang loose", "don't have a conniption",
    ],
    slangCap: 2,
    blurb:
      "Boomer slang was born in the counterculture of the sixties and softened into warmth over the decades that followed. It favours full sentences, generous punctuation and a fondness for the ellipsis. Enthusiasm is expressed plainly, which is exactly what makes it sound so unlike everything after it.",
    terms: [
      { term: "groovy", meaning: "Fashionable and thoroughly pleasing." },
      { term: "far out", meaning: "Amazing, or nearly too surprising to believe." },
      { term: "the cat's pajamas", meaning: "The very best example of something." },
      { term: "right on", meaning: "Wholehearted agreement." },
      { term: "heavens to Betsy", meaning: "A mild exclamation of surprise." },
      { term: "hunky-dory", meaning: "Perfectly fine, with nothing to worry about." },
      { term: "the bee's knees", meaning: "Outstanding. A sibling of the cat's pajamas, and just as old." },
      { term: "outta sight", meaning: "So good it is beyond describing." },
      { term: "copacetic", meaning: "In good order, entirely satisfactory." },
    ],
  },
];

export const GENERATION_MAP = Object.fromEntries(
  GENERATIONS.map((g) => [g.id, g]),
) as Record<GenerationId, Generation>;
