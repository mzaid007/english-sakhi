# English Sakhi (इंग्लिश सखी) — Master Implementation Plan for Cursor

## 1. Project Overview & Philosophy
**English Sakhi** is an open-source, mobile-first micro-learning web platform crafted specifically for Hindi-medium mothers and homemakers who have limited English reading literacy and only 5–10 minutes of fragmented free time daily.

### Core Tenets
1. **Audio-First Scaffolding:** No wall-of-text explanations. Every English sentence, phrase, and interactive block features instant, natural Indian-accented audio synthesis (`en-IN`).
2. **Zero Mobile Keyboard Typing:** The user never types English words. All interactions rely on tap-to-select, swappable word pills, binary contrastive choices, and tap-to-speak voice recognition.
3. **No Grammatical Jargon:** Banish terms like *Present Continuous*, *Auxiliary Verbs*, *Gerunds*, or *Prepositions*. Replace them with intuitive mental models:
   - ⏰ **काम अभी चल रहा है** (Action in progress: is/are + -ing)
   - 📅 **रोज़ की आदत** (Daily habit: base verb)
   - ⏳ **काम पूरा हो चुका** (Finished action: has/have + done)
   - 🌸 **तहज़ीब और ज़रूरत** (Politeness & requests: Can/Could/Please)
4. **Offline-First with Frictionless Cloud Sync:** Local-first storage (`localStorage` / `IndexedDB`) allows immediate Day 1 progress without sign-up friction. Cloud sync via Supabase passwordless magic link (OTP) ensures safe cross-device progress.
5. **Modern Indian Warmth UI:** Warm cream background (`#FAF8F5`), rich emerald and saffron accents, tactile 48px touch targets, and celebratory micro-interactions.

---

## 2. Technical Stack Specification
- **Framework:** Next.js 14+ (App Router), React 19, TypeScript.
- **Styling & Motion:** Tailwind CSS, Framer Motion (for spring taps and fluid block transitions).
- **Icons:** `lucide-react`.
- **Audio Engine:** Web Speech API (`window.speechSynthesis`, `window.webkitSpeechRecognition`) with zero server overhead; modular adapter for Groq Whisper (`whisper-large-v3`) fallback.
- **AI Feedback Engine:** Google Gemini Flash (`@google/genai`) or Groq Llama-3.3-70B for real-time speech evaluation returning warm conversational Hindi guidance in strict JSON format.
- **Backend / Database:** Supabase Free Tier (PostgreSQL + Auth via Magic Link OTP + Row Level Security).
- **Offline / PWA:** `next-pwa` with service worker caching for offline practice.

---

## 3. Architecture & Directory Blueprint

```
english-sakhi/
├── .cursorrules                     # AI guidelines for Cursor (Persona, UI, Pedagogy)
├── IMPLEMENTATION_PLAN.md           # This document (Project reference specification)
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── public/
│   ├── manifest.json                # PWA manifest
│   ├── icons/                       # App icons & badges
│   └── audio/                       # Fallback static sounds (chimes, clicks)
├── supabase/
│   └── schema.sql                   # Supabase RLS & Progress table schema
└── src/
    ├── app/
    │   ├── layout.tsx               # Root layout with warm font imports & audio provider
    │   ├── page.tsx                 # Home dashboard: Daily Mission Card & Streak Tracker
    │   ├── lesson/[id]/page.tsx     # The 3-Step Micro-Mission Player
    │   ├── api/
    │   │   ├── speak-eval/route.ts  # Gemini Flash speech feedback evaluator
    │   │   └── sync/route.ts        # Optional cloud sync helper
    ├── components/
    │   ├── common/
    │   │   ├── Header.tsx           # Brand header with streak badge & sync status
    │   │   ├── AudioButton.tsx      # Tactile play & slow (turtle) speech trigger
    │   │   └── DualScriptText.tsx   # English + Devanagari phonetics + Hindi translation
    │   ├── lesson/
    │   │   ├── Step1EarTraining.tsx # Listen & repeat micro-dialogue
    │   │   ├── Step2Substitution.tsx# Tactile word-swapping syntax builder
    │   │   ├── Step3VoiceMission.tsx # Tap-to-speak roleplay evaluator
    │   │   └── MissionComplete.tsx  # Celebration modal with Diya/Chai micro-animations
    │   └── sync/
    │       ├── SyncModal.tsx        # Passwordless email OTP modal
    │       └── SyncBanner.tsx       # Gentle, non-intrusive cloud backup nudge
    ├── data/
    │   ├── curriculum.ts            # Day 1 to Day 5 structured lesson schemas
    │   └── phonetics.ts             # Devanagari transliteration mapping helpers
    ├── hooks/
    │   ├── useSpeechSynthesis.ts    # Indian English TTS manager with speed controls
    │   ├── useSpeechRecognition.ts  # Free Web Speech API STT hook
    │   └── useProgressSync.ts       # Local-to-Cloud merge hook
    └── lib/
        ├── supabase.ts              # Supabase client singleton
        └── types.ts                 # Core TypeScript interfaces
```

