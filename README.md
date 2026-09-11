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
(`llama-3.1-8b-instant`), which is fast and costs nothing for hobby traffic.

| Variable       | Default                            | Notes                                   |
| -------------- | ---------------------------------- | --------------------------------------- |
| `LLM_API_KEY`  | (required)                         | Groq key from console.groq.com/keys     |
| `LLM_BASE_URL` | `https://api.groq.com/openai/v1`   | Swap for OpenRouter, Together, etc.     |
| `LLM_MODEL`    | `llama-3.1-8b-instant`             | Any chat model the endpoint supports    |

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Import it at vercel.com/new. Framework is auto-detected as Next.js.
3. Add the three environment variables above under Settings → Environment Variables.
4. Deploy.

The key never reaches the browser; the client only calls `/api/translate`.
