"use client";
import { MenubarMenu } from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";
import { withEditorCommand } from "@/utils/editorUtils";
import { Code2 } from "lucide-react";

export function CodeBlockMenu({ editor }) {
    return (
        <MenubarMenu>
            <Button
                variant={editor.isActive("codeBlock") ? "default" : "outline"}
                size="sm"
                onMouseDown={withEditorCommand(
                    editor,
                    (editor) => editor.chain().focus().toggleCodeBlock(),
                    (editor) =>
                        !editor.isActive("blockquote") &&
                        editor.can().chain().focus().toggleCodeBlock().run(),
                )}
                className="h-9 px-3 flex items-center gap-2"
            >
                {/* {"</>"} */}
                <Code2 className="h-4 w-4" />
                <span>Code</span>
            </Button>
        </MenubarMenu>
    );
}
