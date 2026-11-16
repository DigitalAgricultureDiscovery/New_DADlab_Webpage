# Digital Agriculture Discovery Lab (DAD Lab) website

The public website of the Digital Agriculture Discovery Lab, Department of
Agricultural and Biological Engineering, Purdue University. It is a fully
static React + Vite site published on GitHub Pages. There is no server,
database, or admin login: all content lives in this repository and is
published by merging changes to `main`.

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
  data/                          Site content (the single source for everything the site shows)
    profile.ts                   Lab profile, biography, education, honors, contact
    research/areas.ts            Research focus areas = Research page topic filters
    research/projects.ts         Research projects (status + topics)
    publications/publications.ts Publications
    news/news.ts                 News
    teaching/courses.ts          Courses
    people/team.ts               People and alumni
    opportunities/opportunities.ts Open positions
  lib/siteData.ts                Hides drafts, orders lists, picks home-page items
  lib/researchFilters.ts         Research page status/topic filtering (pure, tested)
  pages/, components/            React pages and components
tests/                           node:test suites
```

## Editing content

Edit the relevant file in `src/data/` (on GitHub, use the pencil icon), then
merge the change into `main`. The deploy workflow rebuilds and publishes the
site automatically, usually within a minute or two.

Visibility rules:

| Content | Shown on the site | Hidden |
| --- | --- | --- |
| Publications | `status: 'published'` | `status: 'draft'` |
| Research projects, opportunities | `publish_status: 'published'` | `publish_status: 'draft'` |
| Courses | `status: 'active'` or `'archived'` | `status: 'draft'` |
| News | `status: 'published'` or `'archived'` | `status: 'draft'` |

Items marked `featured_on_home` appear on the home page, up to the limits in
`homeLimits` in `src/data/profile.ts`. Fields ending in `_html` accept simple
HTML such as `<p>`, `<ul>`, and `<a>`.

Images are referenced by root-relative paths such as
`/images/research/projects/corn-disease-geodls-app.jpg`; `resolveMediaUrl`
adds the deployment base path, so the same paths work locally and on GitHub
Pages. Put new images under `public/images/`.

### Publication links

Each card on the Publications page is clickable when the publication has a
`publication_url`: clicking anywhere on the card opens that paper in a new
tab. To add or change a link in `src/data/publications/publications.ts`:

1. Find the paper's DOI (on the article page, or by searching the title at
   [search.crossref.org](https://search.crossref.org)).
2. Set `publication_url` to the DOI link, for example
   `doi('10.3390/rs13245182')`. Use the publisher's article page only when the
   paper has no DOI.
3. Open the link and confirm it shows that exact paper before publishing.
4. Optionally set `doi_url` to the same DOI link. It adds a "DOI" link to the
   paper on the Home and Research pages.

Leave `publication_url` empty when no verified link exists. The card then
stays visible but is not clickable.

### Research projects and filters

Each project in `src/data/research/projects.ts` has:

- `project_status`: `ongoing` or `completed` (`archived` is also accepted and
  appears as a "Historical" filter only when used);
- `topics`: one or more research area ids from `src/data/research/areas.ts`;
- `research_area`: the primary area's title (always one of its topics).

The Research page combines the status and topic filters (AND), shows counts,
highlights the active filters, offers a reset, and shows a message when
nothing matches. `tests/research-filters.test.ts` checks every status and
topic combination against this data. Keep publication topics identical to
research area titles to retain their associations.

## Local development

Use Node.js 24, then:

```sh
npm install --legacy-peer-deps --package-lock=false --no-audit --no-fund
npm run dev
```

`npm run dev` starts the Vite development server and prints its local address.

```sh
npm run lint     # TypeScript checks
npm test         # Content and Research filter tests
npm run build    # Static site in dist/
```

This repository has no lockfile, so fresh installs may resolve newer versions
within the declared ranges.

## Deploying to GitHub Pages

The `Deploy website to GitHub Pages` workflow (`.github/workflows/pages.yml`)
runs on every push to `main` and can be started manually from the **Actions**
tab. It installs dependencies, runs `npm run lint`, builds with
`npm run build:pages`, and publishes `dist/`.

1. In **Settings → Pages → Build and deployment**, select **GitHub Actions** as
   the source (one-time setup). "Deploy from a branch" would publish the
   unbuilt source files and show blank pages.
2. Merge changes into `main` (or run the workflow manually).
3. When the workflow finishes, the site is live at the URL shown in the
   workflow's deploy step, for example
   `https://<owner>.github.io/New_DADlab_Webpage/`.

The workflow obtains the URL base from GitHub Pages, so both repository paths
and custom domains use the correct asset URLs. Public navigation uses hash
routes, for example `#/research`, allowing bookmarks and refreshes on Pages.

To build and preview the Pages site locally for the repository URL:

```sh
VITE_BASE_PATH=/New_DADlab_Webpage/ npm run build:pages
```

Then serve `dist/` so that it is reachable under `/New_DADlab_Webpage/`.
