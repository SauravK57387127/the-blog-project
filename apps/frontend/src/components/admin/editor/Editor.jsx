"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { EditorContent, useEditor } from "@tiptap/react";
import FloatingMenuBar from "./FloatingMenuBar";
import { Button } from "@/components/ui/button";
import { allExtensions } from "./allExtensions.js";
import { defaultContent } from "./menubarComponents/defaultContent.js";
import { useDraftMutation, useGetDraftById } from "@/hooks/admin/useDrafts.js";
import { slugify } from "@/utils/slugify.js";
import { usePublishBlog } from "@/hooks/admin/usePublishBlog.js";
import { useScheduleBlog } from "@/hooks/admin/useScheduleBlog.js";

/**
 * Extracts title, coverImage, and tags directly from TipTap's doc structure
 * Ambition #3, #4, #9: works for both title-first and content-first workflows
 */
function extractBlogMeta(editor) {
    const titleNode = editor?.state?.doc?.firstChild;
    const title = titleNode?.textContent || "Untitled";

    const coverImageNode = editor?.state?.doc?.child(1);
    const coverImage = coverImageNode?.attrs?.src || null;

    const tagsNode = editor?.state?.doc?.child(2);
    const tagsText = tagsNode?.textContent || "";
    const tags = tagsText.split(",").map(tag => tag.trim()).filter(Boolean);

    return { title, coverImage, tags };
}

