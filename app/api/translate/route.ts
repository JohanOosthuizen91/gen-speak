import { NextResponse } from "next/server";
import { GENERATION_MAP, type GenerationId } from "@/lib/generations";

const MAX_INPUT_CHARS = 600;

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
- Rewrite every sentence in the voice. Never copy the input back unchanged.
- Lean hard into the voice; be funny but not mean or offensive.
- Never invent a sign-off or a placeholder like [Your Name].
- Output ONLY the rewritten message. No preamble, no quotes, no explanation.`;

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
    let friendly = "The model had a moment. Try again.";
    if (upstream.status === 429) friendly = "The model is rate limited right now. Try again in a moment.";
    else if (upstream.status === 401) friendly = `Your ${new URL(baseUrl).hostname} API key was rejected. Check LLM_API_KEY.`;
    else if (upstream.status === 404) friendly = `The model "${model}" does not exist on this provider. Check LLM_MODEL.`;
    else if (upstream.status === 400) friendly = `The provider rejected the request: ${detail.slice(0, 200)}`;
    return NextResponse.json({ error: friendly }, { status: 502 });
  }

  const data = await upstream.json();
  const raw: string = data.choices?.[0]?.message?.content ?? "";
  // Some models emit their chain of thought inline instead of in a separate field.
  const translation = raw.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
  if (!translation) return NextResponse.json({ error: "Empty response from model." }, { status: 502 });

  return NextResponse.json({ translation: translation.replace(/^["“]|["”]$/g, "") });
}
