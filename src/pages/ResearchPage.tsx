import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink, FileText, RotateCcw } from 'lucide-react';
import type { PublicationItem, ResearchProjectItem, SiteProfile } from '../types/cms';
import { LabImage } from '../components/LabImage';
import { sanitizeHtmlClient } from '../lib/htmlUtils';
import { replacePath } from '../lib/routing';
import {
  DEFAULT_FILTERS,
  STATUS_LABELS,
  filterProjects,
  projectTopicIds,
  researchTopicPath,
  statusOptions,
  topicFromParam,
  topicLabel,
  topicOptions,
  type FilterOption,
  type ResearchFilters,
} from '../lib/researchFilters';

interface ResearchPageProps {
  projects: ResearchProjectItem[];
  researchAreas?: SiteProfile['researchAreas'];
  publications: PublicationItem[];
  selectedSlug?: string;
  /**
   * The `?topic=` value from the URL. When present, the list opens with that
   * topic selected (or with all research if the topic is unknown).
   */
  topicParam?: string | null;
  onNavigate: (path: string) => void;
}

// Remember the last filters while the visitor moves between the list and a
// project's detail page (the page component remounts on each navigation).
let rememberedFilters: ResearchFilters = DEFAULT_FILTERS;

const STATUS_BADGE: Record<ResearchProjectItem['project_status'], string> = {
  ongoing: 'bg-[#CFB991]/30 text-[#5B4521] border-[#CFB991]',
  completed: 'bg-neutral-100 text-neutral-700 border-neutral-300',
  archived: 'bg-white text-neutral-600 border-neutral-300',
};

const StatusBadge: React.FC<{ status: ResearchProjectItem['project_status'] }> = ({ status }) => (
  <span className={`inline-flex items-center px-2 py-0.5 text-badge rounded border ${STATUS_BADGE[status]}`}>
    {STATUS_LABELS[status] ?? status}
  </span>
);

