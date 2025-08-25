import { useTiptap } from "@/hooks/admin/useEditor.js";
import { EditorContent } from "@tiptap/react";


export function Editor() {
    const editor = useTiptap()
  if (!editor) return <p>Loading editor...</p>

    return (
    <EditorContent editor={editor}/>
  )
}

