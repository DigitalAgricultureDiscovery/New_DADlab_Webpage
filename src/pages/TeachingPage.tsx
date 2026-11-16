import React, { useState } from 'react';
import { ExternalLink, FileText, BookOpen } from 'lucide-react';
import type { CourseItem, SiteProfile } from '../types/cms';
import { sanitizeHtmlClient } from '../lib/htmlUtils';

interface TeachingPageProps {
  courses: CourseItem[];
  profile: SiteProfile;
}

export const TeachingPage: React.FC<TeachingPageProps> = ({ courses, profile }) => {
  const [view, setView] = useState<'active' | 'archived'>('active');

  const activeCourses = courses.filter((c) => c.status === 'active');
  const archivedCourses = courses.filter((c) => c.status === 'archived');
  const displayed = view === 'active' ? activeCourses : archivedCourses;

  return (
    <div className="bg-[#FAF9F6] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="pb-8 border-b border-[#E5E2DC] flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wider text-[#8E6F3E] uppercase">
              Purdue University Instruction
            </p>
            <h1 className="font-serif text-4xl font-semibold text-black mt-2">
              Courses &amp; Teaching
            </h1>
            <p className="text-base text-neutral-600 mt-3 leading-relaxed">
              {profile.teachingOverview}
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-white border border-[#E5E2DC] rounded-md self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setView('active')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 ${
                view === 'active'
                  ? 'bg-black text-[#CFB991]'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              Active Courses ({activeCourses.length})
            </button>
            <button
              type="button"
              onClick={() => setView('archived')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 ${
                view === 'archived'
                  ? 'bg-black text-[#CFB991]'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              Archived Courses ({archivedCourses.length})
            </button>
          </div>
        </div>

        <p className="text-sm text-neutral-600">Courses are listed as described on the DAD Lab&rsquo;s previous website. Please confirm the current schedule in the Purdue course catalog.</p>
        {displayed.length === 0 ? (
          <div className="bg-white border border-[#E5E2DC] rounded-md p-10 text-center">
            <p className="text-sm text-neutral-600">
              No {view} courses are currently listed.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {displayed.map((course) => (
              <article
                key={course.id}
                className="bg-white border border-[#E5E2DC] rounded-md p-7 sm:p-9 space-y-6"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-5 border-b border-[#E5E2DC]">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                      <span className="font-mono font-semibold text-[#8E6F3E] tabular-nums">
                        {course.course_number}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">
                        {course.semester} {course.academic_year}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">
                        {course.status === 'active' ? 'Currently Offered' : 'Archived Offering'}
                      </span>
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-black">
                      {course.title}
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    {course.syllabus_url && (
                      <a
                        href={course.syllabus_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-black text-[#CFB991] rounded hover:bg-neutral-800 transition-colors whitespace-nowrap shrink-0"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Course Syllabus
                      </a>
                    )}
                    {course.university_catalog_url && (
                      <a
                        href={course.university_catalog_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border border-[#E5E2DC] text-black rounded hover:border-black transition-colors whitespace-nowrap shrink-0"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        Purdue Catalog
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                <div
                  className="prose-lab max-w-3xl"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtmlClient(course.description_html),
                  }}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  {course.topics.length > 0 && (
                    <div className="p-5 bg-[#FAF9F6] border border-[#E5E2DC] rounded-md space-y-2.5">
                      <h3 className="font-sans text-xs font-semibold tracking-wider text-[#8E6F3E] uppercase">
                        Topics Covered
                      </h3>
                      <ul className="space-y-1.5 text-sm text-neutral-700 list-disc pl-5">
                        {course.topics.map((topic, i) => (
                          <li key={i}>{topic}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {course.objectives.length > 0 && (
                    <div className="p-5 bg-[#FAF9F6] border border-[#E5E2DC] rounded-md space-y-2.5">
                      <h3 className="font-sans text-xs font-semibold tracking-wider text-[#8E6F3E] uppercase">
                        Course Learning Objectives
                      </h3>
                      <ul className="space-y-1.5 text-sm text-neutral-700 list-disc pl-5">
                        {course.objectives.map((obj, i) => (
                          <li key={i}>{obj}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {course.materials.length > 0 && (
                  <div className="pt-4 border-t border-[#E5E2DC] flex flex-wrap items-center gap-4 text-xs">
                    <span className="font-semibold text-neutral-500 uppercase tracking-wider">
                      Supporting Resources:
                    </span>
                    {course.materials.map((mat, i) => (
                      <a
                        key={i}
                        href={mat.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-[#8E6F3E] hover:text-black underline underline-offset-4"
                      >
                        {mat.label}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
