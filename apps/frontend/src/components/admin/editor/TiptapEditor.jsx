"use client";

import { useEffect, useState, useRef } from "react";

import { EditorContent, useEditor } from "@tiptap/react";

import FloatingMenuBar from "./FloatingMenuBar";
import { Button } from "@/components/ui/button";
import { allExtensions } from "./allExtensions";
import { defaultContent } from "./menubarComponents/defaultContent";

import { useDraftMutation, useGetDraftById } from "@/hooks/admin/useDrafts";

import { slugify } from "@/utils/slugify";

import { usePublishBlog } from "@/hooks/admin/usePublishBlog";
import { useScheduleBlog } from "@/hooks/admin/useScheduleBlog";

function extractBlogMetaFromJSON(json) {
    const nodes = json.content || [];
    const title = nodes[0]?.content?.[0]?.text || "Untitled";

    const coverImage = nodes[1]?.attrs?.src || null;

    const tagsText = nodes[2]?.content?.[0]?.text || "";
    const tags = tagsText
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

    return { title, coverImage, tags };
}

export default function TiptapEditor({ mode="create", draftId=null }) {
    const [initialContent, setInitialContent] = useState(defaultContent);
    const [scheduledTime, setScheduledTime] = useState("");
    const [currentDraftId, setCurrentDraftId] = useState(draftId);


    const draftTimer = useRef(null);
    const saveDraft = useDraftMutation({
        onSuccess: (data) => {
            if (!currentDraftId && data._id) {
                setCurrentDraftId(data._id); // Store for future updates
            }
        }
    });

    const { data: draftData } = useGetDraftById(draftId, {
        enabled: !!draftId,
    });

    // ⏬ Fill editor with existing draft content if in edit mode
    useEffect(() => {
        if (mode === "edit" && draftData && editor) {
            console.log("📝 Loading draft into editor:", draftData.title);
            editor.commands.setInitialContent(
                draftData.content || defaultContent,
            );
        }
    }, [draftData, mode, editor]);

    // 🧠 Actual editor instance
    const editor = useEditor({
        extensions: allExtensions,
        content: initialContent, // ✅ Use dynamic content (either draft or default)
        editorProps: {
            handleDOMEvents: {
                keydown: (_, event) => {
                    if (event.key === "Enter") {
                        editor.commands.unsetAllMarks();
                        const state = editor.state;
                        const { $from } = state.selection;
                        const node = $from.node();
                        const isEmpty = node.content.size === 0;
                        const isBlock = ["blockquote", "codeBlock"].includes(
                            node.type.name,
                        );
                        if (isEmpty && isBlock) {
                            editor.commands.clearNodes();
                        }
                    }
                },
            },
        },
        onUpdate: ({ editor }) => {
            clearTimeout(draftTimer.current);

            // 🧠 Save draft after delay (autosave on content/title change)
            draftTimer.current = setTimeout(() => {
                const json = editor.getJSON();
                // const title = json.content?.[0]?.content?.[0]?.text || "Untitled";
                const { title, coverImage, tags } =
                    extractBlogMetaFromJSON(json);

                saveDraft.mutate({
                    ...(currentDraftId ? { _id: currentDraftId } : {}),
                    title,
                    content: json,
                    coverImage,
                    tags,
                });
            }, 2500);
        },
    });

    useEffect(() => {
        return () => {
            if (draftTimer.current) {
                clearTimeout(draftTimer.current);
            }
        };
    }, []);

    const publishBlog = usePublishBlog();
    const scheduleBlog = useScheduleBlog();

    useEffect(() => {
        if (publishBlog.error) {
            console.error("❌ Publish failed:", publishBlog.error.message);
        }
        if (scheduleBlog.error) {
            console.error("❌ Schedule failed:", scheduleBlog.error.message);
        }
        if (saveDraft.error) {
            console.error("❌ Draft save failed:", saveDraft.error.message);
        }
    }, [publishBlog.error, scheduleBlog.error, saveDraft.error]);

    function handleSave(isScheduled = false, scheduleAt = null) {
        if (!editor) return;

        const json = editor.getJSON();
        const { title, coverImage, tags } = extractBlogMetaFromJSON(json);

        const payload = {
            title,
            slug: slugify(title),
            content: json,
            coverImage,
            tags,
            category: "General", // or let user select later
            draftId: currentDraftId,
            scheduleAt,
        };

        if (isScheduled) {
            scheduleBlog.mutate(payload);
        } else {
            publishBlog.mutate(payload);
        }
    }

    // Add before handleSave call in schedule button:
    const handleSchedule = () => {
        if (!scheduledTime) {
            console.error("❌ No schedule time selected");
            return;
        }

        const scheduleDate = new Date(scheduledTime);
        if (scheduleDate <= new Date()) {
            console.error("❌ Schedule time must be in future");
            return;
        }

        handleSave(true, scheduleDate.toISOString());
    };

    return (
        <div className="relative editor-wrapper">
            <EditorContent editor={editor} className="editor-styled" />
            <FloatingMenuBar editor={editor} />
            <Button
                onClick={handleSave}
                className="absolute right-0 top-0 cursor-pointer bg-black text-white px-4 p-4 rounded-md text-sm shadow"
            >
                Save & Publish
            </Button>
            <input
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="absolute right-36 top-0 bg-white border px-2 py-1 rounded"
            />
            <Button
                onClick={handleSchedule}
                className="cursor-pointer bg-black text-white px-4 p-4 rounded-md text-sm shadow"
            >
                Schedule
            </Button>
        </div>
    );
}

