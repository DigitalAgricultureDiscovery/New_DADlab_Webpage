# Digital Agriculture Discovery Lab (DAD Lab) website

The public website of the Digital Agriculture Discovery Lab at Purdue University.
It is a fully static React + Vite site published on GitHub Pages. There is no
server, database, or admin login: all content lives in the repository and is
published by merging changes to `main`.

## Editing content

Everything the site shows comes from one file:
[`src/content/siteContent.ts`](src/content/siteContent.ts). It contains the lab
profile (name, biography, research areas, team members, contact details) and the
lists of publications, research projects, courses, news, and opportunities.

Edit that file (on GitHub, use the pencil icon), then merge the change into `main`.
The deploy workflow rebuilds and publishes the site automatically, usually within
a minute or two.

Visibility rules:

| List | Shown on the site | Hidden |
| --- | --- | --- |
| `publications` | `status: "published"` | `status: "draft"` |
| `projects`, `opportunities` | `publish_status: "published"` | `publish_status: "draft"` |
| `courses` | `status: "active"` or `"archived"` | `status: "draft"` |
| `news` | `status: "published"` or `"archived"` | `status: "draft"` |

Fields ending in `_html` (for example `piBioHtml` or a course's `description_html`)
accept simple HTML such as `<p>`, `<ul>`, and `<a>`.

### Publication links

Each publication card on the Publications page is clickable when the publication
has a `publication_url`. Clicking anywhere on the card opens that paper in a new
tab. To add or change a link:

1. Find the paper's DOI (on the article page, or by searching the title at
   [search.crossref.org](https://search.crossref.org)).
2. Set `publication_url` to the DOI link, for example
   `"https://doi.org/10.3390/rs13245182"`. Use the publisher's article page only
   when the paper has no DOI.
3. Open the link and confirm it shows that exact paper before publishing.
4. Optionally set `doi_url` to the same DOI link. It adds a "DOI" link to the
   paper on the Home and Research pages.

Leave `publication_url` empty (`""`) when no verified link exists. The card then
stays visible but is not clickable.

## Local development

Use Node.js 24, then:

```sh
npm install --legacy-peer-deps --package-lock=false --no-audit --no-fund
npm run dev
```

`npm run dev` starts the Vite development server and prints its local address.
`npm run lint` type-checks the code, and `npm run build` produces the static site
in `dist/`. This repository has no lockfile, so fresh installs may resolve newer
versions within the declared ranges.

## Deployment (GitHub Pages)

The `Deploy website to GitHub Pages` workflow
([`.github/workflows/pages.yml`](.github/workflows/pages.yml)) runs on every push
to `main`. It type-checks, builds, and publishes `dist/`. It can also be started
manually from the repository's Actions tab.

In **Settings → Pages → Build and deployment**, the source must be
**GitHub Actions**. "Deploy from a branch" would publish the unbuilt source files
and show blank pages.

The workflow gets the site's base path from GitHub Pages, so asset URLs work both
at `https://<owner>.github.io/<repo>/` and on a custom domain. To reproduce the
production build locally:

```sh
VITE_BASE_PATH=/New_DADlab_Webpage/ npm run build
```

Pages are addressed with hash routes such as `#/publications`, so bookmarks and
page refreshes work on GitHub Pages without server-side routing.

## Content review

See [the content audit and verification ledger](docs/content-audit.md) for what
has been verified and what still needs review.
