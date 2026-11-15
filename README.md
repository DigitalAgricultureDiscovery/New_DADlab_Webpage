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

Pages serves static files only. The build exports **public seeded content**
from a temporary database into `dist/public-data.json`; it never exports user
accounts, inquiries, session secrets, or a local CMS database. Changes made
through a running CMS are not automatically published to Pages. Update seeded
public content and rebuild to publish changes, or host the full Express app
when live CMS editing is needed. The Pages contact page offers email, and
administration explains that a CMS server is required.

Existing research descriptions and other sample content still need editorial
review for the lab; changing the lab name does not rewrite that content.
