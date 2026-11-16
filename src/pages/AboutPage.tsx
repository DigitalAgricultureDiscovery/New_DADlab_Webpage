import React, { useRef } from 'react';
import { Mail, MapPin, Phone, ExternalLink, ArrowRight } from 'lucide-react';
import type { SiteProfile } from '../types/cms';
import { LabImage } from '../components/LabImage';
import { sanitizeHtmlClient } from '../lib/htmlUtils';
import { resolveMediaUrl } from '../lib/mediaAssets';
import { groupAwardsByYear, profileAwards } from '../lib/awards';

const RECENT_AWARDS_SHOWN = 6;

interface AboutPageProps {
  profile: SiteProfile;
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ profile, onNavigate }) => {
  const team = profile.teamMembers.filter((m) => m.category !== 'Faculty');
  const alumniCount = team.filter((m) => m.category === 'Alumni').length;
  const previewMembers = team.filter((m) => m.photoUrl).slice(0, 8);
  const awards = profileAwards(profile);
  const awardsRef = useRef<HTMLElement>(null);

  return (
    <div className="bg-[#FAF9F6] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Page Header */}
        <div className="pb-8 border-b border-[#E5E2DC] max-w-3xl">
          <p className="text-xs font-semibold tracking-wider text-[#8E6F3E] uppercase">
            {profile.institution}
          </p>
          <h1 className="font-serif text-4xl font-semibold text-black mt-2">
            About the Laboratory &amp; Principal Investigator
          </h1>
          <p className="text-base text-neutral-600 mt-3 leading-relaxed">
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

            <div className="bg-white border border-[#E5E2DC] rounded-md p-5 space-y-3 text-sm">
              <h2 className="font-serif text-lg font-semibold text-black">{profile.piName}</h2>
              <p className="text-xs text-neutral-600">{profile.piTitle}</p>
              <div className="pt-2 border-t border-neutral-100 space-y-2 text-xs text-neutral-700">
                <p className="flex items-start gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#8E6F3E] shrink-0 mt-0.5" />
                  <a href={`mailto:${profile.piEmail}`} className="hover:underline">
                    {profile.piEmail}
                  </a>
                </p>
                {profile.piPhone && (
                  <p className="flex items-start gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#8E6F3E] shrink-0 mt-0.5" />
                    <span className="tabular-nums">{profile.piPhone}</span>
                  </p>
                )}
                {(profile.piOffice || profile.labAddress) && (
                  <p className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#8E6F3E] shrink-0 mt-0.5" />
                    <span>
                      {profile.piOffice && <span className="block">Office: {profile.piOffice}</span>}
                      {profile.labAddress}
                    </span>
                  </p>
                )}
              </div>
              <div className="pt-3 border-t border-neutral-100 flex flex-wrap gap-4 text-xs font-semibold">
                {profile.googleScholarUrl && (
                  <a
                    href={profile.googleScholarUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[#8E6F3E] hover:text-black"
                  >
                    Google Scholar <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {profile.orcidUrl && (
                  <a
                    href={profile.orcidUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[#8E6F3E] hover:text-black"
                  >
                    ORCID <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {profile.githubUrl && (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[#8E6F3E] hover:text-black"
                  >
                    GitHub <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white border border-[#E5E2DC] rounded-md p-8 space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-black mb-4">
                  Academic Biography
                </h2>
                <div
                  className="prose-lab max-w-none"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtmlClient(profile.piBioHtml) }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[#E5E2DC]">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-black mb-3">Education</h3>
                  <ul className="space-y-2.5 text-sm text-neutral-700">
                    {profile.piEducation.map((edu, idx) => (
                      <li key={idx} className="leading-snug">
                        {edu}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-serif text-lg font-semibold text-black mb-3">
                    Recent Honors
                  </h3>
                  <ul className="space-y-2.5 text-sm text-neutral-700">
                    {awards.slice(0, RECENT_AWARDS_SHOWN).map((award, idx) => (
                      <li key={idx} className="leading-snug">
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
                      className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-black hover:text-[#8E6F3E]"
                    >
                      View all {awards.length} honors and awards
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-black text-white rounded-md p-8 space-y-3">
              <p className="text-xs font-semibold tracking-wider text-[#CFB991] uppercase">
                Laboratory Mission
              </p>
              <p className="font-serif text-xl sm:text-2xl leading-relaxed text-white">
                {profile.missionStatement}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('/opportunities')}
                  className="text-xs font-semibold text-[#CFB991] hover:underline underline-offset-4"
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
                  <p className="text-xs font-semibold tracking-wider text-[#8E6F3E] uppercase">Laboratory Identity</p>
                  <h3 className="font-serif text-xl font-semibold text-black">The {profile.shortTitle} Logo</h3>
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    The lab&rsquo;s logo places Digital Agriculture Discovery at the center of four connected themes:
                    UAV and machine intelligence, big data analytics, web tools, and IoT for high-value crops, linked
                    by platforms that connect over the web and open-source tools for production and management.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Honors & awards, grouped by year (newest first) */}
        {awards.length > 0 && (
          <section ref={awardsRef} className="space-y-6 scroll-mt-24" aria-labelledby="honors-heading">
            <div className="pb-4 border-b border-[#E5E2DC]">
              <p className="text-xs font-semibold tracking-wider text-[#8E6F3E] uppercase">Recognition</p>
              <h2 id="honors-heading" className="font-serif text-3xl font-semibold text-black mt-1">
                Honors &amp; Awards
              </h2>
            </div>
            <div className="bg-white border border-[#E5E2DC] rounded-md divide-y divide-[#E5E2DC]">
              {groupAwardsByYear(awards).map((group, groupIdx) => (
                <div key={`${group.year}-${groupIdx}`} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 p-5 sm:p-6">
                  <p className="md:col-span-2 font-serif text-xl font-semibold text-[#8E6F3E] tabular-nums">
                    {group.year}
                  </p>
                  <ul className="md:col-span-10 space-y-4">
                    {group.awards.map((award, idx) => (
                      <li key={idx} className="space-y-1">
                        <p className="text-base font-semibold text-black leading-snug">
                          {award.url ? (
                            <a
                              href={award.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 hover:text-[#8E6F3E] underline-offset-4 hover:underline"
                            >
                              {award.title}
                              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                            </a>
                          ) : (
                            award.title
                          )}
                        </p>
                        {award.organization && <p className="text-sm text-neutral-600">{award.organization}</p>}
                        {award.details && <p className="text-sm text-neutral-700 leading-relaxed">{award.details}</p>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Research group preview: the full directory is on the People page */}
        {team.length > 0 && (
          <section className="space-y-6">
            <div className="pb-4 border-b border-[#E5E2DC] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-wider text-[#8E6F3E] uppercase">People</p>
                <h2 className="font-serif text-3xl font-semibold text-black mt-1">
                  Research Group &amp; Alumni
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('/people')}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-black hover:text-[#8E6F3E] whitespace-nowrap shrink-0"
              >
                Meet the team
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-neutral-700 max-w-3xl leading-relaxed">
              The DAD Lab brings together graduate students, staff, visiting scholars, and undergraduate researchers
              {alumniCount > 0 ? `, with ${alumniCount} alumni listed` : ''}.
            </p>
            {previewMembers.length > 0 && (
              <ul className="flex flex-wrap gap-3" aria-label="Selected lab members">
                {previewMembers.map((m) => (
                  <li key={m.id} title={m.name} className="w-14 h-14 rounded-full overflow-hidden border border-[#E5E2DC] bg-white">
                    <LabImage src={m.photoUrl!} alt={m.name} width={56} height={56} className="w-full h-full object-cover" />
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
