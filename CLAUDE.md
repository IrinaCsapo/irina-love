# irina.love — project memory

## Writing rules

- **No em dashes (—).** They read as AI-generated filler. Use a comma, a full stop, or rewrite the sentence instead.

## Project overview

Static HTML/CSS/JS site hosted at irina.love. Source files live in `website_source/`. Previously deployed via Netlify; migrating to GitHub Pages.

## Tech notes

- Colors use `oklch()` throughout — do not convert to hex/rgb
- WebP format for all photography assets
- Fonts: Fraunces (display/serif), Newsreader (text), Fragment Mono (mono)
- No build step — plain HTML files, edit directly

## Video assets

- A `-web` suffix in a video filename means Irina has already re-formatted/compressed it for the web. Only deploy `-web` versions.
- ALERT Irina before using any video that lacks the `-web` suffix or is larger than 10MB, so she can re-export it first.

## Sound

- Sound is opt-in: OFF by default with a visible "Turn music on" tag next to the floating toggle (browser autoplay rules made default-on buggy; Irina chose explicit opt-in).

## Photography albums

- `streets.html` — 25 photos, accent `oklch(56% 0.185 29)` (coral)
- `lights.html` — 25 photos, accent `oklch(72% 0.09 75)` (amber)
- `cats.html` — 19 photos, accent `oklch(56% 0.185 29)` (coral)
- All three use the same book-browsing layout (full-screen, cross-dissolve, arrow/click/swipe navigation)

## Analytics

Umami self-hosted at irina-umami.vercel.app, website ID: 9c96c480-3224-4ef0-ba74-a5212d1f6d69
Both script.js and recorder.js on all pages.
