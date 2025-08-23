import { useTiptap } from "@/hooks/admin/useEditor.js";
import { EditorContent } from "@tiptap/react";


export function Editor() {
    const editor = useTiptap()
if (!editor) {
        console.log("[Editor] : didn't recieved editor")
        return null
    }  
    return (
    <EditorContent editor={editor}/>
  )
}

