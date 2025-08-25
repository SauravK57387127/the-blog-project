// app/drafts/[id]/page.jsx
"use client";

import EditorWrapper from "@/components/admin/editor/EditorWrapper";
import { EditorProvider } from "@/context/EditorProvider";


export default function DraftEditorPage({ params }) {
  const { id } = params; 

  if (!id || id === "undefined" || id === "null") {
    return <p className="text-red-500">Invalid draft ID</p>;
  }

  return (
    <EditorProvider key={id}>
      <EditorWrapper draftId={id} />
    </EditorProvider>
  )
}