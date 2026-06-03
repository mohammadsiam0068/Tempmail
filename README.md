# temporaries.email

Disposable email service with permanent accounts, inbox UI, and REST API.

## Stack
- **Frontend + API**: Next.js 14 (App Router) → Vercel
- **Database + Auth**: Supabase
- **Email Routing**: Cloudflare Email Routing + Workers

---

## Setup Guide

### 1. Supabase
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase-schema.sql`
3. Note down:
   - Project URL (Settings → API → Project URL)
   - `anon` public key (Settings → API → Project API keys)
   - `service_role` secret key (same place)

### 2. Cloudflare Email Worker
1. Go to Cloudflare Dashboard → **Workers & Pages** → Create Worker
2. Name it `email-receiver`
3. Paste the code from `cloudflare-worker/email-receiver.js`
4. Go to **Settings** → **Variables** → Add secrets:
   - `SUPABASE_URL` = your Supabase project URL
   - `SUPABASE_SERVICE_KEY` = your service_role key
5. Deploy the worker

### 3. Cloudflare Email Routing
1. Go to your domain → **Email** → **Email Routing**
2. Enable Email Routing (Cloudflare adds MX records automatically)
3. Go to **Routing Rules** → **Catch-all**
4. Set Action: **Send to Worker** → select `email-receiver`

### 4. Vercel Deployment
1. Push this repo to GitHub
2. Import project in [vercel.com](https://vercel.com)
3. Add environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   NEXT_PUBLIC_DOMAIN=temporaries.email
   ```
4. Deploy!

### 5. Supabase Auth Callback URL
In Supabase → Authentication → URL Configuration:
- Site URL: `https://temporaries.email`
- Redirect URLs: `https://temporaries.email/auth/callback`

---

## API Reference

See [temporaries.email/docs](https://temporaries.email/docs) or the `src/app/docs/page.tsx` file.

### Quick Example
```bash
# Get your inbox
curl https://temporaries.email/api/inbox \
  -H "Authorization: Bearer te_your_key"

# Get a specific message
curl https://temporaries.email/api/messages/MESSAGE_ID \
  -H "Authorization: Bearer te_your_key"
```

---

## Project Structure

```
src/
  app/
    page.tsx              ← Landing page
    dashboard/
      page.tsx            ← Inbox UI
      api-keys/page.tsx   ← API key management
    api/
      inbox/route.ts      ← GET /api/inbox
      messages/[id]/      ← GET /api/messages/:id
    auth/
      login/page.tsx
      signup/page.tsx
      callback/route.ts
    docs/page.tsx         ← API documentation
  components/
    DashboardShell.tsx    ← Sidebar + layout
  lib/
    supabase/
      client.ts           ← Browser Supabase client
      server.ts           ← Server Supabase client
    utils.ts              ← Email/key generators

cloudflare-worker/
  email-receiver.js       ← Deploy to Cloudflare Workers

supabase-schema.sql       ← Run in Supabase SQL Editor
```
