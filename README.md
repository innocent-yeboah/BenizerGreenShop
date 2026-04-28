# Benizer Green Shop Platform

Premium health supplement and network marketing platform built with Next.js (App Router), TypeScript, Tailwind, and Supabase-ready architecture.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS with Benizer brand theme tokens
- Supabase (Auth, DB, Storage)
- Zod + next-safe-action
- Resend for notification emails
- Paystack / Flutterwave checkout integration hooks

## Features Implemented

- Branded premium homepage with conversion-first sections
- Product catalog and dynamic product detail pages
- Distributor recruitment landing with validated application action
- Admin dashboard shell for products, orders, and leads
- Distributor dashboard shell with referral and commission metrics
- Supabase schema + RLS baseline at `supabase/schema.sql`
- Route protection middleware for admin/distributor sections
- WhatsApp floating CTA integration

## Setup

1. Install dependencies:
   - `npm install`
2. Configure env values:
   - copy `.env.example` to `.env.local`
3. Run locally:
   - `npm run dev`
4. Lint:
   - `npm run lint`

## Supabase

Run the SQL in `supabase/schema.sql` in your Supabase SQL editor, then wire server actions to table inserts for production usage.
