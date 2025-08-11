"use client";

import Editor from "@/components/admin/editor/Editor";
import { defaultContent } from "@/components/admin/editor/menubarComponents/defaultContent";
// import TiptapEditor1 from "@/components/admin/editor/TiptapEditor1";
// import { useState } from "react";


export default function NewBlogPage() {
    // const [content, setContent] = useState("<p>Type something...</p>")
    return (
        <div className="editor-wrapper p-4">
            <Editor mode="create" initialContent={defaultContent} />
            {/* <TiptapEditor1 content={content} onChange={setContent} /> */}
        </div>
    );
}
