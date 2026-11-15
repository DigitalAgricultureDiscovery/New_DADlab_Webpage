import React from 'react';
import { ArrowRight, ExternalLink, FileText, BookOpen, FlaskConical, Briefcase } from 'lucide-react';
import type { PublicBootstrapData } from '../types/cms';
import { LabImage } from '../components/LabImage';
import { formatAcademicDate } from '../lib/htmlUtils';

interface HomePageProps {
  data: PublicBootstrapData;
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ data, onNavigate }) => {
  const {
    profile,
    featuredProjects,
    featuredNews,
    featuredPublications,
    opportunities,
  } = data;

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
              <p className="text-xs font-semibold tracking-[0.14em] text-[#CFB991] uppercase">
                {profile.heroEyebrow}
              </p>
              <h1
                className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-[1.12]"
                style={{ textWrap: 'balance' }}
              >
                {profile.heroHeadline}
              </h1>
              <p className="text-base sm:text-lg text-neutral-300 leading-relaxed max-w-2xl">
                {profile.heroSubheadline}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('/research')}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-[#CFB991] text-black rounded hover:bg-[#DFCCA8] transition-colors whitespace-nowrap shrink-0"
                >
                  Explore Research
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('/opportunities')}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold border border-neutral-600 text-white rounded hover:border-[#CFB991] hover:text-[#CFB991] transition-colors whitespace-nowrap shrink-0"
                >
                  Research Opportunities
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="h-72 sm:h-96 lg:h-full min-h-[340px] rounded-md overflow-hidden border border-neutral-800 bg-neutral-900">
                <LabImage
                  src={profile.heroImageUrl}
                  alt={`${profile.labName} at ${profile.institution}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-5">
        <h2 className="font-serif text-3xl">{profile.piName}</h2>
        <p>{profile.piTitle} · {profile.institution}</p>
        <p className="max-w-4xl text-neutral-700 leading-relaxed">{profile.missionStatement}</p>
        <button className="underline" onClick={() => onNavigate('/about')}>Biography and recognition</button>
        <h2 className="font-serif text-2xl pt-4">Research Focus Areas</h2>
        <div className="grid md:grid-cols-2 gap-6">{profile.researchAreas?.map(area => <article key={area.id} className="bg-white p-6 border border-[#E5E2DC] rounded-md">
          <h3 className="font-serif text-xl">{area.title}</h3><p className="mt-2 text-neutral-700">{area.description}</p>
        </article>)}</div>
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
              <FlaskConical className="w-5 h-5 text-[#8E6F3E] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-black group-hover:text-[#8E6F3E] transition-colors">
                  Research Projects
                </p>
                <p className="text-xs text-neutral-600 mt-0.5 tabular-nums">
                  Research themes and documented activities
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/publications')}
              className="group py-5 px-4 text-left hover:bg-[#FAF9F6] transition-colors flex items-start gap-3"
            >
              <FileText className="w-5 h-5 text-[#8E6F3E] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-black group-hover:text-[#8E6F3E] transition-colors">
                  Publications Archive
                </p>
                <p className="text-xs text-neutral-600 mt-0.5 tabular-nums">
                  Selected articles and preprints
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/teaching')}
              className="group py-5 px-4 text-left hover:bg-[#FAF9F6] transition-colors flex items-start gap-3"
            >
              <BookOpen className="w-5 h-5 text-[#8E6F3E] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-black group-hover:text-[#8E6F3E] transition-colors">
                  Purdue Courses
                </p>
                <p className="text-xs text-neutral-600 mt-0.5 tabular-nums">
                  Educational activities and course resources
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/opportunities')}
              className="group py-5 px-4 text-left hover:bg-[#FAF9F6] transition-colors flex items-start gap-3"
            >
              <Briefcase className="w-5 h-5 text-[#8E6F3E] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-black group-hover:text-[#8E6F3E] transition-colors">
                  Lab Opportunities
                </p>
                <p className="text-xs text-neutral-600 mt-0.5 tabular-nums">
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
            <p className="text-xs font-semibold tracking-wider text-[#8E6F3E] uppercase">
              Laboratory Mission &amp; Projects
            </p>
            <h2 className="font-serif text-3xl font-semibold text-black mt-1">
              Featured Research Initiatives
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/research')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-black hover:text-[#8E6F3E] transition-colors whitespace-nowrap shrink-0"
          >
            View All Research
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <p className="mt-6 text-base text-neutral-700 leading-relaxed max-w-3xl">
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
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <span className="font-semibold text-[#8E6F3E]">
                      {project.project_status === 'ongoing' ? 'Ongoing' : project.project_status === 'completed' ? 'Completed' : 'Historical / theme'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{project.research_area}</span>
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-black leading-snug">
                    <button
                      type="button"
                      onClick={() => onNavigate(`/research/${project.slug}`)}
                      className="text-left hover:text-[#8E6F3E] transition-colors"
                    >
                      {project.title}
                    </button>
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed line-clamp-3">
                    {project.overview}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onNavigate(`/research/${project.slug}`)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-black hover:text-[#8E6F3E] transition-colors"
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
        <h2 className="font-serif text-3xl">Teaching &amp; Educational Activities</h2>
        <p className="text-neutral-700 max-w-4xl">{profile.teachingOverview}</p>
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
                  <p className="text-xs font-semibold tracking-wider text-[#8E6F3E] uppercase">
                    Dispatches &amp; Honors
                  </p>
                  <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-black mt-1">
                    News & Historical Achievements
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('/news')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-black hover:text-[#8E6F3E] whitespace-nowrap shrink-0"
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
                      <div className="flex items-center gap-2 text-xs text-neutral-500 tabular-nums">
                        <span className="font-semibold text-[#8E6F3E]">{leadNews.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{formatAcademicDate(leadNews.published_date)}</span>
                      </div>
                      <h3 className="font-serif text-xl font-semibold text-black leading-snug">
                        <button
                          type="button"
                          onClick={() => onNavigate(`/news/${leadNews.slug}`)}
                          className="text-left hover:text-[#8E6F3E] transition-colors"
                        >
                          {leadNews.title}
                        </button>
                      </h3>
                      <p className="text-sm text-neutral-600 leading-relaxed">{leadNews.summary}</p>
                    </div>
                  </div>
                </article>
              )}

              <div className="divide-y divide-[#E5E2DC]">
                {secondaryNews.map((item) => (
                  <article key={item.id} className="py-4 first:pt-0">
                    <div className="flex items-center gap-2 text-xs text-neutral-500 tabular-nums mb-1">
                      <span className="font-semibold text-[#8E6F3E]">{item.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{formatAcademicDate(item.published_date)}</span>
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-black leading-snug">
                      <button
                        type="button"
                        onClick={() => onNavigate(`/news/${item.slug}`)}
                        className="text-left hover:text-[#8E6F3E] transition-colors"
                      >
                        {item.title}
                      </button>
                    </h3>
                    <p className="text-sm text-neutral-600 mt-1 line-clamp-2">{item.summary}</p>
                  </article>
                ))}
              </div>
            </div>

            {/* Research Opportunities (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-end justify-between pb-4 border-b border-[#E5E2DC]">
                <div>
                  <p className="text-xs font-semibold tracking-wider text-[#8E6F3E] uppercase">
                    Join Our Group
                  </p>
                  <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-black mt-1">
                    Open Opportunities
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('/opportunities')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-black hover:text-[#8E6F3E] whitespace-nowrap shrink-0"
                >
                  All Openings
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-4">
                {openOpportunities.length === 0 ? (
                  <div className="p-6 border border-[#E5E2DC] rounded-md bg-[#FAF9F6]">
                    <p className="text-sm text-neutral-600">
                      No open positions are currently listed. Prospective students may still reach out via the Contact page.
                    </p>
                  </div>
                ) : (
                  openOpportunities.map((opp) => (
                    <div
                      key={opp.id}
                      className="p-5 border border-[#E5E2DC] rounded-md bg-[#FAF9F6] space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2 text-xs text-neutral-500">
                        <span className="font-semibold text-[#8E6F3E]">{opp.appointment_type}</span>
                        <span className="font-mono tabular-nums">
                          {opp.deadline ? `Deadline: ${opp.deadline}` : 'Open'}
                        </span>
                      </div>
                      <h3 className="font-serif text-lg font-semibold text-black leading-snug">
                        <button
                          type="button"
                          onClick={() => onNavigate('/opportunities')}
                          className="text-left hover:text-[#8E6F3E] transition-colors"
                        >
                          {opp.title}
                        </button>
                      </h3>
                      <p className="text-xs text-neutral-600 line-clamp-2">
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
            <p className="text-xs font-semibold tracking-wider text-[#8E6F3E] uppercase">
              Selected Scholarship
            </p>
            <h2 className="font-serif text-3xl font-semibold text-black mt-1">
              Recent Research Publications
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/publications')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-black hover:text-[#8E6F3E] whitespace-nowrap shrink-0"
          >
            Full Publications List
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-[#E5E2DC]">
          {featuredPublications.map((pub) => (
            <article key={pub.id} className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline">
              <div className="md:col-span-2 flex items-center gap-2 text-xs font-mono tabular-nums text-neutral-600">
                <span className="font-semibold text-black">{pub.year}</span>
                <span aria-hidden="true">/</span>
                <span>{pub.pub_type}</span>
              </div>
              <div className="md:col-span-8 space-y-1.5">
                <h3 className="font-serif text-lg font-semibold text-black leading-snug">
                  {pub.title}
                </h3>
                <p className="text-sm text-neutral-700">{pub.authors}</p>
                <p className="text-xs text-neutral-500 italic">{pub.venue}</p>
              </div>
              <div className="md:col-span-2 flex md:justify-end items-center gap-3 text-xs font-semibold">
                {pub.doi_url && (
                  <a
                    href={pub.doi_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[#8E6F3E] hover:text-black"
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
                    className="inline-flex items-center gap-1 text-black hover:text-[#8E6F3E]"
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
