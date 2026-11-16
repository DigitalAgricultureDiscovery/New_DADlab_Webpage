import type { ResearchArea } from '../../types/cms.ts';

/**
 * Research focus areas. These double as the topic taxonomy for the Research
 * page filters: every project lists one or more of these ids in `topics`, and
 * every publication's `topic` matches one of these titles.
 *
 * Sources: the personalization brief (areas 1-5) and the "Main Research
 * Interests" listed on the former DAD Lab website
 * (dad.saraswat.rcac.purdue.edu/index.php/news/), which supplied area 6 and
 * the wording merged into the descriptions.
 */
export const RESEARCH_AREAS: ResearchArea[] = [
  {
    id: 'area-1',
    title: 'Artificial Intelligence and Machine Learning for Agriculture',
    shortLabel: 'Artificial Intelligence',
    description:
      'Machine learning, deep learning, crop disease detection, image analysis, and predictive modeling for agricultural production systems.',
    imageUrl: '',
  },
  {
    id: 'area-2',
    title: 'Remote Sensing and Precision Agriculture',
    shortLabel: 'Remote Sensing & UAS',
    description:
      'UAV imagery, remote sensing, and geospatial data for crop monitoring and site-specific plant management.',
    imageUrl: '',
  },
  {
    id: 'area-3',
    title: 'Digital Agriculture and Decision Support',
    shortLabel: 'Decision Support',
    description:
      'Digital tools, mobile and web applications, data visualization, and cloud-based platforms for agricultural data analysis and decision support.',
    imageUrl: '',
  },
  {
    id: 'area-4',
    title: 'Environmental and Watershed Modeling',
    shortLabel: 'Watershed Modeling',
    description:
      'Modeling soils, plants, and watershed processes, including hydrologic and water quality simulation, spatial and temporal variability assessment, and geospatial analysis of land management.',
    imageUrl: '',
  },
  {
    id: 'area-5',
    title: 'Agricultural Informatics and Education',
    shortLabel: 'Education',
    description:
      'Computational thinking, data science, software development, and informatics education for agricultural students and professionals.',
    imageUrl: '',
  },
  {
    id: 'area-6',
    title: 'Sensors, Internet of Things, and Field Platforms',
    shortLabel: 'IoT & Field Platforms',
    description:
      'Internet of Things (IoT) for plant and animal monitoring and remote control, and building sensors, data collection platforms, field equipment, and autonomous vehicles.',
    imageUrl: '',
  },
];

/** Look up a research area title by id (used to keep publication topics in sync). */
export function areaTitle(id: string): string {
  const area = RESEARCH_AREAS.find((a) => a.id === id);
  if (!area) throw new Error(`Unknown research area id: ${id}`);
  return area.title;
}
