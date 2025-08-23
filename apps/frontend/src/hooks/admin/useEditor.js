import { EditorContext } from "@/context/EditorProvider"
import { useContext } from "react"

export const useTiptap = () => {
    const editor = useContext(EditorContext)
    if(!editor) {
        console.warn("Editor not yet ready 🟥");
        return null
    } 

    return editor
}