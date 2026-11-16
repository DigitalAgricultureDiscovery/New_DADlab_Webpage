# Content migration ledger

This ledger records what was migrated from the former DAD Lab website,
<https://dad.saraswat.rcac.purdue.edu/>, into this site, where it now lives,
and what still needs the PI's confirmation. Migration date: November 16, 2026.

## Source and method

- The former site is a WordPress site. Its pages, posts and media library were
  read through its public WordPress REST API (`/wp-json/wp/v2/pages`, `posts`,
  `media`) and its rendered homepage.
- **Certificate:** the TLS certificate for `saraswat.rcac.purdue.edu` and
  `*.saraswat.rcac.purdue.edu` (InCommon RSA Server CA 2) expired on
  **November 1, 2025**. With the PI's explicit authorization, content was
  fetched with full certificate-chain and hostname verification but without
  the expiry-date check. The same certificate also covers the SWAT Tools
  (`saraswat-swat`) and StreBand Cloud (`saraswat-streband`) web tools linked
  from the Research page; visitors see a browser certificate warning on those
  hosts until the certificate is renewed through RCAC.
- The former site's page slugs are swapped: `/index.php/research/` holds the
  dated **News** feed, and `/index.php/news/` holds **Research Interests**.

## Where content now lives

| Content | Former site | New location |
| --- | --- | --- |
| Biography, education, awards | About Us (homepage), Home | `src/data/profile.ts` |
| Contact (email, office) | Contact Us | `src/data/profile.ts` |
| Research focus areas | Research Interests (`/news/`) + brief | `src/data/research/areas.ts` |
| Research projects (16) | News feed, Tools, People, NNF, posts + brief | `src/data/research/projects.ts` |
| Publications (38) | Publications page (29), news posts (8 conference papers), brief (1) | `src/data/publications/publications.ts` |
| News (62 items, 2019-2024) | News feed (`/research/`), 2019 blog posts, and one 2020 item from the brief | `src/data/news/news.ts` |
| Courses (2 current, 2 archived, 4 drafts) | Current 2026-2027 courses from the PI; Teaching, ASM 54000, ASM 59100, ABE 49500 pages; brief | `src/data/teaching/courses.ts` |
| People (28) | People page, The DAD Group page, thesis-defense posts | `src/data/people/team.ts` |
| Images (54 files) | WordPress media library | `public/images/` |

`server/initial-content.ts` converts these modules into rows for a fresh CMS
database and for the GitHub Pages export. Existing CMS databases are not
overwritten.

## Images

All images were taken from the former site's media library, resized, and
re-encoded with metadata removed. Five unused generated images that were in
`src/assets/images/` (including a generated "PI portrait") were deleted.

