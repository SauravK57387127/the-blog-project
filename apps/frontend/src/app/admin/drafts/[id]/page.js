// app/drafts/[id]/page.jsx
"use client";

import Editor from "@/components/admin/editor/Editor";

export default function DraftEditorPage({ params }) {
  const { id } = params;

  if (!id || id === "undefined" || id === "null") {
    return <p className="text-red-500">Invalid draft ID</p>;
  }

  return (
    <div className="p-4">
      <Editor mode="edit" draftId={id} />
    </div>
  );
}


// REMINDER: should be using next.js way of doing stuffs.

