import React from 'react';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import { phoneHref } from '../lib/profileLinks';
import type { SiteProfile } from '../types/content';

interface ContactPageProps {
  profile: SiteProfile;
}

export const ContactPage: React.FC<ContactPageProps> = ({ profile }) => {
  return (
    <div className="bg-[#FAF9F6] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="pb-8 border-b border-[#E5E2DC] max-w-3xl">
          <p className="text-label uppercase text-purdue-gold-text">
            {profile.institution} · West Lafayette
          </p>
          <h1 className="font-display text-page text-black mt-2">
            Contact &amp; Laboratory Inquiries
          </h1>
          <p className="text-body text-neutral-700 mt-3">
            Reach out regarding research collaborations, prospective graduate or undergraduate positions, course inquiries, or visiting scholar seminars.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#E5E2DC] rounded-md p-7 space-y-5">
              <div>
                <h2 className="text-subsection text-black">
                  {profile.labName}
                </h2>
                <p className="text-card text-neutral-700 mt-1">{profile.department}</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#E5E2DC] text-card text-neutral-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-purdue-gold-text shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-black">Laboratory &amp; Office Address</p>
                    <p className="text-neutral-600">{profile.labAddress}</p>
                    <p className="text-neutral-600 text-meta mt-0.5">{profile.piOffice}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-purdue-gold-text shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-black">Principal Investigator Email</p>
                    <a
                      href={`mailto:${profile.piEmail}`}
                      className="text-purdue-gold-text hover:text-black underline underline-offset-4"
                    >
                      {profile.piEmail}
                    </a>
                  </div>
                </div>

                {profile.piPhone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-purdue-gold-text shrink-0 mt-1" aria-hidden="true" />
                    <p>
                      <span className="font-semibold text-black">Office:</span>{' '}
                      <a
                        href={phoneHref(profile.piPhone)}
                        className="text-purdue-gold-text hover:text-black underline underline-offset-4 tabular-nums"
                      >
                        {profile.piPhone}
                      </a>
                    </p>
                  </div>
                )}

                {profile.officeHours && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-purdue-gold-text shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-black">Academic Office Hours</p>
                      <p className="text-neutral-600">{profile.officeHours}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Email inquiries */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#E5E2DC] rounded-md p-7 sm:p-9">
              <h2 className="text-subsection text-black mb-2">
                Send a Message to the Laboratory
              </h2>
              <p className="text-card text-neutral-700 mb-6">
                Please email the laboratory directly with your inquiry.
              </p>
              <a
                href={`mailto:${profile.piEmail}`}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-button bg-black text-[#CFB991] rounded-md hover:bg-neutral-800 transition-colors"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                Email {profile.piEmail}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
