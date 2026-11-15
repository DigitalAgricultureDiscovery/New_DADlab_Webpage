import React, { useRef, useState } from 'react';
import { Plus, Eye, Trash2, Edit3, Upload, Copy, Check, FileText } from 'lucide-react';
import { api } from '../../lib/api';
import { RichTextEditor } from '../../components/RichTextEditor';
import { MediaPickerField } from '../../components/MediaPickerField';
import { formatFileSize } from '../../lib/htmlUtils';
import { resolveMediaUrl } from '../../lib/mediaAssets';
import type { PreviewPayload } from './PreviewModal';
import type {
  CourseItem,
  CourseStatus,
  OpportunityItem,
  AppointmentType,
  PositionStatus,
  MediaAsset,
} from '../../types/cms';

// ========================
// COURSES MANAGER
// ========================
interface CoursesManagerProps {
  items: CourseItem[];
  mediaAssets: MediaAsset[];
  onMediaUploaded: (asset: MediaAsset) => void;
  onRefresh: () => Promise<void>;
  onPreview: (p: PreviewPayload) => void;
}

export const CoursesManager: React.FC<CoursesManagerProps> = ({
  items,
  mediaAssets,
  onMediaUploaded,
  onRefresh,
  onPreview,
}) => {
  const [editing, setEditing] = useState<Partial<CourseItem> | null>(null);
  const [topicsText, setTopicsText] = useState('');
  const [objectivesText, setObjectivesText] = useState('');
  const [saving, setSaving] = useState(false);

  const openEditor = (course?: CourseItem) => {
    if (course) {
      setEditing(course);
      setTopicsText(course.topics.join('\n'));
      setObjectivesText(course.objectives.join('\n'));
    } else {
      setEditing({
        course_number: '',
        title: '',
        semester: '',
        academic_year: '',
        description_html: '<p></p>',
        topics: [],
        objectives: [],
        syllabus_url: '',
        materials: [],
        university_catalog_url: 'https://selfservice.mypurdue.purdue.edu',
        status: 'draft',
        featured_on_home: false,
      });
      setTopicsText('');
      setObjectivesText('');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    const payload: Partial<CourseItem> = {
      ...editing,
      topics: topicsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      objectives: objectivesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    };
    try {
      if (editing.id) {
        await api.updateCourse(editing.id, payload);
      } else {
        await api.createCourse(payload);
      }
      await onRefresh();
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  const quickStatus = async (course: CourseItem, status: CourseStatus) => {
    await api.updateCourse(course.id, { status });
    await onRefresh();
  };

  const handleDelete = async (id: number) => {
    await api.deleteCourse(id);
    await onRefresh();
  };

  if (editing) {
    return (
      <form onSubmit={handleSave} className="bg-white border border-neutral-200 rounded-md p-6 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
          <h2 className="font-serif text-xl font-semibold text-black">
            {editing.id ? 'Edit Course' : 'Add Purdue Course'}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                onPreview({
                  type: 'course',
                  item: {
                    ...editing,
                    topics: topicsText.split('\n').filter(Boolean),
                    objectives: objectivesText.split('\n').filter(Boolean),
                  },
                })
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-neutral-300 rounded hover:border-black"
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="text-xs text-neutral-600 hover:text-black px-2"
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Course Number
            </label>
            <input
              type="text"
              required
              value={editing.course_number || ''}
              onChange={(e) => setEditing({ ...editing, course_number: e.target.value })}
              placeholder="Course number"
              className="w-full px-3 py-2 text-sm font-mono border border-neutral-300 rounded-md focus:outline-none focus:border-black"
            />
          </div>
          <div className="md:col-span-5">
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Course Title
            </label>
            <input
              type="text"
              required
              value={editing.title || ''}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:border-black"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-neutral-800 mb-1">Semester</label>
            <select
              value={editing.semester || 'Fall'}
              onChange={(e) => setEditing({ ...editing, semester: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md bg-white"
            >
              <option>Fall</option>
              <option>Spring</option>
              <option>Summer</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Academic Year
            </label>
            <input
              type="text"
              required
              value={editing.academic_year || ''}
              onChange={(e) => setEditing({ ...editing, academic_year: e.target.value })}
              placeholder="2026–2027"
              className="w-full px-3 py-2 text-sm font-mono border border-neutral-300 rounded-md focus:outline-none focus:border-black"
            />
          </div>
        </div>

        <RichTextEditor
          label="Course Description"
          value={editing.description_html || ''}
          onChange={(html) => setEditing({ ...editing, description_html: html })}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Topics Covered (one topic per line)
            </label>
            <textarea
              rows={5}
              value={topicsText}
              onChange={(e) => setTopicsText(e.target.value)}
              placeholder="Hybrid Automata&#10;Control Barrier Functions&#10;Real-Time Scheduling"
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Course Objectives (one objective per line)
            </label>
            <textarea
              rows={5}
              value={objectivesText}
              onChange={(e) => setObjectivesText(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:border-black"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MediaPickerField
            label="Syllabus PDF / Supporting Document"
            value={editing.syllabus_url || ''}
            onChange={(url) => setEditing({ ...editing, syllabus_url: url })}
            accept="pdf"
            mediaAssets={mediaAssets}
            onMediaUploaded={onMediaUploaded}
          />
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Purdue Course Catalog URL
            </label>
            <input
              type="url"
              value={editing.university_catalog_url || ''}
              onChange={(e) => setEditing({ ...editing, university_catalog_url: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:border-black"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
          <div className="flex items-center gap-4">
            <select
              value={editing.status || 'active'}
              onChange={(e) => setEditing({ ...editing, status: e.target.value as CourseStatus })}
              className="px-3 py-2 text-xs border border-neutral-300 rounded-md bg-white"
            >
              <option value="active">Active (Current Offering)</option>
              <option value="archived">Archived (Past Course)</option>
              <option value="draft">Draft (Hidden)</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 text-xs font-semibold bg-black text-[#CFB991] rounded-md hover:bg-neutral-800 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Course'}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-neutral-600">
          Maintain Purdue University course offerings, syllabi, learning objectives, and archived courses.
        </p>
        <button
          type="button"
          onClick={() => openEditor()}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-black text-[#CFB991] rounded-md hover:bg-neutral-800 whitespace-nowrap shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Course
        </button>
      </div>

      <div className="bg-white border border-neutral-200 rounded-md overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold text-neutral-600">
              <th className="py-3 px-4">Course #</th>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Term</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {items.map((course) => (
              <tr key={course.id} className="hover:bg-neutral-50/70">
                <td className="py-3 px-4 font-mono text-xs font-semibold text-[#8E6F3E]">
                  {course.course_number}
                </td>
                <td className="py-3 px-4 font-medium text-black">{course.title}</td>
                <td className="py-3 px-4 text-xs text-neutral-600 tabular-nums">
                  {course.semester} {course.academic_year}
                </td>
                <td className="py-3 px-4 text-xs">
                  <select
                    value={course.status}
                    onChange={(e) => quickStatus(course, e.target.value as CourseStatus)}
                    className="px-2 py-1 text-xs border border-neutral-300 rounded bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                    <option value="draft">Draft</option>
                  </select>
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                  <button
                    type="button"
                    onClick={() => onPreview({ type: 'course', item: course })}
                    className="p-1.5 text-neutral-600 hover:text-black"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openEditor(course)}
                    className="p-1.5 text-neutral-600 hover:text-black"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(course.id)}
                    className="p-1.5 text-neutral-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ========================
// OPPORTUNITIES MANAGER
// ========================
interface OpportunitiesManagerProps {
  items: OpportunityItem[];
  onRefresh: () => Promise<void>;
  onPreview: (p: PreviewPayload) => void;
}

export const OpportunitiesManager: React.FC<OpportunitiesManagerProps> = ({
  items,
  onRefresh,
  onPreview,
}) => {
  const [editing, setEditing] = useState<Partial<OpportunityItem> | null>(null);
  const [saving, setSaving] = useState(false);

  const startNew = () => {
    setEditing({
      title: '',
      appointment_type: 'Graduate Research',
      description_html: '<p></p>',
      qualifications_html: '<ul><li></li></ul>',
      responsibilities_html: '<ul><li></li></ul>',
      application_instructions: '',
      application_url: '',
      deadline: 'Open until filled',
      position_status: 'Open',
      featured_on_home: true,
      publish_status: 'published',
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) {
        await api.updateOpportunity(editing.id, editing);
      } else {
        await api.createOpportunity(editing);
      }
      await onRefresh();
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  const quickStatus = async (opp: OpportunityItem, position_status: PositionStatus) => {
    await api.updateOpportunity(opp.id, { position_status });
    await onRefresh();
  };

  const handleDelete = async (id: number) => {
    await api.deleteOpportunity(id);
    await onRefresh();
  };

  if (editing) {
    return (
      <form onSubmit={handleSave} className="bg-white border border-neutral-200 rounded-md p-6 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
          <h2 className="font-serif text-xl font-semibold text-black">
            {editing.id ? 'Edit Laboratory Position' : 'Post Laboratory Opening'}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPreview({ type: 'opportunity', item: editing })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-neutral-300 rounded hover:border-black"
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="text-xs text-neutral-600 hover:text-black px-2"
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6">
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Position Title
            </label>
            <input
              type="text"
              required
              value={editing.title || ''}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:border-black"
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Appointment Type
            </label>
            <select
              value={editing.appointment_type || 'Graduate Research'}
              onChange={(e) =>
                setEditing({ ...editing, appointment_type: e.target.value as AppointmentType })
              }
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md bg-white"
            >
              <option>Hourly Student Research</option>
              <option>Undergraduate Research</option>
              <option>Graduate Research</option>
              <option>Research Assistantship</option>
              <option>Full-Time Research</option>
              <option>Postdoctoral / Other</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Application Deadline
            </label>
            <input
              type="text"
              value={editing.deadline || ''}
              onChange={(e) => setEditing({ ...editing, deadline: e.target.value })}
              placeholder="2027-01-15 or Open until filled"
              className="w-full px-3 py-2 text-sm font-mono border border-neutral-300 rounded-md focus:outline-none focus:border-black"
            />
          </div>
        </div>

        <RichTextEditor
          label="Job Description"
          value={editing.description_html || ''}
          onChange={(html) => setEditing({ ...editing, description_html: html })}
          minHeightClass="min-h-[120px]"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RichTextEditor
            label="Required Qualifications & Preferred Skills"
            value={editing.qualifications_html || ''}
            onChange={(html) => setEditing({ ...editing, qualifications_html: html })}
            minHeightClass="min-h-[120px]"
          />
          <RichTextEditor
            label="Expected Responsibilities"
            value={editing.responsibilities_html || ''}
            onChange={(html) => setEditing({ ...editing, responsibilities_html: html })}
            minHeightClass="min-h-[120px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Application Instructions
            </label>
            <textarea
              rows={2}
              required
              value={editing.application_instructions || ''}
              onChange={(e) =>
                setEditing({ ...editing, application_instructions: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              External Application URL (optional)
            </label>
            <input
              type="url"
              value={editing.application_url || ''}
              onChange={(e) => setEditing({ ...editing, application_url: e.target.value })}
              placeholder="https://www.purdue.edu/gradschool/"
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:border-black"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-neutral-200">
          <div className="flex flex-wrap items-center gap-4">
            <select
              value={editing.position_status || 'Open'}
              onChange={(e) =>
                setEditing({ ...editing, position_status: e.target.value as PositionStatus })
              }
              className="px-3 py-2 text-xs border border-neutral-300 rounded-md bg-white"
            >
              <option value="Open">Status: Open</option>
              <option value="Closed">Status: Closed</option>
              <option value="Filled">Status: Filled</option>
              <option value="Archived">Status: Archived (Hidden)</option>
            </select>
            <select
              value={editing.publish_status || 'published'}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  publish_status: e.target.value as 'draft' | 'published',
                })
              }
              className="px-3 py-2 text-xs border border-neutral-300 rounded-md bg-white"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 text-xs font-semibold bg-black text-[#CFB991] rounded-md hover:bg-neutral-800 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Position'}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-neutral-600">
          Post undergraduate, graduate, hourly, and full-time openings, update deadlines, or mark filled.
        </p>
        <button
          type="button"
          onClick={startNew}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-black text-[#CFB991] rounded-md hover:bg-neutral-800 whitespace-nowrap shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          Post Position
        </button>
      </div>

      <div className="bg-white border border-neutral-200 rounded-md overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold text-neutral-600">
              <th className="py-3 px-4">Position Title</th>
              <th className="py-3 px-4">Appointment</th>
              <th className="py-3 px-4">Deadline</th>
              <th className="py-3 px-4">Position Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {items.map((opp) => (
              <tr key={opp.id} className="hover:bg-neutral-50/70">
                <td className="py-3 px-4 font-medium text-black">{opp.title}</td>
                <td className="py-3 px-4 text-xs text-neutral-600">{opp.appointment_type}</td>
                <td className="py-3 px-4 text-xs font-mono tabular-nums text-neutral-600">
                  {opp.deadline || '—'}
                </td>
                <td className="py-3 px-4 text-xs">
                  <select
                    value={opp.position_status}
                    onChange={(e) => quickStatus(opp, e.target.value as PositionStatus)}
                    className="px-2 py-1 text-xs border border-neutral-300 rounded bg-white"
                  >
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                    <option value="Filled">Filled</option>
                    <option value="Archived">Archived</option>
                  </select>
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                  <button
                    type="button"
                    onClick={() => onPreview({ type: 'opportunity', item: opp })}
                    className="p-1.5 text-neutral-600 hover:text-black"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(opp)}
                    className="p-1.5 text-neutral-600 hover:text-black"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(opp.id)}
                    className="p-1.5 text-neutral-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ========================
// MEDIA & DOCUMENTS MANAGER
// ========================
interface MediaManagerProps {
  items: MediaAsset[];
  onRefresh: () => Promise<void>;
}

export const MediaManager: React.FC<MediaManagerProps> = ({ items, onRefresh }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });
      await api.uploadMedia({
        filename: file.name,
        mimeType: file.type || 'application/octet-stream',
        dataBase64: base64,
      });
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const copyUrl = async (asset: MediaAsset) => {
    await navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleDelete = async (id: number) => {
    await api.deleteMedia(id);
    await onRefresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-neutral-600">
          Upload laboratory photos, research figures, course syllabi (PDF), and manuscript preprints (up to 12 MB).
        </p>
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,.pdf,.txt,.bib,.docx"
            onChange={handleUpload}
            className="hidden"
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-black text-[#CFB991] rounded-md hover:bg-neutral-800 disabled:opacity-50"
          >
            <Upload className="w-3.5 h-3.5" />
            {uploading ? 'Uploading...' : 'Upload Image or PDF'}
          </button>
        </div>
      </div>

      {error && <p className="text-xs text-red-700 bg-red-50 p-3 rounded">{error}</p>}

      {items.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-md p-10 text-center space-y-2">
          <p className="text-sm text-neutral-600">
            No custom uploaded files yet. Upload a PDF syllabus, paper preprint, or photo to store it in the repository.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((asset) => (
            <div
              key={asset.id}
              className="bg-white border border-neutral-200 rounded-md overflow-hidden flex flex-col justify-between"
            >
              <div className="h-36 bg-neutral-100 border-b border-neutral-200 flex items-center justify-center overflow-hidden">
                {asset.category === 'image' ? (
                  <img
                    src={resolveMediaUrl(asset.url)}
                    alt={asset.original_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <FileText className="w-8 h-8 text-[#8E6F3E] mx-auto mb-1" />
                    <span className="text-[11px] font-mono uppercase text-neutral-600">
                      {asset.category}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4 space-y-2">
                <p className="text-xs font-semibold text-black truncate" title={asset.original_name}>
                  {asset.original_name}
                </p>
                <p className="text-[11px] font-mono text-neutral-500 tabular-nums">
                  {formatFileSize(asset.size_bytes)} · {asset.created_at.slice(0, 10)}
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => copyUrl(asset)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#8E6F3E] hover:text-black"
                  >
                    {copiedId === asset.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied URL
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Path
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(asset.id)}
                    className="p-1 text-neutral-500 hover:text-red-700"
                    title="Delete file"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
