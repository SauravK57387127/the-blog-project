"use client";

// import { DateTimePicker } from "@/components/admin/editor/blogEditorChildren/DateTimePicker";
// import Editor from "@/components/admin/editor/Editor1";
// import { defaultContent } from "@/components/admin/editor/menubarComponents/defaultContent";
import { EditorWrapper } from "@/components/admin/editor/EditorWrapper";
import { EditorProvider } from "@/context/EditorProvider";
// import { useState } from "react";
// import TiptapEditor1 from "@/components/admin/editor/TiptapEditor1";
// import { useState } from "react";


export default function NewBlogPage() {
    // const [content, setContent] = useState("<p>Type something...</p>")
    // const [dt, setDt] = useState(new Date())
    // console.log("date & time : ", dt)

    return (
        // <div className="editor-wrapper p-4">
        //     {/* <Editor mode="create" initialContent={defaultContent} /> */}
        //     {/* <TiptapEditor1 content={content} onChange={setContent} /> */}
        //     {/* <DateTimePicker value={dt} onChange={setDt} /> */}
        // </div>
        <EditorProvider>
            <EditorWrapper />
        </EditorProvider>
    );
}
