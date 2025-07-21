"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import FloatingMenuBar from "./FloatingMenuBar";
import { allExtensions } from "./allExtensions";
import { defaultContent } from "./menubarComponents/defaultContent";


export default function Editor() {
    function handleSave() {
  if (!editor) return

  const json = editor.getJSON()
    // const html = editor.getHTML()

  console.log("🧩 Editor JSON (structured):", json)
    // console.log("🌐 Editor HTML (renderable):", html)
}


    const editor = useEditor({
        extensions: allExtensions,
        // editorProps: {
        //     handleKeyDown(view, event) {
        //         if (event.key !== "Enter") return false;

        //         const { state } = view;
        //         const { $from } = state.selection;
        //         const node = $from.node();

        //         const isCode = node.type.name === "codeBlock";
        //         const isQuote = node.type.name === "blockquote";

        //         // Get text content inside the block
        //         const isEmptyBlock = node.textContent.trim() === "";

        //         if (isCode && isEmptyBlock) {
        //             event.preventDefault();
        //             view.dispatch(
        //                 state.tr.setNodeMarkup(
        //                     $from.before(),
        //                     state.schema.nodes.paragraph,
        //                 ),
        //             );
        //             return true;
        //         }

        //         if (isQuote && isEmptyBlock) {
        //             event.preventDefault();
        //             view.dispatch(
        //                 state.tr.setNodeMarkup(
        //                     $from.before(),
        //                     state.schema.nodes.paragraph,
        //                 ),
        //             );
        //             return true;
        //         }

        //         return false;
        //     },
        // },
        editorProps: {
            handleDOMEvents: {
                keydown: (_, event) => {
                    if (event.key === "Enter") {
                        // 1. Reset marks (highlight, etc.)
                        editor.commands.unsetAllMarks();

                        // 2. Check if in blockquote or codeBlock AND current block is empty
                        const state = editor.state;
                        const { $from } = state.selection;
                        const node = $from.node();

                        const isEmpty = node.content.size === 0;
                        const isBlock = ["blockquote", "codeBlock"].includes(
                            node.type.name,
                        );

                        if (isEmpty && isBlock) {
                            editor.commands.clearNodes(); // clears block and returns to paragraph
                        }
                    }
                },
            },
        },
        content: defaultContent,
        immediatelyRender: false,
    });

    return (
        // <div className="relative">
        //     <EditorContent editor={editor} />
        //     <FloatingMenuBar editor={editor} />
        // </div>

        <div className="relative">
            <EditorContent editor={editor} className="editor-styled" />
            <FloatingMenuBar editor={editor} />
            <button
                onClick={handleSave}
                className="absolute right-0 top-0 cursor-pointer bg-black text-white px-4 p-4 rounded-md text-sm shadow"
            >
                Save & Publish
            </button>
        </div>
    );
}

