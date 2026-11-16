import type { CourseItem } from '../../types/cms.ts';

export type CourseSeed = Omit<CourseItem, 'id' | 'created_at' | 'updated_at'>;

const course = (c: Pick<CourseSeed, 'course_number' | 'title' | 'status' | 'description_html'> & Partial<CourseSeed>): CourseSeed => ({
  semester: '',
  academic_year: '',
  topics: [],
  objectives: [],
  syllabus_url: '',
  materials: [],
  university_catalog_url: '',
  featured_on_home: false,
  ...c,
});

/**
 * Current courses (2026-2027, with Purdue catalog links) were supplied by the
 * PI. Credit and meeting details for ASM 54000 and the two archived offerings
 * come from the former DAD Lab website's Teaching and course pages
 * (index.php/teaching/, /asm-54000/, /asm-59100/, /abe-49500/). Candidate
 * courses from the personalization brief remain unpublished drafts.
 */
export const COURSES: CourseSeed[] = [
  course({
    course_number: 'ASM 54000',
    title: 'Geographic Information System Application',
    academic_year: '2026–2027',
    status: 'active',
    description_html:
      '<p>Fundamentals of geographic information systems (GIS) applied to environmental, agricultural, and engineering problems. Students work with spatial data sources, map projections, and metadata; analyze vector and raster data; automate GIS workflows with custom geoprocessing tools; and share their results through dashboards, web apps, and StoryMaps.</p><p>3 credits (2 lectures and 1 lab per week), offered in the Fall semester. The course includes research components that provide Course-based Research Exposure to Undergraduate Students (CURE).</p>',
    university_catalog_url: 'https://catalog.purdue.edu/preview_course_nopop.php?catoid=19&coid=227381',
    materials: [{ label: 'Course website', url: 'https://engineering.purdue.edu/~asm540/' }],
  }),
  course({
    course_number: 'ASM 59100',
    title: 'Data Visualization and Edge Computing',
    academic_year: '2026–2027',
    status: 'active',
    description_html:
      '<p>A hands-on introduction to data visualization for students new to the field, covering the visualization process through lectures, readings, and current tools. Students also work with IoT sensors for real-time data, edge computing, and deep learning models for computer vision, building a foundation in data analysis and visualization for future applications.</p>',
    university_catalog_url: 'https://catalog.purdue.edu/preview_course_nopop.php?catoid=19&coid=227384',
    materials: [
      {
        label: 'Course description (Purdue Agricultural & Biological Engineering)',
        url: 'https://ag.purdue.edu/department/abe/courses/agriculture-informatics/index.html',
      },
    ],
  }),
  // Earlier offerings listed on the former DAD Lab website.
  course({
    course_number: 'ASM 59100',
    title: 'Decision Agriculture Methods',
    semester: 'Fall',
    status: 'archived',
    description_html: '<p>3 credits (2 lectures and 1 lab per week); offered in the Fall semester.</p>',
  }),
  course({
    course_number: 'ABE 49500',
    title: 'Introduction to Unmanned Aerial Systems (UAS)',
    semester: 'Spring',
    status: 'archived',
    description_html: '<p>1 credit (mostly lectures and a couple of labs); offered in the Spring semester.</p>',
  }),
  // Candidate courses from the personalization brief: unpublished drafts.
  ...[
    ['ASM 59100', 'Hands-On Introduction to AI'],
    ['ABE 49500', 'Modeling and Computational Tools in Biological Engineering (title to verify)'],
    ['ASM 49000', 'Special Problems'],
    ['ILS 59500', 'Visual Media Smart (title to verify)'],
  ].map(([course_number, title]) =>
    course({
      course_number,
      title,
      status: 'draft',
      description_html:
        '<p>Candidate course from the personalization brief. Official title, instructor assignment, semester, and materials require confirmation before publication.</p>',
    })
  ),
];
