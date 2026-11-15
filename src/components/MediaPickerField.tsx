import React, { useRef, useState } from 'react';
import { Upload, FolderOpen, X } from 'lucide-react';
import { api } from '../lib/api';
import type { MediaAsset } from '../types/cms';
import { PRESET_LAB_IMAGES, resolveMediaUrl } from '../lib/mediaAssets';

interface MediaPickerFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept: 'image' | 'pdf' | 'all';
  mediaAssets: MediaAsset[];
  onMediaUploaded: (asset: MediaAsset) => void;
  placeholder?: string;
}

export const MediaPickerField: React.FC<MediaPickerFieldProps> = ({
  label,
  value,
  onChange,
  accept,
  mediaAssets,
  onMediaUploaded,
  placeholder = '/uploads/... or URL',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });
      const created = await api.uploadMedia({
        filename: file.name,
        mimeType: file.type || 'application/octet-stream',
        dataBase64: base64,
      });
      onMediaUploaded(created);
      onChange(created.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const filteredAssets = mediaAssets.filter((m) => {
    if (accept === 'image') return m.category === 'image';
    if (accept === 'pdf') return m.category === 'pdf' || m.category === 'document';
    return true;
  });

  const acceptAttr =
    accept === 'image'
      ? 'image/*'
      : accept === 'pdf'
      ? '.pdf,.txt,.bib,.docx'
      : 'image/*,.pdf,.txt,.bib,.docx';

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-neutral-800">{label}</label>
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 min-w-[200px] px-3 py-2 text-sm border border-neutral-300 rounded-md bg-white focus:outline-none focus:border-black"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptAttr}
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-black text-white rounded-md hover:bg-neutral-800 disabled:opacity-50 whitespace-nowrap shrink-0"
        >
          <Upload className="w-3.5 h-3.5" />
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
        <button
          type="button"
          onClick={() => setPickerOpen((v) => !v)}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-neutral-300 bg-white text-neutral-800 rounded-md hover:bg-neutral-50 whitespace-nowrap shrink-0"
        >
          <FolderOpen className="w-3.5 h-3.5" />
          Library
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            title="Clear"
            className="p-2 text-neutral-500 hover:text-black border border-neutral-200 rounded-md"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-700">{error}</p>}

      {accept === 'image' && value && (
        <div className="mt-2 w-40 h-24 border border-neutral-200 rounded overflow-hidden bg-neutral-100">
          <img
            src={resolveMediaUrl(value)}
            alt="Selected preview"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {pickerOpen && (
        <div className="mt-2 p-3 border border-neutral-200 rounded-md bg-[#FAF9F6] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-700">Select from Library</span>
            <button
              type="button"
              onClick={() => setPickerOpen(false)}
              className="text-xs text-neutral-500 hover:text-black"
            >
              Close
            </button>
          </div>
          {filteredAssets.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {filteredAssets.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => {
                    onChange(asset.url);
                    setPickerOpen(false);
                  }}
                  className="flex items-center gap-2 p-2 text-left text-xs bg-white border border-neutral-200 rounded hover:border-black transition-colors"
                >
                  <span className="truncate font-medium text-neutral-800">{asset.original_name}</span>
                </button>
              ))}
            </div>
          )}
          {accept === 'image' && (
            <div className="pt-2 border-t border-neutral-200">
              <p className="text-[11px] font-medium text-neutral-500 mb-1.5">Laboratory Photography</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRESET_LAB_IMAGES.map((img) => (
                  <button
                    key={img.path}
                    type="button"
                    onClick={() => {
                      onChange(img.path);
                      setPickerOpen(false);
                    }}
                    className="flex items-center gap-2 p-1.5 text-left text-[11px] bg-white border border-neutral-200 rounded hover:border-black transition-colors"
                  >
                    <img
                      src={resolveMediaUrl(img.path)}
                      alt={img.label}
                      className="w-8 h-8 object-cover rounded shrink-0"
                    />
                    <span className="line-clamp-2 text-neutral-700">{img.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
