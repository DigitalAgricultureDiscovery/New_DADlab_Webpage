# Typography

The site's typography is defined in one place, `src/index.css` (Tailwind v4
`@theme` tokens), and the fonts are loaded in `src/main.tsx`.

## Font families

Purdue's brand typography uses **United Sans** for headlines, **Acumin Pro** for
body text, and **Source Serif Pro** for long-form content. Purdue's digital
design guide states that these licensed fonts are "available for all
Purdue-owned domains" and lists system fallbacks for other cases (Franklin
Gothic or Arial for Acumin Pro, Impact for United Sans, Georgia for Source
Serif Pro). This site is served from `github.io`, which is not a Purdue-owned
domain, so the licensed fonts are **not** served from it, and no proprietary
font files are stored in this repository.

Instead, the site self-hosts open-licensed fonts (SIL Open Font License 1.1,
installed from npm via Fontsource and bundled by Vite) that follow Purdue's
documented fallbacks:

| Role | Purdue font (listed first) | Served to visitors | Fallbacks |
| --- | --- | --- | --- |
| Body, navigation, buttons, cards, publications (`font-body`, default) | Acumin Pro | Libre Franklin (a Franklin Gothic revival) | Franklin Gothic, Arial, sans-serif |
| Hero, page titles, numeric highlights (`font-display`) | United Sans | Barlow Semi Condensed 600/700 | Impact, Arial Narrow, Arial |
| Long-form biography, research narratives, news articles (`font-editorial`) | Source Serif Pro | Source Serif 4 (the open-source successor of Source Serif Pro) | Georgia, serif |

Each stack lists the Purdue font first, so visitors who have it installed see
it. If the site moves to a Purdue-owned domain, add Purdue's stylesheets to
`index.html` (see Purdue Brand Studio's digital design guidance:
`https://use.typekit.net/ghc8hdz.css` and
`https://www.purdue.edu/purdue/fonts/united-sans/united-sans.css`); the stacks
already prefer those fonts, and the open fonts can then be removed from
`src/main.tsx`.

Only the Latin subsets a page uses are downloaded (`unicode-range`), with
`font-display: swap`. A typical page loads about 80 KB of fonts.

## Type scale

Use the `text-<token>` utilities; each sets size, line height, and (where
listed) weight and letter spacing. Fluid sizes interpolate between a 375px and a
1440px viewport with `clamp()` and are rem-based, so browser text resizing
works.

| Token | Mobile to desktop | Weight | Line height | Use |
| --- | --- | --- | --- | --- |
| `text-hero` | 36 to 56px | 700 | 1.1 | Homepage lab name (with `font-display`) |
| `text-page` | 32 to 42px | 700 | 1.15 | Page titles, h1 (with `font-display`) |
| `text-section` | 26 to 32px | 600 | 1.25 | Section headings, h2 |
| `text-subsection` | 21 to 24px | 600 | 1.3 | Subsections, course and position titles |
| `text-name` | 22 to 25px | 600 | 1.25 | People's names |
| `text-card-title` | 19 to 21px | 600 | 1.3 | Card titles (projects, focus areas) |
| `text-item-title` | 18 to 20px | 600 | 1.35 | Publication, news, and award titles |
| `text-lead` | 18 to 21px | 400 | 1.55 | Intro statements, article summaries |
| `text-body` | 16 to 18px | 400 | 1.65 | Body text (also the page default) |
| `text-card` | 16px | 400 | 1.55 | Card descriptions, authors, form fields |
| `text-nav` | 16px | 500 | 1.3 | Navigation links |
| `text-button` | 15px | 600 | 1.3 | Buttons, filters, action links |
| `text-meta` | 14 to 15px | 400 | 1.5 | Venues, dates, metadata |
| `text-caption` | 14px | 400 | 1.45 | Captions, small notes |
| `text-label` | 14px | 600 | 1.3 | Uppercase eyebrow labels (0.06em tracking) |
| `text-badge` | 13px | 600 | 1.25 | Status, category, and count badges |

Rich text uses `.prose-lab` (body size, 1.7 line height, 68-character
measure). Add `.prose-editorial` for long-form narratives to switch to the
editorial serif at 17 to 18px. `.measure` limits any paragraph to about 68
characters.

## Rules

- Headings keep semantic levels (one h1 per page; h2 for sections; h3 for
  cards). h1 and h2 balance their lines; longer h3+ titles wrap naturally.
- Do not shrink text to fit a card. Nothing important is smaller than 13px.
- Status is always written out (Ongoing, Completed), not shown by color or
  weight alone.
- Gold text on light backgrounds uses `text-purdue-gold-text` (#816538,
  5.2:1 on the page background). Purdue Aged gold #8E6F3E (4.4:1) is kept for
  borders and accents, and Boilermaker Gold #CFB991 for text on black.
- Form fields use at least 16px so mobile browsers do not zoom on focus.
- The desktop navigation appears from 1280px (Tailwind `xl`); narrower screens
  use the menu button, because 16px navigation links do not fit beside the
  logo below about 1180px.

## Verification (November 2026)

- 375, 768, 1024, and 1440px, plus 200% browser zoom and 200% default text
  size: no horizontal scrolling on 11 representative pages; smallest text is
  13px (26px at 200% text); headings stay clear of the header.
- All 574 visible text elements on those pages meet WCAG AA contrast.
- Web fonts load under the GitHub Pages base path.

Sources: Purdue Brand Studio,
[Design and copy (digital)](https://www.purdue.edu/brand-studio/digital/design-copy/);
[Purdue visual identity](https://www.purdue.edu/brand-studio/our-brand/visual-identity/).
