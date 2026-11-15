import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink, FileText } from 'lucide-react';
import type { PublicationItem, ResearchProjectItem } from '../types/cms';
import { LabImage } from '../components/LabImage';
import { sanitizeHtmlClient } from '../lib/htmlUtils';

interface ResearchPageProps {
  projects: ResearchProjectItem[];
  publications: PublicationItem[];
  selectedSlug?: string;
  onNavigate: (path: string) => void;
}

export const ResearchPage: React.FC<ResearchPageProps> = ({
  projects,
  publications,
  selectedSlug,
  onNavigate,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'ongoing' | 'completed'>('all');
  const [areaFilter, setAreaFilter] = useState<string>('all');

  const areas = useMemo(() => {
    const set = new Set(projects.map((p) => p.research_area));
    return ['all', ...Array.from(set)];
  }, [projects]);

  const activeProject = selectedSlug
    ? projects.find((p) => p.slug === selectedSlug)
    : undefined;

  if (activeProject) {
    const relatedPubs = publications.filter((pub) =>
      activeProject.related_publication_ids.includes(pub.id)
    );

    return (
      <div className="bg-[#FAF9F6] py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <button
            type="button"
            onClick={() => onNavigate('/research')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-700 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Research Projects
          </button>

          <article className="bg-white border border-[#E5E2DC] rounded-md overflow-hidden">
            <div className="p-8 sm:p-10 space-y-6 border-b border-[#E5E2DC]">
              <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                <span className="font-semibold text-[#8E6F3E]">
                  {activeProject.project_status === 'ongoing' ? 'Ongoing Research' : 'Completed Project'}
                </span>
                <span aria-hidden="true">·</span>
                <span>{activeProject.research_area}</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-black leading-tight">
                {activeProject.title}
              </h1>
              <p className="text-base sm:text-lg text-neutral-700 leading-relaxed">
                {activeProject.overview}
              </p>
            </div>

            {activeProject.image_url && (
              <figure className="bg-neutral-50 border-b border-[#E5E2DC]">
                <div className="max-h-[460px] overflow-hidden">
                  <LabImage
                    src={activeProject.image_url}
                    alt={activeProject.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {activeProject.image_caption && (
                  <figcaption className="px-8 py-3 text-xs font-serif italic text-neutral-600 border-t border-[#E5E2DC]">
                    {activeProject.image_caption}
                  </figcaption>
                )}
              </figure>
            )}

            <div className="p-8 sm:p-10 space-y-10">
              {activeProject.progress_notes && (
                <div className="p-5 bg-[#FAF9F6] border border-[#CFB991] rounded-md space-y-1.5">
                  <p className="text-xs font-semibold tracking-wider text-[#8E6F3E] uppercase">
                    Latest Research Progress
                  </p>
                  <p className="text-sm text-neutral-800 leading-relaxed">
                    {activeProject.progress_notes}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-black mb-3">
                    Research Objectives
                  </h2>
                  <div
                    className="prose-lab"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtmlClient(activeProject.objectives_html),
                    }}
                  />
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-semibold text-black mb-3">
                    Methodology &amp; Technical Approach
                  </h2>
                  <div
                    className="prose-lab"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtmlClient(activeProject.methodology_html),
                    }}
                  />
                </div>
              </div>

              {(activeProject.collaborators || activeProject.funding_info) && (
                <div className="pt-8 border-t border-[#E5E2DC] grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                  {activeProject.collaborators && (
                    <div>
                      <h3 className="font-sans text-xs font-semibold tracking-wider text-neutral-500 uppercase mb-1">
                        Collaborators
                      </h3>
                      <p className="text-neutral-800">{activeProject.collaborators}</p>
                    </div>
                  )}
                  {activeProject.funding_info && (
                    <div>
                      <h3 className="font-sans text-xs font-semibold tracking-wider text-neutral-500 uppercase mb-1">
                        Funding &amp; Sponsors
                      </h3>
                      <p className="text-neutral-800">{activeProject.funding_info}</p>
                    </div>
                  )}
                </div>
              )}

              {relatedPubs.length > 0 && (
                <div className="pt-8 border-t border-[#E5E2DC] space-y-4">
                  <h2 className="font-serif text-2xl font-semibold text-black">
                    Related Publications
                  </h2>
                  <div className="divide-y divide-[#E5E2DC] border border-[#E5E2DC] rounded-md bg-[#FAF9F6]">
                    {relatedPubs.map((pub) => (
                      <div key={pub.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <p className="font-serif text-base font-semibold text-black">{pub.title}</p>
                          <p className="text-xs text-neutral-600">
                            {pub.authors} · <span className="italic">{pub.venue}</span> ({pub.year})
                          </p>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-semibold shrink-0">
                          {pub.doi_url && (
                            <a
                              href={pub.doi_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[#8E6F3E] hover:text-black"
                            >
                              DOI <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {pub.pdf_url && (
                            <a
                              href={pub.pdf_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-black hover:text-[#8E6F3E]"
                            >
                              PDF <FileText className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>
        </div>
      </div>
    );
  }

  const filtered = projects.filter((p) => {
    if (statusFilter !== 'all' && p.project_status !== statusFilter) return false;
    if (areaFilter !== 'all' && p.research_area !== areaFilter) return false;
    return true;
  });

  return (
    <div className="bg-[#FAF9F6] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="pb-8 border-b border-[#E5E2DC] flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wider text-[#8E6F3E] uppercase">
              Laboratory Portfolio
            </p>
            <h1 className="font-serif text-4xl font-semibold text-black mt-2">
              Research &amp; Experimental Testbeds
            </h1>
            <p className="text-base text-neutral-600 mt-3 leading-relaxed">
              Ongoing investigations and completed archival programs conducted by our research group at Purdue University.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 p-1 bg-white border border-[#E5E2DC] rounded-md">
              {(['all', 'ongoing', 'completed'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors capitalize whitespace-nowrap shrink-0 ${
                    statusFilter === status
                      ? 'bg-black text-[#CFB991]'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  {status === 'all' ? 'All Projects' : status}
                </button>
              ))}
            </div>

            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              aria-label="Filter by research area"
              className="px-3 py-2 text-xs font-medium bg-white border border-[#E5E2DC] rounded-md text-neutral-800 focus:outline-none focus:border-black"
            >
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area === 'all' ? 'All Research Areas' : area}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white border border-[#E5E2DC] rounded-md p-10 text-center">
            <p className="text-sm text-neutral-600">No research projects match the selected filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filtered.map((project) => (
              <article
                key={project.id}
                className="bg-white border border-[#E5E2DC] rounded-md overflow-hidden flex flex-col"
              >
                {project.image_url && (
                  <div className="aspect-[16/9] border-b border-[#E5E2DC] bg-neutral-100 overflow-hidden">
                    <LabImage
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-7 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <span className="font-semibold text-[#8E6F3E]">
                        {project.project_status === 'ongoing' ? 'Ongoing' : 'Completed'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{project.research_area}</span>
                    </div>
                    <h2 className="font-serif text-2xl font-semibold text-black leading-snug">
                      <button
                        type="button"
                        onClick={() => onNavigate(`/research/${project.slug}`)}
                        className="text-left hover:text-[#8E6F3E] transition-colors"
                      >
                        {project.title}
                      </button>
                    </h2>
                    <p className="text-sm text-neutral-600 leading-relaxed">{project.overview}</p>
                    {project.progress_notes && (
                      <p className="text-xs text-neutral-700 bg-[#FAF9F6] border border-[#E5E2DC] rounded p-3">
                        <strong className="font-semibold text-black">Latest Progress: </strong>
                        {project.progress_notes}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <span className="text-neutral-500 truncate max-w-[60%]">
                      {project.funding_info}
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigate(`/research/${project.slug}`)}
                      className="inline-flex items-center gap-1.5 font-semibold text-black hover:text-[#8E6F3E] whitespace-nowrap shrink-0"
                    >
                      Project Details <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
