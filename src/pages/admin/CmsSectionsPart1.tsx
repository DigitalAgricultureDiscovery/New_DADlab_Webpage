import React, { useState } from 'react';
import { Plus, Eye, Trash2, Edit3, Check, X } from 'lucide-react';
import { api } from '../../lib/api';
import { RichTextEditor } from '../../components/RichTextEditor';
import { MediaPickerField } from '../../components/MediaPickerField';
import type { PreviewPayload } from './PreviewModal';
import type {
  NewsItem,
  NewsCategory,
  PublishStatus,
  PublicationItem,
  PublicationType,
  ResearchProjectItem,
  MediaAsset,
} from '../../types/cms';

// ========================
// NEWS MANAGER
// ========================
interface NewsManagerProps {
  items: NewsItem[];
  mediaAssets: MediaAsset[];
  onMediaUploaded: (asset: MediaAsset) => void;
  onRefresh: () => Promise<void>;
  onPreview: (p: PreviewPayload) => void;
  authorName: string;
}

export const NewsManager: React.FC<NewsManagerProps> = ({
  items,
  mediaAssets,
  onMediaUploaded,
  onRefresh,
  onPreview,
  authorName,
}) => {
  const [editing, setEditing] = useState<Partial<NewsItem> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const startNew = () => {
    setError('');
    setEditing({
      title: '',
      category: 'Announcement',
      published_date: new Date().toISOString().slice(0, 10),
      summary: '',
      content_html: '<p></p>',
      image_url: '',
      image_caption: '',
      featured_on_home: true,
      status: 'draft',
      author_name: authorName,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setError('');
    try {
      if (editing.id) {
        await api.updateNews(editing.id, editing);
      } else {
        await api.createNews(editing);
      }
      await onRefresh();
      setEditing(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const quickStatus = async (item: NewsItem, status: PublishStatus) => {
    await api.updateNews(item.id, { status });
    await onRefresh();
  };

  const handleDelete = async (id: number) => {
    await api.deleteNews(id);
    await onRefresh();
  };

  if (editing) {
    return (
      <form onSubmit={handleSave} className="bg-white border border-neutral-200 rounded-md p-6 space-y-5">
        <label className="block text-sm">Source URL<input type="url" className="block border p-2 w-full" value={editing.source_url || ''} onChange={e => setEditing({...editing,source_url:e.target.value})} /></label>
        <label className="block text-sm">Attachment links (one URL per line)<textarea className="block border p-2 w-full" value={(editing.attachments || []).map(a=>a.url).join('\n')} onChange={e=>setEditing({...editing,attachments:e.target.value.split('\n').map(url=>({label:'Download resource',url}))})} /></label>
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-200">
          <h2 className="font-serif text-xl font-semibold text-black">
            {editing.id ? 'Edit News Announcement' : 'New News Announcement'}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPreview({ type: 'news', item: editing })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-neutral-300 rounded hover:border-black"
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:text-black"
            >
              <X className="w-3.5 h-3.5" />
              Cancel
            </button>
          </div>
        </div>

        {error && <p className="text-xs text-red-700 bg-red-50 p-2.5 rounded">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6">
            <label className="block text-xs font-semibold text-neutral-800 mb-1">Title</label>
            <input
              type="text"
              required
              value={editing.title || ''}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:border-black"
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-neutral-800 mb-1">Category</label>
            <select
              value={editing.category || 'Announcement'}
              onChange={(e) => setEditing({ ...editing, category: e.target.value as NewsCategory })}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md bg-white focus:outline-none focus:border-black"
            >
              <option>Award</option>
              <option>Conference</option>
              <option>Student Achievement</option>
              <option>Research Development</option>
              <option>Announcement</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Publication Date
            </label>
            <input
              type="date"
              required
              value={editing.published_date || ''}
              onChange={(e) => setEditing({ ...editing, published_date: e.target.value })}
              className="w-full px-3 py-2 text-sm font-mono border border-neutral-300 rounded-md focus:outline-none focus:border-black"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-800 mb-1">
            Short Summary (displayed in news listings and home page)
          </label>
          <textarea
            rows={2}
            required
            value={editing.summary || ''}
            onChange={(e) => setEditing({ ...editing, summary: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:border-black"
          />
        </div>

        <RichTextEditor
          label="Full Announcement Body"
          value={editing.content_html || ''}
          onChange={(html) => setEditing({ ...editing, content_html: html })}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MediaPickerField
            label="Optional Feature Image"
            value={editing.image_url || ''}
            onChange={(url) => setEditing({ ...editing, image_url: url })}
            accept="image"
            mediaAssets={mediaAssets}
            onMediaUploaded={onMediaUploaded}
          />
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Image Caption (optional)
            </label>
            <input
              type="text"
              value={editing.image_caption || ''}
              onChange={(e) => setEditing({ ...editing, image_caption: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:border-black"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-neutral-200 items-center">
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Publication Status
            </label>
            <select
              value={editing.status || 'draft'}
              onChange={(e) => setEditing({ ...editing, status: e.target.value as PublishStatus })}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md bg-white focus:outline-none focus:border-black"
            >
              <option value="draft">Draft (Hidden from Public)</option>
              <option value="published">Published (Live)</option>
              <option value="archived">Archived (News Archive)</option>
            </select>
          </div>

          <label className="inline-flex items-center gap-2 text-xs font-medium text-neutral-800 pt-4 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(editing.featured_on_home)}
              onChange={(e) => setEditing({ ...editing, featured_on_home: e.target.checked })}
              className="rounded border-neutral-300"
            />
            Feature on Home Page
          </label>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold bg-black text-[#CFB991] rounded-md hover:bg-neutral-800 disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              {saving ? 'Saving...' : 'Save Announcement'}
            </button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-neutral-600">
          Manage chronological laboratory dispatches, awards, and archived announcements.
        </p>
        <button
          type="button"
          onClick={startNew}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-black text-[#CFB991] rounded-md hover:bg-neutral-800 whitespace-nowrap shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          New Announcement
        </button>
      </div>

      <div className="bg-white border border-neutral-200 rounded-md overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold text-neutral-600">
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Title &amp; Category</th>
              <th className="py-3 px-4">Home</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-neutral-50/70">
                <td className="py-3 px-4 font-mono text-xs tabular-nums text-neutral-600 whitespace-nowrap">
                  {item.published_date}
                </td>
                <td className="py-3 px-4">
                  <p className="font-medium text-black">{item.title}</p>
                  <p className="text-xs text-neutral-500">{item.category}</p>
                </td>
                <td className="py-3 px-4 text-xs text-neutral-600">
                  {item.featured_on_home ? 'Yes' : 'No'}
                </td>
                <td className="py-3 px-4 text-xs">
                  <select
                    value={item.status}
                    onChange={(e) => quickStatus(item, e.target.value as PublishStatus)}
                    aria-label={`Change status for ${item.title}`}
                    className="px-2 py-1 text-xs border border-neutral-300 rounded bg-white"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                  <button
                    type="button"
                    onClick={() => onPreview({ type: 'news', item })}
                    title="Preview"
                    className="p-1.5 text-neutral-600 hover:text-black"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(item)}
                    title="Edit"
                    className="p-1.5 text-neutral-600 hover:text-black"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    title="Delete"
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
// PUBLICATIONS MANAGER
// ========================
interface PublicationsManagerProps {
  items: PublicationItem[];
  mediaAssets: MediaAsset[];
  onMediaUploaded: (asset: MediaAsset) => void;
  onRefresh: () => Promise<void>;
  onPreview: (p: PreviewPayload) => void;
}

export const PublicationsManager: React.FC<PublicationsManagerProps> = ({
  items,
  mediaAssets,
  onMediaUploaded,
  onRefresh,
  onPreview,
}) => {
  const [editing, setEditing] = useState<Partial<PublicationItem> | null>(null);
  const [saving, setSaving] = useState(false);

  const startNew = () => {
    setEditing({
      title: '',
      authors: '',
      year: new Date().getFullYear(),
      venue: '',
      pub_type: 'Journal Article',
      topic: 'Autonomous Control',
      abstract: '',
      doi_url: '',
      publisher_url: '',
      pdf_url: '',
      bibtex: '',
      featured_on_home: true,
      status: 'published',
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) {
        await api.updatePublication(editing.id, editing);
      } else {
        await api.createPublication(editing);
      }
      await onRefresh();
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    await api.deletePublication(id);
    await onRefresh();
  };

  if (editing) {
    return (
      <form onSubmit={handleSave} className="bg-white border border-neutral-200 rounded-md p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
          <h2 className="font-serif text-xl font-semibold text-black">
            {editing.id ? 'Edit Publication' : 'Add Research Publication'}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPreview({ type: 'publication', item: editing })}
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
          <div className="md:col-span-9">
            <label className="block text-xs font-semibold text-neutral-800 mb-1">Paper Title</label>
            <input
              type="text"
              required
              value={editing.title || ''}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:border-black"
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-neutral-800 mb-1">Year</label>
            <input
              type="number"
              required
              value={editing.year || 2026}
              onChange={(e) => setEditing({ ...editing, year: Number(e.target.value) })}
              className="w-full px-3 py-2 text-sm font-mono border border-neutral-300 rounded-md focus:outline-none focus:border-black"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">Authors</label>
            <input
              type="text"
              required
              value={editing.authors || ''}
              onChange={(e) => setEditing({ ...editing, authors: e.target.value })}
              placeholder="M. Chen, E. Saraswat"
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Journal or Conference Venue
            </label>
            <input
              type="text"
              required
              value={editing.venue || ''}
              onChange={(e) => setEditing({ ...editing, venue: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:border-black"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Publication Type
            </label>
            <select
              value={editing.pub_type || 'Journal Article'}
              onChange={(e) => setEditing({ ...editing, pub_type: e.target.value as PublicationType })}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md bg-white focus:outline-none focus:border-black"
            >
              <option>Journal Article</option>
              <option>Conference Paper</option>
              <option>Workshop</option>
              <option>Book Chapter</option>
              <option>Preprint</option>
              <option>Technical Report</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">Research Topic</label>
            <input
              type="text"
              required
              value={editing.topic || ''}
              onChange={(e) => setEditing({ ...editing, topic: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">Visibility</label>
            <select
              value={editing.status || 'published'}
              onChange={(e) =>
                setEditing({ ...editing, status: e.target.value as 'draft' | 'published' })
              }
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md bg-white focus:outline-none focus:border-black"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-800 mb-1">Abstract</label>
          <textarea
            rows={4}
            required
            value={editing.abstract || ''}
            onChange={(e) => setEditing({ ...editing, abstract: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:border-black"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">DOI URL</label>
            <input
              type="url"
              value={editing.doi_url || ''}
              onChange={(e) => setEditing({ ...editing, doi_url: e.target.value })}
              placeholder="https://doi.org/..."
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Publisher Website URL
            </label>
            <input
              type="url"
              value={editing.publisher_url || ''}
              onChange={(e) => setEditing({ ...editing, publisher_url: e.target.value })}
              placeholder="https://ieeexplore.ieee.org/..."
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:border-black"
            />
          </div>
        </div>

        <MediaPickerField
          label="PDF Preprint / Manuscript (upload or link)"
          value={editing.pdf_url || ''}
          onChange={(url) => setEditing({ ...editing, pdf_url: url })}
          accept="pdf"
          mediaAssets={mediaAssets}
          onMediaUploaded={onMediaUploaded}
        />

        <div>
          <label className="block text-xs font-semibold text-neutral-800 mb-1">
            BibTeX Entry (optional)
          </label>
          <textarea
            rows={3}
            value={editing.bibtex || ''}
            onChange={(e) => setEditing({ ...editing, bibtex: e.target.value })}
            className="w-full px-3 py-2 font-mono text-xs border border-neutral-300 rounded-md focus:outline-none focus:border-black"
          />
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
          <label className="inline-flex items-center gap-2 text-xs font-medium text-neutral-800 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(editing.featured_on_home)}
              onChange={(e) => setEditing({ ...editing, featured_on_home: e.target.checked })}
            />
            Display in Recent Publications on Home Page
          </label>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 text-xs font-semibold bg-black text-[#CFB991] rounded-md hover:bg-neutral-800 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Publication'}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-neutral-600">
          Add peer-reviewed articles, conference papers, DOIs, and permitted PDF manuscripts.
        </p>
        <button
          type="button"
          onClick={startNew}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-black text-[#CFB991] rounded-md hover:bg-neutral-800 whitespace-nowrap shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Publication
        </button>
      </div>

      <div className="bg-white border border-neutral-200 rounded-md overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold text-neutral-600">
              <th className="py-3 px-4">Year</th>
              <th className="py-3 px-4">Title &amp; Authors</th>
              <th className="py-3 px-4">Type / Topic</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {items.map((pub) => (
              <tr key={pub.id} className="hover:bg-neutral-50/70">
                <td className="py-3 px-4 font-mono text-xs tabular-nums font-semibold">
                  {pub.year}
                </td>
                <td className="py-3 px-4">
                  <p className="font-medium text-black">{pub.title}</p>
                  <p className="text-xs text-neutral-500">
                    {pub.authors} · {pub.venue}
                  </p>
                </td>
                <td className="py-3 px-4 text-xs text-neutral-600">
                  {pub.pub_type} · {pub.topic}
                </td>
                <td className="py-3 px-4 text-xs capitalize">{pub.status}</td>
                <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                  <button
                    type="button"
                    onClick={() => onPreview({ type: 'publication', item: pub })}
                    className="p-1.5 text-neutral-600 hover:text-black"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(pub)}
                    className="p-1.5 text-neutral-600 hover:text-black"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(pub.id)}
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
// RESEARCH PROJECTS MANAGER
// ========================
interface ProjectsManagerProps {
  items: ResearchProjectItem[];
  publications: PublicationItem[];
  mediaAssets: MediaAsset[];
  onMediaUploaded: (asset: MediaAsset) => void;
  onRefresh: () => Promise<void>;
  onPreview: (p: PreviewPayload) => void;
}

export const ProjectsManager: React.FC<ProjectsManagerProps> = ({
  items,
  publications,
  mediaAssets,
  onMediaUploaded,
  onRefresh,
  onPreview,
}) => {
  const [editing, setEditing] = useState<Partial<ResearchProjectItem> | null>(null);
  const [saving, setSaving] = useState(false);

  const startNew = () => {
    setEditing({
      title: '',
      research_area: 'Autonomous Control & Verification',
      overview: '',
      objectives_html: '<ul><li>Define research objective</li></ul>',
      methodology_html: '<p>Describe technical approach...</p>',
      progress_notes: '',
      image_url: '',
      image_caption: '',
      project_status: 'ongoing',
      related_publication_ids: [],
      collaborators: '',
      funding_info: '',
      featured_on_home: true,
      publish_status: 'published',
    });
  };

  const togglePubId = (pubId: number) => {
    if (!editing) return;
    const current = editing.related_publication_ids || [];
    const next = current.includes(pubId)
      ? current.filter((id) => id !== pubId)
      : [...current, pubId];
    setEditing({ ...editing, related_publication_ids: next });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) {
        await api.updateProject(editing.id, editing);
      } else {
        await api.createProject(editing);
      }
      await onRefresh();
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    await api.deleteProject(id);
    await onRefresh();
  };

  if (editing) {
    return (
      <form onSubmit={handleSave} className="bg-white border border-neutral-200 rounded-md p-6 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
          <h2 className="font-serif text-xl font-semibold text-black">
            {editing.id ? 'Edit Research Project' : 'New Research Project'}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPreview({ type: 'project', item: editing })}
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
              Project Title
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
              Research Area
            </label>
            <input
              type="text"
              required
              value={editing.research_area || ''}
              onChange={(e) => setEditing({ ...editing, research_area: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:border-black"
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Research Status
            </label>
            <select
              value={editing.project_status || 'ongoing'}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  project_status: e.target.value as 'ongoing' | 'completed' | 'archived',
                })
              }
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md bg-white focus:outline-none focus:border-black"
            >
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived / historical theme</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-800 mb-1">
            Brief Research Overview
          </label>
          <textarea
            rows={2}
            required
            value={editing.overview || ''}
            onChange={(e) => setEditing({ ...editing, overview: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-800 mb-1">
            Ongoing Progress Notes (editable as research evolves)
          </label>
          <textarea
            rows={2}
            value={editing.progress_notes || ''}
            onChange={(e) => setEditing({ ...editing, progress_notes: e.target.value })}
            placeholder="Research progress, status confirmation, or historical context"
            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:border-black"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RichTextEditor
            label="Research Objectives"
            value={editing.objectives_html || ''}
            onChange={(html) => setEditing({ ...editing, objectives_html: html })}
            minHeightClass="min-h-[140px]"
          />
          <RichTextEditor
            label="Methodology & Technical Approach"
            value={editing.methodology_html || ''}
            onChange={(html) => setEditing({ ...editing, methodology_html: html })}
            minHeightClass="min-h-[140px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MediaPickerField
            label="Project Figure / Laboratory Photo"
            value={editing.image_url || ''}
            onChange={(url) => setEditing({ ...editing, image_url: url })}
            accept="image"
            mediaAssets={mediaAssets}
            onMediaUploaded={onMediaUploaded}
          />
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Figure Caption
            </label>
            <input
              type="text"
              value={editing.image_caption || ''}
              onChange={(e) => setEditing({ ...editing, image_caption: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:border-black"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Collaborators (optional)
            </label>
            <input
              type="text"
              value={editing.collaborators || ''}
              onChange={(e) => setEditing({ ...editing, collaborators: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Funding &amp; Sponsors (optional)
            </label>
            <input
              type="text"
              value={editing.funding_info || ''}
              onChange={(e) => setEditing({ ...editing, funding_info: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:border-black"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-800 mb-2">
            Link Related Publications
          </label>
          <div className="max-h-36 overflow-y-auto border border-neutral-200 rounded-md p-3 space-y-1.5 bg-[#FAF9F6]">
            {publications.map((pub) => (
              <label key={pub.id} className="flex items-start gap-2 text-xs text-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(editing.related_publication_ids || []).includes(pub.id)}
                  onChange={() => togglePubId(pub.id)}
                  className="mt-0.5"
                />
                <span>
                  <strong className="font-mono">{pub.year}</strong> — {pub.title}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-neutral-200 items-center">
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">Visibility</label>
            <select
              value={editing.publish_status || 'published'}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  publish_status: e.target.value as 'draft' | 'published',
                })
              }
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md bg-white"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <label className="inline-flex items-center gap-2 text-xs font-medium text-neutral-800 pt-4 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(editing.featured_on_home)}
              onChange={(e) => setEditing({ ...editing, featured_on_home: e.target.checked })}
            />
            Feature on Home Page
          </label>
          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-xs font-semibold bg-black text-[#CFB991] rounded-md hover:bg-neutral-800 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Research Project'}
            </button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-neutral-600">
          Manage ongoing investigations, update research progress notes, and archive completed projects.
        </p>
        <button
          type="button"
          onClick={startNew}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-black text-[#CFB991] rounded-md hover:bg-neutral-800 whitespace-nowrap shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          New Project
        </button>
      </div>

      <div className="bg-white border border-neutral-200 rounded-md overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold text-neutral-600">
              <th className="py-3 px-4">Project Title</th>
              <th className="py-3 px-4">Research Area</th>
              <th className="py-3 px-4">Project Status</th>
              <th className="py-3 px-4">Visibility</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {items.map((proj) => (
              <tr key={proj.id} className="hover:bg-neutral-50/70">
                <td className="py-3 px-4">
                  <p className="font-medium text-black">{proj.title}</p>
                  <p className="text-xs text-neutral-500 line-clamp-1">{proj.funding_info}</p>
                </td>
                <td className="py-3 px-4 text-xs text-neutral-600">{proj.research_area}</td>
                <td className="py-3 px-4 text-xs capitalize font-semibold text-[#8E6F3E]">
                  {proj.project_status}
                </td>
                <td className="py-3 px-4 text-xs capitalize">{proj.publish_status}</td>
                <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                  <button
                    type="button"
                    onClick={() => onPreview({ type: 'project', item: proj })}
                    className="p-1.5 text-neutral-600 hover:text-black"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(proj)}
                    className="p-1.5 text-neutral-600 hover:text-black"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(proj.id)}
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