| New file | Original upload | Used on |
| --- | --- | --- |
| `people/principal-investigator/dharmendra-saraswat.jpg` | `2021/10/Dharam_suit2web.jpg` (About Us photo; original 2663×3150, aspect ratio kept) | Home, About, People |
| `lab/logo/dad-lab-logo.webp` | `2018/12/DAD_group2.jpg` (the site's custom logo; white background made transparent, design unchanged) | Header, footer, About |
| `lab/logo/favicon-32.png`, `icon-192.png`, `apple-touch-icon.png` | same logo | Browser icons |
| `lab/field/uas-flight-over-field-plot.jpg` | `2021/01/IMG_1686` | Home hero |
| `research/projects/corn-disease-geodls-app.jpg` | `2023/05/geodls` | Corn disease project; GeoDLS news |
| `research/projects/weed-detection-examples.jpg` | `2021/04/Picture8-1.png` | Weed identification project |
| `research/projects/disease-forecasting-model-workflow.jpg` | `2023/04/Screen-Shot-...11.58.08` | Disease forecasting project |
| `research/projects/iot-indoor-outdoor-farms-diagram.jpg` | `2019/01/research2.jpg` | IoT indoor farming project |
| `research/projects/swat-tools-web-application.jpg` | `2019/01/tools-2.jpg` | SWAT web tools project |
| `research/projects/uas-hexacopter-field.jpg` | `2021/01/IMG_1287` | Soybean stand count project |
| `research/projects/reeu-2021-poster-session.jpg` | `2021/07/liz.png` | REEU project and news |
| `research/projects/corn-leaf-slic-segmentation-workflow.jpg` | `2022/10/GA.jpg` | SLIC news |
| `research/projects/corn-foliar-disease-types.jpg` | `2021/10/one-1.png` | 2021 corn disease news |
| `news/*.jpg` (15 files) | Photos and slides attached to dated news posts | News |
| `people/members/*.jpg` (24 files) | People / DAD Group page photos | People, About |

**Not migrated:** stock or template images in the media library (e.g. barley
field, "idea" paper, podcast microphone, theme demo team photos and client
logos); third-party material (a *Smart Agricultural Technology* journal cover,
the seed drill composite that credits ICAR photographs, the ABE magazine
spread, ASABE and Remote Sensing logos); duplicate WordPress thumbnails; and
two `Photos.zip` archives. Publication PDFs hosted on the former site (17
files) were not copied because of publisher copyright; entries link to DOIs or
publisher pages instead. Embedded YouTube videos (5) were not migrated.

## Research project status

Status was set from documented evidence; where the former site did not show
an end, the PI decided (November 16, 2026).

| Project | Status | Basis |
| --- | --- | --- |
| AI chatbots and LLMs for agricultural extension | Ongoing | PI confirmation |
| Affordable seed drill for India | Ongoing | PI confirmation |
| SPEAR-NeXT Earth representation learning | Ongoing | PI confirmation; 2026 preprint |
| Corn disease deep learning | Completed | Ph.D. defense Nov 17, 2023 |
| Weed identification with UAS | Completed | M.S. defense July 2019; 3-year funding from Aug 2019 |
| Plant disease forecasting and early warning | Completed | PI confirmation; M.S. defense Apr 2023 |
| UAS soybean stand counting | Completed | PI confirmation |
| IoT testbed for indoor farming | Completed | M.S. defense July 2021 |
| REEU Data Science for Agriculture | Completed | Funding period 2019-2023 ended |
| Agricultural informatics and data science education | Completed | PI confirmation |
| UAS User Log | Completed | PI confirmation |
| Watershed and water quality modeling | Completed | Alumni research, publications 2010-2020 |
| Web-based geospatial tools for SWAT | Completed | Tools developed; alumni research |
| UAS imagery for soybean moisture stress | Completed | Ph.D. defense Apr 2019 |
| Field-scale predictive soil mapping | Completed | M.S. defense July 2019 |
| Mobile apps and cloud tools | Completed | Historical tools (University of Arkansas era) |

Each project lists its research topics (research area ids); the Research
page filters by status and topic with AND logic.

## Corrections and normalizations

- Publication venues that named two journals were resolved from the entry's
  own DOI or URL: LUU Checker → *Applied Engineering in Agriculture*
  (doi 10.13031/aea.13295); Singh & Saraswat 2018 → *Water* 10(4), 443;
  Leiva et al. 2017 → *Journal of Applied Remote Sensing*. Kumar et al. 2020
  is listed as *Water* 12(2), 410 (the page said "40", its URL says 410).
- *Smart Agricultural Technology* volume 3 articles are dated 2023
  (the page listed one as 2022 and one as 2023).
- Author names normalized: "Gamal, A.E." → "El Gamal, A."; "Youseff" →
  "Youssef". Student-author superscripts and "(Tier 1)" labels removed.
- The news post headed "08/02/2022" describes the 2023 SURF award and is
  dated 2023-08-02.
- "Foundation of Food and Agricultural Research" → Foundation for Food and
  Agriculture Research; "American Society of Horticultural Sciences" →
  American Society for Horticultural Science.
- Hannah Klein's thesis title comes from her defense announcement; the People
  page had copied Jeff Fiechter's thesis topic onto her entry.
- Aanis Ahmad (Ph.D. 2023) and Madhu Lekha Guntaka (M.S. 2021) were listed as
  current students on the People page; their defense announcements place them
  under Alumni.

## Not retrieved or needing PI confirmation

- **Title:** the former site says *Associate Professor*; the new site keeps
  *Professor* from the personalization brief. Please confirm.
- **Phone:** the Contact page lists +1 (501) 954-0365 (an Arkansas area code).
  It was not published; add it in Site Profile if it should appear.
- **Bachelor's degree year** is not on the former site and is not shown.
- **Current roster:** the People page reflects the former site (last updated
  2023-2024). Please confirm current students and alumni positions.
- **Courses:** the current 2026-2027 courses (ASM 54000 *Geographic
  Information System Application* and ASM 59100 *Data Visualization and Edge
  Computing*) were supplied by the PI; the former site's credit details were
  added to ASM 54000. ASM 59100 *Decision Agriculture Methods* and ABE 49500
  *Introduction to UAS* are shown as archived offerings. Candidate courses
  from the brief remain drafts.
- **Publications not added (incomplete citations on the former site):** the
  March 2024 tar spot paper (no author list), BNNDC-Net (title not given), and
  the 2022 weather-data lesson plan (title not given). They appear as news.
  The Chawla et al. 2022 ASABE paper number on the former site duplicated
  another paper's number and was omitted.
- **Undated item:** the 2024 summer intern announcement was labeled
  "10/06/2024" but its photo was uploaded in July 2024; it is shown with the
  year only.
- **Not migrated by design:** personal/social posts (a family announcement,
  Diwali and lunch celebrations), expired 2019 GRA and SURF openings, the
  Purdue Agricultural Data Engine (PADE) tool link (lab role unclear), and the
  empty WordPress demo pages.
- **Links:** the SWAT Tools and StreBand Cloud links show certificate warnings
  until the RCAC certificate is renewed. Links to aaes.auburn.edu,
  connect.purdue.edu, and iitj.ac.in could not be verified from the migration
  environment.

## Review notice

The header review notice is cleared (as on `main`). It can be restored in
**Site Profile → Public review notice** if needed.
