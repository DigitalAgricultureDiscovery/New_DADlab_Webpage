// Types for the site's content, which lives in src/data/.

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  category: 'Faculty' | 'Staff' | 'Former Staff' | 'PhD Student' | 'MS Student' | 'Undergraduate' | 'Postdoctoral Researcher' | 'Visiting Researcher' | 'Alumni';
  focus: string;
  photoUrl?: string;
  email?: string;
  website?: string;
  /** Full LinkedIn profile URL. */
  linkedin?: string;
}

/** An honor or award shown on the About page, newest first. */
export interface Award {
  /** Year or range as displayed, e.g. "2025" or "1990-91". */
  year: string;
  title: string;
  organization?: string;
  /** Optional sentence(s) shown under the award. */
  details?: string;
  url?: string;
}

/** A research focus area. Its `id` is the topic key that research projects reference. */
export interface ResearchArea {
  id: string;
  title: string;
  /** Short label used for compact topic filter chips. Falls back to `title`. */
  shortLabel?: string;
  description: string;
  imageUrl: string;
}

export interface SiteProfile {
  researchAreas?: ResearchArea[];
  teachingOverview?: string;
  reviewNote?: string;
  labName: string;
  shortTitle: string;
  department: string;
  college: string;
  institution: string;
  heroEyebrow: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroImageUrl: string;
  heroImageAlt?: string;
  logoUrl?: string;
  missionStatement: string;
  piName: string;
  piTitle: string;
  piEmail: string;
  piPhone: string;
  piOffice: string;
  piPortraitUrl: string;
  piBioHtml: string;
  piEducation: string[];
  /** One-line honors ("YEAR — Award, Organization"); kept in sync with piAwards and used when piAwards is empty. */
  piHonors: string[];
  /** Structured honors and awards (preferred). */
  piAwards?: Award[];
  labAddress: string;
  officeHours: string;
  googleScholarUrl: string;
  linkedinUrl?: string;
  orcidUrl: string;
  githubUrl: string;
  homeLimits: {
    projects: number;
    news: number;
    publications: number;
    opportunities: number;
  };
  teamMembers: TeamMember[];
}

export type NewsCategory =
  | 'Award'
  | 'Conference'
  | 'Student Achievement'
  | 'Research Development'
  | 'Announcement';

export type PublishStatus = 'draft' | 'published' | 'archived';

export interface NewsItem {
  source_url?: string;
  attachments?: {label: string; url: string}[];
  id: number;
  slug: string;
  title: string;
  category: NewsCategory;
  published_date: string;
  summary: string;
  content_html: string;
  image_url: string;
  image_caption: string;
  featured_on_home: boolean;
  status: PublishStatus;
  author_name: string;
}

export type PublicationType =
  | 'Journal Article'
  | 'Conference Paper'
  | 'Workshop'
  | 'Book Chapter'
  | 'Preprint'
  | 'Technical Report';

export interface PublicationItem {
  id: number;
  title: string;
  authors: string;
  year: number;
  venue: string;
  pub_type: PublicationType;
  topic: string;
  abstract: string;
  doi_url: string;
  publisher_url: string;
  pdf_url: string;
  bibtex: string;
  featured_on_home: boolean;
  status: 'draft' | 'published';
}

export interface CourseMaterial {
  label: string;
  url: string;
}

export type CourseStatus = 'draft' | 'active' | 'archived';

export interface CourseItem {
  id: number;
  course_number: string;
  title: string;
  semester: string;
  academic_year: string;
  description_html: string;
  topics: string[];
  objectives: string[];
  syllabus_url: string;
  materials: CourseMaterial[];
  university_catalog_url: string;
  status: CourseStatus;
  featured_on_home: boolean;
}

export type ProjectStatus = 'ongoing' | 'completed' | 'archived';

export interface ResearchProjectItem {
  id: number;
  slug: string;
  title: string;
  research_area: string;
  overview: string;
  objectives_html: string;
  methodology_html: string;
  progress_notes: string;
  image_url: string;
  image_caption: string;
  project_status: ProjectStatus;
  /** Research area ids (see SiteProfile.researchAreas); a project may have several. */
  topics: string[];
  related_publication_ids: number[];
  collaborators: string;
  funding_info: string;
  featured_on_home: boolean;
  publish_status: 'draft' | 'published';
}

export type AppointmentType =
  | 'Hourly Student Research'
  | 'Undergraduate Research'
  | 'Graduate Research'
  | 'Research Assistantship'
  | 'Full-Time Research'
  | 'Postdoctoral / Other';

export type PositionStatus = 'Open' | 'Closed' | 'Filled' | 'Archived';

export interface OpportunityItem {
  id: number;
  title: string;
  appointment_type: AppointmentType;
  description_html: string;
  qualifications_html: string;
  responsibilities_html: string;
  application_instructions: string;
  application_url: string;
  deadline: string;
  position_status: PositionStatus;
  featured_on_home: boolean;
  publish_status: 'draft' | 'published';
}

/** Everything the public pages need, built from src/data/ by src/data/content.ts. */
export interface SiteContent {
  profile: SiteProfile;
  featuredProjects: ResearchProjectItem[];
  allProjects: ResearchProjectItem[];
  featuredNews: NewsItem[];
  allNews: NewsItem[];
  featuredPublications: PublicationItem[];
  allPublications: PublicationItem[];
  courses: CourseItem[];
  opportunities: OpportunityItem[];
}
