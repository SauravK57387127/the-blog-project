"use client";

import { EditorContent } from "@tiptap/react";
import { useTiptapEditor } from "@/hooks/useTiptapEditor";
import { EditorToolbar } from "./EditorToolbar";
import { EditorProvider } from "@/context/EditorContext";

export function TiptapEditor({ content, onUpdate, showToolbar = true }) {
  const editor = useTiptapEditor({ content, onUpdate });

  if (!editor) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <p className="text-muted-foreground">Loading editor...</p>
      </div>
    );
  }

  return (
    <EditorProvider editor={editor}>
      {/* FIXED: Removed overflow-hidden - was cutting the floating menu */}
      <div className="relative border rounded-lg bg-background">
        {showToolbar && <EditorToolbar editor={editor} />}
        <EditorContent editor={editor} />
      </div>
    </EditorProvider>
  );
}
