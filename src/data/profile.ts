import type { SiteProfile } from '../types/cms.ts';
import { RESEARCH_AREAS } from './research/areas.ts';
import { TEAM_MEMBERS } from './people/team.ts';
import { AWARDS } from './awards/awards.ts';
import { awardLine } from '../lib/awards.ts';

/**
 * Site profile. Sources: the personalization brief, the former DAD Lab
 * website's "About Us" (homepage), "Home", and "Contact Us" pages
 * (dad.saraswat.rcac.purdue.edu), the department address on the official
 * Purdue Engineering directory, and the PI's awards list (November 2026).
 * See docs/content-audit.md.
 */
export const SITE_PROFILE: SiteProfile = {
  reviewNote: '',
  labName: 'Digital Agriculture Discovery Lab',
  shortTitle: 'DAD Lab',
  department: 'Department of Agricultural and Biological Engineering',
  college: 'Purdue University',
  institution: 'Purdue University',
  heroEyebrow: '',
  heroHeadline: 'Digital Agriculture Discovery Lab',
  heroSubheadline:
    'Advancing Agriculture and Natural Resource Management Through Data Science, Artificial Intelligence, and Digital Technologies.',
  heroImageUrl: '/images/lab/field/uas-flight-over-field-plot.jpg',
  heroImageAlt: 'A DAD Lab researcher flying an unmanned aerial system over a field research plot',
  logoUrl: '/images/lab/logo/dad-lab-logo.webp',
  missionStatement:
    'The Digital Agriculture Discovery Lab at Purdue University conducts research at the intersection of agricultural engineering, data science, artificial intelligence, remote sensing, and environmental modeling. Led by Dr. Dharmendra Saraswat, the laboratory explores applications of information, communication, and sensing technologies to address challenges in agricultural production and natural resource management.',
  piName: 'Dr. Dharmendra Saraswat',
  piTitle: 'Professor, Department of Agricultural and Biological Engineering',
  piEmail: 'saraswat@purdue.edu',
  piPhone: '',
  piOffice: 'ABE 3041 P',
  piPortraitUrl: '/images/people/principal-investigator/dharmendra-saraswat.jpg',
  piBioHtml: [
    'Dr. Dharmendra Saraswat is a Professor in the Department of Agricultural and Biological Engineering (ABE) at Purdue University, where he leads the Digital Agriculture Discovery (DAD) Lab. He received a bachelor’s degree in agricultural engineering from Allahabad Agricultural Institute, formerly associated with the University of Allahabad and now a deemed university named Sam Higginbottom Institute of Agriculture, Technology and Sciences (SHUATS); a master’s degree in agricultural engineering from the Indian Agricultural Research Institute (IARI), New Delhi; and a Ph.D. in food, agricultural and biological engineering from The Ohio State University.',
    'Before coming to Purdue, Dr. Saraswat was a faculty member at the University of Arkansas, a scientist at the Indian Council of Agricultural Research, New Delhi, India, and an assistant professor at Chandra Shekhar Azad University of Agriculture & Technology, Kanpur, India.',
    'Dr. Saraswat conducts research in information technology for agriculture. He has pursued two areas of emphasis within agriculture: watershed modeling and digital agriculture. He applies engineering and science principles to measure, model, and develop digital solutions. His research demonstrates the application of Geographic Information Systems (GIS), remote sensing, and open-source software for creating new technologies, decision-support tools, and datasets for managing the environment and agricultural production systems.',
    'His research focuses on using information, communication, and sensing technologies (ICSTs) to address challenges in plant production (field and nursery crops) and the management of natural resources, through innovative application of ICSTs and multidisciplinary collaborations with colleagues within and outside Purdue University. His research and extension efforts have been recognized nationally and internationally on a sustained basis.',
  ]
    .map((t) => `<p>${t}</p>`)
    .join(''),
  piEducation: [
    'Ph.D., 2007 — The Ohio State University, Food, Agricultural and Biological Engineering',
    'M.S., 1990 — Indian Agricultural Research Institute (IARI), New Delhi, Agricultural Engineering',
    'Bachelor’s degree — Allahabad Agricultural Institute (now SHUATS), Agricultural Engineering',
  ],
  // Structured awards from src/data/awards/awards.ts; the one-line list is derived from them.
  piHonors: AWARDS.map(awardLine),
  piAwards: AWARDS,
  labAddress:
    'Department of Agricultural and Biological Engineering, Purdue University, 225 S. University Street, West Lafayette, IN 47907',
  officeHours: '',
  googleScholarUrl: 'https://scholar.google.com/citations?user=ZKWeTlUAAAAJ&hl=en',
  linkedinUrl: 'https://www.linkedin.com/in/dharmendra-saraswat-40934411/',
  orcidUrl: 'https://orcid.org/0000-0001-8882-0510',
  githubUrl: 'https://github.com/DigitalAgricultureDiscovery',
  homeLimits: {
    projects: 3,
    news: 3,
    publications: 4,
    opportunities: 3,
  },
  teamMembers: TEAM_MEMBERS,
  researchAreas: RESEARCH_AREAS,
  teachingOverview:
    'Dr. Saraswat teaches geospatial and digital agriculture courses at Purdue, including Geographic Information System Application (ASM 54000), which brings course-based research experiences to undergraduates, and Data Visualization and Edge Computing (ASM 59100). He has led agricultural informatics and data science curriculum development supported by USDA-NIFA, covering computational thinking, open-source technologies, data analysis, experiential learning, and problem-based education, and has mentored REEU, SURF, and visiting researchers in the DAD Lab.',
};
