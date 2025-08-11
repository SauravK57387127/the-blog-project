import { useEffect, useState, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import FloatingMenuBar from "./FloatingMenuBar";
import { Button } from "@/components/ui/button";
import { allExtensions } from "./allExtensions.js";
import { defaultContent } from "./menubarComponents/defaultContent.js";
import { useDraftMutation, useGetDraftById } from "@/hooks/admin/useDrafts.js";
import { slugify } from "@/utils/slugify.js";
import { usePublishBlog } from "@/hooks/admin/usePublishBlog.js";
import { useScheduleBlog } from "@/hooks/admin/useScheduleBlog.js";

export default function Editor({ mode = "create", draftId: initialDraftId }) {
  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [draftId, setDraftId] = useState(initialDraftId);

  const autosaveTimer = useRef(null);
  const hasCreatedDraftRef = useRef(false);
  const lastContentRef = useRef("");

  // Fetch draft if editing
  const { data: draftData, isLoading: isDraftLoading } = useGetDraftById(draftId, {
    enabled: !!draftId && mode === "edit",
    retry: (failureCount, error) => {
      if (error?.message?.includes("404")) return false;
      return failureCount < 2; // retry only once
    },
  });

  const { mutate: saveDraft } = useDraftMutation({
    onSuccess: (res) => {
      if (res?.found === false) {
        console.warn("[Draft] Save skipped:", res.message);
        setIsSaving(false);
        return;
      }
      const savedDraft = res?.data;
      if (!draftId && savedDraft?._id) {
        setDraftId(savedDraft._id);
      }
      hasCreatedDraftRef.current = true;
      console.log("[Draft] Created/Updated draft ID:", savedDraft?._id);
      setIsSaving(false);
    },
  });

  const { mutate: publishBlog } = usePublishBlog();
  const { mutate: scheduleBlog } = useScheduleBlog();

  // Initialize editor
  const editor = useEditor({
    extensions: allExtensions,
    content: defaultContent,
    onUpdate: ({ editor }) => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);

      autosaveTimer.current = setTimeout(() => {
        const contentJSON = editor.getJSON();
        const contentStr = JSON.stringify(contentJSON);

        // Skip if content unchanged
        if (contentStr === lastContentRef.current) {
          console.log("[Draft] No content change detected, skipping save");
          return;
        }
        lastContentRef.current = contentStr;

        setIsSaving(true);
        if (!hasCreatedDraftRef.current) {
          console.log("[Draft] Creating new draft...");
          saveDraft({
            title,
            coverImage,
            tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
            content: contentJSON,
          });
        } else {
          console.log("[Draft] Updating draft...");
          saveDraft({
            _id: draftId,
            title,
            coverImage,
            tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
            content: contentJSON,
          });
        }
      }, 2500);
    },
  });

  // Load draft data into editor
  useEffect(() => {
    if (draftData?.data) {
      setTitle(draftData.data.title || "");
      setCoverImage(draftData.data.coverImage || "");
      setTags(draftData.data.tags?.join(", ") || "");
      editor?.commands.setContent(draftData.data.content || defaultContent);
    }
  }, [draftData]);

  // Cleanup autosave timer
  useEffect(() => {
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, []);

  // Publish blog
  const handlePublish = () => {
    if (!title.trim()) {
      console.warn("[Publish] Title is required");
      return;
    }
    publishBlog({
      _id: draftId,
      title,
      slug: slugify(title),
      coverImage,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      content: editor.getJSON(),
    });
  };

  // Schedule blog
  const handleSchedule = (scheduleDate) => {
    if (!title.trim()) {
      console.warn("[Schedule] Title is required");
      return;
    }
    scheduleBlog({
      _id: draftId,
      title,
      slug: slugify(title),
      coverImage,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      content: editor.getJSON(),
      scheduleDate,
    });
  };

  return (
    <div className="editor-container">
      {/* Blog Meta Inputs */}
      <input
        type="text"
        placeholder="Blog Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="editor-title-input"
      />
      <input
        type="text"
        placeholder="Cover Image URL"
        value={coverImage}
        onChange={(e) => setCoverImage(e.target.value)}
        className="editor-cover-input"
      />
      <input
        type="text"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="editor-tags-input"
      />

      {/* Editor */}
      <EditorContent editor={editor} />
      <FloatingMenuBar editor={editor} />

      {/* Actions */}
      <div className="editor-actions">
        <Button onClick={handlePublish}>Publish</Button>
        <Button onClick={() => handleSchedule(new Date())}>Schedule</Button>
      </div>

      {isSaving && <p className="saving-indicator">Saving...</p>}
    </div>
  );
}








// "use client";

// import { useEffect, useState, useRef } from "react";
// import { EditorContent, useEditor } from "@tiptap/react";
// import FloatingMenuBar from "./FloatingMenuBar";
// import { Button } from "@/components/ui/button";
// import { allExtensions } from "./allExtensions.js";
// import { defaultContent } from "./menubarComponents/defaultContent.js";
// import { useDraftMutation, useGetDraftById } from "@/hooks/admin/useDrafts.js";
// import { slugify } from "@/utils/slugify.js";
// import { usePublishBlog } from "@/hooks/admin/usePublishBlog.js";
// import { useScheduleBlog } from "@/hooks/admin/useScheduleBlog.js";

