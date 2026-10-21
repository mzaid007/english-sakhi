# English Sakhi (इंग्लिश सखी)

Open-source, audio-first English micro-learning for Hindi-medium homemakers and mothers.

## Features

- **5-day curriculum** — ear training → substitution pills → voice mission
- **Audio-first** — Indian English TTS (`en-IN`) + turtle slow mode
- **Zero English keyboard** for lessons (tap / speak); email OTP only for optional cloud sync
- **Local-first progress** with Supabase merge (`Math.max` streak, union of lessons)
- **Warm AI feedback** via Gemini (Groq / offline heuristic fallback)
- **PWA** — installable, offline shell cache

## Local development

```bash
npm install
cp .env.example .env.local   # fill keys (optional for Day 1 offline)
npm run dev
```

## Environment variables

| Variable | Where used | Secret? |
|----------|------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Browser + server | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publishable / anon key | No |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | **Yes** |
| `GEMINI_API_KEY` | `/api/speak-eval` | **Yes** |
| `GROQ_API_KEY` | Optional fallback | **Yes** |

After creating a Supabase project, run `supabase/schema.sql` in the SQL Editor, then add the same env vars in **Vercel → Settings → Environment Variables**.

## Deploy

Import the GitHub repo on [Vercel](https://vercel.com/new). Day lessons work without keys; add Supabase + Gemini for sync and smarter voice feedback.
