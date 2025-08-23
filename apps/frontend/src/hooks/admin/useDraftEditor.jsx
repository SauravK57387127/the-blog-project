'use client'

import { useEffect, useRef, useState } from "react"
import { useTiptap } from "./useEditor.js"
import { useCreateDraft, useDraftAutoSave } from "@/services/admin/useDraftsService"
import { usePublishBlog, useScheduleBlog } from "./useBlogPublishing.js"



export default function useDraftEditor() {
    const [draftId, setDraftId] = useState(null)
    const [title, setTitle] = useState("")
    const [coverImage, setCoverImage] = useState(null)
    const [tags, setTags] = useState([])
    const [content, setContent] = useState("")
    const [dt, setDt] = useState(new Date())                // holds date & time BOTH

    const timerRef = useRef(null)

    const editor = useTiptap()                              // Editor creation
    const createDraft = useCreateDraft({
  onSuccess: (res) => {
    if (res?.data?._id) setDraftId(res.data._id);
  }
});

    const draftAutoSave = useDraftAutoSave()
    const scheduleBlog = useScheduleBlog()
    const publishBlog = usePublishBlog()

    useEffect(() => {
  if (!editor) return;

  const handler = () => setContent(editor.getHTML());
  editor.on("update", handler);

  return () => editor.off("update", handler);  // ✅ cleanup
}, [editor]);


 // Effect 1: create draft on first title update
  useEffect(() => {
    if (!title.trim() || draftId) return
    createDraft.mutate({ title })
  }, [title, draftId])


  // Effect 2: debounced content update in draft db ( on content update in editor )
  useEffect(() => {
    if (!title.trim() || !draftId) return
    timerRef.current = setTimeout(() => {
draftAutoSave.mutate({ _id: draftId, title, content, coverImage, tags })
    }, 2500);

    return () => clearTimeout(timerRef.current);
  }, [content, coverImage, tags])


  // Action: publish
  const publishDraft = () => {
    if (!draftId) return
    publishBlog.mutate({ _id: draftId, title, content, coverImage, tags })
  }

  /// Action: schedule
const scheduleDraft = () => {
  if (!draftId) return
  scheduleBlog.mutate({ 
    _id: draftId, 
    title, 
    content, 
    coverImage, 
    tags, 
    scheduleAt: dt.toISOString()
  })
}


  return {
    draftId,
    title, setTitle,
    coverImage, setCoverImage,
    tags, setTags,
    // content, setContent,
    publishDraft,
    scheduleDraft,
    // editor,
    dt, setDt
  }
}
