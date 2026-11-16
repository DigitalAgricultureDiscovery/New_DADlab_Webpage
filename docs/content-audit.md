# Personalization and migration ledger — brief v2.0

This review version uses the user's supplied brief, not an independent audit of
faculty records or the old website. The user explicitly deferred access to the
old website. Nothing in this phase establishes complete migration, verified
current project funding, a current teaching schedule, or final PI approval.

| Content | Implemented | Still required before launch |
| --- | --- | --- |
| Identity and biography | Digital Agriculture Discovery Lab (DAD Lab), Dr. Dharmendra Saraswat, Professor, Agricultural and Biological Engineering, Purdue | PI approval of wording and contact details |
| Education | Ph.D. 2007, Ohio State; M.S. 1990, IARI, as supplied | Verify 1988 undergraduate institution against latest CV; intentionally not published |
| Awards | Seven supplied honors, newest first, 2023–2014 | Authoritative source links and approved descriptions; none invented |
| Research areas | Five editable focus areas with descriptions and optional approved imagery; publication topics connect to these areas | Confirm exact wording and approved photographs |
| Research activities | Four supplied historical themes, archived separately from completed/ongoing work; related publications | Confirm active/completed status, funding, dates and links; no active project claims |
| Publications | Six supplied citations, including 2026 preprint; year/type/topic/search controls. Every card links to its DOI, verified in November 2026: title, authors, year, journal, volume and pages match the Crossref record (arXiv record for the preprint), and each DOI resolves to that article's page | Permitted PDF links; migrate the complete historical publication list |
| Teaching | Educational activities published; ASM 54000 and ASM 59100 (Data Visualization and Edge Computing) listed as current 2026–2027 courses with Purdue catalog links; other candidate courses kept as hidden drafts | Semesters, syllabus permissions and materials; confirm or remove the remaining draft courses |
| News | Three historical announcements (2023, 2022, 2020) with year-only dates | Exact dates, source links, approved attachments/photos; dates were not guessed |
| People | PI only; editable photo, role, category, interests, email and professional link; dedicated People page | Verified current roster, approved profiles and alumni |
| Opportunities | No fabricated listings; neutral empty state | PI-approved position details before posting |
| Images | Unapproved generated/sample presets removed from use; no false PI photo | Approved lab photographs, captions, usage rights and alt text |
| Identity/design | Existing layout and black/Boilermaker Gold/white palette retained; false statistics removed | Purdue brand review; no claim of formal brand approval |
| Content management | Static site on GitHub Pages; all content in `src/content/siteContent.ts`, published by merging to `main`; no admin login, server or database | Give content maintainers GitHub access and agree on a review step before merging |

## Old-site migration — deliberately deferred

No old pages, publications, projects, courses, news, names, photographs, PDFs,
figures, downloads, navigation, or legacy URL redirects are claimed as migrated.
When access or an export is supplied, inventory every item with its original
URL, type, assets, citation/source, approved disposition, destination URL and
redirect. Compare the complete inventory with the new site before launch.
Do not redirect uninspected old URLs to invented destinations.

## Review and approval

The public review notice was removed at the lab's request. Dr. Saraswat should
still review the remaining brief-derived content, approve photographs and links,
and confirm current membership and project status. Candidate courses stay in
draft until independently confirmed. The 2026 entry remains a preprint, not a
peer-reviewed journal article.

The site is published on GitHub Pages from the `main` branch.
