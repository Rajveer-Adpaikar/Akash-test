# CLAUDE.md — Akash The Band Website

## Project Overview

**Akash The Band** — single-page portfolio for Goa's premier Bollywood ensemble, led by Akash Mangeshkar. 6-piece band specializing in destination weddings, corporate events, and live gigs. Dark cinematic design with warm cream (#DEDBC8) palette.

**Live:** https://rajveer-adpaikar.github.io/akash-the-band/

---

## Tech Stack

- **Framework:** React 19 + TypeScript 6 + Vite 8.1
- **Styling:** Tailwind CSS 3 with PostCSS + Autoprefixer
- **Animation:** Framer Motion 12 (scroll-linked opacity, card scale-ins, staggered entrance)
- **Icons:** Lucide React (Phone, Mail, Music2, MessageCircle, ArrowRight, Check, Volume2, VolumeX, ChevronLeft, ChevronRight, AlertTriangle, X, CheckCircle, AlertCircle)
- **Fonts:** Almarai (global body, sans-serif), Playfair Display (accent headings, serif)
- **Video:** Vimeo Player API (iframe embeds with independent Player instances)
- **Deployment:** GitHub Pages via gh-pages package (branch: gh-pages)
- **Linting:** oxlint

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (localhost:5173/akash-the-band/) |
| `npm run build` | Type-check + production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run deploy` | Deploy `dist/` to GitHub Pages via gh-pages |
| `npm run lint` | Run oxlint |

## Project Structure

```
├── index.html                    # Entry HTML: SEO meta, OG/Twitter, JSON-LD, preconnects
├── public/
│   ├── 404.html                  # Custom error page (noise + glow + home button → /akash-the-band/)
│   ├── favicon.ico               # 32×32 favicon (from New 32x32.png)
│   ├── favicon.svg               # SVG wrapper embedding 512×512 PNG (from New 512x512.png)
│   ├── favicon-32.png            # Scaled 32px favicon
│   ├── favicon-512.png           # Apple touch icon (512px)
│   ├── akash-portrait.jpg        # Akash frontman portrait (used by OG image)
│   ├── Group.jpg                 # Band group photo (FeaturesSection card 1)
│   ├── Logo 2 with no background.png  # Client logo (unused, original asset)
│   ├── New 32x32.png             # Source for favicon.ico
│   ├── New 512x512.png           # Source for favicon.svg + apple-touch-icon
│   ├── robots.txt                # Allow all, sitemap link
│   └── sitemap.xml               # Single URL, weekly, priority 1.0
├── src/
│   ├── main.tsx                  # React root mount (StrictMode)
│   ├── App.tsx                   # Section composition + FloatingCTA + SocialProofBar
│   ├── index.css                 # Tailwind + noise-overlay + bg-noise + skip-link + sr-only
│   ├── vite-env.d.ts             # Vite type declarations
│   └── components/
│       ├── HeroSection.tsx       # Fullscreen Vimeo hero + navbar + mute toggle + CTA
│       ├── AboutSection.tsx      # Portrait + scroll-reveal body + 8-member lineup grid
│       ├── FeaturesSection.tsx   # 4-card responsive grid (group photo, live, corporate, weddings)
│       ├── ReelsSection.tsx      # Vimeo carousel (clone-wrap, snap, touch swipe, lazy init)
│       ├── FooterSection.tsx     # Social links, WhatsApp, phone, email, copyright
│       └── InquiryModal.tsx      # Web3Forms contact form with validation + mailto fallback
├── tailwind.config.js            # colors.primary (#DEDBC8), fontFamily.display, fontFamily.body
├── postcss.config.js
├── vite.config.ts                # base (/akash-the-band/), manualChunks (vendor, animations)
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── package.json
└── .gitignore
```

## Section Order (App.tsx)

1. **HeroSection** — Vimeo background video, loading spinner, mute toggle, noise overlay, gradient overlay, navbar (About, Events, Services, Contact), descriptive text + "Inquire Now" CTA on desktop (overlaid) + mobile (below). Skip-to-content link as first focusable element.

2. **SocialProofBar** (inline in App.tsx) — 738K views · 31K likes · 6 musicians · Birla White. Cream divider strips.

3. **AboutSection** — `bg-[#101010]` rounded card. Label → intro paragraph → scroll-reveal body (Framer Motion `useScroll` ghost+reveal layers) → 8-member lineup grid (2×4 grid with emoji icons).

4. **ReelsSection** — Vimeo carousel: 7 reels + clone-wrap (9 slots). Transform-driven translateX snap navigation with CSS transitions (SNAP_MS=350). Arrow buttons (44×44px WCAG). Touch swipe with dx/dy comparison (vertical scroll passes through). Vimeo Player API lazy init (chain: reel 1 → 2&7 → stagger rest). Mute toggle cross-section sync with Hero. Instagram fallback links for failed embeds. Reel captions.

5. **FeaturesSection** — bg-noise overlay. "Your event. Our stage." header with staggered Framer Motion → 4-card responsive grid (1→2→4 columns): Group.jpg photo card + Live Performances + Corporate Events + Destination Weddings checklist cards. Each service card has "Inquire now" link. Shared InquiryModal.

6. **FooterSection** — Instagram, WhatsApp, phone (+91 99238 37062), email links. Dynamic copyright year.

7. **FloatingCTA** (inline in App.tsx) — Fixed bottom bar on mobile (WhatsApp green #25D366 + Phone primary), floating column at md:right-6 md:bottom-6 on desktop. 44px touch targets.

## Key Content

- **Band lineup:** 6-piece (lead vocals, female vocals, keys, bass, lead guitar, drums) + FOH + production
- **Specialty:** Bollywood covers for luxury weddings and corporate events across India
- **Hero collaboration:** Papon at Goa concert — 738K views, 31K likes
- **High-profile booking:** Birla White corporate event
- **Contact:** WhatsApp +91 99238 37062 · Phone +91 99238 37062 · kanwarbharat@gmail.com
- **Instagram:** @akash_theband

## SEO & Metadata (index.html)

- `<html lang="en-IN">` with geo.region IN-GA
- Meta: description (keyword-rich), keywords, robots (index, follow), canonical URL
- **Open Graph:** og:type, og:url, og:title, og:description, og:image (akash-portrait.jpg, 1200×1200), og:locale en_IN
- **Twitter Card:** summary_large_image
- **JSON-LD structured data:**
  - `MusicGroup` — members, genre, areaServed, sameAs, telephone, email
  - `LocalBusiness` — address, areaServed (Goa, Mumbai, India), priceRange
  - `FAQPage` — 5 Q&As (band size, destination weddings, music type, corporate booking, availability outside Goa)
- Vimeo SDK loaded with `defer`
- Preconnects: fonts.googleapis, fonts.gstatic, player.vimeo.com, i.vimeocdn.com, cloudfront CDN
- Preloads: akash-portrait.jpg, Google Fonts stylesheet

## Reels Carousel Details

- `initReelPlayer()` — Creates Vimeo iframe with `muted=1&loop=1&controls=0&title=0&byline=0&portrait=0&dnt=1` (NOT background=1 — was causing freezes)
- `buildSlots()` — 9 slots: clone-last (idx 0), 7 real (1-7), clone-first (8)
- Clone cards skipped from player init (`data-clone="true"`)
- Chain init: reel 1 → reels 2 & 7 → stagger rest at (i-1)*400ms
- `snap(slot, animated)` — Centers card via `translateX()` with optional `cubic-bezier(0.22, 1, 0.36, 1)` transition
- `navigate(dir)` — Smooth slide → 400ms timeout → wrap detection → snap to real counterpart
- Touch: dx vs dy comparison, only preventDefault when horizontal dominates (allows vertical page scroll)
- IntersectionObserver for autoplay on scroll into view (once)
- Cross-section mute sync: hero unmute → mute-reels event, reels unmute → mute-hero event

## InquiryModal Details

- **Web3Forms** POST to `https://api.web3forms.com/submit`
- Access key from `VITE_WEB3FORMS_ACCESS_KEY` env var
- Mailto fallback (`kanwarbharat@gmail.com`) when key is unset
- Validation: name (required), phone (`/^[\d\s+\-()]{7,15}$/`), email (optional, format check)
- `role="dialog" aria-modal="true" aria-label="Inquiry form"` with ESC key close
- Success state with CheckCircle icon → auto-reset after 2s

## Custom CSS Utilities

- `.noise-overlay` — SVG fractal noise (baseFrequency: 0.85, 3 octaves), mix-blend-overlay on hero
- `.bg-noise` — SVG fractal noise (baseFrequency: 0.9, 4 octaves), subtle bg on features section
- `.skip-link` — Hidden until focused, appears at top of hero for keyboard users
- `.sr-only` — Screen reader only utility
- `.scrollbar-hide` — Hide scrollbar while keeping container scrollable
- `body` bottom padding: 72px for FloatingCTA on mobile (disabled at md breakpoint)

## Build Config

- `base: '/akash-the-band/'` in vite.config.ts for GitHub Pages subpath
- Code splitting: `manualChunks` for vendor (React) and animations (Framer Motion)
- TypeScript 6 with strict mode (tsc -b before build)

## WAT Framework

This project does not use WAT framework tools or workflows. The WAT framework (Workflows/Agents/Tools with Python scripts in `tools/` and Markdown SOPs in `workflows/`) is configured at the user's global level and is unrelated to this website codebase.