const FilterGroup: React.FC<{
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}> = ({ label, options, value, onChange }) => (
  <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
    <p className="text-label uppercase text-neutral-600 md:w-20 md:pt-2 shrink-0" id={`filter-${label}`}>
      {label}
    </p>
    <div role="group" aria-labelledby={`filter-${label}`} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-button rounded border transition-colors ${
              active
                ? 'bg-black text-[#CFB991] border-black'
                : 'bg-white text-neutral-700 border-[#E5E2DC] hover:border-black hover:text-black'
            }`}
          >
            {option.label}
            <span
              className={`tabular-nums text-badge px-1.5 py-0.5 rounded ${
                active ? 'bg-[#CFB991] text-black' : 'bg-neutral-100 text-neutral-600'
              }`}
            >
              {option.count}
            </span>
          </button>
        );
      })}
    </div>
  </div>
);

export const ResearchPage: React.FC<ResearchPageProps> = ({
  projects,
  researchAreas,
  publications,
  selectedSlug,
  topicParam,
  onNavigate,
}) => {
  const areas = researchAreas || [];
  const linkedFromUrl = !selectedSlug && topicParam != null;
  const [filters, setFiltersState] = useState<ResearchFilters>(() => {
    if (!linkedFromUrl) return rememberedFilters;
    // A shared or bookmarked topic link wins over remembered filters.
    const topic = topicFromParam(topicParam, projects, areas);
    rememberedFilters = topic ? { status: 'all', topic } : DEFAULT_FILTERS;
    return rememberedFilters;
  });
  const filterPanelRef = useRef<HTMLElement>(null);

  // Keep the address bar in step with the topic filter so it can be bookmarked or shared.
  useEffect(() => {
    if (!selectedSlug) replacePath(researchTopicPath(filters.topic, areas));
  }, [selectedSlug, filters.topic, areas]);

  // Arriving from a topic link: once the page has faded in, bring the filter bar into view.
  useEffect(() => {
    if (!linkedFromUrl) return;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(() => {
      filterPanelRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }, reduceMotion ? 0 : 180);
    return () => window.clearTimeout(timer);
    // Run once per arrival; the page remounts on each navigation.
  }, []);

  const setFilters = (next: ResearchFilters) => {
    rememberedFilters = next;
    setFiltersState(next);
  };

  const filtered = useMemo(() => filterProjects(projects, filters, areas), [projects, filters, areas]);
  const statusOpts = useMemo(() => statusOptions(projects, filters, areas), [projects, filters, areas]);
  const topicOpts = useMemo(() => topicOptions(projects, filters, areas), [projects, filters, areas]);
  const filtersActive = filters.status !== 'all' || filters.topic !== 'all';

  const activeProject = selectedSlug
    ? projects.find((p) => p.slug === selectedSlug)
    : undefined;

  if (activeProject) {
    const relatedPubs = publications.filter((pub) =>
      activeProject.related_publication_ids.includes(pub.id)
    );
    const topicIds = projectTopicIds(activeProject, areas);

    return (
      <div className="bg-[#FAF9F6] py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <button
            type="button"
            onClick={() => onNavigate('/research')}
            className="inline-flex items-center gap-2 text-button text-neutral-700 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Research Projects
          </button>

          <article className="bg-white border border-[#E5E2DC] rounded-md overflow-hidden">
            <div className="p-8 sm:p-10 space-y-6 border-b border-[#E5E2DC]">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-meta text-neutral-600">
                <StatusBadge status={activeProject.project_status} />
                <span>{activeProject.research_area}</span>
              </div>
              <h1 className="font-display text-page text-black">
                {activeProject.title}
              </h1>
              <p className="text-lead text-neutral-700 measure">
                {activeProject.overview}
              </p>
              {topicIds.length > 0 && (
                <ul className="flex flex-wrap gap-2" aria-label="Research topics">
                  {topicIds.map((id) => (
                    <li key={id} className="px-2.5 py-1 text-badge font-medium text-neutral-700 bg-[#FAF9F6] border border-[#E5E2DC] rounded">
                      {topicLabel(id, areas)}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {activeProject.image_url && (
              <figure className="bg-neutral-50 border-b border-[#E5E2DC]">
                <div className="max-h-[460px] overflow-hidden flex justify-center bg-white">
                  <LabImage
                    src={activeProject.image_url}
                    alt={activeProject.image_caption || activeProject.title}
                    className="w-full max-h-[460px] object-contain"
                  />
                </div>
                {activeProject.image_caption && (
                  <figcaption className="px-8 py-3 text-caption italic text-neutral-600 border-t border-[#E5E2DC]">
                    {activeProject.image_caption}
                  </figcaption>
                )}
              </figure>
            )}

            <div className="p-8 sm:p-10 space-y-10">
              {activeProject.progress_notes && (
                <div className="p-5 bg-[#FAF9F6] border border-[#CFB991] rounded-md space-y-1.5">
                  <p className="text-label uppercase text-purdue-gold-text">
                    {activeProject.project_status === 'ongoing' ? 'Latest Research Progress' : 'Project Milestones'}
                  </p>
                  <p className="text-body text-neutral-800 measure">
                    {activeProject.progress_notes}
                  </p>
                </div>
              )}

              {(activeProject.objectives_html || activeProject.methodology_html) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {activeProject.objectives_html && (
                    <div className={activeProject.methodology_html ? '' : 'md:col-span-2'}>
                      <h2 className="text-subsection text-black mb-3">
                        Research Objectives
                      </h2>
                      <div
                        className="prose-lab prose-editorial"
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtmlClient(activeProject.objectives_html),
                        }}
                      />
                    </div>
                  )}

                  {activeProject.methodology_html && (
                    <div className={activeProject.objectives_html ? '' : 'md:col-span-2'}>
                      <h2 className="text-subsection text-black mb-3">
                        Methodology &amp; Technical Approach
                      </h2>
                      <div
                        className="prose-lab prose-editorial"
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtmlClient(activeProject.methodology_html),
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {(activeProject.collaborators || activeProject.funding_info) && (
                <div className="pt-8 border-t border-[#E5E2DC] grid grid-cols-1 sm:grid-cols-2 gap-6 text-card">
                  {activeProject.collaborators && (
                    <div>
                      <h3 className="text-label uppercase text-neutral-600 mb-1.5">
                        Collaborators
                      </h3>
                      <p className="text-neutral-800">{activeProject.collaborators}</p>
                    </div>
                  )}
                  {activeProject.funding_info && (
                    <div>
                      <h3 className="text-label uppercase text-neutral-600 mb-1.5">
                        Funding &amp; Sponsors
                      </h3>
                      <p className="text-neutral-800">{activeProject.funding_info}</p>
                    </div>
                  )}
                </div>
              )}

              {relatedPubs.length > 0 && (
                <div className="pt-8 border-t border-[#E5E2DC] space-y-4">
                  <h2 className="text-subsection text-black">
                    Related Publications
                  </h2>
                  <div className="divide-y divide-[#E5E2DC] border border-[#E5E2DC] rounded-md bg-[#FAF9F6]">
                    {relatedPubs.map((pub) => {
                      const link = pub.doi_url || pub.publisher_url;
                      return (
                        <div key={pub.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <p className="text-item-title text-black">{pub.title}</p>
                            <p className="text-meta text-neutral-600">
                              {pub.authors} · <span className="italic">{pub.venue}</span> ({pub.year})
                            </p>
                          </div>
                          <div className="flex items-center gap-3 text-button shrink-0">
                            {link && (
                              <a
                                href={link}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-purdue-gold-text hover:text-black"
                              >
                                {pub.doi_url ? 'DOI' : 'Publisher'} <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                            {pub.pdf_url && (
                              <a
                                href={pub.pdf_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-black hover:text-purdue-gold-text"
                              >
                                PDF <FileText className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </article>
        </div>
      </div>
    );
  }

  const activeTopicLabel = filters.topic !== 'all' ? topicLabel(filters.topic, areas) : '';
  const summaryParts = [
    filters.status !== 'all' ? STATUS_LABELS[filters.status] : '',
    activeTopicLabel,
  ].filter(Boolean);

  const showTopic = (topic: string) => {
    setFilters({ status: 'all', topic });
    filterPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-[#FAF9F6] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="pb-8 border-b border-[#E5E2DC] max-w-3xl">
          <p className="text-label uppercase text-purdue-gold-text">
            Laboratory Portfolio
          </p>
          <h1 className="font-display text-page text-black mt-2">
            Research &amp; Digital Agriculture
          </h1>
          <p className="text-body text-neutral-700 mt-3 measure">
            Ongoing and completed research projects of the Digital Agriculture Discovery Lab. Filter by project status and research topic; projects can belong to several topics.
          </p>
        </div>

        <section
          ref={filterPanelRef}
          aria-label="Filter research projects"
          className="bg-white border border-[#E5E2DC] rounded-md p-4 sm:p-6 space-y-4 scroll-mt-24"
        >
          <FilterGroup
            label="Status"
            options={statusOpts}
            value={filters.status}
            onChange={(status) => setFilters({ ...filters, status: status as ResearchFilters['status'] })}
          />
          <FilterGroup
            label="Topic"
            options={topicOpts}
            value={filters.topic}
            onChange={(topic) => setFilters({ ...filters, topic })}
          />
          <div className="pt-4 border-t border-[#E5E2DC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-meta">
            <p className="text-neutral-600" aria-live="polite">
              Showing <strong className="text-black tabular-nums">{filtered.length}</strong> of{' '}
              <span className="tabular-nums">{projects.length}</span> projects
              {summaryParts.length > 0 && <> · {summaryParts.join(' · ')}</>}
            </p>
            <button
              type="button"
              onClick={() => setFilters(DEFAULT_FILTERS)}
              disabled={!filtersActive}
              className="inline-flex items-center gap-1.5 self-start sm:self-auto px-3.5 py-2 text-button rounded border border-[#E5E2DC] text-black hover:border-black transition-colors disabled:opacity-40 disabled:hover:border-[#E5E2DC] disabled:cursor-not-allowed"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset filters
            </button>
          </div>
        </section>

        {filtered.length === 0 ? (
          <div className="bg-white border border-[#E5E2DC] rounded-md p-10 text-center space-y-3">
            <p className="text-card-title text-black">No projects match these filters</p>
            <p className="text-card text-neutral-700">
              {filters.status !== 'all'
                ? `No ${STATUS_LABELS[filters.status].toLowerCase()} projects are listed`
                : 'No projects are listed'}
              {activeTopicLabel ? ` under ${activeTopicLabel}` : ''}. Try another topic or status, or show all research
              projects.
            </p>
            <button
              type="button"
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-button bg-black text-[#CFB991] rounded hover:bg-neutral-800"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Show all projects
            </button>
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
                      alt={project.image_caption || project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-7 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-meta text-neutral-600">
                      <StatusBadge status={project.project_status} />
                      <span>{project.research_area}</span>
                    </div>
                    <h2 className="text-card-title text-black">
                      <button
                        type="button"
                        onClick={() => onNavigate(`/research/${project.slug}`)}
                        className="text-left hover:text-purdue-gold-text transition-colors"
                      >
                        {project.title}
                      </button>
                    </h2>
                    <p className="text-card text-neutral-700">{project.overview}</p>
                    <ul className="flex flex-wrap gap-1.5" aria-label="Research topics">
                      {projectTopicIds(project, areas).map((id) => (
                        <li
                          key={id}
                          className={`px-2 py-0.5 text-badge font-medium rounded border ${
                            id === filters.topic
                              ? 'bg-black text-[#CFB991] border-black'
                              : 'bg-[#FAF9F6] text-neutral-600 border-[#E5E2DC]'
                          }`}
                        >
                          {topicLabel(id, areas)}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-4 text-meta">
                    <span className="text-neutral-600 line-clamp-2">
                      {project.funding_info}
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigate(`/research/${project.slug}`)}
                      className="inline-flex items-center gap-1.5 text-button text-black hover:text-purdue-gold-text whitespace-nowrap shrink-0"
                    >
                      Project Details <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {areas.length > 0 && (
          <section className="pt-6 space-y-6" aria-labelledby="focus-areas-heading">
            <div className="pb-4 border-b border-[#E5E2DC]">
              <p className="text-label uppercase text-purdue-gold-text">Research Topics</p>
              <h2 id="focus-areas-heading" className="text-section text-black mt-1">
                Research Focus Areas
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {areas.map((area) => {
                const projectCount = filterProjects(projects, { status: 'all', topic: area.id }, areas).length;
                const pubCount = publications.filter((pub) => pub.topic === area.title).length;
                return (
                  <article key={area.id} className="bg-white border border-[#E5E2DC] rounded-md p-6 flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      {area.imageUrl && (
                        <LabImage src={area.imageUrl} alt={area.title} className="w-full h-40 object-cover rounded" />
                      )}
                      <h3 className="text-card-title text-black">{area.title}</h3>
                      <p className="text-card text-neutral-700">{area.description}</p>
                    </div>
                    <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2 text-meta">
                      <span className="text-neutral-600 tabular-nums">
                        {projectCount} {projectCount === 1 ? 'project' : 'projects'} · {pubCount}{' '}
                        {pubCount === 1 ? 'publication' : 'publications'}
                      </span>
                      {projectCount > 0 && (
                        <button
                          type="button"
                          onClick={() => showTopic(area.id)}
                          className="inline-flex items-center gap-1 text-button text-black hover:text-purdue-gold-text"
                        >
                          View projects <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
