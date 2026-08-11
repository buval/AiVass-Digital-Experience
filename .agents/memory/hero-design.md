---
name: Hero design decisions
description: Landing page hero image, layout, and panoramic gradient approach
---

## Rule
Hero uses `hero-arch-a.jpg` (stone arch, olive tree, Mediterranean light). Absolutely positioned on `right-0 w-[62%] md:w-[58%]`. Gradient fade is very gentle (arch stone is cream-toned so it blends naturally).

**Why:** User rejected the dark navy LighthouseHero SVG component (felt "scary" and "two separate things"). Chosen aesthetic: Strategist Deck slide reference — cream, arch, olive tree, warm sea, serene.

**How to apply:** Do not re-add the LighthouseHero. If hero image changes, use an architectural/editorial image with light tones on the left side so the gradient blend works. Portrait photos work only if they have a light left edge.

## Layout
- Section: `bg-paper min-h-[100svh] flex flex-col justify-center overflow-hidden`
- Image: `absolute inset-y-0 right-0`, gradient fades L→R and top/bottom edges
- Headline: `clamp(76px, 10.5vw, 144px)` font-serif, max-w `55vw` desktop
- "Automation with Soul." pull quote: hidden on mobile, desktop bottom-right

## Removed sections
- Section 03 (standalone "Automation with Soul" manifesto) — folded into hero
- Section 10 (Founder quote) — redundant with editorial strip
- Numbered eyebrows ("01 ·", "02 ·") — replaced with descriptive labels

## Living hero (2026-08-11)
Home hero is now a cinemagraph video (`public/videos/hero-arch-living-web.mp4`, ~3.3MB, 8s loop: olive leaves sway, sea shimmers) with `hero-arch-a.jpg` as poster and as full fallback under prefers-reduced-motion. "Automation with Soul." tagline does a staggered blur-fade word reveal then a slow breathe. Source 42MB original in attached_assets/generated_videos/ — don't ship it; always compress with ffmpeg crf 28.
