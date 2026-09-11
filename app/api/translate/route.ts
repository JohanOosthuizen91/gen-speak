import { NextResponse } from "next/server";
import { GENERATIONS, GENERATION_MAP, type GenerationId } from "@/lib/generations";

const MAX_INPUT_CHARS = 600;

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/**
 * Models often restate the original message before the rewrite, separated by a
 * blank line. The prompt forbids it but cannot guarantee it, so drop the echo.
 */
function dropEcho(output: string, input: string): string {
  const blocks = output.split(/\n\s*\n/);
  if (blocks.length < 2) return output;

  const first = normalize(blocks[0]);
  const source = normalize(input);
  if (!first) return output;

  const echoed = first === source || (source.includes(first) && first.length > source.length * 0.8);
  if (!echoed) return output;

  const rest = blocks.slice(1).join("\n\n").trim();
  return rest || output;
}

/**
 * A degenerating model restates its answer over and over. The prompt asks for one
 * paragraph, so keep at most two blocks and stop at the first one that repeats.
 */
function collapseRepeats(output: string): string {
  const blocks = output.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  if (blocks.length < 2) return output;

  const seen = new Set<string>();
  const kept: string[] = [];
  for (const block of blocks) {
    const key = normalize(block).slice(0, 30);
    if (seen.has(key)) break;
    seen.add(key);
    kept.push(block);
    if (kept.length === 2) break;
  }
  return kept.join("\n\n");
}

/**
 * True when the model barely touched the input, either returning it outright or
 * bolting emoji and a slang word onto the original sentence. The whole original
 * surviving verbatim inside the output means no real rewrite happened.
 */
function isWeakRewrite(output: string, input: string): boolean {
  const out = normalize(output);
  const src = normalize(input);
  if (out === src) return true;
  // Short inputs are excluded: a genuine rewrite of "hi" may fairly contain "hi".
  return src.length > 20 && out.includes(src);
}

