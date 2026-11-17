import { LabImage } from '../components/LabImage';
import type { SiteProfile, TeamMember } from '../types/cms';

const GROUPS: { category: TeamMember['category']; heading: string }[] = [
  { category: 'Faculty', heading: 'Principal Investigator' },
  { category: 'Staff', heading: 'Staff' },
  { category: 'PhD Student', heading: 'Ph.D. Students' },
  { category: 'MS Student', heading: 'M.S. Students' },
  { category: 'Postdoctoral Researcher', heading: 'Postdoctoral Researchers' },
  { category: 'Visiting Researcher', heading: 'Visiting Scholars' },
  { category: 'Undergraduate', heading: 'Undergraduate Researchers and Interns' },
  { category: 'Alumni', heading: 'Alumni' },
];

export function PeoplePage({profile}: {profile: SiteProfile}) {
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
    <div className="pb-8 border-b border-[#E5E2DC] space-y-3">
      <p className="text-label uppercase text-purdue-gold-text">{profile.labName}</p>
      <h1 className="font-display text-page text-black">People &amp; Alumni</h1>
      <p className="text-body text-neutral-700 measure">Members, visiting scholars, undergraduate researchers, and alumni of the DAD Lab, as listed on the lab&rsquo;s previous website and its dated announcements. Positions shown for alumni are those last listed and may have changed.</p>
    </div>
    {GROUPS.map(({category, heading})=>{
      const members=profile.teamMembers.filter(m=>m.category===category);
      return members.length ? <section key={category} className="space-y-5" aria-labelledby={`people-${category}`}>
        <h2 id={`people-${category}`} className="text-section text-black">{heading}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{members.map(member=><article key={member.id} className="bg-white border border-[#E5E2DC] rounded-md p-6 space-y-2">
          {member.photoUrl && <div className="w-28 h-28 mb-4 rounded-full overflow-hidden border border-[#E5E2DC] bg-neutral-100"><LabImage src={member.photoUrl} alt={`Photo of ${member.name}`} width={112} height={112} className="w-full h-full object-cover object-top" /></div>}
          <h3 className="text-name text-black">{member.name}</h3>
          <p className="text-body font-medium text-purdue-gold-text">{member.role}</p>
          <p className="text-card text-neutral-700 pt-1">{member.focus}</p>
          {member.email && <a className="block pt-1 text-meta underline underline-offset-4 hover:text-purdue-gold-text break-words" href={`mailto:${member.email}`}>{member.email}</a>}
          {member.website && <a className="block pt-1 text-meta underline underline-offset-4 hover:text-purdue-gold-text" href={member.website} target="_blank" rel="noreferrer">Professional profile</a>}
        </article>)}</div>
      </section>:null;
    })}
  </div>;
}
