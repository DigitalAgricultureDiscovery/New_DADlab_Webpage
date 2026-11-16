// Images migrated from the former DAD Lab website (dad.saraswat.rcac.purdue.edu).
// The files live in public/images/ and are offered as presets in the CMS media picker.
export const PRESET_LAB_IMAGES: { label: string; path: string }[] = [
  { label: 'Dr. Dharmendra Saraswat (portrait)', path: '/images/people/principal-investigator/dharmendra-saraswat.jpg' },
  { label: 'DAD Lab logo', path: '/images/lab/logo/dad-lab-logo.webp' },
  { label: 'UAS flight over a field research plot', path: '/images/lab/field/uas-flight-over-field-plot.jpg' },
  { label: 'Hexacopter UAS at a field site', path: '/images/research/projects/uas-hexacopter-field.jpg' },
  { label: 'GeoDLS corn disease app screens', path: '/images/research/projects/corn-disease-geodls-app.jpg' },
  { label: 'Corn foliar disease types', path: '/images/research/projects/corn-foliar-disease-types.jpg' },
  { label: 'SLIC segmentation workflow', path: '/images/research/projects/corn-leaf-slic-segmentation-workflow.jpg' },
  { label: 'Weed detection examples', path: '/images/research/projects/weed-detection-examples.jpg' },
  { label: 'Disease forecasting model workflow', path: '/images/research/projects/disease-forecasting-model-workflow.jpg' },
  { label: 'IoT indoor and outdoor farms diagram', path: '/images/research/projects/iot-indoor-outdoor-farms-diagram.jpg' },
  { label: 'SWAT Tools web application', path: '/images/research/projects/swat-tools-web-application.jpg' },
  { label: 'REEU 2021 poster session', path: '/images/research/projects/reeu-2021-poster-session.jpg' },
];

/**
 * Resolve a stored media URL for the browser. Root-relative paths for files
 * in public/ (for example `/images/...`) are prefixed with the deployment base
 * path so they also work when the site is served from a sub-path such as
 * GitHub Pages (`/New_DADlab_Webpage/`). Absolute URLs are returned unchanged.
 */
export function resolveMediaUrl(url: string | undefined | null): string {
  if (!url) return '';
  const base = import.meta.env.BASE_URL || '/';
  if (url.startsWith('/') && !url.startsWith('//') && base !== '/' && !url.startsWith(base)) {
    return `${base.replace(/\/$/, '')}${url}`;
  }
  return url;
}
