"use client";
import { createContext, useContext, ReactNode } from "react";
import { Editor } from "@tiptap/react";
const EditorContext = createContext({
    editor: null,
});
export const useEditorContext = () => {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error("useEditorContext must be used within EditorProvider");
    }
    return context;
};
export const EditorProvider = ({ children, editor }) => {
    return (
        <EditorContext.Provider
            value={{
                editor,
            }}
        >
            {children}
        </EditorContext.Provider>
    );
};
