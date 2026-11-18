import { ExternalLink, Mail } from 'lucide-react';
import { PersonAvatar } from '../components/PersonAvatar';
import { ProfileLinks, type ProfileLinkInput } from '../components/ProfileLinks';
import { profileLinkKind } from '../lib/profileLinks';
import type { SiteProfile, TeamMember } from '../types/cms';

const GROUPS: { category: TeamMember['category']; heading: string }[] = [
  { category: 'Faculty', heading: 'Principal Investigator' },
  { category: 'Staff', heading: 'Staff' },
  { category: 'PhD Student', heading: 'Ph.D. Students' },
  { category: 'MS Student', heading: 'M.S. Students' },
  { category: 'Postdoctoral Researcher', heading: 'Postdoctoral Researchers' },
  { category: 'Visiting Researcher', heading: 'Visiting Scholars' },
  { category: 'Undergraduate', heading: 'Undergraduate Researchers and Interns' },
  { category: 'Former Staff', heading: 'Former Staff' },
  { category: 'Alumni', heading: 'Alumni' },
];

/** LinkedIn, plus the website when it is a Scholar/GitHub/ORCID/LinkedIn profile. */
function memberProfileLinks(member: TeamMember): ProfileLinkInput[] {
  const links: ProfileLinkInput[] = [{ kind: 'linkedin', url: member.linkedin }];
  const websiteKind = member.website ? profileLinkKind(member.website) : undefined;
  if (websiteKind && !(websiteKind === 'linkedin' && member.linkedin)) links.push({ kind: websiteKind, url: member.website });
  return links;
}

const LINK = 'inline-flex items-center gap-1.5 text-meta font-medium text-purdue-gold-text underline-offset-4 hover:text-black hover:underline';

export function PeoplePage({profile}: {profile: SiteProfile}) {
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
    <div className="pb-8 border-b border-[#E5E2DC] space-y-3">
      <p className="text-label uppercase text-purdue-gold-text">{profile.labName}</p>
      <h1 className="font-display text-page text-black">People &amp; Alumni</h1>
      <p className="text-body text-neutral-700 measure">Members, visiting scholars, undergraduate researchers, and alumni of the DAD Lab. Positions shown for alumni are those last reported and may have changed.</p>
    </div>
    {GROUPS.map(({category, heading})=>{
      const members=profile.teamMembers.filter(m=>m.category===category);
      return members.length ? <section key={category} className="space-y-5" aria-labelledby={`people-${category}`}>
        <h2 id={`people-${category}`} className="text-section text-black">{heading}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{members.map(member=><article key={member.id} className="bg-white border border-[#E5E2DC] rounded-md p-6 flex flex-col">
          <PersonAvatar name={member.name} photoUrl={member.photoUrl} className="mb-4" />
          <div className="space-y-2 flex-1">
            <h3 className="text-name text-black">{member.name}</h3>
            <p className="text-body font-medium text-purdue-gold-text">{member.role}</p>
            {member.focus && <p className="text-card text-neutral-700 pt-1">{member.focus}</p>}
          </div>
          {(member.email || member.linkedin || member.website) && <div className="pt-4 mt-4 border-t border-neutral-100 flex flex-wrap items-center gap-x-5 gap-y-2">
            <ProfileLinks owner={member.name} links={memberProfileLinks(member)} />
            {member.website && !profileLinkKind(member.website) && <a className={LINK} href={member.website} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s professional profile (opens in a new tab)`}>Website <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /></a>}
            {member.email && <a className={`${LINK} break-all`} href={`mailto:${member.email}`}><Mail className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />{member.email}</a>}
          </div>}
        </article>)}</div>
      </section>:null;
    })}
  </div>;
}
