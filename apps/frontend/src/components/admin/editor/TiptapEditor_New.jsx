"use client";

import { EditorContent } from "@tiptap/react";
import { useTiptapEditor } from "@/hooks/useTiptapEditor";
import { EditorToolbar } from "./EditorToolbar";
import { EditorProvider } from "@/context/EditorContext";
import { FixedToolbar } from "@/components/admin/editor/FixedToolbar";

export function TiptapEditor({
    content,
    onUpdate,
    showToolbar = true,
    draftSlug,
}) {
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
            <div className="relative bg-background">
                <div className="sticky top-[125] z-10">
                    {" "}
                    {/* ← wrap FixedToolbar in sticky */}
                    <FixedToolbar editor={editor} draftSlug={draftSlug} />
                </div>
                {showToolbar && (
                    <EditorToolbar editor={editor} draftSlug={draftSlug} />
                )}
                <EditorContent editor={editor} />
            </div>
        </EditorProvider>
    );
}
