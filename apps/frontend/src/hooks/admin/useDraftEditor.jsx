'use client'

import { useEffect, useState } from "react"
import { useTiptap } from "./useEditor.js"
import { useDraftAutoSave } from "@/services/admin/useDraftsService"
import { usePublishBlog, useScheduleBlog } from "./useBlogPublishing.js"
import { useSmartQuery } from "@/utils/apiClient.js"


export default function useDraftEditor({draftId}) {
    const editor = useTiptap()                              // Editor creation

    const [title, setTitle] = useState('')
  const [tags, setTags] = useState([])
  const [coverImage, setCoverImage] = useState('')
  const [dt, setDt] = useState(new Date())                 


    // load draft
  const { data } = useSmartQuery(['draft', draftId], `/admin/blogs/drafts/${draftId}`)


  // hydrate once data/editor ready
  useEffect(() => {
    const d = data?.data
    if (!d || !editor) return
    setTitle(d.title || '')
    setTags(Array.isArray(d.tags) ? d.tags : [])
    setCoverImage(d.coverImage || '')
    editor.commands.setContent(d.content || '<p>Type something...</p>')
  }, [data, editor])


  // autosave mutation (id-scoped endpoint)
  const autosave = useDraftAutoSave(draftId)

  useEffect(() => {
  if (!editor || !draftId) return;

  const interval = setInterval(() => {
    autosave.mutate({
      draftId,
      title,
      coverImage,
      tags,
      content: editor.getHTML()
    });
  }, 2000);

  return () => clearInterval(interval);
}, [editor, draftId, title, coverImage, tags]);


  // actions
  const publishMutation = usePublishBlog()
  const scheduleMutation = useScheduleBlog()

  const publishDraft = () => {
    if (!draftId) return;
  publishMutation.mutate({ _id: draftId, title, coverImage, tags, content: editor.getHTML() });
  }

  const scheduleDraft = () => {
    if (!draftId) return;
  scheduleMutation.mutate({ _id: draftId, title, coverImage, tags, content, scheduleAt: dt });
  }



  return {
    title, setTitle,
    tags, setTags,
    coverImage, setCoverImage,
    dt, setDt,
    publishDraft, scheduleDraft,
    isSaving,
  }
}