// "use client";

// import { useEffect, useState, useRef } from "react";

// import { EditorContent, useEditor } from "@tiptap/react";
// import FloatingMenuBar from "./FloatingMenuBar";

// import { Button } from "@/components/ui/button";

// import { allExtensions } from "./allExtensions";
// import { defaultContent } from "./menubarComponents/defaultContent";

// import { useDraftMutation, useGetDraftById } from "@/hooks/admin/useDrafts";

// export default function TiptapEditor({ mode, draftId }) {
//     const [initialContent, setInitialContent] = useState(defaultContent);
//   const draftTimer = useRef(null);
//   const saveDraft = useDraftMutation();

//     const { data: draftData } = useGetDraftById(draftId, mode === "edit");

//     useEffect(() => {
//     if (mode === "edit" && draftData) {
//       setInitialContent(draftData?.content || defaultContent);
//     }
//   }, [draftData, mode]);

//     function handleSave() {
//   if (!editor) return

//   const json = editor.getJSON()
//     // const html = editor.getHTML()

//   console.log("🧩 Editor JSON (structured):", json)
//     // console.log("🌐 Editor HTML (renderable):", html)
// }

//     const editor = useEditor({
//         extensions: allExtensions,
//         editorProps: {
//             handleDOMEvents: {
//                 keydown: (_, event) => {
//                     if (event.key === "Enter") {
//                         // 1. Reset marks (highlight, etc.)
//                         editor.commands.unsetAllMarks();

//                         // 2. Check if in blockquote or codeBlock AND current block is empty
//                         const state = editor.state;
//                         const { $from } = state.selection;
//                         const node = $from.node();

//                         const isEmpty = node.content.size === 0;
//                         const isBlock = ["blockquote", "codeBlock"].includes(
//                             node.type.name,
//                         );

//                         if (isEmpty && isBlock) {
//                             editor.commands.clearNodes(); // clears block and returns to paragraph
//                         }
//                     }
//                 },
//             },
//         },
//         content: defaultContent,
//         onUpdate: ({ editor }) => {
//             if (mode !== "new" && !draftId) return;

//             clearTimeout(draftTimer.current);
//             draftTimer.current = setTimeout(() => {
//                 const json = editor.getJSON();
//                 const title = json.content?.[0]?.content?.[0]?.text || "Untitled";

//                 saveDraft.mutate({
//                 ...(draftId ? { _id: draftId } : {}),
//                     title,
//                     content: json,
//                 });
//             }, 2500);
//             },
//         });

//     return (
//         <div className="relative">
//             <EditorContent editor={editor} className="editor-styled" />
//             <FloatingMenuBar editor={editor} />
//             <button
//                 onClick={handleSave}
//                 className="absolute right-0 top-0 cursor-pointer bg-black text-white px-4 p-4 rounded-md text-sm shadow"
//             >
//                 Save & Publish
//             </button>
//             <Button>
//                 Schedule
//             </Button>
//         </div>
//     );
// }
