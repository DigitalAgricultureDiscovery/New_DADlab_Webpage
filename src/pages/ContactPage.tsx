import React, { useState } from 'react';
import { Mail, MapPin, Phone, Clock, CheckCircle2 } from 'lucide-react';
import type { SiteProfile } from '../types/cms';
import { api } from '../lib/api';

interface ContactPageProps {
  profile: SiteProfile;
}

export const ContactPage: React.FC<ContactPageProps> = ({ profile }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('Prospective Student / Researcher');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.submitContact({
        name,
        email,
        inquiry_type: inquiryType,
        subject,
        message,
      });
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send inquiry');
    } finally {
      setSubmitting(false);
    }
  };

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

          {/* Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#E5E2DC] rounded-md p-7 sm:p-9">
              <h2 className="font-serif text-2xl font-semibold text-black mb-2">
                Send a Message to the Laboratory
              </h2>
              <p className="text-sm text-neutral-600 mb-6">
                Messages submitted here are stored securely for review by the Principal Investigator.
              </p>

              {submitted ? (
                <div className="p-6 bg-[#FAF9F6] border border-[#CFB991] rounded-md space-y-3">
                  <div className="flex items-center gap-2 text-black font-semibold">
                    <CheckCircle2 className="w-5 h-5 text-[#8E6F3E]" />
                    Inquiry Received
                  </div>
                  <p className="text-sm text-neutral-700">
                    Thank you for contacting the {profile.labName}. Your message has been recorded for review.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-semibold text-[#8E6F3E] hover:text-black underline underline-offset-4"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-800 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Boilermaker"
                        className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-800 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@purdue.edu"
                        className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-800 mb-1">
                        Inquiry Category
                      </label>
                      <select
                        value={inquiryType}
                        onChange={(e) => setInquiryType(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md bg-white focus:outline-none focus:border-black"
                      >
                        <option>Prospective Student / Researcher</option>
                        <option>Academic / Industry Collaboration</option>
                        <option>Course &amp; Teaching Question</option>
                        <option>Media / Speaking Invitation</option>
                        <option>General Inquiry</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-800 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Brief subject line"
                        className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-800 mb-1">
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Provide details regarding your research interests, academic background, or inquiry..."
                      className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2.5 text-sm font-semibold bg-black text-[#CFB991] rounded-md hover:bg-neutral-800 disabled:opacity-50 transition-colors"
                    >
                      {submitting ? 'Sending Message...' : 'Send Inquiry'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
