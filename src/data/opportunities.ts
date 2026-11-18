import type { OpportunityItem } from '../types/content.ts';

/**
 * Open positions shown on the Opportunities page (and, when "Open", on the
 * home page). Add an entry here to announce a position; set `publish_status`
 * to 'draft' to hide it without deleting it. Example:
 *
 *   {
 *     id: 1,
 *     title: 'Graduate Research Assistant, Digital Agriculture',
 *     appointment_type: 'Graduate Research',
 *     description_html: '<p>…</p>',
 *     qualifications_html: '<ul><li>…</li></ul>',
 *     responsibilities_html: '<ul><li>…</li></ul>',
 *     application_instructions: 'Email your CV and a short statement of interest to saraswat@purdue.edu.',
 *     application_url: '',
 *     deadline: '',
 *     position_status: 'Open',
 *     featured_on_home: true,
 *     publish_status: 'published',
 *   },
 */
export const OPPORTUNITIES: OpportunityItem[] = [];