export default function Editor({ mode, draftId: initialDraftId = null }) {
    const router = useRouter();

    // Ambition #1 & #11: Works for both `/admin/blogs/new` and `/drafts/:id`
    const [draftId, setDraftId] = useState(initialDraftId);
    const [scheduledTime, setScheduledTime] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isInitialContentSet, setIsInitialContentSet] = useState(false);

    // Refs to track session-based logic
    const autosaveTimer = useRef(null);
    const editorRef = useRef(null);
    const hasCreatedDraftRef = useRef(false); // Ambition #3, #8, #9: only create draft once per mount
    const prevTitleRef = useRef(null);
    const prevContentRef = useRef(""); // Ambition #9: detect content changes

    // Ambition #4, #5: Load existing draft if editing
    const { data: draftData, isLoading: isDraftLoading } = useGetDraftById(draftId, {
        enabled: !!draftId && mode === "edit",
    });

    // Mutation to save/update drafts
    const { mutate: saveDraft } = useDraftMutation({
        onSuccess: (data) => {
            if (!draftId) setDraftId(data._id);
            hasCreatedDraftRef.current = true;
            console.log("[Draft] Created/Updated draft ID:", data._id);
            setIsSaving(false);
        },
        onError: () => {
            console.error("[Draft] Error saving draft");
            setIsSaving(false);
        },
    });

    // Publish & schedule
    const publishBlog = usePublishBlog();
    const scheduleBlog = useScheduleBlog();

    // Ambition #2: Always start with defaultContent for new mode
    const editor = useEditor({
        extensions: allExtensions,
        content: defaultContent,
        editorProps: {
            attributes: {
                class: "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
            },
        },
        onUpdate: ({ editor }) => {
            if (autosaveTimer.current) clearTimeout(autosaveTimer.current);

            autosaveTimer.current = setTimeout(() => {
                const { title, coverImage, tags } = extractBlogMeta(editor);
                const contentJSON = editor.getJSON();
                const contentString = JSON.stringify(contentJSON);

                const titleChanged = title !== prevTitleRef.current;
                const contentChanged = contentString !== prevContentRef.current;

                // Track previous state
                prevTitleRef.current = title;
                prevContentRef.current = contentString;

                // Ambition #3 & #9: Create draft once if title/content changes
                if (!hasCreatedDraftRef.current && (titleChanged || contentChanged)) {
                    console.log("[Draft] Creating new draft (first change detected)");
                    setIsSaving(true);
                    saveDraft({
                        title,
                        content: contentString,
                        coverImage,
                        tags,
                    });
                    return;
                }

                // Ambition #4: Update same draft for future changes
                if (draftId && (titleChanged || contentChanged)) {
                    console.log("[Draft] Updating existing draft:", draftId);
                    setIsSaving(true);
                    saveDraft({
                        _id: draftId,
                        title,
                        content: contentString,
                        coverImage,
                        tags,
                    });
                }
            }, 2000);
        },
    });

    // Keep a reference to editor instance
    useEffect(() => {
        if (editor && !editorRef.current) {
            editorRef.current = editor;
        }
    }, [editor]);

    // Ambition #11: Load draft content in edit mode
    useEffect(() => {
        if (mode === "edit" && draftData && editorRef.current && !isInitialContentSet) {
            editorRef.current.commands.setContent(JSON.parse(draftData.content) || defaultContent);
            setIsInitialContentSet(true);
            prevTitleRef.current = extractBlogMeta(editorRef.current).title;
            prevContentRef.current = draftData.content;
            console.log("[Draft] Loaded existing draft:", draftId);
        }
    }, [draftData, mode, isInitialContentSet]);

    // Ambition #7 & #8: Reset state for new mode on mount
    useEffect(() => {
        if (mode === "new" && editor && !isInitialContentSet) {
            editor.commands.setContent(defaultContent);
            setIsInitialContentSet(true);
            prevTitleRef.current = extractBlogMeta(editor).title;
            prevContentRef.current = JSON.stringify(editor.getJSON());
            setDraftId(null);
            hasCreatedDraftRef.current = false;
            console.log("[Editor] Reset to default content for new session");
        }
    }, [mode, editor, isInitialContentSet]);

    // Ambition #5: Cleanup autosave timer
    useEffect(() => {
        return () => {
            if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
        };
    }, []);

    // Ambition #6 & #10: Publish or schedule draft
    const handleSave = useCallback((isScheduled = false, scheduleAt = null) => {
        if (!editorRef.current) return;
        const { title, coverImage, tags } = extractBlogMeta(editorRef.current);
        if (!title.trim() || title === "Untitled") return;

        const payload = {
            title,
            slug: slugify(title),
            content: editorRef.current.getJSON(),
            coverImage,
            tags,
            category: "General",
            draftId,
            scheduleAt,
        };

        console.log(isScheduled ? "[Publish] Scheduling blog" : "[Publish] Publishing blog", payload);

        if (isScheduled) {
            scheduleBlog.mutate(payload);
        } else {
            publishBlog.mutate(payload);
        }
    }, [draftId, publishBlog, scheduleBlog]);

    const handleSchedule = useCallback(() => {
        if (!scheduledTime) return;
        const scheduleDate = new Date(scheduledTime);
        if (scheduleDate <= new Date()) return;
        handleSave(true, scheduleDate.toISOString());
    }, [scheduledTime, handleSave]);

    if (mode === "edit" && isDraftLoading) {
        return <div>Loading draft...</div>;
    }

    return (
        <div className="relative editor-wrapper min-h-screen">
            <EditorContent editor={editor} className="editor-styled pb-20" />
            <FloatingMenuBar editor={editor} />

            {/* Debug Info */}
            <div className="fixed bottom-4 left-4 text-xs bg-gray-100 p-2 rounded shadow">
                <div>Mode: {mode}</div>
                <div>Draft ID: {draftId || "none"}</div>
                <div>Saving: {isSaving.toString()}</div>
            </div>

            {/* Actions */}
            <div className="fixed bottom-4 right-4 flex gap-2 bg-white p-2 rounded shadow-lg border">
                <input
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="bg-white border px-2 py-1 rounded text-sm"
                />
                <Button
                    onClick={handleSchedule}
                    disabled={!scheduledTime || isSaving}
                    className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Schedule
                </Button>
                <Button
                    onClick={() => handleSave()}
                    disabled={isSaving}
                    className="cursor-pointer bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Save & Publish
                </Button>
            </div>
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