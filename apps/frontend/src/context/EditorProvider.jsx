'use client'

import { allExtensions } from "@/components/admin/editor/allExtensions";
import { defaultContent } from "@/components/admin/editor/menubarComponents/defaultContent";
import { useEditor } from "@tiptap/react";
import { createContext, useEffect } from "react";

export const EditorContext = createContext(null)

export const EditorProvider = ({children}) => {
    const editor = useEditor({
        extensions: allExtensions,
        content: "<p>Type something...</p>",
            immediatelyRender: false,
    })

    return (
        <EditorContext.Provider value={editor}>
            {children}
        </EditorContext.Provider>
    )
}