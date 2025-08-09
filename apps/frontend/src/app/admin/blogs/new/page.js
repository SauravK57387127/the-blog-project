"use client";

import TiptapEditor from "@/components/admin/editor/TiptapEditor";
import TiptapEditor1 from "@/components/admin/editor/TiptapEditor1";
import { useState } from "react";


export default function NewBlogPage() {
    const [content, setContent] = useState("<p>Type something...</p>")
    return (
        <div className="editor-wrapper">
            {/* <TiptapEditor /> */}
            <TiptapEditor1 content={content} onChange={setContent} />
        </div>
    );
}
