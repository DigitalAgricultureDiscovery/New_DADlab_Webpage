# Digital Agriculture Discovery Lab (DAD Lab) website

Website and content management system for the Digital Agriculture Discovery
Lab, Department of Agricultural and Biological Engineering, Purdue University.
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
  data/                          Seed content (single source for the site's data)
    profile.ts                   Lab profile, biography, education, honors, contact
    research/areas.ts            Research focus areas = Research page topic filters
    research/projects.ts         Research projects (status + topics)
    publications/publications.ts Publications
    news/news.ts                 News
    teaching/courses.ts          Courses
    people/team.ts               People and alumni
  lib/researchFilters.ts         Research page status/topic filtering (pure, tested)
  pages/, components/            React pages and components
server/                          SQLite CMS (db.ts) and seed adapter (initial-content.ts)
server.ts                        Express API, CMS, and production server
tests/                           node:test suites
```

Images are referenced by root-relative paths such as
`/images/research/projects/corn-disease-geodls-app.jpg`;
`resolveMediaUrl` adds the deployment base path, so the same paths work locally,
on the Express server, and on GitHub Pages.

### Research projects and filters

Each project in `src/data/research/projects.ts` has:

- `project_status`: `ongoing` or `completed` (`archived` is still accepted by
  the CMS and appears as a "Historical" filter only when used);
- `topics`: one or more research area ids from `src/data/research/areas.ts`;
- `research_area`: the primary area's title (always one of its topics).

The Research page combines the status and topic filters (AND), shows counts,
highlights the active filters, offers a reset, and shows a message when
nothing matches. `tests/research-filters.test.ts` checks every status and
topic combination against this data. In the CMS, edit topics with the
**Research Topics** checkboxes in **Research Projects**, and research areas
(including the short labels used on the filter chips) in **Site Profile**.

## Local development

Use Node.js 24 (Node 22.13 or later also works; the server uses the built-in
`node:sqlite` module), then:

```sh
npm install --legacy-peer-deps --package-lock=false --no-audit --no-fund
npm run dev
```

The Express/Vite development server listens on port 3000. SQLite content,
uploads and a generated session secret live in `data/`. Keep this directory
local; do not commit or publish it. A new `data/` directory is seeded from
`src/data/`; an existing database is never overwritten, so delete your local
`data/` directory (after backing up anything you need) to load updated seed
content.

```sh
npm run lint                                  # TypeScript checks
node --import tsx --test tests/*.test.ts      # CMS, migration, export, and filter tests
npm run build                                 # Frontend build for the Express server
```

The compatibility install flag handles the current Vite/esbuild optional peer
conflict. This repository has no lockfile, so fresh installs may resolve newer
versions within its declared ranges.

## Deploying to GitHub Pages

The `Deploy website to GitHub Pages` workflow (`.github/workflows/pages.yml`)
runs on every push to `main` and can be started manually from the **Actions**
tab. It installs dependencies, runs `npm run lint`, builds with
`npm run build:pages`, and publishes `dist/`.

1. In **Settings → Pages → Build and deployment**, select **GitHub Actions** as
   the source (one-time setup).
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

Pages serves static files only. The build exports public content from a
temporary database seeded from `src/data/` into `dist/public-data.json`; it
never exports user accounts, inquiries, session secrets, or a local CMS
database. Changes made through a running CMS are not automatically published to
Pages: update `src/data/` and rebuild, or use the CMS export described below.
The Pages contact page offers email, and administration explains that a CMS
server is required.

## CMS operation

A fresh database has **no default accounts**. Provision an administrator from
the server terminal using `CMS_ADMIN_EMAIL` and `CMS_ADMIN_PASSWORD` (at least
16 characters), then run `node --import tsx scripts/create-admin.ts`. Supply
these values through secure environment settings or masked terminal input,
never source files or command-line arguments. Clear those variables afterwards.
The CMS can then create additional users. No Gemini key is required.

Run the Express app on Node 24 with HTTPS in production and a persistent,
backed-up `CMS_DATA_DIR` (defaults to `data/`). The production server runs with
`NODE_ENV=production npm run dev` after `npm run build`; the script uses `tsx`
for TypeScript. `PORT` defaults to 3000. Uploads, SQLite data and the session
secret must survive container restarts. Keep backups private. The public export
is not a database backup. Deploying on GitHub Pages alone does not provide CMS
hosting, authentication, or persistent server storage.

The profile editor manages identity, biography, education, honors, logo, hero
image, research focus areas, teaching overview, team and alumni, review notice
and homepage curation. Separate managers support publications, research
projects (status and topics), news sources/attachments, draft/current/archived
courses, openings and media. The media picker offers the migrated images as
presets. Keep publication topics identical to research area titles to retain
their associations.

For Pages after editing the CMS: use **Download public content for Pages** in
Site Profile, place the downloaded JSON at `content/public-data.json`, and
submit that content file through GitHub review. The workflow publishes it on
merge; when present it takes precedence over `src/data/`. Private user
accounts and contact inquiries are excluded by the authenticated public export
endpoint. Use public hosted media URLs or files in `public/images/` in a Pages
snapshot; local `/uploads/` paths require the backend.

Existing databases are never silently overwritten or reseeded when a table
becomes empty. Schema migrations preserve records while adding archived project
status and project topics (existing projects start without topics and are
filtered by their primary research area until topics are assigned).
