import React from 'react';
import { ArrowRight, ExternalLink, FileText, BookOpen, FlaskConical, Briefcase } from 'lucide-react';
import type { PublicBootstrapData } from '../types/cms';
import { LabImage } from '../components/LabImage';
import { formatAcademicDate } from '../lib/htmlUtils';
import { STATUS_LABELS, researchTopicPath } from '../lib/researchFilters';
import { recentPublications } from '../lib/publications';
import { routeHref } from '../lib/routing';

interface HomePageProps {
  data: PublicBootstrapData;
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ data, onNavigate }) => {
  const {
    profile,
    featuredProjects,
    featuredNews,
    allPublications,
    opportunities,
  } = data;

  // Newest first, in the same order as the Publications page.
  const latestPublications = recentPublications(allPublications, profile.homeLimits?.publications ?? 4);

  const openOpportunities = opportunities.filter((o) => o.position_status === 'Open').slice(0, 3);
  const leadNews = featuredNews[0];
  const secondaryNews = featuredNews.slice(1, 4);

  return (
    <div className="bg-[#FAF9F6]">
      {/* Hero Section: Editorial Split Canvas */}
      <section className="bg-black text-white border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
              {profile.heroEyebrow?.trim() && (
                <p className="text-label uppercase text-[#CFB991]">
                  {profile.heroEyebrow}
                </p>
              )}
              <h1
                className="font-display text-hero text-white"
                style={{ textWrap: 'balance' }}
              >
                {profile.heroHeadline}
              </h1>
              <p className="text-lead text-neutral-200 max-w-2xl">
                {profile.heroSubheadline}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('/research')}
                  className="inline-flex items-center gap-2 px-6 py-3 text-button bg-[#CFB991] text-black rounded hover:bg-[#DFCCA8] transition-colors whitespace-nowrap shrink-0"
                >
                  Explore Research
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('/opportunities')}
                  className="inline-flex items-center gap-2 px-6 py-3 text-button border border-neutral-600 text-white rounded hover:border-[#CFB991] hover:text-[#CFB991] transition-colors whitespace-nowrap shrink-0"
                >
                  Research Opportunities
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="h-72 sm:h-96 lg:h-full min-h-[340px] rounded-md overflow-hidden border border-neutral-800 bg-neutral-900">
                <LabImage
                  src={profile.heroImageUrl}
                  alt={profile.heroImageAlt || `${profile.labName} at ${profile.institution}`}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 sm:gap-8 items-start">
          {profile.piPortraitUrl && (
            <div className="w-36 sm:w-44 rounded-md overflow-hidden border border-[#E5E2DC] bg-white">
              <LabImage
                src={profile.piPortraitUrl}
                alt={`Portrait of ${profile.piName}`}
                width={800}
                height={946}
                className="w-full h-auto block"
              />
            </div>
          )}
          <div className="space-y-5">
            <h2 className="text-section text-black">{profile.piName}</h2>
            <p>{profile.piTitle} · {profile.institution}</p>
            <p className="text-body text-neutral-700 measure">{profile.missionStatement}</p>
            <button className="underline" onClick={() => onNavigate('/about')}>Biography and recognition</button>
          </div>
        </div>
        <h2 className="text-section text-black pt-6">Research Focus Areas</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profile.researchAreas?.map((area) => {
            const path = researchTopicPath(area.id, profile.researchAreas);
            return (
              <a
                key={area.id}
                href={routeHref(path)}
                onClick={(event) => {
                  // Let modified clicks (new tab/window) use the real link.
                  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
                  event.preventDefault();
                  onNavigate(path);
                }}
                className="group bg-white p-6 border border-[#E5E2DC] rounded-md flex flex-col cursor-pointer transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md hover:border-[#CFB991] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CFB991] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <h3 className="text-card-title text-black group-hover:text-purdue-gold-text transition-colors">{area.title}</h3>
                <p className="mt-2 text-card text-neutral-700 flex-1">{area.description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-button text-black group-hover:text-purdue-gold-text transition-colors">
                  View research
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </a>
            );
          })}
        </div>
      </section>
      {/* Quick Links Institutional Bar */}
      <section className="bg-white border-b border-[#E5E2DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E5E2DC]">
            <button
              type="button"
              onClick={() => onNavigate('/research')}
              className="group py-5 px-4 text-left hover:bg-[#FAF9F6] transition-colors flex items-start gap-3"
            >
              <FlaskConical className="w-5 h-5 text-purdue-gold-text shrink-0 mt-0.5" />
              <div>
                <p className="text-card font-semibold text-black group-hover:text-purdue-gold-text transition-colors">
                  Research Projects
                </p>
                <p className="text-meta text-neutral-600 mt-0.5">
                  Research themes and documented activities
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/publications')}
              className="group py-5 px-4 text-left hover:bg-[#FAF9F6] transition-colors flex items-start gap-3"
            >
              <FileText className="w-5 h-5 text-purdue-gold-text shrink-0 mt-0.5" />
              <div>
                <p className="text-card font-semibold text-black group-hover:text-purdue-gold-text transition-colors">
                  Publications Archive
                </p>
                <p className="text-meta text-neutral-600 mt-0.5">
                  Selected articles and preprints
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/teaching')}
              className="group py-5 px-4 text-left hover:bg-[#FAF9F6] transition-colors flex items-start gap-3"
            >
              <BookOpen className="w-5 h-5 text-purdue-gold-text shrink-0 mt-0.5" />
              <div>
                <p className="text-card font-semibold text-black group-hover:text-purdue-gold-text transition-colors">
                  Purdue Courses
                </p>
                <p className="text-meta text-neutral-600 mt-0.5">
                  Educational activities and course resources
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/opportunities')}
              className="group py-5 px-4 text-left hover:bg-[#FAF9F6] transition-colors flex items-start gap-3"
            >
              <Briefcase className="w-5 h-5 text-purdue-gold-text shrink-0 mt-0.5" />
              <div>
                <p className="text-card font-semibold text-black group-hover:text-purdue-gold-text transition-colors">
                  Lab Opportunities
                </p>
                <p className="text-meta text-neutral-600 mt-0.5">
                  View current announcements
                </p>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Featured Research Areas & Ongoing Projects */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E5E2DC]">
          <div>
            <p className="text-label uppercase text-purdue-gold-text">
              Laboratory Mission &amp; Projects
            </p>
            <h2 className="text-section text-black mt-1">
              Featured Research Initiatives
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/research')}
            className="inline-flex items-center gap-1.5 text-button text-black hover:text-purdue-gold-text transition-colors whitespace-nowrap shrink-0"
          >
            View All Research
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <p className="mt-6 text-body text-neutral-700 measure">
          {profile.missionStatement}
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <article
              key={project.id}
              className="group bg-white border border-[#E5E2DC] rounded-md overflow-hidden flex flex-col"
            >
              <div className="aspect-[4/3] bg-neutral-100 overflow-hidden border-b border-[#E5E2DC]">
                <LabImage
                  src={project.image_url}
                  alt={project.image_caption || project.title}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-meta text-neutral-600">
                    <span className="font-semibold text-purdue-gold-text">
                      {STATUS_LABELS[project.project_status] ?? project.project_status}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{project.research_area}</span>
                  </div>
                  <h3 className="text-card-title text-black">
                    <button
                      type="button"
                      onClick={() => onNavigate(`/research/${project.slug}`)}
                      className="text-left hover:text-purdue-gold-text transition-colors"
                    >
                      {project.title}
                    </button>
                  </h3>
                  <p className="text-card text-neutral-700 line-clamp-3">
                    {project.overview}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onNavigate(`/research/${project.slug}`)}
                    className="inline-flex items-center gap-1.5 text-button text-black hover:text-purdue-gold-text transition-colors"
                  >
                    Read Technical Brief
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-4">
        <h2 className="text-section text-black">Teaching &amp; Educational Activities</h2>
        <p className="text-body text-neutral-700 measure">{profile.teachingOverview}</p>
        <button className="underline" onClick={() => onNavigate('/teaching')}>Explore teaching and course resources</button>
      </section>
      {/* Latest News & Current Laboratory Opportunities */}
      <section className="bg-white border-y border-[#E5E2DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Latest News (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-end justify-between pb-4 border-b border-[#E5E2DC]">
                <div>
                  <p className="text-label uppercase text-purdue-gold-text">
                    Dispatches &amp; Honors
                  </p>
                  <h2 className="text-section text-black mt-1">
                    News & Historical Achievements
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('/news')}
                  className="inline-flex items-center gap-1 text-button text-black hover:text-purdue-gold-text whitespace-nowrap shrink-0"
                >
                  All News
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {leadNews && (
                <article className="pb-6 border-b border-[#E5E2DC]">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
                    {leadNews.image_url && (
                      <div className="sm:col-span-5 aspect-[4/3] rounded overflow-hidden border border-[#E5E2DC]">
                        <LabImage
                          src={leadNews.image_url}
                          alt={leadNews.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className={leadNews.image_url ? 'sm:col-span-7 space-y-2' : 'sm:col-span-12 space-y-2'}>
                      <div className="flex items-center gap-2 text-meta text-neutral-600 tabular-nums">
                        <span className="font-semibold text-purdue-gold-text">{leadNews.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{formatAcademicDate(leadNews.published_date)}</span>
                      </div>
                      <h3 className="text-card-title text-black">
                        <button
                          type="button"
                          onClick={() => onNavigate(`/news/${leadNews.slug}`)}
                          className="text-left hover:text-purdue-gold-text transition-colors"
                        >
                          {leadNews.title}
                        </button>
                      </h3>
                      <p className="text-card text-neutral-700">{leadNews.summary}</p>
                    </div>
                  </div>
                </article>
              )}

              <div className="divide-y divide-[#E5E2DC]">
                {secondaryNews.map((item) => (
                  <article key={item.id} className="py-4 first:pt-0">
                    <div className="flex items-center gap-2 text-meta text-neutral-600 tabular-nums mb-1">
                      <span className="font-semibold text-purdue-gold-text">{item.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{formatAcademicDate(item.published_date)}</span>
                    </div>
                    <h3 className="text-item-title text-black">
                      <button
                        type="button"
                        onClick={() => onNavigate(`/news/${item.slug}`)}
                        className="text-left hover:text-purdue-gold-text transition-colors"
                      >
                        {item.title}
                      </button>
                    </h3>
                    <p className="text-card text-neutral-700 mt-1 line-clamp-2">{item.summary}</p>
                  </article>
                ))}
              </div>
            </div>

            {/* Research Opportunities (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-end justify-between pb-4 border-b border-[#E5E2DC]">
                <div>
                  <p className="text-label uppercase text-purdue-gold-text">
                    Join Our Group
                  </p>
                  <h2 className="text-section text-black mt-1">
                    Open Opportunities
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('/opportunities')}
                  className="inline-flex items-center gap-1 text-button text-black hover:text-purdue-gold-text whitespace-nowrap shrink-0"
                >
                  All Openings
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-4">
                {openOpportunities.length === 0 ? (
                  <div className="p-6 border border-[#E5E2DC] rounded-md bg-[#FAF9F6]">
                    <p className="text-card text-neutral-700">
                      No open positions are currently listed. Prospective students may still reach out via the Contact page.
                    </p>
                  </div>
                ) : (
                  openOpportunities.map((opp) => (
                    <div
                      key={opp.id}
                      className="p-5 border border-[#E5E2DC] rounded-md bg-[#FAF9F6] space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2 text-meta text-neutral-600">
                        <span className="font-semibold text-purdue-gold-text">{opp.appointment_type}</span>
                        <span className="tabular-nums">
                          {opp.deadline ? `Deadline: ${opp.deadline}` : 'Open'}
                        </span>
                      </div>
                      <h3 className="text-item-title text-black">
                        <button
                          type="button"
                          onClick={() => onNavigate('/opportunities')}
                          className="text-left hover:text-purdue-gold-text transition-colors"
                        >
                          {opp.title}
                        </button>
                      </h3>
                      <p className="text-card text-neutral-700 line-clamp-2">
                        {opp.application_instructions}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Published Research Papers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E5E2DC]">
          <div>
            <p className="text-label uppercase text-purdue-gold-text">
              Selected Scholarship
            </p>
            <h2 className="text-section text-black mt-1">
              Recent Research Publications
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/publications')}
            className="inline-flex items-center gap-1.5 text-button text-black hover:text-purdue-gold-text whitespace-nowrap shrink-0"
          >
            Full Publications List
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-[#E5E2DC]">
          {latestPublications.map((pub) => (
            <article key={pub.id} className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline">
              <div className="md:col-span-2 flex items-center gap-2 text-caption tabular-nums text-neutral-600">
                <span className="font-semibold text-black">{pub.year}</span>
                <span aria-hidden="true">/</span>
                <span>{pub.pub_type}</span>
              </div>
              <div className="md:col-span-8 space-y-1.5">
                <h3 className="text-item-title text-black">
                  {pub.title}
                </h3>
                <p className="text-card text-neutral-700">{pub.authors}</p>
                <p className="text-meta text-neutral-600 italic">{pub.venue}</p>
              </div>
              <div className="md:col-span-2 flex md:justify-end items-center gap-3 text-button">
                {pub.doi_url && (
                  <a
                    href={pub.doi_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-purdue-gold-text hover:text-black"
                  >
                    DOI
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {pub.pdf_url && (
                  <a
                    href={pub.pdf_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-black hover:text-purdue-gold-text"
                  >
                    PDF
                    <FileText className="w-3 h-3" />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
