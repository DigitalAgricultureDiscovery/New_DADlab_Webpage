import { LabImage } from '../components/LabImage';
import type { SiteProfile } from '../types/cms';
export function PeoplePage({profile}: {profile: SiteProfile}) {
  const categories=['Faculty','PhD Student','MS Student','Undergraduate','Postdoctoral Researcher','Visiting Researcher','Alumni'];
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
    <h1 className="font-serif text-4xl">People &amp; Alumni</h1>
    <p className="text-neutral-600">The directory includes approved profiles. Additional current members and alumni will be included after membership and biographies are confirmed.</p>
    {categories.map(category=>{
      const members=profile.teamMembers.filter(m=>m.category===category);
      return members.length ? <section key={category} className="space-y-4">
        <h2 className="font-serif text-2xl">{category==='Faculty'?'Principal Investigator':category}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{members.map(member=><article key={member.id} className="bg-white border border-[#E5E2DC] rounded-md p-6 space-y-3">
          {member.photoUrl && <LabImage src={member.photoUrl} alt={member.name} className="w-28 h-28 rounded-full object-cover" />}
          <h3 className="font-serif text-xl">{member.name}</h3><p className="text-[#8E6F3E]">{member.role}</p><p>{member.focus}</p>
          {member.email && <a className="block underline" href={`mailto:${member.email}`}>{member.email}</a>}
          {member.website && <a className="block underline" href={member.website} target="_blank" rel="noreferrer">Professional profile</a>}
        </article>)}</div>
      </section>:null;
    })}
  </div>;
}
