"use client";


import { MenubarMenu } from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";
import { withEditorCommand } from "@/utils/editorUtils";

export default function CodeBlockMenu({ editor }) {
    if (!editor) return null;

    return (
        <MenubarMenu>
            <Button
                onMouseDown={withEditorCommand(
                    editor,
                    (editor) => editor.chain().focus().toggleCodeBlock(),
                    (editor) =>
                        !editor.isActive("blockquote") &&
                        editor.can().chain().focus().toggleCodeBlock().run(),
                )}
            >
                {"</>"}
            </Button>
        </MenubarMenu>
    );
}
