import heroPurdueLabImg from '../assets/images/hero_purdue_lab_1794777660038.jpg';
import piPortraitFacultyImg from '../assets/images/pi_portrait_faculty_1794777661027.jpg';
import researchAutonomousImg from '../assets/images/research_autonomous_systems_1794777660851.jpg';
import researchPhotonicsImg from '../assets/images/research_photonics_computing_1794777661254.jpg';
import newsSymposiumImg from '../assets/images/news_symposium_award_1794777661678.jpg';

const BUNDLED_ASSETS: Record<string, string> = {
  '/src/assets/images/hero_purdue_lab_1794777660038.jpg': heroPurdueLabImg,
  '/src/assets/images/pi_portrait_faculty_1794777661027.jpg': piPortraitFacultyImg,
  '/src/assets/images/research_autonomous_systems_1794777660851.jpg': researchAutonomousImg,
  '/src/assets/images/research_photonics_computing_1794777661254.jpg': researchPhotonicsImg,
  '/src/assets/images/news_symposium_award_1794777661678.jpg': newsSymposiumImg,
};

export const PRESET_LAB_IMAGES = [
  {
    label: 'Laboratory Floor & Optical Testbenches',
    path: '/src/assets/images/hero_purdue_lab_1794777660038.jpg',
  },
  {
    label: 'Principal Investigator Office Portrait',
    path: '/src/assets/images/pi_portrait_faculty_1794777661027.jpg',
  },
  {
    label: 'Autonomous Gantry Validation Testbed',
    path: '/src/assets/images/research_autonomous_systems_1794777660851.jpg',
  },
  {
    label: 'Silicon Photonic Optical Probe Bench',
    path: '/src/assets/images/research_photonics_computing_1794777661254.jpg',
  },
  {
    label: 'Engineering Symposium Poster Session',
    path: '/src/assets/images/news_symposium_award_1794777661678.jpg',
  },
];

export function resolveMediaUrl(url: string | undefined | null): string {
  if (!url) return '';
  return BUNDLED_ASSETS[url] || url;
}
