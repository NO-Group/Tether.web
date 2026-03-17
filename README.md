# Tether

A production-ready, multi-page website for **Tether** — a next-generation chat platform built around **usernames instead of phone numbers**, with a focus on **speed, simplicity, and premium product design**.

**Tagline:**  
**Connect without limits.**  
**No numbers. Just usernames.**

---

## Overview

Tether is designed to feel like a real modern product experience rather than a generic landing page.

This project includes:

- Multi-page Next.js website
- Responsive mobile-first layout
- Black and white brand system only
- Minimal, premium UI
- Interactive chat preview
- Mock username reservation flow
- Smooth animations with Framer Motion
- Reusable, scalable frontend architecture
- Future-ready structure for backend integration

---

## Tech Stack

- **Next.js 14**
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion**
- **Lucide React**
- **clsx**
- **tailwind-merge**

---

## Pages

### `/`
Home page with:
- Hero section
- CTA buttons
- Animated live chat preview
- Features section
- Username reservation form
- Footer navigation

### `/about`
About Tether:
- Product explanation
- Mission and vision
- Why usernames are better than phone numbers

### `/features`
Detailed features:
- Username system
- Instant search
- Messaging speed
- Interactive UI mock sections

### `/download`
Download page:
- Tether Beta (APK)
- Disabled APK button
- Installation guidance
- Google Play note

### `/early`
Early access page:
- Mock username reservation system
- Availability checks
- Beta join CTA
- Future-ready onboarding foundation

---

## Design System

### Brand Rules
- **Colors:** Black `#000000` and White `#FFFFFF` only
- No gradients
- No extra colors
- Clean spacing, contrast, and subtle motion used for visual depth

### Style Direction
- Premium startup
- Minimal and futuristic
- High-end simplicity
- Apple-level restraint
- Product-first presentation

---

## Project Structure

```txt
tether/
├─ app/
│  ├─ about/
│  │  └─ page.tsx
│  ├─ download/
│  │  └─ page.tsx
│  ├─ early/
│  │  └─ page.tsx
│  ├─ features/
│  │  └─ page.tsx
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ components/
│  ├─ animated-preview.tsx
│  ├─ button.tsx
│  ├─ early-access-form.tsx
│  ├─ feature-card.tsx
│  ├─ footer.tsx
│  ├─ mock-phone.tsx
│  ├─ navbar.tsx
│  ├─ page-hero.tsx
│  ├─ reveal.tsx
│  ├─ section.tsx
│  └─ ui/
│     └─ availability-badge.tsx
├─ lib/
│  ├─ constants.ts
│  └─ utils.ts
├─ public/
│  └─ og-image.svg
├─ next.config.js
├─ package.json
├─ postcss.config.js
├─ tailwind.config.ts
└─ tsconfig.json
