import { useTiptap } from "@/hooks/admin/useEditor.js";
import FloatingMenuBar from "../FloatingMenuBar";


export function EditorMenuBar() {
    const editor = useTiptap()
    if (!editor) {
        console.log("[editor menu bar] : didn't recieved editor")
        return null
    }
  return (
    <FloatingMenuBar editor={editor} />
  )
}

