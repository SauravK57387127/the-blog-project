"use client";

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

function extractBlogMetaFromJSON(json) {
    const nodes = json.content || [];
    const title = nodes[0]?.content?.[0]?.text || "Untitled";
    const coverImage = nodes[1]?.attrs?.src || null;
    const tagsText = nodes[2]?.content?.[0]?.text || "";
    const tags = tagsText.split(",").map(tag => tag.trim()).filter(Boolean);
    return { title, coverImage, tags };
}

export default function TiptapEditor({ mode, draftId: initialDraftId = null }) {
    const [draftId, setDraftId] = useState(initialDraftId);
    const [scheduledTime, setScheduledTime] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isInitialContentSet, setIsInitialContentSet] = useState(false);

    const autosaveTimer = useRef(null);
    const editorRef = useRef(null);

    const { data: draftData, isLoading: isDraftLoading } = useGetDraftById(draftId, {
        enabled: !!draftId && mode === "edit",
    });

    const { mutate: saveDraft } = useDraftMutation({
        onSuccess: (data) => {
            if (!draftId) {
                setDraftId(data._id);
            }
            setIsSaving(false);
        },
        onError: () => {
            setIsSaving(false);
        },
    });

    const editor = useEditor({
        extensions: allExtensions,
        content: defaultContent,
        editorProps: {
            attributes: {
                class: "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
            },
        },
        onUpdate: ({ editor }) => {
            if (autosaveTimer.current) {
                clearTimeout(autosaveTimer.current);
            }
            autosaveTimer.current = setTimeout(() => {
                const json = editor.getJSON();
                const { title, coverImage, tags } = extractBlogMetaFromJSON(json);
                if (title.trim() !== "Untitled" && title.trim() !== "") {
                    setIsSaving(true);
                    saveDraft({
                        ...(draftId ? { _id: draftId } : {}),
                        title,
                        content: JSON.stringify(json),
                        coverImage,
                        tags,
                    });
                }
            }, 2500);
        },
    });

    useEffect(() => {
        if (editor && !editorRef.current) {
            editorRef.current = editor;
        }
    }, [editor]);

    useEffect(() => {
        if (mode === "edit" && draftData && editorRef.current && !isInitialContentSet) {
            editorRef.current.commands.setContent(JSON.parse(draftData.content) || defaultContent);
            setIsInitialContentSet(true);
        }
    }, [draftData, mode, isInitialContentSet]);

    useEffect(() => {
        return () => {
            if (autosaveTimer.current) {
                clearTimeout(autosaveTimer.current);
            }
        };
    }, []);

    const publishBlog = usePublishBlog();
    const scheduleBlog = useScheduleBlog();

    function handleSave(isScheduled = false, scheduleAt = null) {
        if (!editorRef.current) return;

        const json = editorRef.current.getJSON();
        const { title, coverImage, tags } = extractBlogMetaFromJSON(json);

        if (title === "Untitled" || title.trim() === "") return;

        const payload = {
            title,
            slug: slugify(title),
            content: json,
            coverImage,
            tags,
            category: "General",
            draftId,
            scheduleAt,
        };

        if (isScheduled) {
            scheduleBlog.mutate(payload);
        } else {
            publishBlog.mutate(payload);
        }
    }

    const handleSchedule = () => {
        if (!scheduledTime) return;
        const scheduleDate = new Date(scheduledTime);
        if (scheduleDate <= new Date()) return;
        handleSave(true, scheduleDate.toISOString());
    };

    if (mode === "edit" && isDraftLoading) {
        return <div>Loading draft...</div>;
    }

    return (
        <div className="relative editor-wrapper min-h-screen">
            <EditorContent editor={editor} className="editor-styled pb-20" />
            <FloatingMenuBar editor={editor} />
            <div className="fixed bottom-4 left-4 text-xs bg-gray-100 p-2 rounded shadow">
                <div>Mode: {mode}</div>
                <div>Draft ID: {draftId || 'none'}</div>
                <div>Saving: {isSaving.toString()}</div>
            </div>
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