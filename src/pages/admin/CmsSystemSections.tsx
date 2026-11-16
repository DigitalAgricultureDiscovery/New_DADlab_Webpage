import React, { useRef, useState } from 'react';
import { Download, Upload, Plus, Trash2, Check, Shield, BookOpen } from 'lucide-react';
import { api } from '../../lib/api';
import { RichTextEditor } from '../../components/RichTextEditor';
import { MediaPickerField } from '../../components/MediaPickerField';
import type {
  SiteProfile,
  TeamMember,
  ContactInquiry,
  UserAccount,
  RedirectRule,
  MediaAsset,
} from '../../types/cms';

// ========================
// SITE PROFILE & TEAM
// ========================
interface ProfileManagerProps {
  profile: SiteProfile;
  mediaAssets: MediaAsset[];
  onMediaUploaded: (asset: MediaAsset) => void;
  onRefresh: () => Promise<void>;
  isAdmin: boolean;
}

export const ProfileManager: React.FC<ProfileManagerProps> = ({
  profile,
  mediaAssets,
  onMediaUploaded,
  onRefresh,
  isAdmin,
}) => {
  const [form, setForm] = useState<SiteProfile>(profile);
  const [eduText, setEduText] = useState(profile.piEducation.join('\n'));
  const [honorsText, setHonorsText] = useState(profile.piHonors.join('\n'));
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const [error, setError] = useState('');

  const addMember = () => {
    const next: TeamMember = {
      id: `tm-${Date.now()}`,
      name: 'New Researcher',
      role: 'Ph.D. Student',
      category: 'PhD Student',
      focus: 'Research focus area',
    };
    setForm({ ...form, teamMembers: [...form.teamMembers, next] });
  };

  const updateMember = (idx: number, patch: Partial<TeamMember>) => {
    const next = form.teamMembers.map((m, i) => (i === idx ? { ...m, ...patch } : m));
    setForm({ ...form, teamMembers: next });
  };

  const removeMember = (idx: number) => {
    setForm({ ...form, teamMembers: form.teamMembers.filter((_, i) => i !== idx) });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSavedMsg('');
    setSaving(true);
    try {
      const payload: SiteProfile = {
        ...form,
        piEducation: eduText.split('\n').map((s) => s.trim()).filter(Boolean),
        piHonors: honorsText.split('\n').map((s) => s.trim()).filter(Boolean),
      };
      await api.updateProfile(payload);
      await onRefresh();
      setSavedMsg('Laboratory profile and team directory saved.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="bg-white border border-neutral-200 rounded-md p-8">
        <p className="text-sm text-neutral-700">
          Site-wide branding, PI biography, and homepage curation settings are restricted to Principal Investigator (Admin) accounts.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {error && <p className="text-xs text-red-700 bg-red-50 p-3 rounded">{error}</p>}
      {savedMsg && <p className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 p-3 rounded">{savedMsg}</p>}

      <div className="bg-white border border-neutral-200 rounded-md p-6 space-y-4">
        <h2 className="font-serif text-xl font-semibold text-black pb-3 border-b border-neutral-200">
          Laboratory Identity &amp; Home Page Hero
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">Full Lab Name</label>
            <input
              type="text"
              value={form.labName}
              onChange={(e) => setForm({ ...form, labName: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">Header Wordmark (Short)</label>
            <input
              type="text"
              value={form.shortTitle}
              onChange={(e) => setForm({ ...form, shortTitle: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">Department / School</label>
            <input
              type="text"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">Hero Eyebrow (optional)</label>
            <input
              type="text"
              placeholder="Leave blank to hide the line above the headline"
              value={form.heroEyebrow}
              onChange={(e) => setForm({ ...form, heroEyebrow: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-800 mb-1">Hero Headline</label>
          <input
            type="text"
            value={form.heroHeadline}
            onChange={(e) => setForm({ ...form, heroHeadline: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-800 mb-1">Hero Subheadline</label>
          <textarea
            rows={2}
            value={form.heroSubheadline}
            onChange={(e) => setForm({ ...form, heroSubheadline: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-800 mb-1">Mission Statement</label>
          <textarea
            rows={2}
            value={form.missionStatement}
            onChange={(e) => setForm({ ...form, missionStatement: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md"
          />
        </div>

        <MediaPickerField
          label="Home Page Hero Image"
          value={form.heroImageUrl}
          onChange={(url) => setForm({ ...form, heroImageUrl: url })}
          accept="image"
          mediaAssets={mediaAssets}
          onMediaUploaded={onMediaUploaded}
        />
      </div>

      <div className="bg-white border border-neutral-200 rounded-md p-6 space-y-4">
        <h2 className="font-serif text-xl font-semibold text-black pb-3 border-b border-neutral-200">
          Principal Investigator Profile &amp; Contact
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">PI Name</label>
            <input
              type="text"
              value={form.piName}
              onChange={(e) => setForm({ ...form, piName: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">Academic Title</label>
            <input
              type="text"
              value={form.piTitle}
              onChange={(e) => setForm({ ...form, piTitle: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">Email</label>
            <input
              type="email"
              value={form.piEmail}
              onChange={(e) => setForm({ ...form, piEmail: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">Lab Address</label>
            <input
              type="text"
              value={form.labAddress}
              onChange={(e) => setForm({ ...form, labAddress: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">Office Hours</label>
            <input
              type="text"
              value={form.officeHours}
              onChange={(e) => setForm({ ...form, officeHours: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md"
            />
          </div>
          <MediaPickerField
            label="PI Portrait"
            value={form.piPortraitUrl}
            onChange={(url) => setForm({ ...form, piPortraitUrl: url })}
            accept="image"
            mediaAssets={mediaAssets}
            onMediaUploaded={onMediaUploaded}
          />
        </div>

        <RichTextEditor
          label="PI Biography"
          value={form.piBioHtml}
          onChange={(html) => setForm({ ...form, piBioHtml: html })}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Education (one degree per line)
            </label>
            <textarea
              rows={4}
              value={eduText}
              onChange={(e) => setEduText(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Selected Honors (one per line)
            </label>
            <textarea
              rows={4}
              value={honorsText}
              onChange={(e) => setHonorsText(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-md p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
          <h2 className="font-serif text-xl font-semibold text-black">
            Lab Members &amp; Alumni Directory
          </h2>
          <button
            type="button"
            onClick={addMember}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold border border-neutral-300 rounded hover:border-black"
          >
            <Plus className="w-3.5 h-3.5" /> Add Member
          </button>
        </div>

        <div className="space-y-3">
          {form.teamMembers.map((member, idx) => (
            <div
              key={member.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-2 p-3 bg-[#FAF9F6] border border-neutral-200 rounded items-center"
            >
              <input
                type="text"
                value={member.name}
                onChange={(e) => updateMember(idx, { name: e.target.value })}
                placeholder="Name"
                className="md:col-span-3 px-2.5 py-1.5 text-xs border border-neutral-300 rounded bg-white"
              />
              <input
                type="text"
                value={member.role}
                onChange={(e) => updateMember(idx, { role: e.target.value })}
                placeholder="Role"
                className="md:col-span-3 px-2.5 py-1.5 text-xs border border-neutral-300 rounded bg-white"
              />
              <select
                value={member.category}
                onChange={(e) =>
                  updateMember(idx, { category: e.target.value as TeamMember['category'] })
                }
                className="md:col-span-2 px-2 py-1.5 text-xs border border-neutral-300 rounded bg-white"
              >
                <option>Faculty</option>
                <option>PhD Student</option>
                <option>MS Student</option>
                <option>Undergraduate</option>
                <option>Postdoctoral Researcher</option><option>Visiting Researcher</option><option>Alumni</option>
              </select>
              <input
                type="text"
                value={member.focus}
                onChange={(e) => updateMember(idx, { focus: e.target.value })}
                placeholder="Research Focus"
                className="md:col-span-3 px-2.5 py-1.5 text-xs border border-neutral-300 rounded bg-white"
              />
              <input aria-label="Member photo URL" placeholder="Approved photo URL" value={member.photoUrl || ''} onChange={e => updateMember(idx,{photoUrl:e.target.value})} className="border p-2" />
              <input aria-label="Member email" placeholder="Email" value={member.email || ''} onChange={e => updateMember(idx,{email:e.target.value})} className="border p-2" />
              <input aria-label="Member professional URL" placeholder="Professional URL" value={member.website || ''} onChange={e => updateMember(idx,{website:e.target.value})} className="border p-2" />
              <button
                type="button"
                onClick={() => removeMember(idx)}
                className="md:col-span-1 p-1.5 text-neutral-500 hover:text-red-700 justify-self-end"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <section className="bg-white border rounded-md p-6 space-y-4">
        <h2 className="font-serif text-xl">Research focus areas</h2>
        {(form.researchAreas || []).map((area, idx) => <fieldset key={area.id} className="border p-4 space-y-2">
          <label className="block">Title<input className="block border p-2 w-full" value={area.title} onChange={e => setForm({...form, researchAreas: form.researchAreas!.map((a,i) => i===idx ? {...a,title:e.target.value} : a)})} /></label>
          <label className="block">Description<textarea className="block border p-2 w-full" value={area.description} onChange={e => setForm({...form, researchAreas: form.researchAreas!.map((a,i) => i===idx ? {...a,description:e.target.value} : a)})} /></label>
          <label className="block">Approved image URL<input className="block border p-2 w-full" value={area.imageUrl} onChange={e => setForm({...form, researchAreas: form.researchAreas!.map((a,i) => i===idx ? {...a,imageUrl:e.target.value} : a)})} /></label>
          <button type="button" onClick={() => setForm({...form,researchAreas:form.researchAreas!.filter((_,i)=>i!==idx)})}>Remove area</button>
        </fieldset>)}
        <button type="button" onClick={() => setForm({...form,researchAreas:[...(form.researchAreas||[]),{id:crypto.randomUUID(),title:'',description:'',imageUrl:''}]})}>Add research area</button>
        <label className="block">Educational activities<textarea className="block border p-2 w-full" value={form.teachingOverview || ''} onChange={e => setForm({...form,teachingOverview:e.target.value})} /></label>
        <label className="block">Public review notice (clear only after approval)<textarea className="block border p-2 w-full" value={form.reviewNote || ''} onChange={e => setForm({...form,reviewNote:e.target.value})} /></label>
        <a className="block underline" href="/api/admin/public-export">Download public content for Pages</a>
        <p className="text-sm">Published and archived public records only. Private accounts and inquiries are excluded. See deployment instructions before updating Pages.</p>
      </section>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-semibold bg-black text-[#CFB991] rounded-md hover:bg-neutral-800 disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
          {saving ? 'Saving Profile...' : 'Save Site Profile & Team'}
        </button>
      </div>
    </form>
  );
};

// ========================
// CONTACT INQUIRIES
// ========================
export const InquiriesManager: React.FC<{
  items: ContactInquiry[];
  onRefresh: () => Promise<void>;
}> = ({ items, onRefresh }) => {
  const updateStatus = async (id: number, status: 'unread' | 'read' | 'archived') => {
    await api.updateInquiryStatus(id, status);
    await onRefresh();
  };

  const handleDelete = async (id: number) => {
    await api.deleteInquiry(id);
    await onRefresh();
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-neutral-600">
        Messages submitted via the public Contact page form.
      </p>
      {items.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-md p-10 text-center text-sm text-neutral-600">
          No inquiries have been submitted yet.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((inq) => (
            <div key={inq.id} className="bg-white border border-neutral-200 rounded-md p-5 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs text-neutral-500 tabular-nums">
                  <span className="font-semibold text-black">{inq.name}</span> ({inq.email}) ·{' '}
                  {inq.inquiry_type} · {inq.created_at.slice(0, 10)}
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={inq.status}
                    onChange={(e) =>
                      updateStatus(inq.id, e.target.value as 'unread' | 'read' | 'archived')
                    }
                    className="px-2 py-1 text-xs border border-neutral-300 rounded bg-white"
                  >
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                    <option value="archived">Archived</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => handleDelete(inq.id)}
                    className="p-1 text-neutral-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-serif text-lg font-semibold text-black">{inq.subject}</h3>
              <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
                {inq.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ========================
// USERS & SECURITY
// ========================
export const UsersSecurityManager: React.FC<{
  users: UserAccount[];
  currentUser: UserAccount;
  onRefresh: () => Promise<void>;
}> = ({ users, currentUser, onRefresh }) => {
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'editor'>('editor');
  const [newPass, setNewPass] = useState('');
  const [userMsg, setUserMsg] = useState('');
  const [userErr, setUserErr] = useState('');

  const [currPass, setCurrPass] = useState('');
  const [nextPass, setNextPass] = useState('');
  const [passMsg, setPassMsg] = useState('');
  const [passErr, setPassErr] = useState('');

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserErr('');
    setUserMsg('');
    try {
      await api.createUser({
        email: newEmail,
        name: newName,
        role: newRole,
        password: newPass,
      });
      setNewEmail('');
      setNewName('');
      setNewPass('');
      setUserMsg('Authorized CMS account created.');
      await onRefresh();
    } catch (err) {
      setUserErr(err instanceof Error ? err.message : 'Unable to create user');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassErr('');
    setPassMsg('');
    try {
      await api.changePassword(currPass, nextPass);
      setCurrPass('');
      setNextPass('');
      setPassMsg('Your password has been updated.');
    } catch (err) {
      setPassErr(err instanceof Error ? err.message : 'Unable to update password');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-neutral-200 rounded-md p-6 space-y-4 max-w-xl">
        <div className="flex items-center gap-2 pb-3 border-b border-neutral-200">
          <Shield className="w-4 h-4 text-[#8E6F3E]" />
          <h2 className="font-serif text-xl font-semibold text-black">Change Your Password</h2>
        </div>
        {passErr && <p className="text-xs text-red-700 bg-red-50 p-2.5 rounded">{passErr}</p>}
        {passMsg && <p className="text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded">{passMsg}</p>}
        <form onSubmit={handlePasswordChange} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currPass}
              onChange={(e) => setCurrPass(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              New Password (min 8 characters)
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={nextPass}
              onChange={(e) => setNextPass(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold bg-black text-[#CFB991] rounded-md hover:bg-neutral-800"
          >
            Update Password
          </button>
        </form>
      </div>

      {currentUser.role === 'admin' && (
        <div className="bg-white border border-neutral-200 rounded-md p-6 space-y-5">
          <h2 className="font-serif text-xl font-semibold text-black pb-3 border-b border-neutral-200">
            Authorized Contributors &amp; Role-Based Permissions
          </h2>

          <div className="overflow-x-auto border border-neutral-200 rounded">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-xs font-semibold text-neutral-600">
                  <th className="py-2.5 px-4">Name</th>
                  <th className="py-2.5 px-4">Email</th>
                  <th className="py-2.5 px-4">Role</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="py-2.5 px-4 font-medium text-black">{u.name}</td>
                    <td className="py-2.5 px-4 text-xs font-mono text-neutral-600">{u.email}</td>
                    <td className="py-2.5 px-4 text-xs capitalize font-semibold text-[#8E6F3E]">
                      {u.role === 'admin' ? 'Administrator (PI)' : 'Lab Editor'}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      {u.id !== currentUser.id && (
                        <button
                          type="button"
                          onClick={async () => {
                            await api.deleteUser(u.id);
                            await onRefresh();
                          }}
                          className="p-1 text-neutral-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <form onSubmit={handleAddUser} className="pt-4 border-t border-neutral-200 space-y-3">
            <h3 className="text-sm font-semibold text-black">Add Lab Team Contributor</h3>
            {userErr && <p className="text-xs text-red-700 bg-red-50 p-2 rounded">{userErr}</p>}
            {userMsg && <p className="text-xs text-emerald-800 bg-emerald-50 p-2 rounded">{userMsg}</p>}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="text"
                required
                placeholder="Full Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="px-3 py-2 text-xs border border-neutral-300 rounded-md"
              />
              <input
                type="email"
                required
                placeholder="member@purdue.edu"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="px-3 py-2 text-xs border border-neutral-300 rounded-md"
              />
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as 'admin' | 'editor')}
                className="px-3 py-2 text-xs border border-neutral-300 rounded-md bg-white"
              >
                <option value="editor">Lab Editor (Content &amp; Media)</option>
                <option value="admin">Administrator (Full Control)</option>
              </select>
              <input
                type="password"
                required
                minLength={8}
                placeholder="Initial Password (min 8)"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="px-3 py-2 text-xs border border-neutral-300 rounded-md"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-black text-[#CFB991] rounded-md hover:bg-neutral-800"
            >
              Create Authorized Account
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

// ========================
// REDIRECTS & BACKUPS
// ========================
export const RedirectsBackupManager: React.FC<{
  redirects: RedirectRule[];
  isAdmin: boolean;
  onRefresh: () => Promise<void>;
}> = ({ redirects, isAdmin, onRefresh }) => {
  const [fromPath, setFromPath] = useState('');
  const [toPath, setToPath] = useState('');
  const [note, setNote] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const restoreRef = useRef<HTMLInputElement>(null);

  if (!isAdmin) {
    return (
      <div className="bg-white border border-neutral-200 rounded-md p-8 text-sm text-neutral-700">
        Backups and URL redirect rules are restricted to Administrator accounts.
      </div>
    );
  }

  const handleAddRedirect = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await api.createRedirect({ from_path: fromPath, to_path: toPath, note });
      setFromPath('');
      setToPath('');
      setNote('');
      await onRefresh();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to create redirect');
    }
  };

  const handleRestoreFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg('');
    setStatusMsg('');
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      await api.restoreBackup(parsed);
      await onRefresh();
      setStatusMsg('Database snapshot restored successfully.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Restore failed');
    } finally {
      if (restoreRef.current) restoreRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-neutral-200 rounded-md p-6 space-y-4">
        <h2 className="font-serif text-xl font-semibold text-black pb-3 border-b border-neutral-200">
          Database Backup &amp; Recovery
        </h2>
        <p className="text-sm text-neutral-600">
          Download a complete portable JSON archive of all news, publications, courses, research projects, job openings, profile data, and redirects—or restore from a previous snapshot.
        </p>
        {statusMsg && <p className="text-xs text-emerald-800 bg-emerald-50 p-3 rounded">{statusMsg}</p>}
        {errorMsg && <p className="text-xs text-red-700 bg-red-50 p-3 rounded">{errorMsg}</p>}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/api/admin/backup/export"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-black text-[#CFB991] rounded-md hover:bg-neutral-800"
          >
            <Download className="w-3.5 h-3.5" />
            Download Full JSON Backup
          </a>
          <input
            ref={restoreRef}
            type="file"
            accept=".json"
            onChange={handleRestoreFile}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => restoreRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border border-neutral-300 bg-white text-black rounded-md hover:border-black"
          >
            <Upload className="w-3.5 h-3.5" />
            Restore from Backup JSON
          </button>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-md p-6 space-y-4">
        <h2 className="font-serif text-xl font-semibold text-black pb-3 border-b border-neutral-200">
          Legacy Website URL Redirects (301)
        </h2>
        <p className="text-sm text-neutral-600">
          Preserve links from your previous university website so bookmarked URLs resolve automatically without broken links.
        </p>

        <form onSubmit={handleAddRedirect} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="text"
            required
            placeholder="/old-page.html"
            value={fromPath}
            onChange={(e) => setFromPath(e.target.value)}
            className="px-3 py-2 text-xs font-mono border border-neutral-300 rounded-md"
          />
          <input
            type="text"
            required
            placeholder="/publications"
            value={toPath}
            onChange={(e) => setToPath(e.target.value)}
            className="px-3 py-2 text-xs font-mono border border-neutral-300 rounded-md"
          />
          <input
            type="text"
            placeholder="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="px-3 py-2 text-xs border border-neutral-300 rounded-md"
          />
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold bg-black text-[#CFB991] rounded-md hover:bg-neutral-800"
          >
            Add 301 Redirect
          </button>
        </form>

        <div className="border border-neutral-200 rounded overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 font-semibold text-neutral-600">
                <th className="py-2.5 px-4">Legacy Path</th>
                <th className="py-2.5 px-4">Target Route</th>
                <th className="py-2.5 px-4">Note</th>
                <th className="py-2.5 px-4 text-right">Remove</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {redirects.map((r) => (
                <tr key={r.id}>
                  <td className="py-2.5 px-4 font-mono text-black">{r.from_path}</td>
                  <td className="py-2.5 px-4 font-mono text-[#8E6F3E]">{r.to_path}</td>
                  <td className="py-2.5 px-4 text-neutral-600">{r.note}</td>
                  <td className="py-2.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={async () => {
                        await api.deleteRedirect(r.id);
                        await onRefresh();
                      }}
                      className="p-1 text-neutral-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ========================
// ADMIN GUIDE & ARCHITECTURE
// ========================
export const AdminGuideView: React.FC = () => {
  return (
    <div className="bg-white border border-neutral-200 rounded-md p-7 space-y-6 max-w-4xl">
      <div className="flex items-center gap-2 pb-4 border-b border-neutral-200">
        <BookOpen className="w-5 h-5 text-[#8E6F3E]" />
        <h2 className="font-serif text-2xl font-semibold text-black">
          Administrative Operations &amp; Architecture Guide
        </h2>
      </div>

      <div className="space-y-4 text-sm text-neutral-700 leading-relaxed">
        <h3 className="font-serif text-lg font-semibold text-black">
          1. Routine Content Updates (No Coding Required)
        </h3>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong>Publish News:</strong> Open <em>News &amp; Announcements</em>, click <em>New Announcement</em>, compose with the rich-text toolbar, upload or select a photo, click <em>Preview</em> to verify formatting, and set status to <em>Published</em>. Check <em>Feature on Home Page</em> to display it on the homepage.
          </li>
          <li>
            <strong>Add a Publication:</strong> Open <em>Publications</em>, enter authors, year, venue, abstract, DOI, and optionally upload a permitted preprint PDF directly via <em>Upload File</em>.
          </li>
          <li>
            <strong>Update Ongoing Research:</strong> Open <em>Research Projects</em>, edit any ongoing project to update its <em>Ongoing Progress Notes</em>, methodology, or linked publications, or use <em>Completed</em> or <em>Archived</em> as appropriate.
          </li>
          <li>
            <strong>Manage Courses &amp; Lab Positions:</strong> Use <em>Courses &amp; Teaching</em> to upload syllabi and archive past semesters, and <em>Lab Opportunities</em> to open, update deadlines, or mark positions as <em>Filled</em> or <em>Closed</em>.
          </li>
        </ul>

        <h3 className="font-serif text-lg font-semibold text-black pt-3">
          2. Recommended Architecture, Hosting &amp; Maintenance
        </h3>
        <p>
          This platform uses a unified TypeScript architecture: a React + Tailwind CSS frontend served alongside an Express API and relational SQLite database (<code>data/purdue_lab_cms.db</code>) with local persistent disk storage for uploaded PDFs and imagery (<code>data/uploads/</code>).
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong>Low Maintenance &amp; Cost:</strong> Requires zero external paid SaaS CMS subscriptions and runs on a single Node.js 24+ container or university virtual machine behind HTTPS (e.g., Purdue Engineering web hosting, Cloud Run with persistent volume, or a standard Linux VPS with Nginx/Caddy).
          </li>
          <li>
            <strong>Security &amp; RBAC:</strong> Passwords are salted and hashed using <code>scrypt</code>; sessions use HMAC-SHA256 signed <code>HttpOnly</code> cookies. Administrator accounts control publishing, team roles, site profile, redirects, and backups.
          </li>
          <li>
            <strong>Backups &amp; Recovery:</strong> Visit <em>Redirects &amp; Backups</em> regularly to export a portable JSON archive of all laboratory records.
          </li>
        </ul>
      </div>
    </div>
  );
};
