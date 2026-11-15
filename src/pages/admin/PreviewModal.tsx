import React from 'react';
import { X, ExternalLink, FileText } from 'lucide-react';
import { LabImage } from '../../components/LabImage';
import { formatAcademicDate, sanitizeHtmlClient } from '../../lib/htmlUtils';
import type {
  NewsItem,
  PublicationItem,
  CourseItem,
  ResearchProjectItem,
  OpportunityItem,
} from '../../types/cms';

export type PreviewPayload =
  | { type: 'news'; item: Partial<NewsItem> }
  | { type: 'publication'; item: Partial<PublicationItem> }
  | { type: 'course'; item: Partial<CourseItem> }
  | { type: 'project'; item: Partial<ResearchProjectItem> }
  | { type: 'opportunity'; item: Partial<OpportunityItem> };

interface PreviewModalProps {
  preview: PreviewPayload | null;
  onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ preview, onClose }) => {
  if (!preview) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/65 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Draft Content Preview"
    >
      <div className="bg-[#FAF9F6] border border-[#E5E2DC] rounded-md max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-black text-white px-6 py-4 flex items-center justify-between border-b border-[#CFB991]/40">
          <div>
            <p className="text-[11px] font-semibold tracking-wider text-[#CFB991] uppercase">
              Public Website Preview
            </p>
            <p className="text-xs text-neutral-300">
              Visual check before publishing to the live Purdue laboratory site
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-neutral-800 text-white rounded hover:bg-neutral-700"
          >
            <X className="w-3.5 h-3.5" />
            Close Preview
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {preview.type === 'news' && (
            <article className="bg-white border border-[#E5E2DC] rounded-md overflow-hidden">
              <div className="p-8 space-y-4 border-b border-[#E5E2DC]">
                <div className="flex items-center gap-2 text-xs text-neutral-500 tabular-nums">
                  <span className="font-semibold text-[#8E6F3E]">{preview.item.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {formatAcademicDate(preview.item.published_date || new Date().toISOString().slice(0, 10))}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{preview.item.status}</span>
                </div>
                <h2 className="font-serif text-3xl font-semibold text-black">
                  {preview.item.title || 'Untitled Announcement'}
                </h2>
                <p className="text-base text-neutral-600">{preview.item.summary}</p>
              </div>
              {preview.item.image_url && (
                <div className="border-b border-[#E5E2DC]">
                  <div className="max-h-80 overflow-hidden">
                    <LabImage
                      src={preview.item.image_url}
                      alt={preview.item.title || 'News preview'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {preview.item.image_caption && (
                    <p className="px-8 py-2.5 text-xs font-serif italic text-neutral-600">
                      {preview.item.image_caption}
                    </p>
                  )}
                </div>
              )}
              <div className="p-8">
                <div
                  className="prose-lab"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtmlClient(preview.item.content_html || ''),
                  }}
                />
              </div>
            </article>
          )}

          {preview.type === 'project' && (
            <article className="bg-white border border-[#E5E2DC] rounded-md overflow-hidden">
              <div className="p-8 space-y-4 border-b border-[#E5E2DC]">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <span className="font-semibold text-[#8E6F3E] capitalize">
                    {preview.item.project_status} Research
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{preview.item.research_area}</span>
                </div>
                <h2 className="font-serif text-3xl font-semibold text-black">
                  {preview.item.title || 'Untitled Project'}
                </h2>
                <p className="text-base text-neutral-700">{preview.item.overview}</p>
              </div>
              {preview.item.image_url && (
                <div className="border-b border-[#E5E2DC] max-h-80 overflow-hidden">
                  <LabImage
                    src={preview.item.image_url}
                    alt={preview.item.title || 'Project preview'}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-8 space-y-6">
                {preview.item.progress_notes && (
                  <div className="p-4 bg-[#FAF9F6] border border-[#CFB991] rounded">
                    <p className="text-xs font-semibold text-[#8E6F3E] uppercase">
                      Latest Progress
                    </p>
                    <p className="text-sm text-neutral-800 mt-1">{preview.item.progress_notes}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-serif text-xl font-semibold mb-2">Objectives</h3>
                    <div
                      className="prose-lab"
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtmlClient(preview.item.objectives_html || ''),
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-semibold mb-2">Methodology</h3>
                    <div
                      className="prose-lab"
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtmlClient(preview.item.methodology_html || ''),
                      }}
                    />
                  </div>
                </div>
              </div>
            </article>
          )}

          {preview.type === 'publication' && (
            <article className="bg-white border border-[#E5E2DC] rounded-md p-8 space-y-3">
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <span className="font-mono font-semibold text-black">{preview.item.year}</span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-[#8E6F3E]">{preview.item.pub_type}</span>
                <span aria-hidden="true">·</span>
                <span>{preview.item.topic}</span>
              </div>
              <h2 className="font-serif text-2xl font-semibold text-black">
                {preview.item.title}
              </h2>
              <p className="text-sm text-neutral-800">{preview.item.authors}</p>
              <p className="text-sm text-neutral-600 italic">{preview.item.venue}</p>
              <div className="pt-3 border-t border-neutral-100 text-sm text-neutral-700 leading-relaxed">
                {preview.item.abstract}
              </div>
              <div className="pt-2 flex gap-4 text-xs font-semibold">
                {preview.item.doi_url && (
                  <span className="inline-flex items-center gap-1 text-[#8E6F3E]">
                    DOI <ExternalLink className="w-3 h-3" />
                  </span>
                )}
                {preview.item.pdf_url && (
                  <span className="inline-flex items-center gap-1 text-black">
                    PDF <FileText className="w-3 h-3" />
                  </span>
                )}
              </div>
            </article>
          )}

          {preview.type === 'course' && (
            <article className="bg-white border border-[#E5E2DC] rounded-md p-8 space-y-5">
              <div>
                <p className="text-xs font-mono font-semibold text-[#8E6F3E]">
                  {preview.item.course_number} · {preview.item.semester} {preview.item.academic_year}
                </p>
                <h2 className="font-serif text-2xl font-semibold text-black mt-1">
                  {preview.item.title}
                </h2>
              </div>
              <div
                className="prose-lab"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtmlClient(preview.item.description_html || ''),
                }}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8E6F3E] mb-2">
                    Topics Covered
                  </h3>
                  <ul className="list-disc pl-5 text-sm space-y-1 text-neutral-700">
                    {(preview.item.topics || []).map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8E6F3E] mb-2">
                    Objectives
                  </h3>
                  <ul className="list-disc pl-5 text-sm space-y-1 text-neutral-700">
                    {(preview.item.objectives || []).map((o, i) => (
                      <li key={i}>{o}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          )}

          {preview.type === 'opportunity' && (
            <article className="bg-white border border-[#E5E2DC] rounded-md p-8 space-y-5">
              <div>
                <p className="text-xs text-neutral-500">
                  <span className="font-semibold text-[#8E6F3E]">
                    {preview.item.position_status}
                  </span>{' '}
                  · {preview.item.appointment_type} · {preview.item.deadline}
                </p>
                <h2 className="font-serif text-2xl font-semibold text-black mt-1">
                  {preview.item.title}
                </h2>
              </div>
              <div
                className="prose-lab"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtmlClient(preview.item.description_html || ''),
                }}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                    Qualifications
                  </h3>
                  <div
                    className="prose-lab text-sm"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtmlClient(preview.item.qualifications_html || ''),
                    }}
                  />
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                    Responsibilities
                  </h3>
                  <div
                    className="prose-lab text-sm"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtmlClient(preview.item.responsibilities_html || ''),
                    }}
                  />
                </div>
              </div>
              <div className="p-4 bg-[#FAF9F6] border border-[#E5E2DC] rounded text-sm">
                <strong className="block text-xs uppercase text-[#8E6F3E] mb-1">
                  Application Instructions
                </strong>
                {preview.item.application_instructions}
              </div>
            </article>
          )}
        </div>
      </div>
    </div>
  );
};