export async function POST(req: Request) {
  const apiKey = process.env.LLM_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server is missing LLM_API_KEY. Copy .env.example to .env.local and add a key." },
      { status: 500 },
    );
  }

  let body: { text?: string; generation?: string; direction?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const text = body.text?.trim() ?? "";
  const toPlain = body.direction === "to-plain";
  const generation = GENERATION_MAP[body.generation as GenerationId];

  if (!text) return NextResponse.json({ error: "Type something to translate." }, { status: 400 });
  if (text.length > MAX_INPUT_CHARS)
    return NextResponse.json({ error: `Keep it under ${MAX_INPUT_CHARS} characters.` }, { status: 400 });
  // Decoding works on any slang, so it needs no generation. Encoding needs one.
  if (!toPlain && !generation) return NextResponse.json({ error: "Unknown generation." }, { status: 400 });

  const baseUrl = (process.env.LLM_BASE_URL ?? "https://api.groq.com/openai/v1").replace(/\/$/, "");
  const model = process.env.LLM_MODEL ?? "openai/gpt-oss-120b";
  // Only the gpt-oss models accept reasoning_effort; others reject the request with a 400.
  const reasoningEffort = process.env.LLM_REASONING_EFFORT?.trim();

  // A fixed word list makes the model pick the same favourite every time. Showing a
  // different handful per request is what actually varies the output across users.
  const palette = generation ? [...generation.vocabulary].sort(() => Math.random() - 0.5).slice(0, 7) : [];

  // The model invents plausible-sounding meanings for niche terms, so any curated
  // definition that actually appears in the input is handed over. Filtering to the
  // ones present keeps this to a few lines instead of the whole glossary.
  const lowerText = text.toLowerCase();
  const known = GENERATIONS.flatMap((g) => g.terms)
    .filter((t) => lowerText.includes(t.term.toLowerCase()))
    .map((t) => `${t.term}: ${t.meaning}`);

  const decodePrompt = `You are a slang decoder. Rewrite the user's message in plain, neutral English that anyone could understand.

The message may use the slang of any of these generations: ${GENERATIONS.map((g) => g.label).join(", ")}.

Terms you may encounter: ${GENERATIONS.flatMap((g) => g.vocabulary).join(", ")}.
${known.length ? `\nDefinitions to use, in preference to your own: \n${known.join("\n")}\n` : ""}
The input is either a whole message or a single term someone wants defined. Handle both.

Rules:
- If it is a message, rewrite it the way the sender would have put it in plain
  English. Keep the meaning, intent and tone, stay roughly the same length, and
  leave no slang, hashtags or emoji behind. Do not comment on the slang itself.
- If it is a bare word or short phrase rather than a message, define it instead:
  one or two plain sentences saying what it means and how people use it.
- Never repeat the input back. If your reply says the same words as the input,
  you have not answered.
- Do not add new facts.
- Write in normal sentence case with ordinary punctuation.
- If a term has no established meaning, say so plainly rather than inventing one.
- Your entire reply is the plain English version and nothing else.`;

  const encodePrompt = `You are a slang translator. Rewrite the user's message so it sounds like it was written by a typical member of this generation:

${generation?.styleGuide}

Slang available for this rewrite: ${palette.join(", ")}.

Rules:
- Preserve the original meaning and intent. Do not add new facts.
- Reply with exactly one short paragraph, roughly the length of the input.
- Replace the original wording with slang equivalents. Most content words must
  differ from the input.
- Use at most two words from that slang list, chosen because they fit this
  particular message. Ignore the rest. Everything else should be ordinary English
  in that generation's rhythm.
- Do not end on a tag phrase such as "no cap", "periodt", "fr fr" or "word".
  Finish on the actual point of the message.
- Do not open with a throwaway interjection such as "Yo", "Well" or "Honestly".
  Start on the substance of the message instead.
- Use the capitalisation habits of the generation described above.
- Write as the sender of the message, speaking to the same reader.
- Be funny, never mean or offensive.
- Your entire reply is the rewritten message and nothing else.`;

  const systemPrompt = toPlain ? decodePrompt : encodePrompt;

  async function attempt() {
    const upstream = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        temperature: 0.9,
        // Reasoning models spend part of this budget thinking before they answer.
        max_tokens: 1000,
        ...(reasoningEffort ? { reasoning_effort: reasoningEffort } : {}),
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text },
        ],
      }),
    });

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => "");
      console.error("LLM error", upstream.status, detail);
      return { ok: false as const, status: upstream.status, detail };
    }

    const data = await upstream.json();
    const raw: string = data.choices?.[0]?.message?.content ?? "";
    const cleaned = raw
      // Some models emit their chain of thought inline instead of in a separate field.
      .replace(/<think>[\s\S]*?<\/think>/g, "")
      // gpt-oss can leak channel markers such as <|constrain|> into the text.
      .replace(/<\|[^|>]*\|>/g, "")
      .trim();
    return { ok: true as const, translation: collapseRepeats(dropEcho(cleaned, text)) };
  }

  let outcome = await attempt();

  // Decoding only rejects an exact echo. A lightly slangy sentence legitimately
  // decodes to nearly itself, but never to precisely itself, and a bare term that
  // comes back unchanged means the model defined nothing.
  const unchanged = (out: string) =>
    toPlain ? normalize(out) === normalize(text) : isWeakRewrite(out, text);

  // One more try is cheap, and the first answer still stands if the retry is no better.
  if (outcome.ok && unchanged(outcome.translation)) {
    const retry = await attempt();
    if (retry.ok && retry.translation && !unchanged(retry.translation)) outcome = retry;
  }

  if (!outcome.ok) {
    const { status, detail } = outcome;
    let friendly = "The model had a moment. Try again.";
    if (status === 429) friendly = "The model is rate limited right now. Try again in a moment.";
    else if (status === 401) friendly = `Your ${new URL(baseUrl).hostname} API key was rejected. Check LLM_API_KEY.`;
    else if (status === 404) friendly = `The model "${model}" does not exist on this provider. Check LLM_MODEL.`;
    else if (status === 400) friendly = `The provider rejected the request: ${detail.slice(0, 200)}`;
    return NextResponse.json({ error: friendly }, { status: 502 });
  }

  const translation = outcome.translation;
  if (!translation) return NextResponse.json({ error: "Empty response from model." }, { status: 502 });

  // Only unwrap when the whole reply is quoted and holds no quotes of its own.
  // A definition like: "Rizz" refers to charisma, short for "charisma." starts and
  // ends with a quote without being a quoted string, and must be left alone.
  const wrapped = /^["“]([^"“”]*)["”]$/.exec(translation);
  return NextResponse.json({ translation: wrapped ? wrapped[1].trim() : translation });
}
