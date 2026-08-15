# Flow 🌊

**Let it flow.**

Flow is a self-hosted social network inspired by the shape of platforms like Bluesky — posts,
likes, reposts, threads/replies, follows, notifications, views, direct messages, and full media
sharing — but it runs on **your** infrastructure: **Supabase** (database, auth, storage, realtime)
+ **GitHub Pages** (static hosting). You own every row of data and every line of code. Wrap it in
Capacitor and you have an iOS + Android app.

Every user gets a handle in the form **`@username.no.flw`** and a shareable profile URL like:

```
https://no-group.github.io/Flow.web/username.no.flw
```

> **Why "Flow"?** Everything implies the name — the feed is *the stream*, interactions *flow*,
> the UI glides with fluid motion, and your handle literally ends in `.flw`.

---

## Stack

| Layer         | Tech                                    |
| ------------- | --------------------------------------- |
| Frontend      | React 18 + Vite (SPA), Google **Nova Round** font |
| Backend       | **Supabase** — Postgres, Auth, Storage, Realtime, RLS |
| Media         | Supabase Storage (image/video/audio/docs) |
| Hosting       | GitHub Pages (`/Flow.web/` subpath)         |
| Mobile app    | **Capacitor** (optional wrapper)        |

**Cost while you grow:** $0/month on the Supabase free tier (500 MB DB, 1 GB storage, 50k monthly
users). Every limit scales upward on the Pro plan as your resources grow — nothing about the
architecture changes.

---

## Features (all included)

- **Signup / login** — email + password via Supabase Auth, with automatic `@handle` claim.
- **Posting** — rich text posts + **every media type**: images, video, audio, PDFs, docs.
- **The stream (feed)** — posts from people you follow, live via Realtime.
- **Likes** — with live counts.
- **Reposts** — repost others' posts into your own stream.
- **Threads / replies** — reply to any post; nested thread view.
- **Follow graph** — follow/unfollow, follower & following counts, "who to flow with".
- **Notifications** — likes, reposts, replies, follows — with unread badge.
- **Direct messages** — 1:1 private conversations, realtime, with media.
- **Views** — per-post view counters (deduplicated per user).
- **Explore / search** — discover stream + keyword search.
- **Profiles** — banner, avatar, bio, custom share URL.
- **Dark/light themes** — defaults to the device's theme (pure black / white) with a deep-blue accent.

### Design tokens
- **Font:** Google **Nova Round**.
- **Colors:** background is **black** (dark) or **white** (light) following the device theme;
  the accent is a **very deep blue**; **navy blue appears as only a 0.1-trace** — a faint wash
  used for glows, borders and gradients so the brand never feels heavy.

---

## Getting started

### 1. Create your Supabase project

1. Go to [supabase.com](https://supabase.com) → **New project** (free).
2. Open **SQL Editor** → run `supabase/schema.sql`.
3. Then run `supabase/realtime.sql`.
4. (Optional, for public signup) In **Authentication → Providers** enable whatever you like.

### 2. Wire up the frontend

```bash
cp .env.example .env
```

Fill `.env` with your project's **URL** and **anon key**
(Supabase Dashboard → Project Settings → API).

### 3. Run locally

```bash
npm install
npm run dev
```

Open **http://localhost:5173/Flow.web/** — you're flowing.

---

## Deploying to GitHub Pages

1. Push this repo to GitHub (e.g. `NO-Group/flow`).
2. Repo **Settings → Pages → Source: GitHub Actions**. The included workflow
   (`.github/workflows/deploy.yml`) builds and publishes automatically on push.
3. Your app is live at **`https://<org>.github.io/Flow.web/`** and profiles at
   **`https://<org>.github.io/Flow.web/username.no.flw`**.

> If you host under a different subpath, change `base` in `vite.config.js` and `basename` logic
> in `src/App.jsx` accordingly.

---

## Wrapping it into a mobile app (Capacitor)

The web build is fully static, so wrapping it into native apps is a one-time setup you can do
personally from this repo:

```bash
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
npx cap add ios
npx cap add android
npm run build
npx cap sync
```

Then open the `ios/` folder in Xcode or the `android/` folder in Android Studio and ship to the
stores. The config lives in `capacitor.config.ts`.

---

## Project layout

```
flow/
├── supabase/
│   ├── schema.sql        # tables, triggers, RLS, storage buckets
│   └── realtime.sql      # enable live updates
├── src/
│   ├── pages/            # Feed, Explore, Profile, Post, Notifications, Messages, Settings, auth
│   ├── components/       # PostCard, Composer, MediaViewer, Layout, etc.
│   ├── lib/api.js        # all Supabase data operations
│   ├── context/          # Auth state
│   └── styles/           # design system (base, layout, components, posts, animations)
├── public/               # logo, 404.html SPA fallback
├── capacitor.config.ts   # mobile wrapper config
└── .github/workflows/    # GitHub Pages deployment
```

---

## Growing beyond the free tier

The schema uses Postgres + Row-Level Security + Realtime natively, so scaling is mostly a plan
change, not a rewrite:

- **More storage / users / bandwidth** → upgrade the Supabase plan.
- **Moderation & anti-spam** → add Supabase Edge Functions + rate limits when your community grows.
- **Global reach** → put a CDN in front of GitHub Pages and Storage.
- **Real AT-Protocol interop** → if you ever want to federate with the wider "Bluesky network",
  Flow's data model maps cleanly onto posts/feeds/handles and can be bridged later.

---

## License

Use it, fork it, run your own Flow.
