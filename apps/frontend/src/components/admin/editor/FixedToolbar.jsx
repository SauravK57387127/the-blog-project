"use client";

import { useRef } from "react";
import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/api/endpoints";
import { toast } from "sonner";
import { DESIGN_CONSTANTS } from "@/lib/design-constants";

// ── Icon components (inline SVG — no extra dependency) ────────

const Bold        = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>;
const Italic      = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="4" x2="14" y2="4"/><line x1="10" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>;
const Underline   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>;
const Strike      = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><line x1="4" y1="12" x2="20" y2="12"/></svg>;
const Quote       = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>;
const Code        = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
const LinkIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
const ImageIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>;
const UploadIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const HighlightIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></svg>;
const HRule       = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/></svg>;

// ── Toolbar button ────────────────────────────────────────────

function ToolBtn({ onClick, active, title, children, disabled }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick?.(); }}
      disabled={disabled}
      title={title}
      className={`h-7 px-2 flex items-center justify-center text-xs font-mono border transition-colors duration-150 ${
        active
          ? 'border-foreground bg-foreground text-background'
          : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
      } disabled:opacity-30`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-border mx-0.5 self-center flex-shrink-0" />;
}

// ── Fixed Toolbar ─────────────────────────────────────────────

export function FixedToolbar({ editor, draftSlug }) {
  const fileInputRef = useRef(null);

  if (!editor) return null;

  // ── Image upload ──────────────────────────────────────────
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    try {
      const formData = new FormData();
      formData.append('image', file);
      if (draftSlug) formData.append('draftSlug', draftSlug);

      toast.loading('Uploading image...', { id: 'toolbar-img' });

      const result = await apiClient.post(
        API_ENDPOINTS.ADMIN.UPLOAD.CONTENT_IMAGE,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      const url = result.data?.url;
      if (!url) throw new Error('No URL');

      editor.chain().focus().setImage({ src: url }).run();
      toast.success('Image inserted', { id: 'toolbar-img' });
    } catch {
      toast.error('Upload failed', { id: 'toolbar-img' });
    }
  };

  const handleImageUrl = () => {
    const url = window.prompt('Enter image URL');
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  };

const handleLink = () => {
  const previousUrl = editor.getAttributes('link').href ?? '';
  const url = window.prompt('URL', previousUrl);

  if (url === null) return; // cancelled

  if (url === '') {
    // Remove link
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    return;
  }

  // Set link — extendMarkRange ensures full word is linked
  try {
    editor.chain().focus().extendMarkRange('link').setLink({ href: url, target: '_blank' }).run();
  } catch (e) {
    toast.error(e.message);
  }
};

  return (
    <div className="flex items-center gap-0.5 px-3 py-1.5 border-b border-border bg-background/80 backdrop-blur flex-wrap">

      {/* Paragraph / Headings */}
      <ToolBtn
        onClick={() => editor.chain().focus().setParagraph().run()}
        active={editor.isActive('paragraph')}
        title="Paragraph"
      >
        <span className="text-[11px]">¶</span>
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive('heading', { level: 1 })}
        title="Heading 1"
      >
        <span className="text-[11px] font-bold">H1</span>
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive('heading', { level: 2 })}
        title="Heading 2"
      >
        <span className="text-[11px] font-bold">H2</span>
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive('heading', { level: 3 })}
        title="Heading 3"
      >
        <span className="text-[11px] font-bold">H3</span>
      </ToolBtn>

      <Divider />

      {/* Format */}
      <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()}          active={editor.isActive('bold')}          title="Bold"><Bold /></ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()}        active={editor.isActive('italic')}        title="Italic"><Italic /></ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()}     active={editor.isActive('underline')}     title="Underline"><Underline /></ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()}        active={editor.isActive('strike')}        title="Strikethrough"><Strike /></ToolBtn>

      <Divider />

      {/* Blocks */}
      <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()}    active={editor.isActive('blockquote')}    title="Blockquote"><Quote /></ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()}     active={editor.isActive('codeBlock')}     title="Code block"><Code /></ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()}   active={false}                            title="Horizontal rule"><HRule /></ToolBtn>

      <Divider />

      {/* Link */}
<ToolBtn onClick={handleLink} active={editor.isActive('link')} title="Link"><LinkIcon /></ToolBtn>
      
    <Divider />

    {/* Font family */}
<ToolBtn onClick={() => editor.chain().focus().setFontFamily('Inter').run()}         active={editor.isActive('textStyle', { fontFamily: 'Inter' })}     title="Sans"><span className="text-[11px]">Aa</span></ToolBtn>
<ToolBtn onClick={() => editor.chain().focus().setFontFamily('serif').run()}          active={editor.isActive('textStyle', { fontFamily: 'serif' })}      title="Serif"><span className="text-[11px] font-serif">Aa</span></ToolBtn>
<ToolBtn onClick={() => editor.chain().focus().setFontFamily('monospace').run()}      active={editor.isActive('textStyle', { fontFamily: 'monospace' })}  title="Mono"><span className="text-[11px] font-mono">Aa</span></ToolBtn>

    <Divider />
    
    {/* Image — URL */}
      <ToolBtn onClick={handleImageUrl} active={false} title="Insert image URL"><ImageIcon /></ToolBtn>

      {/* Image — Upload */}
      <ToolBtn onClick={() => fileInputRef.current?.click()} active={false} title="Upload image from device">
        <UploadIcon />
      </ToolBtn>
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

      <Divider />

      {/* Highlight */}
      <ToolBtn
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        active={editor.isActive('highlight')}
        title="Highlight"
      >
        <HighlightIcon />
      </ToolBtn>

    </div>
  );
}
