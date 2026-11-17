import React, { useRef, useState } from 'react';
import { Mail, MapPin, Phone, ExternalLink, ArrowRight } from 'lucide-react';
import type { SiteProfile } from '../types/cms';
import { LabImage } from '../components/LabImage';
import { PersonAvatar } from '../components/PersonAvatar';
import { sanitizeHtmlClient } from '../lib/htmlUtils';
import { resolveMediaUrl } from '../lib/mediaAssets';
import { groupAwardsByYear, profileAwards, sortAwards, type AwardOrder } from '../lib/awards';

const RECENT_AWARDS_SHOWN = 6;

interface AboutPageProps {
  profile: SiteProfile;
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ profile, onNavigate }) => {
  const team = profile.teamMembers.filter((m) => m.category !== 'Faculty');
  const alumniCount = team.filter((m) => m.category === 'Alumni').length;
  const previewMembers = team.filter((m) => m.photoUrl).slice(0, 8);
  // Awards are always shown in chronological order, whatever order they are stored in.
  const awards = sortAwards(profileAwards(profile), 'newest');
  const [awardOrder, setAwardOrder] = useState<AwardOrder>('newest');
  const timelineAwards = awardOrder === 'newest' ? awards : sortAwards(awards, 'oldest');
  const awardsRef = useRef<HTMLElement>(null);

  return (
    <div className="bg-[#FAF9F6] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Page Header */}
        <div className="pb-8 border-b border-[#E5E2DC] max-w-3xl">
          <p className="text-label uppercase text-purdue-gold-text">
            {profile.institution}
          </p>
          <h1 className="font-display text-page text-black mt-2">
            About the Laboratory &amp; Principal Investigator
          </h1>
          <p className="text-body text-neutral-700 mt-3">
            {profile.department}
          </p>
        </div>

        {/* PI Profile Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4 space-y-5">
            <div className="rounded-md overflow-hidden border border-[#E5E2DC] bg-white">
              <LabImage
                src={profile.piPortraitUrl}
                alt={`Portrait of ${profile.piName}`}
                width={800}
                height={946}
                loading="eager"
                className="w-full h-auto block"
              />
            </div>

            <div className="bg-white border border-[#E5E2DC] rounded-md p-5 space-y-3 text-card">
              <h2 className="text-name text-black">{profile.piName}</h2>
              <p className="text-body text-neutral-700">{profile.piTitle}</p>
              <div className="pt-3 border-t border-neutral-100 space-y-2.5 text-meta text-neutral-700">
                <p className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-purdue-gold-text shrink-0 mt-0.5" aria-hidden="true" />
                  <a href={`mailto:${profile.piEmail}`} className="hover:underline">
                    {profile.piEmail}
                  </a>
                </p>
                {profile.piPhone && (
                  <p className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-purdue-gold-text shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="tabular-nums">{profile.piPhone}</span>
                  </p>
                )}
                {(profile.piOffice || profile.labAddress) && (
                  <p className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-purdue-gold-text shrink-0 mt-0.5" aria-hidden="true" />
                    <span>
                      {profile.piOffice && <span className="block">Office: {profile.piOffice}</span>}
                      {profile.labAddress}
                    </span>
                  </p>
                )}
              </div>
              <div className="pt-3 border-t border-neutral-100 flex flex-wrap gap-4 text-button">
                {profile.googleScholarUrl && (
                  <a
                    href={profile.googleScholarUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-purdue-gold-text hover:text-black"
                  >
                    Google Scholar <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {profile.orcidUrl && (
                  <a
                    href={profile.orcidUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-purdue-gold-text hover:text-black"
                  >
                    ORCID <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {profile.githubUrl && (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-purdue-gold-text hover:text-black"
                  >
                    GitHub <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {profile.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${profile.piName} on LinkedIn (opens in a new tab)`}
                    className="inline-flex items-center gap-1 text-purdue-gold-text hover:text-black"
                  >
                    LinkedIn <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white border border-[#E5E2DC] rounded-md p-8 space-y-6">
              <div>
                <h2 className="text-subsection text-black mb-4">
                  Academic Biography
                </h2>
                <div
                  className="prose-lab prose-editorial"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtmlClient(profile.piBioHtml) }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[#E5E2DC]">
                <div>
                  <h3 className="text-card-title text-black mb-3">Education</h3>
                  <ul className="space-y-2.5 text-card text-neutral-700">
                    {profile.piEducation.map((edu, idx) => (
                      <li key={idx}>
                        {edu}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-card-title text-black mb-3">
                    Recent Honors
                  </h3>
                  <ul className="space-y-2.5 text-card text-neutral-700">
                    {awards.slice(0, RECENT_AWARDS_SHOWN).map((award, idx) => (
                      <li key={idx}>
                        <span className="tabular-nums">{award.year}</span>
                        {award.year && ' \u2014 '}
                        {award.title}
                      </li>
                    ))}
                  </ul>
                  {awards.length > RECENT_AWARDS_SHOWN && (
                    <button
                      type="button"
                      onClick={() => awardsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                      className="mt-4 inline-flex items-center gap-1.5 text-button text-black hover:text-purdue-gold-text"
                    >
                      View all {awards.length} honors and awards
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-black text-white rounded-md p-8 space-y-3">
              <p className="text-label uppercase text-[#CFB991]">
                Laboratory Mission
              </p>
              <p className="font-editorial text-lead text-white">
                {profile.missionStatement}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('/opportunities')}
                  className="text-button text-[#CFB991] hover:underline underline-offset-4"
                >
                  Interested in joining our research team? View open positions →
                </button>
              </div>
            </div>

            {profile.logoUrl && (
              <div className="bg-white border border-[#E5E2DC] rounded-md p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 items-center">
                <img
                  src={resolveMediaUrl(profile.logoUrl)}
                  alt={`${profile.shortTitle} logo: Digital Agriculture Discovery at the center of UAV and machine intelligence, big data analytics, web tools, and IoT for high-value crops`}
                  width={512}
                  height={511}
                  loading="lazy"
                  className="w-48 h-48 sm:w-56 sm:h-56 object-contain mx-auto"
                />
                <div className="space-y-2">
                  <p className="text-label uppercase text-purdue-gold-text">Laboratory Identity</p>
                  <h3 className="text-card-title text-black">The {profile.shortTitle} Logo</h3>
                  <p className="text-card text-neutral-700">
                    The lab&rsquo;s logo places Digital Agriculture Discovery at the center of four connected themes:
                    UAV and machine intelligence, big data analytics, web tools, and IoT for high-value crops, linked
                    by platforms that connect over the web and open-source tools for production and management.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Honors & awards: chronological timeline grouped by year, newest or oldest first */}
        {awards.length > 0 && (
          <section ref={awardsRef} className="space-y-6 scroll-mt-24" aria-labelledby="honors-heading">
            <div className="pb-4 border-b border-[#E5E2DC] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-label uppercase text-purdue-gold-text">Recognition</p>
                <h2 id="honors-heading" className="text-section text-black mt-1">
                  Honors &amp; Awards
                </h2>
              </div>
              <div role="group" aria-label="Order of honors and awards" className="flex items-center gap-1 p-1 bg-white border border-[#E5E2DC] rounded-md self-start sm:self-auto">
                {(['newest', 'oldest'] as const).map((order) => (
                  <button
                    key={order}
                    type="button"
                    aria-pressed={awardOrder === order}
                    onClick={() => setAwardOrder(order)}
                    className={`px-3.5 py-2 text-button rounded transition-colors whitespace-nowrap ${
                      awardOrder === order ? 'bg-black text-[#CFB991]' : 'text-neutral-700 hover:text-black'
                    }`}
                  >
                    {order === 'newest' ? 'Newest first' : 'Oldest first'}
                  </button>
                ))}
              </div>
            </div>
            <ol className="bg-white border border-[#E5E2DC] rounded-md px-5 sm:px-8 py-2">
              {groupAwardsByYear(timelineAwards).map((group, groupIdx) => (
                <li
                  key={`${group.year}-${groupIdx}`}
                  className="relative grid grid-cols-[1.5rem_1fr] md:grid-cols-[1.5rem_7rem_1fr] gap-x-4 md:gap-x-6 py-5 before:absolute before:left-[calc(0.75rem-1px)] before:top-0 before:bottom-0 before:w-0.5 before:bg-[#E5E2DC] first:before:top-8 last:before:bottom-auto last:before:h-8"
                >
                  <span aria-hidden="true" className="relative row-span-2 md:row-span-1 flex justify-center pt-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#CFB991] border border-[#8E6F3E] ring-4 ring-white" />
                  </span>
                  <h3 className="font-display text-subsection font-bold text-purdue-gold-text tabular-nums">
                    {group.year}
                  </h3>
                  <ul className="col-start-2 md:col-start-3 md:row-start-1 mt-2 md:mt-0 space-y-4">
                    {group.awards.map((award, idx) => (
                      <li key={idx} className="space-y-1">
                        <p className="text-item-title text-black">
                          {award.url ? (
                            <a
                              href={award.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 hover:text-purdue-gold-text underline-offset-4 hover:underline"
                            >
                              {award.title}
                              <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                            </a>
                          ) : (
                            award.title
                          )}
                        </p>
                        {award.organization && <p className="text-meta text-neutral-600">{award.organization}</p>}
                        {award.details && <p className="text-card text-neutral-700 measure">{award.details}</p>}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Research group preview: the full directory is on the People page */}
        {team.length > 0 && (
          <section className="space-y-6">
            <div className="pb-4 border-b border-[#E5E2DC] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-label uppercase text-purdue-gold-text">People</p>
                <h2 className="text-section text-black mt-1">
                  Research Group &amp; Alumni
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('/people')}
                className="inline-flex items-center gap-1.5 text-button text-black hover:text-purdue-gold-text whitespace-nowrap shrink-0"
              >
                Meet the team
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-body text-neutral-700 measure">
              The DAD Lab brings together graduate students, staff, visiting scholars, and undergraduate researchers
              {alumniCount > 0 ? `, with ${alumniCount} alumni listed` : ''}.
            </p>
            {previewMembers.length > 0 && (
              <ul className="flex flex-wrap gap-3" aria-label="Selected lab members">
                {previewMembers.map((m) => (
                  <li key={m.id} title={m.name}>
                    <PersonAvatar name={m.name} photoUrl={m.photoUrl} size="sm" />
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </div>
  );
};
