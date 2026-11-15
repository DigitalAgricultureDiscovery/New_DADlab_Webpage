import React, { useEffect, useRef, useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading2,
  Quote,
  Link2,
  Code,
  RemoveFormatting,
} from 'lucide-react';

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (html: string) => void;
  minHeightClass?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  label,
  value,
  onChange,
  minHeightClass = 'min-h-[160px]',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [sourceMode, setSourceMode] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('https://');
  const savedRangeRef = useRef<Range | null>(null);

  useEffect(() => {
    if (!sourceMode && editorRef.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value, sourceMode]);

  const exec = (command: string, val?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, val);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const openLinkPrompt = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
    setShowLinkInput((prev) => !prev);
  };

  const applyLink = () => {
    if (!linkUrl.trim()) {
      setShowLinkInput(false);
      return;
    }
    editorRef.current?.focus();
    if (savedRangeRef.current) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(savedRangeRef.current);
    }
    document.execCommand('createLink', false, linkUrl.trim());
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    setShowLinkInput(false);
    setLinkUrl('https://');
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-4">
        <label className="text-xs font-semibold text-neutral-800">{label}</label>
        <button
          type="button"
          onClick={() => setSourceMode((v) => !v)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-black transition-colors whitespace-nowrap shrink-0"
        >
          <Code className="w-3.5 h-3.5" />
          {sourceMode ? 'Visual Editor' : 'HTML Source'}
        </button>
      </div>

      <div className="border border-neutral-300 bg-white rounded-md overflow-hidden focus-within:border-black transition-colors">
        {!sourceMode && (
          <div className="flex flex-wrap items-center gap-1 px-2 py-1.5 border-b border-neutral-200 bg-neutral-50">
            <button
              type="button"
              onClick={() => exec('bold')}
              title="Bold"
              className="p-1.5 rounded text-neutral-700 hover:bg-neutral-200 hover:text-black transition-colors"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => exec('italic')}
              title="Italic"
              className="p-1.5 rounded text-neutral-700 hover:bg-neutral-200 hover:text-black transition-colors"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => exec('underline')}
              title="Underline"
              className="p-1.5 rounded text-neutral-700 hover:bg-neutral-200 hover:text-black transition-colors"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>
            <span className="w-px h-4 bg-neutral-300 mx-1" aria-hidden="true" />
            <button
              type="button"
              onClick={() => exec('formatBlock', 'H3')}
              title="Section Subheading"
              className="p-1.5 rounded text-neutral-700 hover:bg-neutral-200 hover:text-black transition-colors"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => exec('insertUnorderedList')}
              title="Bullet List"
              className="p-1.5 rounded text-neutral-700 hover:bg-neutral-200 hover:text-black transition-colors"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => exec('insertOrderedList')}
              title="Numbered List"
              className="p-1.5 rounded text-neutral-700 hover:bg-neutral-200 hover:text-black transition-colors"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => exec('formatBlock', 'BLOCKQUOTE')}
              title="Blockquote"
              className="p-1.5 rounded text-neutral-700 hover:bg-neutral-200 hover:text-black transition-colors"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={openLinkPrompt}
              title="Insert Link"
              className="p-1.5 rounded text-neutral-700 hover:bg-neutral-200 hover:text-black transition-colors"
            >
              <Link2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => exec('removeFormat')}
              title="Clear Formatting"
              className="p-1.5 rounded text-neutral-700 hover:bg-neutral-200 hover:text-black transition-colors"
            >
              <RemoveFormatting className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {showLinkInput && !sourceMode && (
          <div className="flex items-center gap-2 px-3 py-2 bg-[#FAF9F6] border-b border-neutral-200">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://purdue.edu/..."
              className="flex-1 text-xs px-2.5 py-1.5 border border-neutral-300 rounded bg-white focus:outline-none focus:border-black"
            />
            <button
              type="button"
              onClick={applyLink}
              className="px-3 py-1.5 text-xs font-medium bg-black text-white rounded hover:bg-neutral-800 whitespace-nowrap shrink-0"
            >
              Apply Link
            </button>
            <button
              type="button"
              onClick={() => setShowLinkInput(false)}
              className="px-2.5 py-1.5 text-xs text-neutral-600 hover:text-black whitespace-nowrap shrink-0"
            >
              Cancel
            </button>
          </div>
        )}

        {sourceMode ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full p-3 font-mono text-xs text-neutral-800 bg-white focus:outline-none ${minHeightClass}`}
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={() => {
              if (editorRef.current) {
                onChange(editorRef.current.innerHTML);
              }
            }}
            className={`prose-lab p-3.5 text-sm focus:outline-none ${minHeightClass}`}
          />
        )}
      </div>
    </div>
  );
};
