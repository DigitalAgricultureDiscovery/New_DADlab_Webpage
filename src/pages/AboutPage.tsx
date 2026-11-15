import React from 'react';
import { Mail, MapPin, Phone, ExternalLink } from 'lucide-react';
import type { SiteProfile } from '../types/cms';
import { LabImage } from '../components/LabImage';
import { sanitizeHtmlClient } from '../lib/htmlUtils';

interface AboutPageProps {
  profile: SiteProfile;
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ profile, onNavigate }) => {
  const categories = ['Faculty', 'PhD Student', 'MS Student', 'Undergraduate', 'Alumni'] as const;

  return (
    <div className="bg-[#FAF9F6] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Page Header */}
        <div className="pb-8 border-b border-[#E5E2DC] max-w-3xl">
          <p className="text-xs font-semibold tracking-wider text-[#8E6F3E] uppercase">
            {profile.institution} · {profile.college}
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
            <div className="aspect-[3/4] rounded-md overflow-hidden border border-[#E5E2DC] bg-white">
              <LabImage
                src={profile.piPortraitUrl}
                alt={profile.piName}
                className="w-full h-full object-cover"
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
                <p className="flex items-start gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#8E6F3E] shrink-0 mt-0.5" />
                  <span className="tabular-nums">{profile.piPhone}</span>
                </p>
                <p className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#8E6F3E] shrink-0 mt-0.5" />
                  <span>{profile.piOffice}</span>
                </p>
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
                    Selected Honors &amp; Service
                  </h3>
                  <ul className="space-y-2.5 text-sm text-neutral-700">
                    {profile.piHonors.map((honor, idx) => (
                      <li key={idx} className="leading-snug">
                        {honor}
                      </li>
                    ))}
                  </ul>
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
          </div>
        </section>

        {/* Team & Alumni Directory */}
        <section className="space-y-6">
          <div className="pb-4 border-b border-[#E5E2DC]">
            <p className="text-xs font-semibold tracking-wider text-[#8E6F3E] uppercase">
              People
            </p>
            <h2 className="font-serif text-3xl font-semibold text-black mt-1">
              Research Group &amp; Alumni
            </h2>
          </div>

          <div className="space-y-8">
            {categories.map((cat) => {
              const members = profile.teamMembers.filter((m) => m.category === cat);
              if (members.length === 0) return null;
              return (
                <div key={cat} className="space-y-3">
                  <h3 className="font-sans text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                    {cat === 'Faculty' ? 'Principal Investigator' : `${cat}s`}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {members.map((m) => (
                      <div
                        key={m.id}
                        className="bg-white border border-[#E5E2DC] rounded-md p-5 space-y-1.5"
                      >
                        <h4 className="font-serif text-lg font-semibold text-black">{m.name}</h4>
                        <p className="text-xs font-medium text-[#8E6F3E]">{m.role}</p>
                        <p className="text-sm text-neutral-600 pt-1 leading-relaxed">{m.focus}</p>
                        {m.email && (
                          <p className="text-xs text-neutral-500 pt-1">
                            <a href={`mailto:${m.email}`} className="hover:underline">
                              {m.email}
                            </a>
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
