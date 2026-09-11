# GenSpeak

Type plain English, pick a generation, get it back in their slang. Next.js App Router, one API route, no database.

## Run locally

```bash
npm install
cp .env.example .env.local   # then paste your key into LLM_API_KEY
npm run dev
```

## LLM provider

The API route talks to any OpenAI-compatible `/chat/completions` endpoint. Defaults target Groq's free tier
(`openai/gpt-oss-120b`), which is fast and costs nothing for hobby traffic.

Do not drop to `openai/gpt-oss-20b` to save quota. It has the same rate limits and the same latency, but it
fails this task roughly half the time: it leaks `<|constrain|>` channel markers, narrates its own rule
compliance, repeats its answer several times over, and hands the input straight back. Measured over matched
runs, 20b was clean 3 times in 6 while 120b was clean 6 in 6, and the gap held across two prompt variants.

| Variable                | Default                          | Notes                                     |
| ----------------------- | -------------------------------- | ----------------------------------------- |
| `LLM_API_KEY`           | (required)                       | Groq key from console.groq.com/keys       |
| `LLM_BASE_URL`          | `https://api.groq.com/openai/v1` | Swap for OpenRouter, Together, etc.       |
| `LLM_MODEL`             | `openai/gpt-oss-120b`            | Any chat model the endpoint supports      |
| `LLM_REASONING_EFFORT`  | `low`                            | gpt-oss only. Clear it for other models.  |
| `NEXT_PUBLIC_SITE_URL`  | (falls back to the Vercel URL)   | Canonical origin, no trailing slash.      |

Groq retires models fairly often. If translating starts failing, list what your key can currently reach
and update `LLM_MODEL` to match:

```bash
curl -s https://api.groq.com/openai/v1/models -H "Authorization: Bearer $LLM_API_KEY"
```

Two things to know when changing `LLM_MODEL`. Only the gpt-oss models accept `LLM_REASONING_EFFORT`, and
everything else returns a 400 while it is set, so clear it. Reasoning models also spend part of the token
budget thinking before they answer, which is why `reasoning_effort` is set low by default.

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Import it at vercel.com/new. Framework is auto-detected as Next.js.
3. Add the three environment variables above under Settings → Environment Variables.
4. Deploy.

The key never reaches the browser; the client only calls `/api/translate`.

Leave `NEXT_PUBLIC_SITE_URL` unset until a custom domain exists. Canonical URLs, the sitemap and the social
card image all fall back to the Vercel deployment URL on their own.

## Free tier limits

Groq's free plan allows 30 requests a minute, 1,000 a day, and 8,000 tokens a minute. A typical translation
costs about 440 tokens, so the real ceiling is a few hundred translations a day across all visitors.
Exceeding it returns a rate-limit error rather than a charge. The key is shared by everyone using the site,
so one heavy user can exhaust the pool.

The limits refill continuously rather than resetting at a fixed hour. Requests come back at one every 86.4
seconds, and the per-minute token bucket refills in about three seconds per translation. A burst therefore
degrades into a trickle instead of shutting the site off until tomorrow. Each model has its own bucket.

## SEO

The page is statically prerendered, so crawlers see the full text without running JavaScript. `app/layout.tsx`
carries the canonical URL and the Open Graph and Twitter card tags. `app/opengraph-image.tsx` generates the
1200x630 social card at build time. `app/robots.ts` and `app/sitemap.ts` emit `/robots.txt` and `/sitemap.xml`.
Structured data for the app and the FAQ is injected from `app/page.tsx`.

The slang dictionary in `app/glossary.tsx` exists mainly to give the page enough substance to rank. Ranking
for a broad term like "translator" is not realistic. The winnable angle is the multi-generation framing, since
most competing tools only cover Gen Z.