// function extractBlogMetaFromJSON(json) {
//     const nodes = json.content || [];
//     const title = nodes[0]?.content?.[0]?.text || "Untitled";
//     const coverImage = nodes[1]?.attrs?.src || null;
//     const tagsText = nodes[2]?.content?.[0]?.text || "";
//     const tags = tagsText.split(",").map(tag => tag.trim()).filter(Boolean);
//     return { title, coverImage, tags };
// }

// export default function Editor({ mode, draftId: initialDraftId = null }) {
//     const [draftId, setDraftId] = useState(initialDraftId);
//     const [scheduledTime, setScheduledTime] = useState("");
//     const [isSaving, setIsSaving] = useState(false);
//     const [isInitialContentSet, setIsInitialContentSet] = useState(false);

//     const autosaveTimer = useRef(null);
//     const editorRef = useRef(null);

//     const { data: draftData, isLoading: isDraftLoading } = useGetDraftById(draftId, {
//         enabled: !!draftId && mode === "edit",
//     });

//     const { mutate: saveDraft } = useDraftMutation({
//         onSuccess: (data) => {
//             if (!draftId) {
//                 setDraftId(data._id);
//             }
//             setIsSaving(false);
//         },
//         onError: () => {
//             setIsSaving(false);
//         },
//     });

//     const editor = useEditor({
//         extensions: allExtensions,
//         content: defaultContent,
//         editorProps: {
//             attributes: {
//                 class: "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
//             },
//         },
//         onUpdate: ({ editor }) => {
//             if (autosaveTimer.current) {
//                 clearTimeout(autosaveTimer.current);
//             }
//             autosaveTimer.current = setTimeout(() => {
//                 const json = editor.getJSON();
//                 const { title, coverImage, tags } = extractBlogMetaFromJSON(json);
//                 if (title.trim() !== "Untitled" && title.trim() !== "") {
//                     setIsSaving(true);
//                     saveDraft({
//                         ...(draftId ? { _id: draftId } : {}),
//                         title,
//                         content: JSON.stringify(json),
//                         coverImage,
//                         tags,
//                     });
//                 }
//             }, 2500);
//         },
//     });

//     useEffect(() => {
//         if (editor && !editorRef.current) {
//             editorRef.current = editor;
//         }
//     }, [editor]);

//     useEffect(() => {
//         if (mode === "edit" && draftData && editorRef.current && !isInitialContentSet) {
//             editorRef.current.commands.setContent(JSON.parse(draftData.content) || defaultContent);
//             setIsInitialContentSet(true);
//         }
//     }, [draftData, mode, isInitialContentSet]);

//     useEffect(() => {
//         return () => {
//             if (autosaveTimer.current) {
//                 clearTimeout(autosaveTimer.current);
//             }
//         };
//     }, []);

//     const publishBlog = usePublishBlog();
//     const scheduleBlog = useScheduleBlog();

//     function handleSave(isScheduled = false, scheduleAt = null) {
//         if (!editorRef.current) return;

//         const json = editorRef.current.getJSON();
//         const { title, coverImage, tags } = extractBlogMetaFromJSON(json);

//         if (title === "Untitled" || title.trim() === "") return;

//         const payload = {
//             title,
//             slug: slugify(title),
//             content: json,
//             coverImage,
//             tags,
//             category: "General",
//             draftId,
//             scheduleAt,
//         };

//         if (isScheduled) {
//             scheduleBlog.mutate(payload);
//         } else {
//             publishBlog.mutate(payload);
//         }
//     }

//     const handleSchedule = () => {
//         if (!scheduledTime) return;
//         const scheduleDate = new Date(scheduledTime);
//         if (scheduleDate <= new Date()) return;
//         handleSave(true, scheduleDate.toISOString());
//     };

//     if (mode === "edit" && isDraftLoading) {
//         return <div>Loading draft...</div>;
//     }

//     return (
//         <div className="relative editor-wrapper min-h-screen">
//             <EditorContent editor={editor} className="editor-styled pb-20" />
//             <FloatingMenuBar editor={editor} />
//             <div className="fixed bottom-4 left-4 text-xs bg-gray-100 p-2 rounded shadow">
//                 <div>Mode: {mode}</div>
//                 <div>Draft ID: {draftId || 'none'}</div>
//                 <div>Saving: {isSaving.toString()}</div>
//             </div>
//             <div className="fixed bottom-4 right-4 flex gap-2 bg-white p-2 rounded shadow-lg border">
//                 <input
//                     type="datetime-local"
//                     value={scheduledTime}
//                     onChange={(e) => setScheduledTime(e.target.value)}
//                     className="bg-white border px-2 py-1 rounded text-sm"
//                 />
//                 <Button
//                     onClick={handleSchedule}
//                     disabled={!scheduledTime || isSaving}
//                     className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm shadow disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                     Schedule
//                 </Button>
//                 <Button
//                     onClick={() => handleSave()}
//                     disabled={isSaving}
//                     className="cursor-pointer bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm shadow disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                     Save & Publish
//                 </Button>
//             </div>
//         </div>
//     );
// }


// Remmember: Yet to implement the logic if I UPDATED the content on editor's page and hasn't changed the title. 