# Digital Agriculture Discovery (Dad Lab)

## Local development

Use Node.js 24 (the server uses built-in SQLite), then:

```sh
npm install --legacy-peer-deps --package-lock=false --no-audit --no-fund
npm run dev
```

The Express/Vite development server listens on port 3000. SQLite content,
uploads and a generated session secret live in `data/`. Keep this directory
local; do not commit or publish it. `npm run lint` checks TypeScript, and
`npm run build` builds the frontend for the Express server.

The compatibility install flag handles the current Vite/esbuild optional peer
conflict. This repository has no lockfile, so fresh installs may resolve newer
versions within its declared ranges.

## GitHub Pages

In the repository's **Settings → Pages → Build and deployment**, select
**GitHub Actions** as the source. Push these changes to `main` (or run the
`Deploy website to GitHub Pages` workflow manually). The workflow builds and
deploys `dist/index.html` and its compiled assets; do not serve the source
`index.html` from a branch.

The workflow obtains the URL base from GitHub Pages, so both repository paths
and custom domains use the correct asset URLs. Public navigation uses hash
routes, for example `#/research`, allowing bookmarks and refreshes on Pages.

To build locally for the repository URL:

```sh
VITE_BASE_PATH=/New_DADlab_Webpage/ npm run build:pages
```

Pages serves static files only. By default the build exports **public brief-based review content**
from a temporary database into `dist/public-data.json`; it never exports user
accounts, inquiries, session secrets, or a local CMS database. Changes made
through a running CMS are not automatically published to Pages. Update seeded
public content and rebuild to publish changes, or host the full Express app
when live CMS editing is needed. The Pages contact page offers email, and
administration explains that a CMS server is required.

Existing research descriptions and other sample content still need editorial
review for the lab; changing the lab name does not rewrite that content.

## Personalization review and CMS operation

See [the content audit and remaining verification ledger](docs/content-audit.md).
The brief is the source for the review version. Original-site migration is
explicitly deferred. The header review notice is editable in Site Profile;
clear it only after the PI approves the content.

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

The profile editor manages identity, biography, education, honors, research
focus areas, teaching overview, team and alumni, images, review notice and
homepage curation. Separate managers support publications, research status
(including archived themes), news sources/attachments, draft/current/archived
courses, openings and media. Save reviewed topic names consistently between
research areas, projects and publication topics to retain their associations.

For Pages after editing the CMS: use **Download public content for Pages** in
Site Profile, place the downloaded JSON at `content/public-data.json`, and
submit that content file through GitHub review. The existing workflow publishes
it on merge. This changes content data, not application source. Without that
file, Pages builds the brief-based review seed. Private user accounts and
contact inquiries are excluded by the authenticated public export endpoint.
Use public hosted media URLs in a Pages snapshot; local `/uploads/` paths
require the backend and must be copied to public hosting or replaced before
Pages publication. For immediate routine updates without a GitHub publication
step, serve the full Express app instead of a Pages snapshot.

Existing databases are never silently overwritten or reseeded when a table
becomes empty. Schema migration preserves project records while adding archived
status. Existing deployments containing old demonstration content must back up
their databases, revoke demonstration accounts, and replace that content through
the CMS or a separately reviewed migration before launch. This session's local
demo database was moved to `/workspace/dad-lab-backups/demo-data-before-personalization`
and a fresh brief-based review database was started; no external database was
modified.

Validation: `node --import tsx --test tests/cms.test.ts` exercises authentication,
public/draft separation, persistent edits, safe HTML, backup/restore, public
export and schema migration. `npm run lint` checks types and `npm run build:pages`
checks the static build.
