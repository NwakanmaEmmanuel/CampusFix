# CampusFix

Peer-to-peer help marketplace for students — built for Bincom Hackathon 2026.

## What's here

- `src/` — React + TypeScript + Tailwind frontend (Vite)
- `server/` — small Express server with two AI endpoints (categorize + quality check), using the Anthropic API
- `supabase/schema.sql` — full DB schema + Row Level Security policies

## Setup (do this first, before the hackathon starts)

1. **Create a Supabase project** at supabase.com, then in the SQL editor run `supabase/schema.sql`.
2. **Frontend env**: `cp .env.example .env` and fill in your Supabase URL + anon key (Project Settings → API).
3. **Server env**: `cd server && cp .env.example .env` and add your `ANTHROPIC_API_KEY`.
4. **Install deps**:
   ```
   npm install
   cd server && npm install
   ```
5. **Run both**:
   ```
   # terminal 1
   cd server && npm run dev

   # terminal 2 (project root)
   npm run dev
   ```
6. Enable **email auth** in Supabase (Authentication → Providers) so `supabase.auth.getUser()` works — sign-up/sign-in UI isn't built yet, wire it up first thing (Supabase's `signInWithOtp` or `signUp` is a 10-minute add).

## What's built

- Landing page
- Create request → AI categorizes on blur (topic, difficulty, time estimate)
- Matching page → open requests, accept to become the helper
- Chat page (Supabase Realtime) → helper submits a solution from here
- Completion page → AI quality check + star rating

## What's deliberately not built (per the brief)

Payments, recommendation algorithms, video calls, elaborate dashboards, mobile app, admin panel.

## Still needed before demo

- Auth screens (sign up / log in) — currently assumes a logged-in user
- Seed a couple of test profiles so matching isn't empty
- Deploy: Vercel for the frontend, Railway/Render for the small Express server (or fold the two AI routes into Vercel serverless functions if you'd rather have one deploy)
