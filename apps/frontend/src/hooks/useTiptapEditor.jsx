"use client";
import { useEditor } from "@tiptap/react";
import { useEffect, useRef } from "react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { TextAlign } from "@tiptap/extension-text-align";
import { Highlight } from "@tiptap/extension-highlight";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";

export const useTiptapEditor = ({ content = "", onUpdate } = {}) => {
  // Tracks the last HTML string the editor itself emitted via onUpdate.
  // When `content` prop changes to match this, it came from the editor — skip sync.
  // When it's different, it came from outside (backend load) — sync to editor.
  const editorEmittedContent = useRef(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      TextStyle,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight.configure({ multicolor: true }),
      Image.configure({ allowBase64: true }),
      Link.configure({ openOnClick: false }),
      Subscript,
      Superscript,
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content,
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[500px] max-w-none p-6",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      editorEmittedContent.current = html; // mark: this change came from the editor
      if (onUpdate) onUpdate(html);
    },
  });

  // Sync external content changes (backend load, round-trip) into the editor.
  // Runs when `content` prop changes OR when `editor` transitions null → instance.
  useEffect(() => {
    if (!editor || !content) return;

    // If the new content is what the editor just emitted, it's our own
    // onUpdate → setContent feedback loop. Skip it.
    if (content === editorEmittedContent.current) return;

    // External content (e.g. from backend). Imperatively set it.
    // `false` = don't fire onUpdate, preventing a second write back to parent.
    editor.commands.setContent(content, false);

    // Align the ref so the next user keystroke doesn't trigger this branch.
    editorEmittedContent.current = content;
  }, [content, editor]);
  // `editor` dep is intentional: effect must re-run when editor
  // transitions from null (loading) to the live instance.

  return editor;
};
