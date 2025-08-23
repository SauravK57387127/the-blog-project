"use client";


import { FloatingMenu } from "@tiptap/react";
import { Menubar } from "@/components/ui/menubar";
import {
    ParagraphMenu,
    FontMenu,
    SizeMenu,
    BlockquoteMenu,
    CodeBlockMenu,
    ImageMenu,
    LinkMenu,
    HighlightMenu,
    FormatMenu,
} from "./menubarComponents";


export default function FloatingMenuBar({ editor }) {
    if (!editor) return null
    
    return (
        <FloatingMenu
            editor={editor}
            shouldShow={({ editor, state }) => {
                const { from, to } = state.selection;
                const { $from } = state.selection;
                const node = $from.node();

                const selection = from !== to; // case 2: selecting text
                const isEmpty = node.content.size === 0; // case 1: empty block
                const allowed = [
                    "paragraph",
                    "heading",
                    "blockquote",
                    "codeBlock",
                ];

                return (
                    selection || (allowed.includes(node.type.name) && isEmpty)
                );
            }}
        >
            <Menubar>
                <ParagraphMenu editor={editor} />
                <FontMenu editor={editor} />
                <SizeMenu editor={editor} />
                <BlockquoteMenu editor={editor} />
                <CodeBlockMenu editor={editor} />
                <ImageMenu editor={editor} />
                <LinkMenu editor={editor} />
                <HighlightMenu editor={editor} />
                <FormatMenu editor={editor} />
            </Menubar>
        </FloatingMenu>
    );
}
