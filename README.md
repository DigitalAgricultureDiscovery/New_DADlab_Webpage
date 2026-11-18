# Digital Agriculture Discovery Lab (DAD Lab) website

Website of the Digital Agriculture Discovery Lab, Department of Agricultural
and Biological Engineering, Purdue University. It is a static React site
published on GitHub Pages; there is no server, database, or login. All content
lives in TypeScript files under `src/data/` and is updated through pull
requests.

Content was migrated from the former lab website,
`dad.saraswat.rcac.purdue.edu`; see
[the migration ledger](docs/content-audit.md) for sources, corrections, and
items awaiting PI confirmation.

## Project layout

```
public/images/
  lab/logo/                      DAD Lab logo (header, footer, About) and browser icons
  lab/field/                     Field photography (homepage hero)
  people/principal-investigator/ Dr. Saraswat's portrait
  people/members/                Lab member photos
  research/projects/             Research project images
  news/                          News photos
src/
  data/                          The site's content
    profile.ts                   Lab profile, biography, education, contact, home page limits
    awards/awards.ts             Honors and awards (About page), newest first
    research/areas.ts            Research focus areas = Research page topic filters
    research/projects.ts         Research projects (status + topics)
    publications/publications.ts Publications
    news/news.ts                 News
    teaching/courses.ts          Courses
    people/team.ts               People and alumni
    opportunities.ts             Open positions (currently none)
    content.ts                   Assembles the above for the pages (drafts hidden, sorting, home picks)
  lib/researchFilters.ts         Research page status/topic filtering and topic links (pure, tested)
  lib/publications.ts            Publication order (newest first), shared by Home and Publications
  pages/, components/            React pages and components
tests/                           node:test suites
```

## Updating content

Edit the relevant file in `src/data/`, run the checks below, and open a pull
request. Merging into `main` publishes the change.

- Items with a draft status (`publish_status: 'draft'` for projects and
  opportunities, `status: 'draft'` for publications, news and courses) stay in
  the file but are not shown.
- News from 2023 onward is listed as current news; earlier items appear in the
  News Archive.
- The home page shows the newest publications, the projects and news marked
  `featured_on_home`, and open opportunities, up to the counts in
  `homeLimits` in `src/data/profile.ts`.
- Put new images under `public/images/` and reference them with root-relative
  paths such as `/images/research/projects/corn-disease-geodls-app.jpg`;
  `resolveMediaUrl` adds the GitHub Pages base path.

### Research projects and filters

Each project in `src/data/research/projects.ts` has:

- `project_status`: `ongoing` or `completed` (`archived` is also accepted and
  appears as a "Historical" filter only when used);
- `topics`: one or more research area ids from `src/data/research/areas.ts`;
- `research_area`: the primary area's title (always one of its topics).

Each topic has a shareable link, `#/research?topic=<slug>` (for example
`#/research?topic=remote-sensing-uas`). The slug comes from the area's short
label; the area id and a slug of its full title also work, and unknown topics
show all research. The home page's Research Focus Areas cards use these links.

The Research page combines the status and topic filters (AND), shows counts,
highlights the active filters, offers a reset, and shows a message when
nothing matches. `tests/research-filters.test.ts` checks every status and
topic combination against this data. Research areas, including the short
labels used on the filter chips and in topic links, are edited in
`src/data/research/areas.ts`.

### Typography

Fonts and the type scale are defined in `src/index.css` (Tailwind v4 theme
tokens such as `text-page`, `text-body`, `text-meta`) and loaded in
`src/main.tsx`. The site self-hosts open-licensed fonts that follow Purdue's
documented fallbacks, because Purdue's licensed brand fonts are only licensed
for Purdue-owned domains. See [the typography guide](docs/typography.md) for the
scale, usage rules, licensing, and accessibility notes.

### Welcome animation

On a visitor's first page load, a short intro (about 2.4 seconds) shows
"Welcome", the lab logo, and "to the DAD Lab" over a black screen. The text
fades out and the logo moves to its place in the header. It is in
`src/components/IntroSplash.tsx` (styles at the end of `src/index.css`) and
only animates `opacity` and `transform`, so it stays light on low-end devices.

- It plays at most once every two hours per browser: the first-party cookie
  `dadlab_intro_seen` (`Max-Age` 7200 s, set by `src/lib/intro.ts`) suppresses
  it on refreshes and further visits until it expires.
- It is skipped for visitors whose system requests reduced motion, and any
  click, tap, or key press skips it.

## Local development

Use Node.js 22 or later (the deploy workflow uses Node 24), then:

```sh
npm install --package-lock=false
npm run dev        # http://localhost:3000
```

Before opening a pull request:

```sh
npm run lint       # TypeScript checks
npm test           # content, filter, and helper tests
npm run build      # production build into dist/
```

This repository has no lockfile, so fresh installs may resolve newer versions
within the ranges in `package.json`.

## Deploying to GitHub Pages

The `Deploy website to GitHub Pages` workflow (`.github/workflows/pages.yml`)
runs on every push to `main` and can be started manually from the **Actions**
tab. It installs dependencies, runs `npm run lint` and `npm test`, builds with
`npm run build`, and publishes `dist/`.

1. In **Settings → Pages → Build and deployment**, select **GitHub Actions** as
   the source (one-time setup).
2. Merge changes into `main` (or run the workflow manually).
3. When the workflow finishes, the site is live at the URL shown in the
   workflow's deploy step, for example
   `https://<owner>.github.io/New_DADlab_Webpage/`.

The workflow obtains the URL base from GitHub Pages, so both repository paths
and custom domains use the correct asset URLs. Pages use hash routes, for
example `#/research`, so bookmarks and refreshes work on Pages.

To preview the production build for the repository URL locally:

```sh
VITE_BASE_PATH=/New_DADlab_Webpage/ npm run build
```

Then serve `dist/` so that it is reachable under `/New_DADlab_Webpage/`.

The Contact page lists the lab's email, phone, and address; inquiries go by
email, since there is no server to receive form submissions.
