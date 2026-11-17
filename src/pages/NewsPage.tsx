import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { NewsItem } from '../types/cms';
import { LabImage } from '../components/LabImage';
import { formatAcademicDate, formatMonthYear, sanitizeHtmlClient } from '../lib/htmlUtils';

interface NewsPageProps {
  news: NewsItem[];
  selectedSlug?: string;
  onNavigate: (path: string) => void;
}

export const NewsPage: React.FC<NewsPageProps> = ({ news, selectedSlug, onNavigate }) => {
  // Open on current news when there is any; otherwise show the archive.
  const [viewMode, setViewMode] = useState<'recent' | 'archive'>(() =>
    news.some((n) => n.status !== 'archived') ? 'recent' : 'archive'
  );
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const activeArticle = selectedSlug ? news.find((n) => n.slug === selectedSlug) : undefined;

  const years = useMemo(() => {
    const s = Array.from(new Set(news.map((n) => n.published_date.slice(0, 4)))).sort((a, b) =>
      b.localeCompare(a)
    );
    return ['all', ...s];
  }, [news]);

  const categories = useMemo(() => {
    return ['all', ...Array.from(new Set(news.map((n) => n.category)))];
  }, [news]);

  if (activeArticle) {
    return (
      <div className="bg-[#FAF9F6] py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <button
            type="button"
            onClick={() => onNavigate('/news')}
            className="inline-flex items-center gap-2 text-button text-neutral-700 hover:text-black"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to News &amp; Announcements
          </button>

          <article className="bg-white border border-[#E5E2DC] rounded-md overflow-hidden">
            <div className="p-8 sm:p-10 space-y-4 border-b border-[#E5E2DC]">
              <div className="flex flex-wrap items-center gap-2 text-meta text-neutral-600 tabular-nums">
                <span className="font-semibold text-purdue-gold-text">{activeArticle.category}</span>
                <span aria-hidden="true">·</span>
                <span>{formatAcademicDate(activeArticle.published_date)}</span>
                <span aria-hidden="true">·</span>
                <span>{activeArticle.author_name}</span>
              </div>
              <h1 className="font-display text-page text-black">
                {activeArticle.title}
              </h1>
              <p className="text-lead text-neutral-700 measure">
                {activeArticle.summary}
              </p>
            </div>

            {activeArticle.image_url && (
              <figure className="bg-neutral-50 border-b border-[#E5E2DC]">
                <div className="max-h-[440px] overflow-hidden">
                  <LabImage
                    src={activeArticle.image_url}
                    alt={activeArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {activeArticle.image_caption && (
                  <figcaption className="px-8 py-3 text-caption italic text-neutral-600 border-t border-[#E5E2DC]">
                    {activeArticle.image_caption}
                  </figcaption>
                )}
              </figure>
            )}

            <div className="px-8 pt-6 space-y-2">
              {activeArticle.source_url && <a className="block text-meta underline underline-offset-4 hover:text-purdue-gold-text" href={activeArticle.source_url} target="_blank" rel="noreferrer">Original announcement / source</a>}
              {activeArticle.attachments?.filter(a=>a.url).map((a,i)=><a className="block text-meta underline underline-offset-4 hover:text-purdue-gold-text" key={i} href={a.url} target="_blank" rel="noreferrer">{a.label}</a>)}
            </div>
            <div className="p-8 sm:p-10">
              <div
                className="prose-lab prose-editorial"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtmlClient(activeArticle.content_html),
                }}
              />
            </div>
          </article>
        </div>
      </div>
    );
  }

  const filtered = (() => {
    return news.filter((item) => {
      if (viewMode === 'recent' && item.status === 'archived') return false;
      if (viewMode === 'archive' && item.status !== 'archived') return false;
      if (yearFilter !== 'all' && !item.published_date.startsWith(yearFilter)) return false;
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
      return true;
    });
  })();

  const groupedByMonthYear = (() => {
    const groups = new Map<string, { label: string; items: NewsItem[] }>();
    for (const item of filtered) {
      const { year, monthLabel, monthKey } = formatMonthYear(item.published_date);
      const existing = groups.get(monthKey);
      if (existing) {
        existing.items.push(item);
      } else {
        groups.set(monthKey, { label: `${monthLabel} ${year}`, items: [item] });
      }
    }
    return Array.from(groups.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  })();

  return (
    <div className="bg-[#FAF9F6] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="pb-8 border-b border-[#E5E2DC] flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-label uppercase text-purdue-gold-text">
              Laboratory Dispatches
            </p>
            <h1 className="font-display text-page text-black mt-2">
              News &amp; Announcements
            </h1>
            <p className="text-body text-neutral-700 mt-3">
              Research milestones, student honors, conference presentations, and grant awards organized chronologically by month and year.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 p-1 bg-white border border-[#E5E2DC] rounded-md">
              <button
                type="button"
                onClick={() => setViewMode('recent')}
                className={`px-3.5 py-2 text-button rounded transition-colors whitespace-nowrap shrink-0 ${
                  viewMode === 'recent'
                    ? 'bg-black text-[#CFB991]'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                Current News
              </button>
              <button
                type="button"
                onClick={() => setViewMode('archive')}
                className={`px-3.5 py-2 text-button rounded transition-colors whitespace-nowrap shrink-0 ${
                  viewMode === 'archive'
                    ? 'bg-black text-[#CFB991]'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                News Archive
              </button>
            </div>

            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              aria-label="Filter news by year"
              className="px-3 py-2.5 text-card bg-white border border-[#E5E2DC] rounded-md focus:outline-none focus:border-black"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y === 'all' ? 'All Years' : y}
                </option>
              ))}
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter news by category"
              className="px-3 py-2.5 text-card bg-white border border-[#E5E2DC] rounded-md focus:outline-none focus:border-black"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {groupedByMonthYear.length === 0 ? (
          <div className="bg-white border border-[#E5E2DC] rounded-md p-10 text-center">
            <p className="text-card text-neutral-700">
              No {viewMode === 'archive' ? 'archived' : 'current'} announcements match your filters.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {groupedByMonthYear.map(([monthKey, group]) => (
              <section key={monthKey} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-3 lg:sticky lg:top-24">
                  <h2 className="text-subsection text-black">{group.label}</h2>
                  <p className="text-caption text-neutral-600 mt-1 tabular-nums">
                    {group.items.length} {group.items.length === 1 ? 'entry' : 'entries'}
                  </p>
                </div>

                <div className="lg:col-span-9 space-y-6">
                  {group.items.map((item) => (
                    <article
                      key={item.id}
                      className="bg-white border border-[#E5E2DC] rounded-md overflow-hidden"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12">
                        {item.image_url && (
                          <div className="md:col-span-4 aspect-[4/3] md:aspect-auto bg-neutral-100 border-b md:border-b-0 md:border-r border-[#E5E2DC]">
                            <LabImage
                              src={item.image_url}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div
                          className={`${
                            item.image_url ? 'md:col-span-8' : 'md:col-span-12'
                          } p-6 sm:p-7 space-y-3`}
                        >
                          <div className="flex items-center gap-2 text-meta text-neutral-600 tabular-nums">
                            <span className="font-semibold text-purdue-gold-text">{item.category}</span>
                            <span aria-hidden="true">·</span>
                            <span>{formatAcademicDate(item.published_date)}</span>
                          </div>
                          <h3 className="text-card-title text-black">
                            <button
                              type="button"
                              onClick={() => onNavigate(`/news/${item.slug}`)}
                              className="text-left hover:text-purdue-gold-text transition-colors"
                            >
                              {item.title}
                            </button>
                          </h3>
                          <p className="text-card text-neutral-700 measure">{item.summary}</p>
                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={() => onNavigate(`/news/${item.slug}`)}
                              className="inline-flex items-center gap-1.5 text-button text-black hover:text-purdue-gold-text"
                            >
                              Read Full Announcement <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