---

## 4. Phase-by-Phase Roadmap

### Phase 1: Foundation, Design System & Lesson 1 Prototype
- [ ] Configure `tailwind.config.ts` with the "Modern Indian Warmth" color palette:
  - Cream/Sand base: `#FAF8F5`, surface stone: `#F5F2EB`.
  - Emerald primary: `#059669`, Amber highlight: `#D97706`, Coral secondary: `#E11D48`.
- [ ] Build `useSpeechSynthesis` hook with Indian English voice preference (`en-IN`) and slow turtle mode (`0.7x`).
- [ ] Build `DualScriptText` component rendering English, Devanagari transliteration, and Hindi translation with distinct typographic weights.
- [ ] Implement `Step2Substitution` (the core interactive word-swapping pill mechanic).
- [ ] Seed Day 1 lesson data: *स्कूल में टीचर से बात करना (Aarav is studying well)*.
- [ ] Build responsive mobile home card view (`src/app/page.tsx`).

### Phase 2: Progress Persistence & Supabase Cloud Sync
- [ ] Build local-first progress store (`useProgressSync`) syncing to `localStorage`.
- [ ] Write `supabase/schema.sql` with user profile and progress tables with RLS.
- [ ] Implement passwordless Magic Link / OTP auth flow in `SyncModal.tsx`.
- [ ] Write robust merge logic:
  - `Math.max(local_streak, cloud_streak)`.
  - Union of completed lesson IDs (`Array.from(new Set([...local, ...cloud]))`).
- [ ] Add gentle `SyncBanner` that nudges the user to safeguard progress without blocking the app.

### Phase 3: AI Speech Buddy & Voice Practice
- [ ] Implement client-side `useSpeechRecognition` using the browser's native `webkitSpeechRecognition`.
- [ ] Create `/api/speak-eval` route powered by Google Gemini 1.5/2.0 Flash (`@google/genai`).
- [ ] Configure structured JSON prompt for Gemini:
  - Validates pronunciation and intent against target Hindi sentence.
  - Returns warm, dignity-preserving Hindi feedback (never says "गलत" or "Wrong").
  - Supplies an audio-ready natural phrase alternative.
- [ ] Build `Step3VoiceMission` with an intuitive large mic button, live pulsing waves, and praise cards.

### Phase 4: Full 5-Day Curriculum & PWA Offline Setup
- [ ] Build curriculum dataset (`src/data/curriculum.ts`):
  - **Day 1:** Daily Routine & Habits (मैं रोज़ चाय बनाती हूँ / I make tea)
  - **Day 2:** What's Happening Right Now (आरव पढ़ाई कर रहा है / Aarav is studying)
  - **Day 3:** Polite Requests (कृपया बिल दे दीजिए / Please give me the bill)
  - **Day 4:** School & PTM (आरव की लिखाई कैसी है? / How is his handwriting?)
  - **Day 5:** Clinic & Doctor (सुबह से सिरदर्द है / I have a headache since morning)
- [ ] Configure `next-pwa` with manifest, theme colors, and offline fallback caching.
- [ ] Add celebratory audio chime and streak badge animations.