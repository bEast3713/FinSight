# FinSight

AI-powered Apple financial analysis dashboard built with Next.js, Tailwind, Recharts, and Gemini API.

## Setup

1. Install dependencies:

   npm install

2. Copy env file:

   cp .env.example .env.local

3. Add your key to `.env.local`:

   GEMINI_API_KEY=AIza...

4. Run:

   npm run dev

## Features

- Apple financial dashboard cards and charts
- 2-year linear regression forecast
- Computed company health score (0-100)
- AI analyst chat via server-side `/api/chat`
