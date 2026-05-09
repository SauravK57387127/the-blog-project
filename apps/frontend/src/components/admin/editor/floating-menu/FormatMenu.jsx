"use client";
import {
    MenubarMenu,
    MenubarTrigger,
    MenubarContent,
    MenubarItem,
    MenubarSeparator,
} from "@/components/ui/menubar";
import { withEditorCommand } from "@/utils/editorUtils";
import { AlignLeft } from "lucide-react";

export function FormatMenu({ editor }) {
    return (
        <MenubarMenu>
            {/* <MenubarTrigger>≡</MenubarTrigger> */}
            <MenubarTrigger className="flex items-center gap-2 px-3">
                <AlignLeft className="h-4 w-4" />
                <span>Format</span>
            </MenubarTrigger>

            <MenubarContent>
                <MenubarItem
                    onMouseDown={withEditorCommand(editor, (editor) =>
                        editor.chain().focus().setTextAlign("left"),
                    )}
                >
                    Align Left
                </MenubarItem>
                <MenubarItem
                    onMouseDown={withEditorCommand(
                        editor,
                        (editor) =>
                            editor.chain().focus().setTextAlign("center"),
                        (editor) =>
                            !editor.isActive("codeBlock") &&
                            editor
                                .can()
                                .chain()
                                .focus()
                                .setTextAlign("center")
                                .run(),
                    )}
                >
                    Align Center
                </MenubarItem>
                <MenubarItem
                    onMouseDown={withEditorCommand(
                        editor,
                        (editor) =>
                            editor.chain().focus().setTextAlign("right"),
                        (editor) =>
                            !editor.isActive("codeBlock") &&
                            editor
                                .can()
                                .chain()
                                .focus()
                                .setTextAlign("right")
                                .run(),
                    )}
                >
                    Align Right
                </MenubarItem>
            </MenubarContent>
        </MenubarMenu>
    );
}
