import { NextResponse } from "next/server";
import { GENERATION_MAP, type GenerationId } from "@/lib/generations";

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

  let body: { text?: string; generation?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const text = body.text?.trim() ?? "";
  const generation = GENERATION_MAP[body.generation as GenerationId];

  if (!text) return NextResponse.json({ error: "Type something to translate." }, { status: 400 });
  if (text.length > MAX_INPUT_CHARS)
    return NextResponse.json({ error: `Keep it under ${MAX_INPUT_CHARS} characters.` }, { status: 400 });
  if (!generation) return NextResponse.json({ error: "Unknown generation." }, { status: 400 });

  const baseUrl = (process.env.LLM_BASE_URL ?? "https://api.groq.com/openai/v1").replace(/\/$/, "");
  const model = process.env.LLM_MODEL ?? "openai/gpt-oss-20b";
  // Only the gpt-oss models accept reasoning_effort; others reject the request with a 400.
  const reasoningEffort = process.env.LLM_REASONING_EFFORT?.trim();

  const systemPrompt = `You are a slang translator. Rewrite the user's message so it sounds like it was written by a typical member of this generation:

${generation.styleGuide}

Rules:
- Preserve the original meaning and intent. Do not add new facts.
- Keep roughly the same length as the input (a little longer is fine).
- Replace the original wording with slang equivalents. Keeping the sentence as it
  was and bolting emoji or a catchphrase onto it is not a rewrite. Most of the
  content words must differ from the input.
- Follow the capitalisation habits of the generation above, not those of the input.
- Never restate, quote or echo the original message before your rewrite.
- Lean hard into the voice; be funny but not mean or offensive.
- Never invent a sign-off or a placeholder like [Your Name].
- Output ONLY the rewritten message. No preamble, no quotes, no explanation.`;

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
    // Some models emit their chain of thought inline instead of in a separate field.
    const cleaned = raw.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
    return { ok: true as const, translation: dropEcho(cleaned, text) };
  }

  let outcome = await attempt();

  // The model sometimes hands the input back with only emoji or a slang word bolted on.
  // One more try is cheap, and the first answer still stands if the retry is no better.
  if (outcome.ok && isWeakRewrite(outcome.translation, text)) {
    const retry = await attempt();
    if (retry.ok && retry.translation && !isWeakRewrite(retry.translation, text)) outcome = retry;
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

  return NextResponse.json({ translation: translation.replace(/^["“]|["”]$/g, "") });
}
