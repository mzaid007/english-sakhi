# English Sakhi (इंग्लिश सखी)

[![Live Demo](https://img.shields.io/badge/demo-english--sakhi.vercel.app-059669?style=flat-square&logo=vercel&logoColor=white)](https://english-sakhi.vercel.app/)
[![License: AGPL v3](https://img.shields.io/badge/license-AGPL--3.0-blue.svg?style=flat-square)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3FCF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![PWA](https://img.shields.io/badge/PWA-ready-5A0FC8?style=flat-square&logo=pwa&logoColor=white)](https://english-sakhi.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-mzaid007%2Fenglish--sakhi-181717?style=flat-square&logo=github)](https://github.com/mzaid007/english-sakhi)

Open-source, audio-first English micro-learning for Hindi-medium homemakers and mothers.

**Live app:** [https://english-sakhi.vercel.app/](https://english-sakhi.vercel.app/)

**Source:** [github.com/mzaid007/english-sakhi](https://github.com/mzaid007/english-sakhi)

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

Production URL: [https://english-sakhi.vercel.app/](https://english-sakhi.vercel.app/)

## License

This project is licensed under the [GNU Affero General Public License v3.0](./LICENSE) (AGPL-3.0).

If you run a modified version as a network service, you must make the complete corresponding source available to users of that service.
