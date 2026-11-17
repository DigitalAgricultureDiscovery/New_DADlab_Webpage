import React, { useState } from 'react';
import { ExternalLink, Mail } from 'lucide-react';
import type { OpportunityItem } from '../types/cms';
import { sanitizeHtmlClient } from '../lib/htmlUtils';

interface OpportunitiesPageProps {
  opportunities: OpportunityItem[];
  onNavigate: (path: string) => void;
}

export const OpportunitiesPage: React.FC<OpportunitiesPageProps> = ({
  opportunities,
  onNavigate,
}) => {
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const appointmentTypes = [
    'all',
    'Hourly Student Research',
    'Undergraduate Research',
    'Graduate Research',
    'Research Assistantship',
    'Full-Time Research',
    'Postdoctoral / Other',
  ];

  const openPositions = opportunities.filter(
    (o) =>
      o.position_status === 'Open' &&
      (typeFilter === 'all' || o.appointment_type === typeFilter)
  );

  const pastPositions = opportunities.filter(
    (o) =>
      (o.position_status === 'Closed' || o.position_status === 'Filled') &&
      (typeFilter === 'all' || o.appointment_type === typeFilter)
  );

  return (
    <div className="bg-[#FAF9F6] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="pb-8 border-b border-[#E5E2DC] flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-label uppercase text-purdue-gold-text">
              Laboratory Openings
            </p>
            <h1 className="font-display text-page text-black mt-2">
              Research Opportunities &amp; Positions
            </h1>
            <p className="text-body text-neutral-700 mt-3">
              Research opportunities are posted here when confirmed by the laboratory.
            </p>
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              aria-label="Filter by appointment type"
              className="px-3.5 py-2 text-card bg-white border border-[#E5E2DC] rounded-md focus:outline-none focus:border-black"
            >
              {appointmentTypes.map((t) => (
                <option key={t} value={t}>
                  {t === 'all' ? 'All Appointment Types' : t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Open Positions */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-section text-black">
              Active Open Positions ({openPositions.length})
            </h2>
          </div>

          {openPositions.length === 0 ? (
            <div className="bg-white border border-[#E5E2DC] rounded-md p-8 space-y-3">
              <p className="text-card text-neutral-700">
                No current openings are posted for this category.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('/contact')}
                className="text-button text-purdue-gold-text hover:text-black underline underline-offset-4"
              >
                Send a Research Inquiry →
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {openPositions.map((opp) => (
                <article
                  key={opp.id}
                  className="bg-white border border-[#E5E2DC] rounded-md p-7 sm:p-9 space-y-6"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-5 border-b border-[#E5E2DC]">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2 text-meta text-neutral-600">
                        <span className="font-semibold text-emerald-800">Status: Open</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-purdue-gold-text">{opp.appointment_type}</span>
                        {opp.deadline && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="tabular-nums">
                              Deadline: {opp.deadline}
                            </span>
                          </>
                        )}
                      </div>
                      <h3 className="text-subsection text-black">{opp.title}</h3>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {opp.application_url ? (
                        <a
                          href={opp.application_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-button bg-black text-[#CFB991] rounded hover:bg-neutral-800 transition-colors whitespace-nowrap shrink-0"
                        >
                          Official Application Portal
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onNavigate('/contact')}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-button bg-black text-[#CFB991] rounded hover:bg-neutral-800 transition-colors whitespace-nowrap shrink-0"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          Inquire About Role
                        </button>
                      )}
                    </div>
                  </div>

                  <div
                    className="prose-lab"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtmlClient(opp.description_html),
                    }}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <h4 className="text-label uppercase text-neutral-600">
                        Required Qualifications &amp; Preferred Skills
                      </h4>
                      <div
                        className="prose-lab text-card"
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtmlClient(opp.qualifications_html),
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-label uppercase text-neutral-600">
                        Expected Responsibilities
                      </h4>
                      <div
                        className="prose-lab text-card"
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtmlClient(opp.responsibilities_html),
                        }}
                      />
                    </div>
                  </div>

                  <div className="p-5 bg-[#FAF9F6] border border-[#E5E2DC] rounded-md space-y-1.5">
                    <h4 className="text-label uppercase text-purdue-gold-text">
                      How to Apply
                    </h4>
                    <p className="text-card text-neutral-800">
                      {opp.application_instructions}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Closed / Filled Positions */}
        {pastPositions.length > 0 && (
          <section className="pt-6 border-t border-[#E5E2DC] space-y-4">
            <h2 className="text-subsection text-neutral-700">
              Recently Filled or Closed Announcements
            </h2>
            <div className="bg-white border border-[#E5E2DC] rounded-md divide-y divide-[#E5E2DC]">
              {pastPositions.map((opp) => (
                <div
                  key={opp.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 text-meta text-neutral-600">
                      <span className="font-semibold text-neutral-700">
                        Status: {opp.position_status}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{opp.appointment_type}</span>
                    </div>
                    <h3 className="text-item-title font-medium text-neutral-800 mt-1">
                      {opp.title}
                    </h3>
                  </div>
                  <span className="text-meta text-neutral-600 tabular-nums shrink-0">
                    {opp.deadline}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
