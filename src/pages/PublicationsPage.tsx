import React, { useMemo, useState } from 'react';
import { Search, ExternalLink, FileText, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import type { PublicationItem } from '../types/cms';

interface PublicationsPageProps {
  publications: PublicationItem[];
}

export const PublicationsPage: React.FC<PublicationsPageProps> = ({ publications }) => {
  const [query, setQuery] = useState('');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [expandedIds, setExpandedIds] = useState<Record<number, boolean>>({});
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const years = useMemo(() => {
    const s = Array.from(new Set(publications.map((p) => p.year))).sort((a, b) => b - a);
    return ['all', ...s.map(String)];
  }, [publications]);

  const types = useMemo(() => {
    return ['all', ...Array.from(new Set(publications.map((p) => p.pub_type)))];
  }, [publications]);

  const topics = useMemo(() => {
    return ['all', ...Array.from(new Set(publications.map((p) => p.topic)))];
  }, [publications]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return publications.filter((p) => {
      if (yearFilter !== 'all' && String(p.year) !== yearFilter) return false;
      if (typeFilter !== 'all' && p.pub_type !== typeFilter) return false;
      if (topicFilter !== 'all' && p.topic !== topicFilter) return false;
      if (q) {
        const hay = `${p.title} ${p.authors} ${p.venue} ${p.abstract} ${p.topic}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [publications, query, yearFilter, typeFilter, topicFilter]);

  const groupedByYear = useMemo(() => {
    const map = new Map<number, PublicationItem[]>();
    for (const pub of filtered) {
      const list = map.get(pub.year) || [];
      list.push(pub);
      map.set(pub.year, list);
    }
    return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
  }, [filtered]);

  const toggleAbstract = (id: number) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyBibtex = async (pub: PublicationItem) => {
    const text =
      pub.bibtex ||
      `@article{pub${pub.id},\n  author={${pub.authors}},\n  title={${pub.title}},\n  journal={${pub.venue}},\n  year={${pub.year}}\n}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(pub.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  return (
    <div className="bg-[#FAF9F6] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="pb-8 border-b border-[#E5E2DC] space-y-6">
          <div className="max-w-3xl">
            <p className="text-label uppercase text-purdue-gold-text">
              Peer-Reviewed Scholarship
            </p>
            <h1 className="font-display text-page text-black mt-2">
              Research Publications
            </h1>
            <p className="text-body text-neutral-700 mt-3">
              Journal articles, conference proceedings, and technical papers authored by our Purdue University research group.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-neutral-600 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title, author, or venue"
                aria-label="Search publications"
                className="w-full pl-9 pr-3 py-2.5 text-card bg-white border border-[#E5E2DC] rounded-md focus:outline-none focus:border-black placeholder:text-neutral-600"
              />
            </div>

            <div className="md:col-span-2">
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                aria-label="Filter by year"
                className="w-full px-3 py-2.5 text-card bg-white border border-[#E5E2DC] rounded-md focus:outline-none focus:border-black"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y === 'all' ? 'All Years' : y}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                aria-label="Filter by publication type"
                className="w-full px-3 py-2.5 text-card bg-white border border-[#E5E2DC] rounded-md focus:outline-none focus:border-black"
              >
                {types.map((t) => (
                  <option key={t} value={t}>
                    {t === 'all' ? 'All Publication Types' : t}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <select
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
                aria-label="Filter by research topic"
                className="w-full px-3 py-2.5 text-card bg-white border border-[#E5E2DC] rounded-md focus:outline-none focus:border-black"
              >
                {topics.map((t) => (
                  <option key={t} value={t}>
                    {t === 'all' ? 'All Topics' : t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {groupedByYear.length === 0 ? (
          <div className="bg-white border border-[#E5E2DC] rounded-md p-10 text-center space-y-2">
            <p className="text-card text-neutral-700 font-medium">
              No publications match your current search or filter criteria.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setYearFilter('all');
                setTypeFilter('all');
                setTopicFilter('all');
              }}
              className="text-button text-purdue-gold-text hover:text-black underline underline-offset-4"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {groupedByYear.map(([year, items]) => (
              <section key={year} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-2 lg:sticky lg:top-24">
                  <h2 className="font-display text-section font-bold text-black tabular-nums">
                    {year}
                  </h2>
                  <p className="text-caption text-neutral-600 mt-1 tabular-nums">
                    {items.length} {items.length === 1 ? 'publication' : 'publications'}
                  </p>
                </div>

                <div className="lg:col-span-10 bg-white border border-[#E5E2DC] rounded-md divide-y divide-[#E5E2DC]">
                  {items.map((pub) => {
                    const isExpanded = Boolean(expandedIds[pub.id]);
                    return (
                      <article key={pub.id} className="p-6 space-y-2.5">
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-meta text-neutral-600">
                          <span className="inline-flex items-center px-2 py-0.5 text-badge font-medium text-purdue-gold-text bg-[#FAF9F6] border border-[#E5E2DC] rounded">{pub.pub_type}</span>
                          <span>{pub.topic}</span>
                        </div>

                        <h3 className="text-item-title text-black">
                          {pub.title}
                        </h3>

                        <p className="text-card text-neutral-800">{pub.authors}</p>
                        <p className="text-meta text-neutral-600 italic">{pub.venue} <span className="not-italic tabular-nums">({pub.year})</span></p>

                        <div className="pt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-button">
                          {pub.abstract && (
                          <button
                            type="button"
                            onClick={() => toggleAbstract(pub.id)}
                            className="inline-flex items-center gap-1 text-neutral-700 hover:text-black"
                          >
                            {isExpanded ? (
                              <>
                                Hide Abstract <ChevronUp className="w-3.5 h-3.5" />
                              </>
                            ) : (
                              <>
                                Read Abstract <ChevronDown className="w-3.5 h-3.5" />
                              </>
                            )}
                          </button>
                          )}

                          {pub.doi_url && (
                            <a
                              href={pub.doi_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-purdue-gold-text hover:text-black"
                            >
                              DOI <ExternalLink className="w-3 h-3" />
                            </a>
                          )}

                          {pub.publisher_url && (
                            <a
                              href={pub.publisher_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-neutral-700 hover:text-black"
                            >
                              Publisher <ExternalLink className="w-3 h-3" />
                            </a>
                          )}

                          {pub.pdf_url && (
                            <a
                              href={pub.pdf_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-black hover:text-purdue-gold-text"
                            >
                              Download PDF <FileText className="w-3.5 h-3.5" />
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() => copyBibtex(pub)}
                            className="inline-flex items-center gap-1 text-neutral-600 hover:text-black"
                          >
                            {copiedId === pub.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-700" />
                                Copied BibTeX
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                BibTeX
                              </>
                            )}
                          </button>
                        </div>

                        {isExpanded && (
                          <div className="mt-3 p-4 bg-[#FAF9F6] border border-[#E5E2DC] rounded text-card text-neutral-700 measure">
                            <p className="text-label uppercase text-neutral-600 mb-1">
                              Abstract
                            </p>
                            {pub.abstract}
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
