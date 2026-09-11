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
(`openai/gpt-oss-20b`), which is fast and costs nothing for hobby traffic.

| Variable                | Default                          | Notes                                     |
| ----------------------- | -------------------------------- | ----------------------------------------- |
| `LLM_API_KEY`           | (required)                       | Groq key from console.groq.com/keys       |
| `LLM_BASE_URL`          | `https://api.groq.com/openai/v1` | Swap for OpenRouter, Together, etc.       |
| `LLM_MODEL`             | `openai/gpt-oss-20b`             | Any chat model the endpoint supports      |
| `LLM_REASONING_EFFORT`  | `low`                            | gpt-oss only. Clear it for other models.  |

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
