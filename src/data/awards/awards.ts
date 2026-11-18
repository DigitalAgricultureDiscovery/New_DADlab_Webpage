import type { Award } from '../../types/content.ts';

const ASABE = 'American Society of Agricultural and Biological Engineers (ASABE)';
const AABFEIO = 'Association of Agricultural Biological and Food Engineers of Indian Origin (AABFEIO)';
const PRF = 'Purdue Research Foundation';
const SR_ASHS = 'Southern Region-American Society of Horticultural Science (SR-ASHS)';
const UA_CES = 'University of Arkansas Cooperative Extension Service';
const IARI = 'Indian Agricultural Research Institute (IARI)';

/**
 * Honors and awards, newest first. Source: the complete list supplied by
 * Dr. Saraswat on November 16, 2026 (replacing the shorter list migrated from
 * the former website). First-person wording was changed to third person for
 * the website; no facts were changed.
 */
export const AWARDS: Award[] = [
  {
    year: '2026',
    title: 'Excellence in International Engagement',
    organization: 'Asian Association for Agricultural Engineering (AAAE)',
    details:
      'The award honors those individuals who have made significant contributions to cross-border collaboration, global partnerships, or the international promotion and exchange of agricultural engineering knowledge and sustainable technologies.',
  },
  {
    year: '2025',
    title: 'Fulbright Specialist',
    organization: 'Fulbright Foreign Scholarship Board',
    details:
      'One among 400 U.S. citizens included in the roster for three years, from August 15, 2025, to August 15, 2028, to share expertise in digital agriculture with host institutions abroad. Recipients of Fulbright Specialist awards are selected based on academic and professional achievement, demonstrated leadership in their field, and their potential to foster long-term cooperation between institutions in the U.S. and abroad.',
  },
  {
    year: '2025',
    title: 'Second Place Research Paper Award (Ph.D. category)',
    organization: AABFEIO,
    details:
      'AABFEIO conferred the Second Place Research Paper Award under the Ph.D. category to a research paper led by Dr. Saraswat’s mentee, Adeayo Daniel Adewumi.',
  },
  {
    year: '2025',
    title: 'Second Place Research Paper Award (Ph.D. category)',
    organization: 'African Network Group of ASABE (ANGASABE)',
    details:
      'ANGASABE conferred the Second Place Research Paper Award under the Ph.D. category to a research paper led by Dr. Saraswat’s mentee, Adeayo Daniel Adewumi.',
  },
  {
    year: '2025',
    title: 'Publishing Achievement: Most Significant Increase in H-index for the 2023-2024 Academic Year',
    organization: 'College of Agriculture, Purdue University',
    details:
      'The H-index represents a formula that factors in both the number of publications a scholar has published and the number of times other researchers cite those papers. It shows that an author’s cumulative work is widely recognized and frequently referenced by peers, suggesting that their findings have been influential over the long term.',
  },
  {
    year: '2023',
    title: 'Fulbright U.S. Faculty Scholar Award',
    organization: 'Fulbright Foreign Scholarship Board',
    details:
      'Competitively awarded to conduct teaching/research at the Indian Agricultural Research Institute, New Delhi, India, in the academic year 2023-2024.',
  },
  {
    year: '2023',
    title: 'First Place Research Paper Award (Ph.D. category)',
    organization: AABFEIO,
    details:
      'AABFEIO conferred the First Place Research Paper Award under the Ph.D. category to a research paper led by Dr. Saraswat’s mentee, Varun Aggarwal.',
  },
  {
    year: '2022',
    title:
      'Excellence in Multistate Research Team Award (S1069: Research and Extension for Unmanned Aerial Systems Applications in U.S. Agriculture and Natural Resources)',
    organization: 'National Institute of Food and Agriculture',
  },
  { year: '2022', title: 'Outstanding Faculty Mentor Award', organization: 'Agricultural and Biological Engineering Department, Purdue University' },
  {
    year: '2022',
    title: 'John T Taylor Excellence in Teaching Innovation Award, Nominee for Agricultural and Biological Engineering Department',
    organization: 'Purdue College of Agriculture',
  },
  {
    year: '2021',
    title: 'Outstanding Educator Award',
    organization: 'Sam Higginbottom University of Agriculture, Technology, and Sciences (SHUATS), Prayagraj, India',
  },
  {
    year: '2021',
    title: 'ASABE Information Technology, Sensors, and Control Systems (ITSC) Best Paper Award',
    organization: ASABE,
    details:
      'For a paper led by Ph.D. student Aanis Ahmad in collaboration with Purdue faculty colleagues Dr. Aly Gamal (Electrical and Computer Engineering) and Dr. Gurmukh Johal (Botany and Plant Pathology).',
  },
  { year: '2019', title: 'Outstanding Engineering Teacher for Fall 2019', organization: 'College of Engineering, Purdue University' },
  {
    year: '2018',
    title: 'Standards Award (for EP621: Guidelines for Calibrating, Validating, and Evaluating Hydrologic and Water Quality Models)',
    organization: ASABE,
  },
  { year: '2018', title: 'PRF International Travel Grant', organization: PRF },
  { year: '2018', title: 'Seed for Success Award', organization: 'Purdue University', details: 'For obtaining more than $1 million in research grants.' },
  { year: '2017', title: 'Educational Aids Blue Ribbon Award', organization: ASABE, details: 'For SWAT Tools.' },
  { year: '2017', title: 'PRF International Travel Grant', organization: PRF },
  {
    year: '2016',
    title: 'ASHS 2016 Outstanding App Award',
    organization: 'The American Society for Horticultural Science (ASHS) Extension Division',
    details: 'For the Hort Plants app.',
  },
  { year: '2016', title: 'Blue Ribbon Extension Communication Award', organization: SR_ASHS, details: 'For the Hort Plants app.' },
  { year: '2016', title: 'PRF International Travel Grant', organization: PRF },
  {
    year: '2015',
    title: 'ANRC NPS Award',
    organization: 'Arkansas Natural Resources Commission (ANRC) and Public Policy Center of University of Arkansas Division of Agriculture',
  },
  { year: '2015', title: 'Educational Aids Blue Ribbon Award', organization: ASABE, details: 'For FTTCloud.' },
  { year: '2014', title: 'ISAE Fellow', organization: 'Indian Society of Agricultural Engineers (ISAE), New Delhi' },
  { year: '2014', title: 'The John W. White Outstanding Extension State Faculty Award', organization: 'University of Arkansas System Division of Agriculture' },
  {
    year: '2013',
    title: 'Excellence in Remote Sensing and Precision Agriculture Award (State)',
    organization: 'National Association of County Agricultural Agents (NACAA)',
  },
  { year: '2013', title: 'Educational Aids Blue Ribbon Award', organization: ASABE, details: 'For the Corn Advisor app.' },
  { year: '2013', title: 'Extension Faculty Award of Excellence', organization: 'Gamma Sigma Delta, Arkansas Chapter' },
  { year: '2012', title: 'ASABE Superior Paper Award', organization: ASABE, details: 'For a paper led by Ph.D. student Naresh Pai.' },
  { year: '2012', title: 'Blue Ribbon Extension Communication Award', organization: SR_ASHS },
  { year: '2011', title: 'Early Career Award', organization: UA_CES },
  { year: '2011', title: 'Innovation Award', organization: UA_CES },
  { year: '2004', title: 'CG Ray Travel Grant', organization: 'The Ohio State University' },
  { year: '2002', title: 'Inducted into the Alpha Epsilon Honor Society' },
  { year: '1990-91', title: 'IARI Senior Fellowship', organization: IARI },
  { year: '1988-90', title: 'IARI Junior Fellowship', organization: IARI },
  { year: '1988', title: 'Third rank in a class of 42 students' },
];
