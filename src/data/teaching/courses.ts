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
 * Published courses come from the former DAD Lab website's Teaching and course
 * pages (index.php/teaching/, /asm-54000/, /asm-59100/, /abe-49500/).
 * ASM 54000 is listed as currently offered because the former site's
 * December 2023 news still describes it as Dr. Saraswat's geospatial course;
 * the other two are kept as archived offerings. Candidate courses from the
 * personalization brief remain unpublished drafts until confirmed.
 */
export const COURSES: CourseSeed[] = [
  course({
    course_number: 'ASM 54000',
    title: 'Geographic Information System (GIS) Applications',
    semester: 'Fall',
    status: 'active',
    description_html:
      '<p>3 credits (2 lectures and 1 lab per week); offered in the Fall semester. The course includes research components that provide Course-based Research Exposure to Undergraduate Students (CURE).</p>',
    materials: [{ label: 'Course website', url: 'https://engineering.purdue.edu/~asm540/' }],
  }),
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
