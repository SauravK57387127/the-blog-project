"use client";

import { TitleInput } from "@/components/admin/editor/blogEditorChildren";
import { Button } from "@/components/ui/button";
// import { DateTimePicker } from "@/components/admin/editor/blogEditorChildren/DateTimePicker";
// import Editor from "@/components/admin/editor/Editor1";
// import { defaultContent } from "@/components/admin/editor/menubarComponents/defaultContent";
// import { EditorWrapper } from "@/components/admin/editor/EditorWrapper";
// import { EditorProvider } from "@/context/EditorProvider";
import { useCreateDraft } from "@/services/admin/useDraftsService";
import { useRouter } from "next/navigation";
// import { useState } from "react";
// import TiptapEditor1 from "@/components/admin/editor/TiptapEditor1";
import { useState } from "react";


export default function NewBlogPage() {
    // const [content, setContent] = useState("<p>Type something...</p>")
    // const [dt, setDt] = useState(new Date())
    // console.log("date & time : ", dt)
    const router = useRouter()
  const createDraft = useCreateDraft({
   onSuccess: (res) => {
    if (res?.data?._id) {
      router.push(`/admin/blogs/drafts/${res.data._id}`);
    }
  }
  })
  
  const [title, setTitle] = useState("")

    return (
        // <div className="editor-wrapper p-4">
        //     {/* <Editor mode="create" initialContent={defaultContent} /> */}
        //     {/* <TiptapEditor1 content={content} onChange={setContent} /> */}
        //     {/* <DateTimePicker value={dt} onChange={setDt} /> */}
        // </div>
        // <EditorProvider>
        //     <EditorWrapper />
        // </EditorProvider>
        <>
        <TitleInput title={title} setTitle={setTitle} />
        <Button
  onClick={() => {
      if (title.trim()) createDraft.mutate({ title });
    }}
>
  Create Draft
</Button>
    </>

    );
}
