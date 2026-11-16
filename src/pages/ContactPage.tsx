import React from 'react';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import type { SiteProfile } from '../types/cms';

interface ContactPageProps {
  profile: SiteProfile;
}

export const ContactPage: React.FC<ContactPageProps> = ({ profile }) => {
  return (
    <div className="bg-[#FAF9F6] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="pb-8 border-b border-[#E5E2DC] max-w-3xl">
          <p className="text-xs font-semibold tracking-wider text-[#8E6F3E] uppercase">
            {profile.institution} · West Lafayette
          </p>
          <h1 className="font-serif text-4xl font-semibold text-black mt-2">
            Contact &amp; Laboratory Inquiries
          </h1>
          <p className="text-base text-neutral-600 mt-3 leading-relaxed">
            Reach out regarding research collaborations, prospective graduate or undergraduate positions, course inquiries, or visiting scholar seminars.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#E5E2DC] rounded-md p-7 space-y-5">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-black">
                  {profile.labName}
                </h2>
                <p className="text-sm text-neutral-600 mt-1">{profile.department}</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#E5E2DC] text-sm text-neutral-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#8E6F3E] shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-black">Laboratory &amp; Office Address</p>
                    <p className="text-neutral-600">{profile.labAddress}</p>
                    <p className="text-neutral-500 text-xs mt-0.5">{profile.piOffice}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#8E6F3E] shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-black">Principal Investigator Email</p>
                    <a
                      href={`mailto:${profile.piEmail}`}
                      className="text-[#8E6F3E] hover:text-black underline underline-offset-4"
                    >
                      {profile.piEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#8E6F3E] shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-black">Office Telephone</p>
                    <p className="text-neutral-600 tabular-nums">{profile.piPhone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#8E6F3E] shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-black">Academic Office Hours</p>
                    <p className="text-neutral-600">{profile.officeHours}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Inquiry by email: the site is static, so there is no form backend. */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#E5E2DC] rounded-md p-7 sm:p-9">
              <h2 className="font-serif text-2xl font-semibold text-black mb-2">
                Send a Message to the Laboratory
              </h2>
              <p className="text-sm text-neutral-600 mb-6">
                Please email the laboratory directly with your inquiry.
              </p>

              <a href={`mailto:${profile.piEmail}`} className="text-[#8E6F3E] underline underline-offset-4">
                Email {profile.piEmail}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
