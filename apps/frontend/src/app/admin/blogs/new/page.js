"use client";

import Editor from "@/components/admin/editor/Editor";
import TiptapEditor1 from "@/components/admin/editor/TiptapEditor1";
import { useState } from "react";


export default function NewBlogPage() {
    const [content, setContent] = useState("<p>Type something...</p>")
    return (
        <div className="editor-wrapper">
            <Editor />
            {/* <TiptapEditor1 content={content} onChange={setContent} /> */}
        </div>
    );
}
