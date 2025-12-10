# AdForge - Project Status

## Overview
AdForge is a SaaS application that allows users to upload a static ad and generate AI-powered variations using Google's Gemini model. The design follows a simple utility-style interface (inspired by TinyPNG) with optional authentication for saving history.

## Current Status: MVP Complete (Convex + Clerk)

### What's Working
- **Single-page utility interface** - Upload → Analyze → Select Variations → Generate → Results
- **AI-powered ad analysis** - Uses Gemini 2.0 Flash to understand product, brand style, visual elements
- **Variation suggestions** - AI suggests 5 different variation styles based on the ad analysis
- **Custom variations** - Users can add their own variation descriptions
- **Aspect ratio detection** - Automatically detects and preserves the uploaded ad's aspect ratio
- **Image generation** - Calls Gemini image generation API (falls back to placeholders if API not configured)
- **Authentication** - Clerk with Google OAuth (modal-based sign-in)
- **History page** - Logged-in users can view past generations at `/history`
- **Auto-save** - Generations are automatically saved for logged-in users
- **Logout** - UserButton component with sign-out

### Tech Stack
- **Framework**: Next.js 14 with App Router, TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Auth**: Clerk (with Google OAuth)
- **Database**: Convex (real-time backend)
- **AI**: Google Gemini (gemini-2.0-flash-exp for analysis, image generation for variations)
- **File Upload**: react-dropzone

### Key Files

#### Pages
- `src/app/page.tsx` - Main utility page (upload, analyze, generate flow)
- `src/app/history/page.tsx` - Generation history for logged-in users

#### Convex Backend
- `convex/schema.ts` - Database schema for generations table
- `convex/generations.ts` - Queries and mutations for generation history
- `convex/auth.config.ts` - Clerk JWT configuration

#### API Routes
- `src/app/api/analyze/route.ts` - Analyzes uploaded ad with Gemini
- `src/app/api/suggest-variations/route.ts` - Suggests 5 variation styles
- `src/app/api/generate/route.ts` - Generates image variations

#### Config
- `.env.local` - Environment variables (needs real values)
- `src/middleware.ts` - Clerk middleware for auth

### Environment Variables Needed
```
# Convex
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Google AI (Gemini)
GOOGLE_AI_API_KEY=your_google_ai_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Setup Instructions

### 1. Convex Setup
1. Run `npx convex dev` and follow the prompts to create a project
2. This will create your deployment and add `NEXT_PUBLIC_CONVEX_URL` to `.env.local`
3. In Convex dashboard, go to Settings → Environment Variables
4. Add `CLERK_JWT_ISSUER_DOMAIN` with your Clerk issuer domain (e.g., `https://your-app.clerk.accounts.dev`)

### 2. Clerk Setup
1. Create a Clerk application at https://clerk.com
2. Enable Google OAuth in User & Authentication → Social Connections
3. Copy your keys to `.env.local`:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
4. In Clerk dashboard, go to JWT Templates → Create → Convex
5. Copy the issuer domain to Convex environment variables

### 3. Google AI Setup
1. Go to https://aistudio.google.com/apikey
2. Create an API key
3. Add to `.env.local` as `GOOGLE_AI_API_KEY`

### 4. Run Development Server
```bash
npm install
npx convex dev  # In one terminal
npm run dev     # In another terminal
```
App runs at http://localhost:3000

## Pending / Future Work

### High Priority
- [ ] Configure Convex deployment
- [ ] Configure Clerk credentials
- [ ] Configure Google AI API key
- [ ] Test full flow with real AI responses
- [ ] Upload images to Convex file storage instead of data URLs

### Nice to Have
- [ ] Add download all as ZIP functionality
- [ ] Add "Generate Additional Sizes" option for other aspect ratios
- [ ] Add credit system (currently mocked)
- [ ] Add pricing/payment integration (Stripe)
- [ ] Add user account settings page

### Known Issues
- History saves images as data URLs (should use Convex file storage for production)

## Design Decisions

### Why Single-Page Utility?
User requested a TinyPNG-style experience - simple, focused, no complex navigation. Login is optional and unobtrusive.

### Why Convex + Clerk?
- Convex: Real-time database, simpler than Supabase, great DX with TypeScript
- Clerk: Best-in-class auth UX, easy Google OAuth, built-in Convex integration

### Why Gemini?
Google's "Nano Banana Pro" (Gemini image generation) was specifically requested. Uses gemini-2.0-flash-exp for text analysis.

## Last Updated
December 9, 2024
